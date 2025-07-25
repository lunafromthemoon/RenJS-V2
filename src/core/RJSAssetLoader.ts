import {preloadBackground, preloadCGS, preloadAudio, preloadCharacter, preloadExtra} from '@/states/utils';
import RJSLoadingScreen from '@/gui/elements/RJSLoadingScreen';
import jsyaml from 'js-yaml'

export default class RJSAssetLoader {

    assetsPerScene: {} = {}
    episodes: any[] = []
    loadedAssets: {} = {}
    loadedEpisodes: {} = {}
    loading = false;
    loadingScreen: RJSLoadingScreen;
    backgroundLoading: Promise<any>;

    constructor(private game) {
        if (this.game.setup.lazyloading.findAssets){
            // get each scene asset
            for (const scene in this.game.story) {

                const actions = [...this.game.story[scene]];
                let action = actions.shift()
                while (action){
                    const rawKey = Object.keys(action)[0];
                    const key = rawKey.split(' ');
                    const actionKey = key[0];
                    const characterSays = key.length > 1 && key[1] === 'says';
                    if (actionKey === 'show' || actionKey === 'play' || characterSays) {
                        const parsedAction = this.game.managers.story.parseAction(action);
                        if (!this.assetsPerScene[scene]) this.assetsPerScene[scene]={};
                        this.assetsPerScene[scene][parsedAction.actor]=parsedAction.actorType;
                    }
                    if (actionKey === 'if' || actionKey === 'else'){
                        // check nested actions
                        actions.unshift(...action[rawKey])
                    }
                    if (actionKey === 'choice' || actionKey === 'interrupt' || actionKey === 'visualChoice'){
                        for (const nestedAction of action[rawKey]){
                            const nestedActionKey = Object.keys(nestedAction)[0];
                            if (actionKey === 'visualChoice') {
                                const cg = nestedActionKey.split(' ')[0];
                                if (!this.assetsPerScene[scene]) this.assetsPerScene[scene]={};
                                this.assetsPerScene[scene][cg]='cgs';
                            }
                            actions.unshift(...nestedAction[nestedActionKey])
                        }
                    }
                    action = actions.shift()
                }
            }
            const assetsText = jsyaml.dump(this.assetsPerScene)
            console.log('These are the automatically found assets in each scene, you can copy the following text directly into the lazyloading configuration.');
            console.log('Make sure to still check that everything looks alright, and remember to manually add any assets used by Plugin calls, ambients and effects, as these cannot be found automatically!');
            console.log('assetsPerScene:');
            console.log(assetsText);
        } else {
            this.assetsPerScene = this.game.setup.lazyloading.assetsPerScene;
            this.episodes = this.game.setup.lazyloading.episodes;
            if (!this.episodes) this.episodes = [];
        }
    }

    getEpisode(sceneName: string): number {
        for (let i = 0; i < this.episodes.length; i++) {
            if (this.episodes[i].includes(sceneName)){
                return i;
            }
        }
        return -1;
    }

    async loadScene(sceneName: string): Promise<any> {

        const episodeIdx = this.getEpisode(sceneName);
        if (episodeIdx !== -1) {
            return this.loadEpisode(episodeIdx,this.game.setup.lazyloading.backgroundLoading);
        }
        const toLoad = this.assetsPerScene[sceneName];
        return this.loadAssets(toLoad);
    }

    loadEpisodeInBackground(episodeIdx): void{
        if(episodeIdx<=this.episodes.length-1){
            if (this.game.config.debugMode){
                console.log('Loading episode '+episodeIdx+' in background');
            }

            this.backgroundLoading = this.loadEpisode(episodeIdx,false,true);
        }

    }

    async loadEpisode(episodeIdx, loadNextAfter, background?): Promise<any> {
        if (this.loadedEpisodes[episodeIdx]){
            if (this.game.config.debugMode){
                console.log('Episode '+episodeIdx+' already loaded.');
            }
            // this episode was already loaded, but we try to load the next one anyway
            if (loadNextAfter){
                this.loadEpisodeInBackground(episodeIdx+1);
            }
            return;
        }
        if (this.game.config.debugMode){
            console.log('Loading episode '+episodeIdx);
        }
        this.loadedEpisodes[episodeIdx]=true;
        let toLoad = {};

        for (const asset of this.episodes[episodeIdx]) {
            // add assets for each scene in the episode
            toLoad = {...toLoad, ...this.assetsPerScene[asset]};
        }
        const promise = this.loadAssets(toLoad,background);
        if (loadNextAfter){
            promise.then(()=>{
                // after loading the current episode, we set to load the next one in the background
                this.loadEpisodeInBackground(episodeIdx+1);
            })
        }
        return promise;
    }

    async loadAssets(assets: {},background?): Promise<any> {
        if (!assets) return;
        for (const asset in this.loadedAssets) {
            // remove assets already loaded
            delete assets[asset]
        }
        if (this.game.config.debugMode){
            console.log('Loading assets:');
            console.log(assets)
        }
        if (Object.keys(assets).length === 0){
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
        for (const asset in assets) {
            const assetType = assets[asset];
            switch (assetType) {
                case 'backgrounds':
                    preloadBackground(asset,this.game);
                    break;
                case 'cgs':
                    preloadCGS(asset,this.game);
                    break;
                case 'characters':
                    preloadCharacter(asset,this.game);
                    break;
                case 'music':
                    audioList.push(asset);
                    preloadAudio(asset,'music',this.game);
                    break;
                case 'sfx':
                    audioList.push(asset);
                    preloadAudio(asset,'sfx',this.game);
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
                    console.log('All assets loaded.');
                }
                resolve(true);
            }, this);
            this.loading = true;
            if (this.loadingScreen){
                this.loadingScreen.setLoadingBar(this.game);
            }
            this.game.load.start();
        })
    }

}