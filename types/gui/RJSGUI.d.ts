import RJS from '../core/RJS';
import { Group } from 'phaser-ce';
import RJSSprite from '../components/RJSSprite';
import ChoiceButton from '../components/ChoiceButton';
import { GUIAssets } from './Assets';
export interface RJSGUIInterface {
    init(): any;
    getTextStyle(type: string): any;
    assets: GUIAssets[];
    fonts: string[];
    showMenu(menu: any): any;
    showChoices(choices: any, execId: any): any;
    hideChoice(choiceId: any): any;
    hideChoices(): any;
    changeToLastInterrupt(choiceId: any): any;
    clear(): any;
    showText(text: any, title: any, colour: any, callback: any): any;
    hideText(): any;
    ignoreTap(pointer: any): any;
    addThumbnail?(thumbnail: any, slot: any): any;
    changeMenu(menu: any): void;
    sliderLimits: {
        textSpeed: number[];
        autoSpeed: number[];
        bgmv: number[];
        sfxv: number[];
    };
}
export default class RJSGUI implements RJSGUIInterface {
    protected game: RJS;
    buttonsAction: {};
    config: {
        hud: any;
        menus: {
            main: any;
            settings: any;
            saveload: any;
        };
    };
    assets: GUIAssets[];
    fonts: string[];
    menus: {};
    hud: Group;
    messageBox: any;
    ctc: RJSSprite;
    nameBox: RJSSprite;
    choices: Group;
    interrupts: Group;
    saveSlots: {};
    textLoop: any;
    sliderLimits: {
        textSpeed: number[];
        autoSpeed: number[];
        bgmv: number[];
        sfxv: number[];
    };
    skipClickArea: any[];
    currentMenu: any;
    previousMenu: any;
    currentMusic: any;
    constructor(game: RJS);
    initAssets(gui: any): void;
    init(): void;
    initMenu(name: string, menuConfig: any): void;
    initHUD(hudConfig: any): void;
    getTextStyle(type: any): {
        font: any;
        fill: any;
    };
    loadGeneralComponents(menuConfig: any, menu: any): void;
    loadComponent(type: any, component: any, menu: any): void;
    loadButton(component: any, menu: any): void;
    loadSaveSlot(component: any, menu: any): void;
    loadSlider(component: any, menu: any): void;
    loadThumbnail(thumbnail: any, parent: any): void;
    ignoreTap(pointer: any): boolean;
    addThumbnail(thumbnail: any, slot: any): void;
    showMenu(menu: any): Promise<void>;
    hideMenu(menu: any, mute: any, callback?: any): Promise<void>;
    showHUD(): void;
    hideHUD(): void;
    changeMenu(menu: any): Promise<void>;
    initButtonsActions(): void;
    clear(): void;
    hideText(): void;
    hideChoice(choiceId: any): void;
    changeToLastInterrupt(choiceId: any): void;
    hideChoices(): void;
    setTextStyles(text: any, text_obj: any): string;
    showText(text: any, title: any, colour: any, callback: any): void;
    showChoices(choices: any, execId: any): void;
    createChoiceBox(choice: any, pos: any, index: any, choiceConfig: any, execId: any): ChoiceButton;
    toHexColor(color: any): number;
    setTextPosition(sprite: any, text: any, component: any): void;
}
