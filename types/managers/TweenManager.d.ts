import RJS from '../core/RJS';
import RJSTween from '../core/RJSTween';
import RJSManagerInterface from './RJSManager';
export interface TweenManagerInterface extends RJSManagerInterface {
    tween(sprite: any, tweenables: any, callback: any, time: number, start: boolean, delay?: number, unskippable?: boolean): any;
    chain(tweens: any[], unskippable: boolean, time?: number): any;
    skip(): any;
    current: RJSTween[];
}
export default class TweenManager implements TweenManagerInterface {
    current: any[];
    private game;
    constructor(game: RJS);
    tween(sprite: any, tweenables: any, callback: any, time: any, start: any, delay?: number, unskippable?: boolean): RJSTween;
    chain(tweens: any, unskippable?: boolean, time?: any): void;
    parallel(tweens: any, unskippable?: boolean, time?: any): void;
    skip(): void;
    set(...args: any): void;
}
