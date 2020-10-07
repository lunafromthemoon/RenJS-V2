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
        const bg = this.game.add.graphics(0, 0);
        this.audioManager.play('rollingCredits', 'bgm', true, 'FADE');
        bg.beginFill(0x000000, 1);
        bg.drawRect(0, 0, this.game.config.w, this.game.config.h);
        bg.endFill();
        bg.alpha = 0;

        const style = {...this.game.gui.getTextStyle('choice')};
        style.font = '25pt ' + this.game.gui.fonts[0];
        const credits = this.game.add.text(this.game.world.centerX, this.game.config.h + 30, params.text[0], style);
        credits.anchor.set(0.5);
        const separation = 35;
        for (let i = 1; i < params.text.length; i++) {
            if (params.text[i]) {
                const nextLine = this.game.add.text(0, i * separation, params.text[i], style);
                nextLine.anchor.set(0.5);
                credits.addChild(nextLine);
            }
        }
        const tweenChain: any = [
            {sprite: bg, tweenables: {alpha: 1}, time: this.game.storyConfig.fadetime},
            {sprite: credits, tweenables: {y: -(separation * params.text.length + 30)}, time: 700 * params.text.length},

        ];
        return new Promise(resolve => {
            if (!params.endGame) {
                tweenChain.push(
                    {
                        sprite: bg, tweenables: {alpha: 0}, time: this.game.storyConfig.fadetime, callback: () => {
                            bg.destroy();
                            credits.destroy();
                            this.audioManager.stop('bgm','FADE');
                            resolve();
                        }
                    })
            } else {
                tweenChain[1].callback = null;
            }
            this.tweenManager.chain(tweenChain,true);
        })

    }

    async SHOWTITLE(param): Promise<void> {
        const bg = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'title');
        bg.anchor.set(0.5);
        const style = {...this.game.gui.getTextStyle('choice')};
        style.font = '50pt ' + this.game.gui.fonts[0];
        const title = this.game.add.text(0, -20, param.title, style);
        style.font = '25pt ' + this.game.gui.fonts[0];
        const subtitle = this.game.add.text(0, 40, param.subtitle, style);
        subtitle.anchor.set(0.5);
        title.anchor.set(0.5);
        bg.addChild(title);
        bg.addChild(subtitle);
        bg.alpha = 0;


        this.tweenManager.chain([
            {sprite: bg, tweenables: {alpha: 1}},
            {
                sprite: bg, tweenables: {alpha: 0}, callback: (): void => {
                    bg.destroy();
                }, delay: this.game.storyConfig.fadetime * 2
            }
        ], true, this.game.storyConfig.fadetime * 2);

    }

    async FLASHIMAGE(imageName: string): Promise<void> {
        const image = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, imageName);
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

    async EXPLOSION(): Promise<void> {
        const explosion = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'explosion');
        explosion.anchor.set(0.5);
        // let added
        const anim = explosion.animations.add('explode');
        anim.onComplete.add(() => {
            return;
        });
        anim.play(10, false, true);
        this.audioManager.playSFX('explosionSound');
    }

    async THUNDER(): Promise<void> {
        this.game.camera.shake(0.01, 200);
        this.audioManager.playSFX('thunderSFX');
        return this.FLASHIMAGE('thunder');
    }

    async ATTACK(): Promise<void> {
        this.game.camera.shake(0.01, 200);
        return this.FLASHIMAGE('attack');
    }

    async MULTIATTACK(): Promise<void> {
        this.game.camera.shake(0.01, 600);
        return this.FLASHIMAGE('multiattack');
    }

    async CHAINATTACK(): Promise<void> {
        this.game.camera.shake(0.01, 200);
        await this.FLASHIMAGE('chainattack1')
        this.game.camera.shake(0.01, 200);
        await this.FLASHIMAGE('chainattack2')
        this.game.camera.shake(0.01, 200);
        await this.FLASHIMAGE('chainattack3')
    }
}
