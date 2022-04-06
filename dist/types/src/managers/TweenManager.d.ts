import RJS from '../core/RJS';
import RJSTween from '../core/RJSTween';
export interface TweenManagerInterface {
    tween(sprite: any, tweenables: {
        [key: string]: any;
    }, callback: () => void, time: number, start: boolean, delay?: number, unskippable?: boolean): RJSTween;
    chain(tweens: any[], unskippable: boolean, time?: number): void;
    skip(): void;
    current: RJSTween[];
}
export default class TweenManager implements TweenManagerInterface {
    current: RJSTween[];
    private game;
    constructor(game: RJS);
    tween(sprite: any, tweenables: {
        [key: string]: any;
    }, callback: () => void, time: number | undefined, start: boolean, delay?: number, unskippable?: boolean): RJSTween;
    chain(tweens: any[], unskippable?: boolean, time?: number): void;
    parallel(tweens: any[], unskippable?: boolean, time?: number): void;
    canSkip(): boolean;
    skip(): void;
}
