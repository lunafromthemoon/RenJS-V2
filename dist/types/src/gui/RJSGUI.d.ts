import RJS from '../core/RJS';
import { GUIAsset } from './elements/GUIAsset';
import RJSMenu from './RJSMenu';
import RJSHUD from './RJSHUD';
import { setTextStyles } from '../utils/gui';
export interface RJSGUIInterface {
    init(): any;
    assets: GUIAsset[];
    fonts: string[];
    showMenu(menu: any): any;
    changeMenu(menu: any): void;
}
export default class RJSGUI implements RJSGUIInterface {
    protected game: RJS;
    bindingActions: {};
    config: any;
    assets: GUIAsset[];
    fonts: string[];
    menus: {
        [key: string]: RJSMenu;
    };
    hud: RJSHUD;
    currentMenu: any;
    previousMenu: any;
    setTextStyles: typeof setTextStyles;
    constructor(game: RJS);
    initAssets(gui: any): void;
    init(): Promise<any>;
    getCurrent(): RJSMenu;
    showMenu(menu: any): Promise<any>;
    hideMenu(menu: any, mute: any, callback?: any): Promise<any>;
    changeMenu(menu: any): Promise<any>;
    initBindingActions(): void;
}
