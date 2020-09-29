import RJS from '../core/RJS';
import RJSTween from '../core/RJSTween';
import RJSManagerInterface from './RJSManager';
export interface TweenManagerInterface extends RJSManagerInterface {
    tween(sprite: any, tweenables: any, callback: any, time: number, start: boolean, delay?: number): any;
    chain(tweens: any[], time?: number): any;
    skip(): any;
    unskippable: boolean;
    current: RJSTween[];
}
export default class TweenManager implements TweenManagerInterface {
    unskippable: boolean;
    current: any[];
    private game;
    constructor(game: RJS);
    tween(sprite: any, tweenables: any, callback: any, time: any, start: any, delay?: any): RJSTween;
    chain(tweens: any, time: any): void;
    parallel(tweens: any, time: any): void;
    skip(): void;
    set(...args: any): void;
}
