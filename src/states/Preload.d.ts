import RJSState from './RJSState';
declare class Preload extends RJSState {
    splash: Phaser.Sprite;
    loadingBar: Phaser.Sprite;
    constructor();
    init(): void;
    preload(): void;
    create(): void;
}
export default Preload;
