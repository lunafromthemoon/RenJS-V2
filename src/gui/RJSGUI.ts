import RJS from '../core/RJS';
import {Group} from 'phaser-ce';
import {GUIAsset} from './elements/GUIAsset';
import RJSMenu from './RJSMenu';
import RJSHUD from './RJSHUD';

export interface RJSGUIInterface {
    init();
    assets: GUIAsset[];
    fonts: string[];

    showMenu(menu);
    changeMenu(menu): void;

}

export default class RJSGUI implements RJSGUIInterface {
    bindingActions = {};

    config: any
    assets: GUIAsset[] = []
    fonts: string[] = []

    menus: { [key: string]: RJSMenu } = {};

    hud: RJSHUD = null;

    // menu navigation
    currentMenu = null
    previousMenu = null

    constructor(protected game: RJS) {
        this.initAssets(game.guiSetup);
        this.initBindingActions();
    }

    // ----------------------------------------------------------------
    // Init the gui, build the elements and menus
    // ----------------------------------------------------------------
    initAssets(gui: any){
        // convert specific gui config to general one
        // has to init this.assets, this.fonts and this.config
    }

    async init() {
        // decode audios used in the menu
        const audioList = [];
        for (let i = 0; i < this.assets.length; i++) {
            if (this.assets[i].type=='audio'){
                audioList.push(this.assets[i].key);
            }
        }
        await this.game.managers.audio.decodeAudio(audioList);
        this.hud = new RJSHUD(this.game,this.config.hud);
        this.hud.init();
        // add also as menu to switch between menus and hud easily
        this.menus.hud = this.hud;
        for (const menuName in this.config.menus){
            this.menus[menuName] = new RJSMenu(this.game,this.config.menus[menuName]);
            this.menus[menuName].init();
        }
    }


    // ----------------------------------------------------------------
    // GUI user interaction, buttons and sliders
    // ----------------------------------------------------------------

    getCurrent(){
        return this.menus[this.currentMenu];
    }

    async showMenu(menu) {
        // this.game.pause();
        this.previousMenu = this.currentMenu;
        this.currentMenu = menu;
        this.game.world.bringToTop(this.menus[menu])
        await this.menus[menu].show();
    }

    async hideMenu(menu, mute, callback?) {
        if (!menu){
            menu = this.currentMenu;
        }
        await this.menus[menu].hide(mute);
        this.currentMenu = null;
        if (callback){
            callback()
        }
    }

    async changeMenu(menu) {
        const previous = this.currentMenu;
        if (previous){
            if (menu) {
                // hide previous menu and show this
                await this.hideMenu(previous,false);
                await this.showMenu(menu);
                this.previousMenu = previous;
                return
            } else {
                // just hide menu
                await this.hideMenu(previous,true);
            }
        }
        if (menu){
            await this.showMenu(menu);
        }
    }

    initBindingActions (): void {
        this.bindingActions = {
            start: async () => {
                // hide current menu
                await this.game.gui.changeMenu('hud');
                this.game.start();
            },
            load: async (element) => {
                // hide current menu
                await this.game.gui.changeMenu('hud');
                this.game.loadSlot(parseInt(element.slot, 10));
            },
            save: (element) => {
                this.game.save(parseInt(element.slot, 10));
            },
            auto: this.game.auto.bind(this.game),
            skip: this.game.skip.bind(this.game),
            mute: (element,mute) =>{
                // mutes or unmutes audio and saves preference
                this.game.managers.audio.mute(mute);
             },
            openMenu: (element)=>{
                this.game.pause();
                this.changeMenu(element.menu);
            },
            return: async () => {
                const prev = this.previousMenu;
                await this.game.gui.changeMenu(prev);
                if (prev=='hud') {
                    this.game.unpause();
                }
            },
            // slider bindings
            changeUserPreference: (element,value) => {
                this.game.userPreferences.set(element.userPreference,value);
                if (element.userPreference == 'bgmv'){
                    // change music volume immediately
                    this.game.managers.audio.changeVolume(this.game.userPreferences.get(element.userPreference));
                }
            }
        };
    }

}