import RJSState from './RJSState';
import RJSLoadingScreen from '../components/RJSLoadingScreen';
declare class PreloadStory extends RJSState {
    loadingScreen: RJSLoadingScreen;
    readyToStart: boolean;
    constructor();
    init(): void;
    preload(): void;
    create(): Promise<void>;
    initGame(): void;
}
export default PreloadStory;
