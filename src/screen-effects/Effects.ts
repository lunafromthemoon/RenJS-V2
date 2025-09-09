import RJSScreenEffectInterface from './RJSScreenEffect';
import {AudioManagerInterface} from '../managers/AudioManager';
import {TweenManagerInterface} from '../managers/TweenManager';
import { Color } from 'phaser-ce';
import RJS from '../core/RJS';
import {setTextStyles} from '../utils/gui'

export class Effects implements RJSScreenEffectInterface {

    private game: RJS
    private audioManager: AudioManagerInterface
    private tweenManager: TweenManagerInterface
    private gui: any

    constructor(game: RJS) {
        this.game = game
        this.audioManager = game.managers.audio
        this.tweenManager = game.managers.tween
    }

    async SHAKE(): Promise<void> {
        this.game.camera.shake(0.01, 200);
    }

    async ROLLINGCREDITS(params: {
        /** lines to show in credits roll */
        text: string[];
        /** music id */
        music?: string;
        timePerLine?: number;
        endGame?: boolean;
    }): Promise<void> {
        this.game.accessibility.text(params.text.join('\n'));
        this.game.control.unskippable = true;
        await this.game.managers.story.hide();
        if (params.music){
            this.audioManager.play(params.music, 'bgm', true, null, 'FADE');
        }

        const style = { ...this.game.gui.hud.cHandlers.default.config.text.style };

        // use a text color that contrasts with the bg
        const { backgroundColor = 0 } = this.game.storyConfig;
        const bgColor = typeof backgroundColor === 'string' ? Color.hexToColor(backgroundColor) : Color.getRGB(backgroundColor);
        const textColor = Color.RGBtoHSV(bgColor.r, bgColor.g, bgColor.b).v > 0.5 ? Color.BLACK : Color.WHITE;
        style.fill = Color.getWebRGB(textColor);

        const credits = this.game.add.text(this.game.world.centerX, this.game.config.h + 30, ' ', style);
        credits.anchor.set(0.5);
        const separation = credits.height + 10;
        for (let i = 0; i < params.text.length; i++) {
            if (params.text[i]) {
                const nextLine = this.game.add.text(0, i * separation,'', style);
                nextLine.setText(setTextStyles(params.text[i],nextLine), true);
                nextLine.anchor.set(0.5);
                credits.addChild(nextLine);
            }
        }
        const timePerLine = params.timePerLine ? params.timePerLine : 1500;
        credits.updateTransform();

        return new Promise(resolve => {
            this.tweenManager.tween(credits, {y: -(separation * params.text.length + 30)}, async ()=>{
                credits.destroy();
                if (params.music){
                    this.audioManager.stop('bgm','FADE');
                }
                this.game.control.unskippable = false;
                if (!params.endGame) {
                    console.log('showing hud again')
                    await this.game.managers.story.show();
                } else {
                    this.game.endGame();
                }
                resolve();
            }, timePerLine * params.text.length, true, 0, true)
        })
    }

    async FLASHIMAGE(params): Promise<void> {
        if (params.screenShake){
            this.SHAKE();
        }
        if (params.sfx){
            this.audioManager.playSFX(params.sfx);
        }
        const image = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, params.image);
        image.anchor.set(0.5);
        return new Promise(resolve => {
            setTimeout(() => {
                const tween = this.game.add.tween(image);
                tween.to({alpha: 0}, this.game.storyConfig.fadetime / 2, Phaser.Easing.Linear.None);
                tween.onComplete.add(() => {
                    image.destroy();
                    resolve();
                });
                tween.start();
            }, this.game.storyConfig.fadetime / 3);
        })

    }

}
export default Effects