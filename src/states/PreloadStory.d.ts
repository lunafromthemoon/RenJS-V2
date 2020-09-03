import RJSState from './RJSState';
declare class PreloadStory extends RJSState {
    splash: Phaser.Sprite;
    loadingBar: Phaser.Sprite;
    constructor();
    init(): void;
    preload(): void;
    create(): void;
}
export default PreloadStory;
