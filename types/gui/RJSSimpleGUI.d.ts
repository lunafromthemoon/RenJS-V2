import { RJSGUI } from './RJSGUI';
export interface RJSSimpleGUIInterface extends RJSGUI {
}
export default class RJSSimpleGUI implements RJSSimpleGUIInterface {
    sliderValueChanged: object;
    gui: any;
    constructor(gui: any);
    changeToLastInterrupt(choiceId: any): void;
    clear(): void;
    getAssets(): {
        key: string;
        file: unknown;
        type: string;
    }[];
    getChoiceTextStyle(): void;
    getFonts(argument: any): void;
    hideChoice(choiceId: any): void;
    hideChoices(): void;
    hideHUD(): void;
    hideMenu(menu: any): void;
    hideText(): void;
    ignoreTap(pointer: any): void;
    init(): void;
    initHUD(): void;
    initMenu(name: string, menu: any): void;
    showChoices(choices: any, execId: any): void;
    showHUD(): void;
    showMenu(menu: any): void;
    showText(text: any, title: any, colour: any, callback: any): void;
}
