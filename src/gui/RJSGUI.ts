import RJS from '../core/RJS';
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
    initAssets(gui: any): void{
        // convert specific gui config to general one
        // has to init this.assets, this.fonts and this.config
    }

    async init(): Promise<any> {
        // decode audios used in the menu
        const audioList = [];
        for (const asset of this.assets) {
            if (asset.type==='audio'){
                audioList.push(asset.key);
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

    getCurrent(): RJSMenu{
        return this.menus[this.currentMenu];
    }

    async showMenu(menu): Promise<any> {
        // this.game.pause();
        this.previousMenu = this.currentMenu;
        this.currentMenu = menu;
        this.game.accessibility.updateLayout();
        this.game.world.bringToTop(this.menus[menu])
        await this.menus[menu].show();
    }

    async hideMenu(menu, mute, callback?): Promise<any> {
        if (!menu){
            menu = this.currentMenu;
        }
        const p = this.menus[menu].hide(mute);
        this.game.accessibility.updateLayout();
        await p;
        this.currentMenu = null;
        if (callback){
            callback()
        }
    }

    async changeMenu(menu): Promise<any> {
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
            start: async (): Promise<any> => {
                // hide current menu
                await this.game.gui.changeMenu('hud');
                this.game.start();
            },
            load: async (element): Promise<any> => {
                // hide current menu
                await this.game.gui.changeMenu('hud');
                this.game.loadSlot(parseInt(element.slot, 10));
            },
            save: (element): void => {
                this.game.save(parseInt(element.slot, 10));
            },
            auto: this.game.auto.bind(this.game),
            skip: this.game.skip.bind(this.game),
            mute: (element,mute): void =>{
                // mutes or unmutes audio and saves preference
                this.game.managers.audio.mute(mute);
             },
            openMenu: (element): void =>{
                this.game.pause();
                this.changeMenu(element.menu);
            },
            return: async (): Promise<any> => {
                const prev = this.previousMenu;
                await this.game.gui.changeMenu(prev);
                if (prev==='hud') {
                    this.game.unpause();
                }
            },
            // slider bindings
            changeUserPreference: (element,value): void => {
                this.game.userPreferences.set(element.userPreference,value);
                if (element.userPreference === 'bgmv'){
                    // change music volume immediately
                    this.game.managers.audio.changeVolume();
                }
            }
        };
    }

}