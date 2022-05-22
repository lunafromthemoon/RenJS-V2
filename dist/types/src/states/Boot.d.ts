import RJSState from './RJSState';
import { Sprite } from 'phaser-ce';
import RJS from '../core/RJS';
declare class Boot extends RJSState {
    splash?: Sprite;
    constructor();
    init(): void;
    preload(): void;
    create(game: RJS): void;
}
export default Boot;
