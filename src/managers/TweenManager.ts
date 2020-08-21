import RJSManager from './RJSManager';

export interface TweenManagerInterface extends RJSManager {
    tween (sprite, tweenables, callback, time: number, start: boolean, delay?: number);
    chain (tweens: any[], time?: number);
    unskippable: boolean;
}

export default class TweenManager implements TweenManagerInterface {
    unskippable: boolean

    // @todo to impl
    tween(sprite, tweenables, callback, time, start, delay?): void {
        if (callback) {
            callback()
        }

    }

    // @todo to impl
    chain(tweens, time): void {
        //
    }

    set(...args: any): void {
        //
    }
}
