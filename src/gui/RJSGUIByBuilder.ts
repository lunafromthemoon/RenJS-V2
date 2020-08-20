import {RJSGUI} from './RJSGUI';

export interface RJSGUIByBuilderInterface extends RJSGUI {
    changeMenu(menu)
    createChoiceBox(choice, pos, index, choiceConfig, execId)
    setTextPosition(sprite, text, component)
    loadGeneralComponents(menuConfig, menu)
    loadButton(component, menu)
    loadSlider(component, menu)
    addThumbnail(thumbnail, slot)
    loadSaveSlot(component, menu)
    loadThumbnail(thumbnail,parent)
    loadComponent(type, component, menu)
    buttonsAction: object
}
// todo to impl
export default class RJSGUIByBuilder implements RJSGUIByBuilderInterface {
    sliderValueChanged: object;
    buttonsAction: object;
    gui: any

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

    addThumbnail(thumbnail, slot) {
    }

    changeMenu(menu) {
    }

    createChoiceBox(choice, pos, index, choiceConfig, execId) {
    }

    loadButton(component, menu) {
    }

    loadComponent(type, component, menu) {
    }

    loadGeneralComponents(menuConfig, menu) {
    }

    loadSaveSlot(component, menu) {
    }

    loadSlider(component, menu) {
    }

    loadThumbnail(thumbnail, parent) {
    }

    setTextPosition(sprite, text, component) {
    }

}
