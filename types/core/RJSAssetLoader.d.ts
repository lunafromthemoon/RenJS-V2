import RJSLoadingScreen from '../components/RJSLoadingScreen';
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
    loadScene(sceneName: string): Promise<unknown>;
    loadEpisodeInBackground(episodeIdx: any): void;
    loadEpisode(episodeIdx: any, loadNextAfter: any, background?: any): Promise<unknown>;
    loadAssets(assets: {}, background?: any): Promise<unknown>;
}
