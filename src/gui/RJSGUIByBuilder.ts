import {RJSGUI} from './RJSGUI';
import {Group, Sprite} from 'phaser-ce';
import RJS from '../RJS';
import {GUIAssets} from './Assets';

export interface RJSGUIByBuilderInterface<T, TSprite> extends RJSGUI {
    hideMenu(menu, mute, callback);
    changeMenu(menu);
    createChoiceBox(choice, pos, index, choiceConfig, execId);
    setTextPosition(sprite, text, component);
    loadGeneralComponents(menuConfig, menu);
    loadButton(component, menu);
    loadSlider(component, menu);
    addThumbnail(thumbnail, slot);
    loadSaveSlot(component, menu);
    loadThumbnail(thumbnail,parent);
    loadComponent(type, component, menu);
    buttonsAction: object;
    currentMusic: any;
    choices: T;
    hud: T;
    currentMenu: any;
    menus: any;
    messageBox: TSprite;
}
// todo to impl
export default class RJSGUIByBuilder implements RJSGUIByBuilderInterface<Group, Sprite> {
    sliderValueChanged: object;
    buttonsAction: object;
    gui: any
    currentMusic = null
    choices: Group
    hud: Group
    game: RJS

    currentMenu = null
    menus = {}
    messageBox: any
    ctc: Sprite

    constructor(gui, game: RJS) {
        this.gui = gui
        this.game = game
        this.choices = this.game.add.group()
        this.hud = this.game.add.group()
    }

    changeToLastInterrupt(choiceId): void {
        const choice = this.choices.getByName(choiceId);
        if (choice.animations.frameTotal === 4) {
            choice.setFrames(3,2,3,2);
        } else {
            choice.setFrames(4,3,5,3);
        }
    }

    clear(): void {
        this.hideChoices();
        this.hideText();
    }

    getAssets(): GUIAssets[] {
        const toAssetList = (list,type,path): GUIAssets[] => {
            return Object.keys(list).map(key => (
                {
                    key,
                    file:path+list[key].fileName,
                    type,
                    w:list[key].w,
                    h:list[key].h
                }
            ));
        }
        const imgs = toAssetList(this.gui.assets.images,'image',this.gui.assetsPath);
        const audio = toAssetList(this.gui.assets.audio,'audio',this.gui.assetsPath);
        const sprts = toAssetList(this.gui.assets.spritesheets,'spritesheet',this.gui.assetsPath);
        return imgs.concat(audio).concat(sprts);
    }

    getChoiceTextStyle(): any {
        const choiceConfig = this.gui.config.hud.choice;
        return {font: choiceConfig.size+'px '+choiceConfig.font, fill: choiceConfig.color};
    }

    getFonts(argument?: any): any[] {
        return Object.keys(this.gui.assets.fonts);
    }

    hideChoice(choiceId): void {
        const choice = this.choices.getByName(choiceId);
        if (choice){
            this.choices.remove(choice,true);
        }
    }

    hideChoices(): void {
        this.choices.removeAll();
    }

    hideHUD(): void {
        this.hud.visible = false;
    }

    hideMenu(menu, mute, callback): void {
        if (!menu){
            menu = this.currentMenu;
        }
        const tween = this.game.add.tween(this.menus[menu]).to( {alpha:0}, 400);
        tween.onComplete.add(() => {
            this.menus[menu].visible = false;
            this.currentMenu = null;
            if (callback){
                callback()
            }
        });
        // console.log(this.gui.config[menu])
        if (mute && this.currentMusic){
            this.currentMusic.fadeOut(400);
        }
        tween.start();
    }

    hideText(): void {
        this.messageBox.visible = false;
        this.messageBox.message.text = '';
        if (this.ctc){
            this.ctc.visible = false;
        }
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

    getChosenOptionColor() {
        // eslint-disable-next-line no-bitwise
        return (parseInt(this.gui.config.hud.choice['chosen-color'].substr(1), 16) << 8) / 256;

    }

}
