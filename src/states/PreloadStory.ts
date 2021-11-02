import FontFaceObserver from 'fontfaceobserver';
import {preparePath} from './utils';
import {preloadBackground, preloadCGS, preloadAudio, preloadCharacter, preloadExtra} from './utils';
import RJSState from './RJSState';
import RJSLoadingScreen from '../gui/elements/RJSLoadingScreen';

class PreloadStory extends RJSState {
    loadingScreen:RJSLoadingScreen
    readyToStart: boolean = false;

    constructor() {
        super();
    }

    init(): void {
        this.loadingScreen = new RJSLoadingScreen(this.game);
    }

    preload(): void {
        this.loadingScreen.setLoadingBar(this.game);
        // wait a minimal amount of time in the loading loadingScreen
        // to use as splash screen
        if (this.game.config.loadingScreen.minTime){
            setTimeout(()=>{
                if (this.readyToStart){
                    this.initGame();
                } else {
                    this.readyToStart = true;
                }
            },this.game.config.loadingScreen.minTime)
        } else {
            this.readyToStart = true;
        }
        // preload gui assets
        for (const asset of this.game.gui.assets) {
            if (asset.type === 'spritesheet') {
                this.game.load.spritesheet(asset.key, preparePath(asset.file, this.game), asset.w, asset.h);
            } else {
                this.game.load[asset.type](asset.key, preparePath(asset.file, this.game));
            }
        }

        // preload fonts
        const families = this.game.gui.fonts;
        const styles = ['normal', 'italic'];
        const weights = ['normal', 'bold'];
        for (const family of families) {
            for (const style of styles) {
                for (const weight of weights) {
                    const key = `${family} ${weight} ${style}`;
                    this.game.load.addToFileList('font', key, '');
                    const { file } = this.game.load.getAsset('font', key);
                    new FontFaceObserver(family, { weight, style }).load()
                        .then(() => this.game.load.asyncComplete(file))
                        .catch((err) => this.game.load.asyncComplete(file, err));
                }
            }
        }

        if (this.game.setup.lazyloading){
            // when lazy loading, game assets will be loaded while playing the story
            return
        }
        // preload backgrounds
        if ('backgrounds' in this.game.setup) {
            for (const bg in this.game.setup.backgrounds) {
                preloadBackground(bg,this.game);
            }
        }

        // preload cgs
        if ('cgs' in this.game.setup) {
            for (const cg in this.game.setup.cgs) {
                preloadCGS(cg,this.game);
            }
        }

        // preload background music
        if ('music' in this.game.setup) {
            for (const music in this.game.setup.music) {
               preloadAudio(music,"music",this.game);
            }
        }

        // preload sfx
        if ('sfx' in this.game.setup) {
            for (const sfx in this.game.setup.sfx) {
               preloadAudio(sfx,"sfx",this.game);
            }
        }

        // preload characters
        if ('characters' in this.game.setup) {
            for (const name in this.game.setup.characters) {
                preloadCharacter(name,this.game);
            }
        }


        if ('extra' in this.game.setup) {
            for (const type of Object.keys(this.game.setup.extra)) {
                Object.keys(this.game.setup.extra[type]).forEach(asset => {
                    preloadExtra(asset,type,this.game);
                })
            }
        }
    }

    async create() {
        // game finished loading, now has to build game
        // we add a tween to the loading bar to make it a bit less static
        this.loadingScreen.waitingScreen();
        await this.game.initStory();
        if (this.readyToStart){
            this.initGame();
        } else {
            this.readyToStart = true;
        }
        
    }

    initGame(){
        this.loadingScreen.destroy(this.game);
        this.game.gui.showMenu('main');
    }
}

export default PreloadStory
