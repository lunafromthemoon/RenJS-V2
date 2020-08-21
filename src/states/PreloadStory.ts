import {initLoadingBar, initSplash, preparePath} from './utils';
import RJSState from '../RJSState';
import {GUIAssets} from '../gui/RJSBuilderMadeGUI';

class PreloadStory extends RJSState {
    splash: Phaser.Sprite
    loadingBar: Phaser.Sprite

    init(): void {
        this.splash = initSplash(this.game)
        if (this.game.config.splash.loadingBar) {
            this.loadingBar = initLoadingBar(this.game)
        }
    }

    preload(): void {
        this.game.load.setPreloadSprite(this.loadingBar);
        // preload gui
        const assets: GUIAssets[] = this.game.RJS.gui.getAssets()
        for (const asset of assets) {
            if (asset.type === 'spritesheet') {
                this.game.load.spritesheet(asset.key, preparePath(asset.file, this.game), asset.w, asset.h);
            } else {
                this.game.load[asset.type](asset.key, preparePath(asset.file, this.game));
            }
        }

        // preload backgrounds
        for (const background of Object.keys(this.game.RJS.setup.backgrounds)) {
            const str = this.game.RJS.setup.backgrounds[background].split(' ');
            if (str.length === 1) {
                this.game.load.image(background, preparePath(str[0], this.game));
            } else {
                this.game.load.spritesheet(background, preparePath(str[0], this.game), parseInt(str[1], 10), parseInt(str[2], 10));
            }
        }
        // preload cgs
        for (const key of Object.keys(this.game.RJS.setup.cgs)) {
            const cgs = this.game.RJS.setup.cgs[key];
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
        for (const music of Object.keys(this.game.RJS.setup.music)) {
            this.game.load.audio(music, preparePath(this.game.RJS.setup.music[music], this.game));
        }
        // preload sfx
        for (const sfx of Object.keys(this.game.RJS.setup.sfx)) {
            this.game.load.audio(sfx, preparePath(this.game.RJS.setup.sfx[sfx], this.game));
        }
        // preload characters
        for (const name of Object.keys(this.game.RJS.setup.characters)) {
            const char = this.game.RJS.setup.characters[name];
            for (const look of Object.keys(char.looks)) {
                this.game.load.image(name + '_' + look, preparePath(char.looks[look], this.game));
            }
        }
        if (this.game.RJS.setup.extra) {
            for (const type of Object.keys(this.game.RJS.setup.extra)) {
                Object.keys(this.game.RJS.setup.extra[type]).forEach(asset => {
                    if (type === 'spritesheets') {
                        const str = this.game.RJS.setup.extra[type][asset].split(' ');
                        this.game.load.spritesheet(asset, preparePath(str[0], this.game), parseInt(str[1], 10), parseInt(str[2], 10));
                    } else {
                        this.game.load[type](asset, preparePath(this.game.RJS.setup.extra[type][asset], this.game));
                    }
                })
            }
        }
    }

    create(): void {
        // init game and start main menu
        this.game.state.add('init', init);
        this.game.state.start('init');
    }
}

const init = {
    create(): void {
        this.game.RJS.storyManager.setupStory();
        this.game.RJS.gui.init();
        this.game.RJS.initInput();
        this.game.RJS.audioManager.init(() => {
            this.game.RJS.gui.showMenu('main');
        });
    },

    render (): void {
        // if (RenJS.gui && RenJS.gui.hud && RenJS.gui.hud.area){
        //     _.each(RenJS.gui.hud.area,function(area){
        //         game.debug.rectangle(area);
        //     });
        // }
    }
}

export default PreloadStory
