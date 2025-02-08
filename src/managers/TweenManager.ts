import RJS from '@/core/RJS';
import RJSTween from '@/core/RJSTween';

export interface TweenManagerInterface {
    tween (sprite: any, tweenables: {[key: string]: any}, callback: () => void, time: number, start: boolean, delay?: number, unskippable?: boolean): RJSTween;
    chain (tweens: any[], unskippable: boolean, time?: number): void;
    skip(): void;
    current: RJSTween[];


}

export default class TweenManager implements TweenManagerInterface {
    current: RJSTween[] = []
    private game: RJS


    constructor(game: RJS) {
        this.game = game
    }


    tween(sprite: any, tweenables: {[key: string]: any}, callback: () => void, time: number | undefined, start: boolean, delay = 0, unskippable = false): RJSTween {
        // if the tween has no duration, apply the changes immediately and abort
        if (time <= 0) {
            Object.entries(tweenables).forEach(([key, value]) => {
                sprite[key] = value;
            });
            if (callback) {
                callback.call(this);
            }
            return undefined;
        }
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
            } else {
                // if tween is unskippable, lock the input
                this.game.input.enabled = false
                tween.onComplete.addOnce(()=>{
                    // enable input back when tween finishes
                    this.game.input.enabled = true
                }, this);
            }
        }
        this.current.push(tween);
        if (this.game.control.skipping){
            this.game.input.enabled = true
            this.skip();
        }
        return tween;

    }

    chain(tweens: any[], unskippable = false, time?: number): void {
        this.current = [];
        let lastTween: RJSTween | null = null;
        tweens.forEach(tw => {
            const t = tw.time ? tw.time : (time === undefined ? undefined : time/tweens.length);
            const tween = this.tween(tw.sprite, tw.tweenables, tw.callback, t, false, tw.delay);
            if (lastTween){
                lastTween.chain(tween);
            }
            lastTween = tween;
        });
        if (!this.game.control.skipping){
            this.current[0].start();
        } else if (this.canSkip() && !unskippable) {
            this.game.waitForClick(() => this.skip());
        }
    }

    parallel (tweens: any[], unskippable = false, time?: number): void {
        this.current = [];
        tweens.forEach(tw => {
            this.tween(tw.sprite,tw.tweenables,tw.callback,time,true,tw.delay);
        });
        if (!this.canSkip() && !unskippable) {
            this.game.waitForClick(() => this.skip());
        }
    }

    canSkip(): boolean {
        return this.game.storyConfig.transitions.skippable && !this.game.control.unskippable;
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
}
