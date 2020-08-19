import {RenJS} from '../to-migrate/RenJS';
import {initLoadingBar, initSplash, preparePath} from './utils';
import RJSState from '../RJSState';
import {GUIAssets} from '../RJSBuilderMadeGUI';

class PreloadStory extends RJSState {
    splash: Phaser.Sprite
    loadingBar: Phaser.Sprite

    init() {
        this.splash = initSplash(this.game)
        if (this.game.config.splash.loadingBar) {
            this.loadingBar = initLoadingBar(this.game)
        }
    }

    preload() {
        this.game.load.setPreloadSprite(this.loadingBar);
        // preload gui
        const assets: GUIAssets[] = RenJS.gui.getAssets()
        for (const asset of assets) {
            if (asset.type === 'spritesheet') {
                this.game.load.spritesheet(asset.key, preparePath(asset.file, this.game), asset.w, asset.h);
            } else {
                this.game.load[asset.type](asset.key, preparePath(asset.file, this.game));
            }
        }

        // preload backgrounds
        for (const background of Object.keys(RenJS.setup.backgrounds)) {
            const str = RenJS.setup.backgrounds[background].split(' ');
            if (str.length === 1) {
                this.game.load.image(background, preparePath(str[0], this.game));
            } else {
                this.game.load.spritesheet(background, preparePath(str[0], this.game), parseInt(str[1], 10), parseInt(str[2], 10));
            }
        }
        // preload cgs
        for (const key of Object.keys(RenJS.setup.cgs)) {
            const cgs = RenJS.setup.cgs[key];
            if (typeof cgs === 'string') {
                // normal cgs
                this.game.load.image(key, preparePath(cgs, this.game));
            } else {
                // spritesheet animation
                const str = cgs.spritesheet.split(' ');
                this.game.load.spritesheet(key, preparePath(str[0], this.game), parseInt(str[1], 10), parseInt(str[2], 10));
            }
        }
        // preload background music
        for (const music of Object.keys(RenJS.setup.music)) {
            this.game.load.audio(music, preparePath(RenJS.setup.music[music], this.game));
        }
        // preload sfx
        for (const sfx of Object.keys(RenJS.setup.sfx)) {
            this.game.load.audio(sfx, preparePath(RenJS.setup.sfx[sfx], this.game));
        }
        // preload characters
        for (const name of Object.keys(RenJS.setup.characters)) {
            const char = RenJS.setup.characters[name];
            for (const look of Object.keys(char.looks)) {
                this.game.load.image(name + '_' + look, preparePath(char.looks[look], this.game));
            }
        }
        if (RenJS.setup.extra) {
            for (const type of Object.keys(RenJS.setup.extra)) {
                Object.keys(RenJS.setup.extra[type]).forEach(asset => {
                    if (type === 'spritesheets') {
                        const str = RenJS.setup.extra[type][asset].split(' ');
                        this.game.load.spritesheet(asset, preparePath(str[0], this.game), parseInt(str[1], 10), parseInt(str[2], 10));
                    } else {
                        this.game.load[type](asset, preparePath(RenJS.setup.extra[type][asset], this.game));
                    }
                })
            }
        }
    }

    create() {
        // init game and start main menu
        this.game.state.add('init', init);
        this.game.state.start('init');
    }
}

const init = {
    create () {
        RenJS.storyManager.setupStory();
        RenJS.gui.init();
        RenJS.initInput();
        RenJS.audioManager.init(() => {
            RenJS.gui.showMenu('main');
        });
    },

    render () {
        // if (RenJS.gui && RenJS.gui.hud && RenJS.gui.hud.area){
        //     _.each(RenJS.gui.hud.area,function(area){
        //         game.debug.rectangle(area);
        //     });
        // }
    }
}

export default PreloadStory
