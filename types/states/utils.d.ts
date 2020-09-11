import RJS from '../core/RJS';
import { Sprite } from 'phaser-ce';
import RJSSprite from '../components/RJSSprite';
export declare function initSplash(game: RJS): Sprite;
export declare function initLoadingBar(game: RJS): RJSSprite;
export declare function preparePath(path: string, game: RJS): string;
export declare function loadStyle(href: any, callback?: any): void;
