import {initLoadingBar, initSplash, preparePath} from './utils';
import RJSState from './RJSState';
import {GUIAssets} from '../gui/Assets';
import RJSSprite from '../components/RJSSprite';

class PreloadStory extends RJSState {
    splash: Phaser.Sprite
    loadingBar: RJSSprite

    constructor() {
        super();
    }

    init(): void {
        this.splash = initSplash(this.game)
        if (this.game.config.splash.loadingBar) {
            this.loadingBar = initLoadingBar(this.game)
        }
    }

    preload(): void {
        this.game.load.setPreloadSprite(this.loadingBar);
        // preload gui
        const assets: GUIAssets[] = this.game.gui.getAssets()
        for (const asset of assets) {
            if (asset.type === 'spritesheet') {
                this.game.load.spritesheet(asset.key, preparePath(asset.file, this.game), asset.w, asset.h);
            } else {
                this.game.load[asset.type](asset.key, preparePath(asset.file, this.game));
            }
        }

        // preload backgrounds
        if ('backgrounds' in this.game.setup) {
            for (const background of Object.keys(this.game.setup.backgrounds)) {
                const str = this.game.setup.backgrounds[background].split(' ');
                if (str.length === 1) {
                    this.game.load.image(background, preparePath(str[0], this.game));
                } else {
                    this.game.load.spritesheet(background, preparePath(str[0], this.game), parseInt(str[1], 10), parseInt(str[2], 10));
                }
            }
        }

        // preload cgs
        if ('cgs' in this.game.setup) {
            for (const key of Object.keys(this.game.setup.cgs)) {
                const cgs = this.game.setup.cgs[key];
                if (typeof cgs === 'string') {
                    // normal cgs
                    this.game.load.image(key, preparePath(cgs, this.game));
                } else {
                    // spritesheet animation
                    const str = cgs.spritesheet.split(' ');
                    this.game.load.spritesheet(key, preparePath(str[0], this.game), parseInt(str[1], 10), parseInt(str[2], 10));
                }
            }
        }

        // preload background music
        if ('music' in this.game.setup) {
            for (const music of Object.keys(this.game.setup.music)) {
                this.game.load.audio(music, preparePath(this.game.setup.music[music], this.game));
            }
        }

        // preload sfx
        if ('sfx' in this.game.setup) {
            for (const sfx of Object.keys(this.game.setup.sfx)) {
                this.game.load.audio(sfx, preparePath(this.game.setup.sfx[sfx], this.game));
            }
        }

        // preload characters
        if ('characters' in this.game.setup) {
            for (const name of Object.keys(this.game.setup.characters)) {
                const char = this.game.setup.characters[name];
                for (const look of Object.keys(char.looks)) {
                    this.game.load.image(name + '_' + look, preparePath(char.looks[look], this.game));
                }
            }
        }


        if ('extra' in this.game.setup) {
            for (const type of Object.keys(this.game.setup.extra)) {
                Object.keys(this.game.setup.extra[type]).forEach(asset => {
                    if (type === 'spritesheets') {
                        const str = this.game.setup.extra[type][asset].split(' ');
                        this.game.load.spritesheet(asset, preparePath(str[0], this.game), parseInt(str[1], 10), parseInt(str[2], 10));
                    } else {
                        this.game.load[type](asset, preparePath(this.game.setup.extra[type][asset], this.game));
                    }
                })
            }
        }
    }

    create(): void {
        this.splash.destroy()
        // bg should be destroyed automatically, but destroy override is not working
        if (this.loadingBar.background){
            this.loadingBar.background.destroy();
        }
        this.loadingBar.destroy();
        // init game and start main menu
        this.game.managers.story.setupStory();
        this.game.gui.init();
        this.game.initInput();
        this.game.managers.audio.init(() => {
            this.game.gui.showMenu('main');
        });

        // this.game.state.add('init', init);
        // this.game.state.start('init');
    }
}
//
// const init = {
//     create(): void {
//
//     },
//
//     render (): void {
//         // if (RenJS.gui && RenJS.gui.hud && RenJS.gui.hud.area){
//         //     _.each(RenJS.gui.hud.area,function(area){
//         //         game.debug.rectangle(area);
//         //     });
//         // }
//     }
// }

export default PreloadStory
