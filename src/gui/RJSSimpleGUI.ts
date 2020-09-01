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
        const imgs = Object.entries(this.gui.assets.images).map(([key, asset]) => (
            {key:key, file:asset, type: "image"}
        ));
        const spritesheets = Object.entries(this.gui.assets.spritesheets).map(([key, asset]) => {
            const e = String(asset).split(" ");
            return {key:key,file:e[0],w:parseInt(e[1]),h:parseInt(e[2]), type: "spritesheet"};
        });
        const audio = Object.entries(this.gui.assets.audio).map(([key, asset]) => (
            {key:key, file:asset, type: "audio"}
        ));
        return [...imgs,...spritesheets,...audio];
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
