import RJSState from './RJSState';
import RJS from '../core/RJS';
declare class Preload extends RJSState {
    splash: Phaser.Sprite;
    loadingBar: Phaser.Sprite;
    constructor();
    init(): void;
    preload(): void;
    create(game: RJS): void;
}
export default Preload;
