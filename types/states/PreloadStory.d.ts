import RJSState from './RJSState';
import RJSSprite from '../components/RJSSprite';
declare class PreloadStory extends RJSState {
    splash: Phaser.Sprite;
    loadingBar: RJSSprite;
    constructor();
    init(): void;
    preload(): void;
    create(): void;
}
export default PreloadStory;
