import RJS from '../core/RJS';
import { Group } from 'phaser-ce';
import RJSSprite from '../elements/RJSSprite';
import { GUIAsset } from './elements/GUIAsset';
export interface RJSGUIInterface {
    init(): any;
    assets: GUIAsset[];
    fonts: string[];
    showMenu(menu: any): any;
    showChoices(choices: any, execId: any): any;
    hideChoice(choiceId: any): any;
    hideChoices(): any;
    changeToLastInterrupt(choiceId: any): any;
    clear(): any;
    showText(text: any, title: any, colour: any, sfx: any, callback: any): any;
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
    assets: GUIAsset[];
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
    punctuationMarks: any;
    punctuationWait: any;
    currentMenu: any;
    previousMenu: any;
    currentMusic: any;
    constructor(game: RJS);
    initAssets(gui: any): void;
    init(): Promise<void>;
    initMenu(name: string, menuConfig: any): void;
    initHUD(hudConfig: any): void;
    getTextStyle(type: any): {
        font: any;
        fill: any;
    };
    loadElements(menuConfig: any, menu: any): void;
    loadElement(element: any, menu: any): void;
    loadLabel(element: any, menu: any): void;
    loadButton(element: any, menu: any): void;
    loadSaveSlot(element: any, menu: any): void;
    loadSlider(element: any, menu: any): void;
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
    showText(text: any, title: any, colour: any, sfx: any, callback: any): void;
    showChoices(choices: any, execId: any): void;
    createChoiceBox(choice: any, pos: any, index: any, choiceConfig: any, execId: any): any;
    toHexColor(color: any): number;
    setTextPosition(sprite: any, text: any, element: any): void;
}
