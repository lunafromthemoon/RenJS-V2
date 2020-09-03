import {Tween} from 'phaser-ce';
import RJS from '../core/RJS';
import RJSManagerInterface from './RJSManager';

export interface TweenManagerInterface extends RJSManagerInterface {
    tween (sprite, tweenables, callback, time: number, start: boolean, delay?: number);
    chain (tweens: any[], time?: number);
    unskippable: boolean;
    current: any[];
    skip: any;
    callbackOnComplete: any;
    tweenables: any;
}

export default class TweenManager implements TweenManagerInterface {
    unskippable: boolean
    current = []
    private game: RJS
    callbackOnComplete: any
    tweenables: any;

    constructor(game: RJS) {
        this.game = game
    }

    tween(sprite, tweenables, callback, time, start, delay?): Tween {
        const tween = this.game.add.tween(sprite);
        delay = !delay ? 0 : delay;
        tween.to(tweenables, time, Phaser.Easing.Linear.None,false, delay);
        if (callback) {
            tween.onComplete.addOnce(callback, this);
            this.callbackOnComplete = callback;
        }
        this.tweenables = tweenables;
        if (start){
            this.game.managers.tween.current = [];
            tween.start();
            if (!this.game.control.auto) {
                this.game.waitForClick(this.skip);
            }
        }
        this.game.managers.tween.current.push(tween);
        // if (RenJS.control.skipping){
        //     this.skip();
        // }
        return tween;

    }

    chain(tweens, time): void {
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
        if (!this.game.control.auto) {
            this.game.waitForClick(this.skip);
        }
    }

    parallel (tweens, time): void {
        this.current = [];
        tweens.forEach(tw => {
            const tween = this.tween(tw.sprite,tw.tweenables,tw.callback,time,false,tw.delay);
            tween.start();
        });
        if (!this.game.control.auto) {
            this.game.waitForClick(this.skip);
        }
    }

    skip(): void {
        if (this.unskippable){
            return;
        }
        const tweens = [...this.current];
        this.current = [];
        tweens.forEach(tween => {
            tween.stop(false);
            for (const property in this.tweenables){
                tween.target[property] = this.tweenables[property];
            }
            if (this.callbackOnComplete){
                this.callbackOnComplete();
            }
        });
    }

    set(...args: any): void {
        //
    }
}
