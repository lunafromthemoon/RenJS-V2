import {RenJS} from '../to-migrate/RenJS';
import {RenJSBuilderMadeGUI} from '../to-migrate/RenJSBuilderMadeGUI';
import {SimpleGUI} from '../to-migrate/SimpleGUI';
import jsyaml from 'js-yaml'
import {initLoadingBar, initSplash, loadStyle, preparePath} from './utils';
import RJSState from '../RJSState';

import PreloadStory from './PreloadStory';

// TODO: LOAD RENJS OWN SPLASH SCREEN

class Preload extends RJSState {
    splash: Phaser.Sprite
    loadingBar: Phaser.Sprite

    init() {
        this.splash = initSplash(this.game)
        if (this.game.config.splash.loadingBar) {
            this.loadingBar = initLoadingBar(this.game)
        }
    }

    preload () {
        this.load.setPreloadSprite(this.loadingBar);
        loadStyle(preparePath(this.game.config.fonts, this.game));
        this.game.load.text('guiConfig', preparePath(this.game.config.guiConfig, this.game));
        this.game.load.text('storySetup', preparePath(this.game.config.storySetup, this.game));
        for (let i = this.game.config.storyText.length - 1; i >= 0; i--) {
            this.game.load.text('story'+i, preparePath(this.game.config.storyText[i], this.game));
        }
    }

    create () {
        // load the setup
        RenJS.setup = jsyaml.load(this.game.cache.getText('storySetup'));
        // load the story text
        const story = {};
        this.game.config.storyText.forEach((file,index) => {
            const text = jsyaml.load(this.game.cache.getText('story'+index));
            Object.assign(story, ...text)
        })

        RenJS.story = story;
        // load and create the GUI
        const gui = jsyaml.load(this.game.cache.getText('guiConfig'));
        if (gui.madeWithRenJSBuilder){
            RenJS.gui = new RenJSBuilderMadeGUI(gui);
        } else {
            RenJS.gui = new SimpleGUI(gui);
        }

        // preload the fonts by adding text, else they wont be fully loaded :\
        for (const font of RenJS.gui.getFonts()){
            this.game.add.text(20, 20, font, {font: '42px ' + font});
        }
        // start preloading story
        this.game.state.add('preloadStory', PreloadStory);
        this.game.state.start('preloadStory');
        this.game.add.sprite()
    }
}

export default Preload
