import jsyaml from 'js-yaml'
import {loadStyle, preparePath} from './utils';
import RJSState from './RJSState';
import {Sprite} from 'phaser-ce';
import PreloadStory from './PreloadStory';
import RJSGUIByBuilder from '../gui/RJSGUIByBuilder';
import RJSGUIByNewBuilder from '../gui/RJSGUIByNewBuilder';
import RJS from '../core/RJS';
import RJSLoadingScreen from '../gui/elements/RJSLoadingScreen';
import { AccessibilityConfig } from '../gui/a11y/Accessibility';
import {StoryConfig} from '../core/RJSGameConfig';

class Boot extends RJSState {
    splash: Sprite
    constructor() {
        super();
    }

    init(): void {
        this.game.setupScreen();
        this.game.sound.boot();
        this.game.accessibility.boot();
    }

    preload (): void {
        if (this.game.config.loadingScreen.background){
            this.game.load.image('loadingScreenBg',  preparePath(this.game.config.loadingScreen.background, this.game));
        }
        if (this.game.config.loadingScreen.loadingBar) {
            if (this.game.config.loadingScreen.loadingBar.fullBar){
                this.game.load.image('loadingScreenBar',  preparePath(this.game.config.loadingScreen.loadingBar.fullBar, this.game));
            }
            if (this.game.config.loadingScreen.loadingBar.asset){
                const w = this.game.config.loadingScreen.loadingBar.size.w;
                const h = this.game.config.loadingScreen.loadingBar.size.h;
                this.game.load.spritesheet('loadingScreenBar',  preparePath(this.game.config.loadingScreen.loadingBar.asset, this.game),w,h);
            }
        }
        loadStyle(preparePath(this.game.config.fonts, this.game));
        this.game.load.text('guiConfig', preparePath(this.game.config.guiConfig, this.game));
        this.game.load.text('storySetup', preparePath(this.game.config.storySetup, this.game));
        this.game.load.text('storyConfig', preparePath(this.game.config.storyConfig, this.game));
        this.game.load.text('storyAccessibility', preparePath(this.game.config.storyAccessibility, this.game));
        for (let i = this.game.config.storyText.length - 1; i >= 0; i--) {
            this.game.load.text('story'+i, preparePath(this.game.config.storyText[i], this.game));
        }
    }

    create (game: RJS): void {
        const loadingScreen = new RJSLoadingScreen(this.game);
        loadingScreen.setLoadingBar(this.game);
        this.input.onDown.addOnce(()=> {
            if (this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }
        });
        // load the setup
        this.game.tools.jsyaml = jsyaml;
        this.game.setup = jsyaml.load(this.game.cache.getText('storySetup'));
        if (!game.setup) this.game.setup = {};
        this.game.storyConfig = jsyaml.load(this.game.cache.getText('storyConfig')) as StoryConfig;
        this.game.storyAccessibility = jsyaml.load(this.game.cache.getText('storyAccessibility')) as AccessibilityConfig;
        // load the story text
        const story = {};
        this.game.config.storyText.forEach((file,index) => {
            const text = jsyaml.load(this.game.cache.getText('story' + index)) as Object;
            Object.assign(story, {...text})
        })

        this.game.story = story;
        // load and create the GUI
        this.game.guiSetup = jsyaml.load(this.game.cache.getText('guiConfig'));
        if (game.guiSetup.GUIVersion==='2.0' || game.guiSetup.madeWithRenJSBuilder==='2.0'){
            game.gui = new RJSGUIByNewBuilder(game)
        } else if (game.guiSetup.madeWithRenJSBuilder){
            // game.gui = new RJSSimpleGUI(game)
            game.gui = new RJSGUIByBuilder(game)
        } else {
            // older GUI configuration, now deprecated
            console.error('Old GUI configuration is deprecated!!!!')
            console.error('Check the docs at http://renjs.net/docs-page.html')
        }

        game.state.add('preloadStory', PreloadStory);
        game.state.start('preloadStory');
    }
}

export default Boot
