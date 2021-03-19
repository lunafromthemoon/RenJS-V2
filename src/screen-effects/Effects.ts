import RJSScreenEffectInterface from './RJSScreenEffect';
import {AudioManagerInterface} from '../managers/AudioManager';
import {TweenManagerInterface} from '../managers/TweenManager';
import RJS from '../core/RJS';

export default class Effects implements RJSScreenEffectInterface {

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

    async ROLLINGCREDITS(params): Promise<void> {
        // params: text (list of strings), music (music id), timePerLine (int), endGame (boolean)
        this.game.control.unskippable = true;
        const bg = this.game.add.graphics(0, 0);
        if (params.music){
            this.audioManager.play(params.music, 'bgm', true, null, 'FADE');
        }
        
        bg.beginFill(0x000000, 1);
        bg.drawRect(0, 0, this.game.config.w, this.game.config.h);
        bg.endFill();
        bg.alpha = 0;

        const style = {...this.game.gui.getTextStyle('choice')};
        // style.font = '25pt ' + this.game.gui.fonts[0];
        const credits = this.game.add.text(this.game.world.centerX, this.game.config.h + 30, params.text[0], style);
        credits.anchor.set(0.5);
        const separation = credits.height + 10;
        for (let i = 1; i < params.text.length; i++) {
            if (params.text[i]) {
                const nextLine = this.game.add.text(0, i * separation, params.text[i], style);
                nextLine.anchor.set(0.5);
                credits.addChild(nextLine);
            }
        }
        const timePerLine = params.timePerLine ? params.timePerLine : 700;
        const tweenChain: any = [
            {sprite: bg, tweenables: {alpha: 1}, time: this.game.storyConfig.fadetime},
            {sprite: credits, tweenables: {y: -(separation * params.text.length + 30)}, time: timePerLine * params.text.length},

        ];
        return new Promise(resolve => {
            tweenChain.push(
                {
                    sprite: bg, tweenables: {alpha: 0}, time: this.game.storyConfig.fadetime, callback: () => {
                        bg.destroy();
                        credits.destroy();
                        this.audioManager.stop('bgm','FADE');
                        this.game.control.unskippable = false;
                        if (!params.endGame) {
                            resolve();
                        } else {
                            this.game.endGame();
                        }
                    }
                })
            this.tweenManager.chain(tweenChain,true);
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
