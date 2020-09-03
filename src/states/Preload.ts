import jsyaml from 'js-yaml'
import {initLoadingBar, initSplash, loadStyle, preparePath} from './utils';
import RJSState from './RJSState';

import PreloadStory from './PreloadStory';
import RJSGUIByBuilder from '../gui/RJSGUIByBuilder';
import RJSSimpleGUI from '../gui/RJSSimpleGUI';
import RJS from '../core/RJS';

// TODO: LOAD RENJS OWN SPLASH SCREEN

class Preload extends RJSState {
    splash: Phaser.Sprite
    loadingBar: Phaser.Sprite

    constructor() {
        super();
    }

    init(): void {
        this.splash = initSplash(this.game)
        if (this.game.config.splash.loadingBar) {
            this.loadingBar = initLoadingBar(this.game)
        }
    }

    preload (): void {
        this.load.setPreloadSprite(this.loadingBar);
        loadStyle(preparePath(this.game.config.fonts, this.game));
        this.game.load.text('guiConfig', preparePath(this.game.config.guiConfig, this.game));
        this.game.load.text('storySetup', preparePath(this.game.config.storySetup, this.game));
        for (let i = this.game.config.storyText.length - 1; i >= 0; i--) {
            this.game.load.text('story'+i, preparePath(this.game.config.storyText[i], this.game));
        }
    }

    create (game: RJS): void {
        // load the setup
        game.setup = jsyaml.load(game.cache.getText('storySetup'));

        // load the story text
        const story = {};
        game.config.storyText.forEach((file,index) => {
            const text = jsyaml.load(game.cache.getText('story' + index));
            Object.assign(story, {...text})
        })

        game.story = story;
        // load and create the GUI
        const gui = jsyaml.load(game.cache.getText('guiConfig'));
        if (gui.madeWithRenJSBuilder){
            game.gui = new RJSGUIByBuilder(gui, game)
        } else {
            console.log('simple giu')
            game.gui = new RJSSimpleGUI(gui)
        }

        // preload the fonts by adding text, else they wont be fully loaded :\
        for (const font of game.gui.getFonts()){
            game.add.text(20, 20, font, {font: '42px ' + font});
        }
        // start preloading story
        game.state.add('preloadStory', PreloadStory);
        game.state.start('preloadStory');
        game.add.sprite()
    }
}

export default Preload
