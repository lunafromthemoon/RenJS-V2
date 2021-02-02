import {preloadBackground, preloadCGS, preloadAudio, preloadCharacter, preloadExtra} from '../states/utils';
import RJSLoadingScreen from '../components/RJSLoadingScreen';
import jsyaml from 'js-yaml'

export default class RJSAssetLoader {

    assetsPerScene: {} = {}
    episodes: any[] = []
    loadedAssets: {} = {}
    loadedEpisodes: {} = {}
    loading: boolean = false;
    loadingScreen:RJSLoadingScreen;
    backgroundLoading: Promise<any>;

    constructor(private game) {
        if (this.game.setup.lazyloading.findAssets){
            // get each scene asset
            for (var scene in this.game.story) {
                
                const actions = this.game.story[scene];
                for (var i = 0; i < actions.length; i++) {
                    const action = this.game.managers.story.parseAction(actions[i]);
                    if (action.mainAction=="show" || action.mainAction=="play"){
                        if (!this.assetsPerScene[scene]) this.assetsPerScene[scene]={};
                        this.assetsPerScene[scene][action.actor]=action.actorType;
                    }
                }
            }
            const assetsText = jsyaml.dump(this.assetsPerScene)
            console.log("COPY THIS TEXT INTO THE LAZY LOADING SETUP");
            console.log("assetsPerScene:");
            console.log(assetsText);
        } else {
            this.assetsPerScene = this.game.setup.lazyloading.assetsPerScene;
            this.episodes = this.game.setup.lazyloading.episodes;
            if (!this.episodes) this.episodes = [];
        }
    }

    getEpisode(sceneName: string){
        for (var i = 0; i < this.episodes.length; i++) {
            if (this.episodes[i].includes(sceneName)){
                return i;
            }
        }
        return -1;
    }

    async loadScene(sceneName: string){

        const episodeIdx = this.getEpisode(sceneName);
        if (episodeIdx!=-1) {
            return this.loadEpisode(episodeIdx,this.game.setup.lazyloading.backgroundLoading);
        } 
        let toLoad = this.assetsPerScene[sceneName];
        return this.loadAssets(toLoad);
    }

    async loadEpisode(episodeIdx, loadNextAfter, background?){
        if (this.loadedEpisodes[episodeIdx]){
            console.log("Episode "+episodeIdx+" already loaded.");
            // this episode was already loaded, but we try to load the next one anyway
            if (loadNextAfter && episodeIdx<this.episodes.length-1){
                console.log("Loading next episode "+(episodeIdx+1));
                this.backgroundLoading = this.loadEpisode(episodeIdx+1,false,true);
            }
            return;
        }
        console.log("Loading episode "+episodeIdx);
        this.loadedEpisodes[episodeIdx]=true;
        let toLoad = {};
        
        for (var i = 0; i < this.episodes[episodeIdx].length; i++) {
            // add assets for each scene in the episode
            toLoad = {...toLoad, ...this.assetsPerScene[this.episodes[episodeIdx][i]]};
        }
        let promise = this.loadAssets(toLoad,background);
        if (loadNextAfter && episodeIdx<this.episodes.length-1){
            promise.then(()=>{
                // after loading the current episode, we set to load the next one in the background
                console.log("Loading next episode "+(episodeIdx+1)+" after right now.");
                this.backgroundLoading = this.loadEpisode(episodeIdx+1,false,true);
            })
        }
        return promise;
    }

    async loadAssets(assets: {},background?){
        for (var asset in this.loadedAssets) {
            // remove assets already loaded
            delete assets[asset]
        }
        if (this.game.config.debugMode){
            // console.log("Loading assets:");
            // console.log(assets)
        }
        if (Object.keys(assets).length==0){
            return Promise.resolve();
        }
        // set loading screen
        if (!background && this.game.setup.lazyloading.loadingScreen){
            this.loadingScreen = new RJSLoadingScreen(this.game);
        }
        if (this.backgroundLoading){
            // we want to start loading new assets, but background loading still working
            await this.backgroundLoading;
            this.backgroundLoading = null;
        }

        const audioList = [];
        // load assets on the fly
        for (var asset in assets) {
            let assetType = assets[asset];
            switch (assetType) {
                case "backgrounds":
                    preloadBackground(asset,this.game);
                    break;
                case "cgs":
                    preloadCGS(asset,this.game);
                    break;
                case "characters":
                    preloadCharacter(asset,this.game);
                    break;
                case "music":
                    audioList.push(asset);
                    preloadAudio(asset,"music",this.game);
                    break;
                case "sfx":
                    audioList.push(asset);
                    preloadAudio(asset,"sfx",this.game);
                    break;
                default:
                    preloadExtra(asset,assetType,this.game);
            }
        }
        
        return new Promise(resolve=>{
            this.game.load.onLoadComplete.addOnce(async () => {
            // teardown loading screen
                this.loading = false;
                this.loadedAssets = {...this.loadedAssets, ...assets}
                if (audioList.length>0){
                    // decode new audio assets
                    await this.game.managers.audio.decodeAudio(audioList);
                }
                if (this.loadingScreen){
                    this.loadingScreen.destroy(this.game);
                    this.loadingScreen = null;
                }
                if (this.backgroundLoading){
                    // this was background loading
                    this.backgroundLoading=null;
                }
                if (this.game.config.debugMode){
                    console.log("All assets loaded.");
                }
                resolve();
            }, this);
            this.loading = true;
            if (this.loadingScreen){
                this.loadingScreen.setLoadingBar(this.game);
            }
            this.game.load.start();
        })
    }

}