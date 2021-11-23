import RJSLoadingScreen from '../gui/elements/RJSLoadingScreen';
export default class RJSAssetLoader {
    private game;
    assetsPerScene: {};
    episodes: any[];
    loadedAssets: {};
    loadedEpisodes: {};
    loading: boolean;
    loadingScreen: RJSLoadingScreen;
    backgroundLoading: Promise<any>;
    constructor(game: any);
    getEpisode(sceneName: string): number;
    loadScene(sceneName: string): Promise<any>;
    loadEpisodeInBackground(episodeIdx: any): void;
    loadEpisode(episodeIdx: any, loadNextAfter: any, background?: any): Promise<any>;
    loadAssets(assets: {}, background?: any): Promise<any>;
}
