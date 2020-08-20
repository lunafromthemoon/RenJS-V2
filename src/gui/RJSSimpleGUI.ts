import {RJSGUI} from './RJSGUI';

export interface RJSSimpleGUIInterface extends RJSGUI {}

// todo to impl
export default class RJSSimpleGUI implements RJSSimpleGUIInterface {
    sliderValueChanged: object;
    gui: any;

    constructor(gui) {
        this.gui = gui
    }

    changeToLastInterrupt(choiceId) {
    }

    clear() {
    }

    getAssets() {
    }

    getChoiceTextStyle() {
    }

    getFonts(argument: any) {
    }

    hideChoice(choiceId) {
    }

    hideChoices() {
    }

    hideHUD() {
    }

    hideMenu(menu) {
    }

    hideText() {
    }

    ignoreTap(pointer) {
    }

    init() {
    }

    initHUD() {
    }

    initMenu(name: string, menu) {
    }

    showChoices(choices, execId) {
    }

    showHUD() {
    }

    showMenu(menu) {
    }

    showText(text, title, colour, callback) {
    }

}
