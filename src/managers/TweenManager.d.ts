import { Tween } from 'phaser-ce';
import RJS from '../core/RJS';
import RJSManagerInterface from './RJSManager';
export interface TweenManagerInterface extends RJSManagerInterface {
    tween(sprite: any, tweenables: any, callback: any, time: number, start: boolean, delay?: number): any;
    chain(tweens: any[], time?: number): any;
    unskippable: boolean;
    current: any[];
    skip: any;
    callbackOnComplete: any;
    tweenables: any;
}
export default class TweenManager implements TweenManagerInterface {
    unskippable: boolean;
    current: any[];
    private game;
    callbackOnComplete: any;
    tweenables: any;
    constructor(game: RJS);
    tween(sprite: any, tweenables: any, callback: any, time: any, start: any, delay?: any): Tween;
    chain(tweens: any, time: any): void;
    parallel(tweens: any, time: any): void;
    skip(): void;
    set(...args: any): void;
}
