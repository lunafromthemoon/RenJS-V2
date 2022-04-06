import { Tween } from 'phaser-ce';
export default class RJSTween extends Tween {
    tweenables?: {
        [key: string]: any;
    };
    callbackOnComplete?: any;
}
