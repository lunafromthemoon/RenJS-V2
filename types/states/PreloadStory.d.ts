import RJSState from './RJSState';
import RJSLoadingScreen from '../components/RJSLoadingScreen';
declare class PreloadStory extends RJSState {
    loadingScreen: RJSLoadingScreen;
    constructor();
    init(): void;
    preload(): void;
    create(): Promise<void>;
}
export default PreloadStory;
