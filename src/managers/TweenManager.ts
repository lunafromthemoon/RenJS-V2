import {Tween} from 'phaser-ce';
import RJS from '../core/RJS';
import RJSTween from '../core/RJSTween';
import RJSManagerInterface from './RJSManager';

export interface TweenManagerInterface extends RJSManagerInterface {
    tween (sprite, tweenables, callback, time: number, start: boolean, delay?: number, unskippable?: boolean);
    chain (tweens: any[], unskippable: boolean, time?: number);
    skip(): any;
    current: RJSTween[];
    

}

export default class TweenManager implements TweenManagerInterface {
    current = []
    private game: RJS


    constructor(game: RJS) {
        this.game = game
    }

    tween(sprite, tweenables, callback, time, start, delay = 0, unskippable = false): RJSTween {
        const tween: RJSTween = this.game.add.tween(sprite);
        tween.to(tweenables, time, Phaser.Easing.Linear.None,false, delay);
        if (callback) {
            tween.onComplete.addOnce(callback, this);
            tween.callbackOnComplete = callback;
        }
        tween.tweenables = tweenables;
        if (start){
            this.current = [];
            tween.start();
            if (this.canSkip() && !unskippable) {
                this.game.waitForClick(() => this.skip());
            }
        }
        this.current.push(tween);
        // if (RenJS.control.skipping){
        //     this.skip();
        // }
        return tween;

    }

    chain(tweens, unskippable = false, time?): void {
        this.current = [];
        let lastTween = null;
        tweens.forEach(tw => {
            const t = tw.time ? tw.time : time/tweens.length;
            const tween = this.tween(tw.sprite, tw.tweenables, tw.callback, t, false, tw.delay);
            if (lastTween){
                lastTween.chain(tween);
            }
            lastTween = tween;
        });
        this.current[0].start();
        if (this.canSkip() && !unskippable) {
            this.game.waitForClick(() => this.skip());
        }
    }

    parallel (tweens, unskippable = false, time?): void {
        this.current = [];
        tweens.forEach(tw => {
            const tween = this.tween(tw.sprite,tw.tweenables,tw.callback,time,false,tw.delay);
            tween.start();
        });
        if (!this.canSkip() && !unskippable) {
            this.game.waitForClick(() => this.skip());
        }
    }

    canSkip(): boolean {
        return (!this.game.control.auto && !this.game.control.unskippable);
    }

    skip(): void {
        if (this.game.control.unskippable){
            return;
        }
        this.current.forEach(tween => {
            tween.stop(false);
            for (const property in tween.tweenables){
                tween.target[property] = tween.tweenables[property];
            }
            if (tween.callbackOnComplete){
                tween.callbackOnComplete();
            }
        });
        this.current = [];
    }

    set(...args: any): void {
        //
    }
}
