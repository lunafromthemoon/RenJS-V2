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
    skipClickArea: any[]
    nameBox: TSprite
    interrupts: T
    previousMenu: any
}
// todo to impl
export default class RJSGUIByBuilder implements RJSGUIByBuilderInterface<Group, Sprite> {
    sliderValueChanged: object;
    buttonsAction: object;
    gui: any
    currentMusic = null
    choices: Group
    hud: Group
    interrupts: Group
    game: RJS

    currentMenu = null
    menus = {}
    messageBox: any
    ctc: Sprite
    nameBox: Sprite
    skipClickArea = []
    previousMenu = null

    textLoop = null

    constructor(gui, game: RJS) {
        this.gui = gui
        this.game = game
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
        return this.skipClickArea.find(area => area.contains(pointer.x,pointer.y)) != undefined;
    }

    init() {
        this.initHUD(this.gui.config.hud);
        this.menus = {};
        this.initMenu('main',this.gui.config.main)
        this.initMenu('settings',this.gui.config.settings)
        this.initMenu('saveload',this.gui.config.saveload)
    }

    initHUD(hudConfig: any) {
        this.hud = this.game.add.group()
        this.hud.visible = false;

        if (hudConfig.buttons){
            hudConfig.buttons.forEach(btn => {
                const w = parseInt(btn.width)
                const h = parseInt(btn.height)
                this.skipClickArea.push(new Phaser.Rectangle(btn.x,btn.y,w,h))
            },this);
        }
        let mBox
        if (hudConfig['message-box']){
            mBox = hudConfig['message-box'];
            this.messageBox = this.game.add.sprite(mBox.x,mBox.y,mBox.id,0,this.hud);
            this.messageBox.visible = false;
            const textStyle = {font: mBox.size+'px '+mBox.font, fill: mBox.color};
            const text = this.game.add.text(mBox['offset-x'],mBox['offset-y'], "", textStyle);
            text.wordWrap = true;
            text.align = mBox.align;
            text.wordWrapWidth = mBox['text-width'];
            this.messageBox.message = text;
            this.messageBox.addChild(text);
        }
        if (hudConfig['name-box']){
            const x = hudConfig['name-box'].x - mBox.x;
            const y = hudConfig['name-box'].y - mBox.y;
            this.nameBox = this.game.add.sprite(x,y,hudConfig['name-box'].id,0,this.hud);
            // this.nameBox.visible = false;
            const textStyle = {font: hudConfig['name-box'].size+'px '+hudConfig['name-box'].font, fill: hudConfig['name-box'].color}
            const text = this.game.add.text(0,0, "", textStyle);
            this.setTextPosition(this.nameBox,text, hudConfig['name-box'])
            this.messageBox.addChild(this.nameBox)
        }
        if (hudConfig.ctc) {
            const x = hudConfig['ctc'].x - mBox.x;
            const y = hudConfig['ctc'].y - mBox.y;
            this.ctc = this.game.add.sprite(x,y,hudConfig.ctc.id);
            // this.ctc.visible = false;
            if (hudConfig.ctc.animationStyle == 'spritesheet') {
                this.ctc.animations.add('do').play()
            } else {
                this.ctc.alpha = 0;
                // this.ctc.tween =
                this.game.add.tween(this.ctc).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None,true,0,-1);
            }
            this.messageBox.addChild(this.ctc)
        }
        if (hudConfig.choice){
            this.choices = this.game.add.group();
        }
        if (hudConfig.interrupt && !hudConfig.interrupt.inlineWithChoice){
            this.interrupts = this.game.add.group();
        }

        this.loadGeneralComponents(hudConfig,this.hud)
    }

    initMenu(name: string, menuConfig) {
        if (!menuConfig) return;
        this.menus[name] = this.game.add.group();
        this.menus[name].visible = false;
        // load bg
        if (menuConfig.background){
            this.game.add.image(0,0,menuConfig.background.id,0,this.menus[name]);
        }
        this.loadGeneralComponents(menuConfig,this.menus[name]);
        if (menuConfig.backgroundMusic){
            menuConfig.backgroundMusic = this.game.add.audio(menuConfig.backgroundMusic);
        }
    }

    showChoices(choices, execId) {
        this.choices.removeAll(true);

        const choiceConfig = this.gui.config.hud.choice;
        const interruptConfig = this.gui.config.hud.choice;

        if (interruptConfig && !interruptConfig.inlineWithChoice){
            // separate choices from interrupts
        }

        const x = (choiceConfig.isBoxCentered) ? this.gui.resolution[0]/2 - choiceConfig.width/2 : choiceConfig.x;
        const y = (choiceConfig.isBoxCentered) ? this.gui.resolution[1]/2 - (choiceConfig.height*choices.length + parseInt(choiceConfig.separation)*(choices.length-1))/2 : choiceConfig.y;

        choices.forEach((choice,index) => {
            const choiceType = choice.interrupt ? interruptConfig : choiceConfig;
            this.createChoiceBox(choice,[x,y],index,choiceType,execId)
        });
    }

    showHUD() {
        this.hud.visible = true;
    }

    showMenu(menu) {
        this.game.pause();
        this.previousMenu = this.currentMenu;
        this.currentMenu = menu;
        this.menus[menu].alpha = 0;
        this.menus[menu].visible = true;
        this.game.add.tween(this.menus[menu]).to( {alpha:1}, 750,null,true);
        if (this.gui.config[menu].backgroundMusic && !this.gui.config[menu].backgroundMusic.isPlaying && !this.game.defaultValues.settings.muted){
            this.currentMusic = this.gui.config[menu].backgroundMusic;
            this.currentMusic.fadeIn(1000);
        }
    }

    showText(text, title, colour, callback) {
        if  (title && this.nameBox) {
            // todo unknown property
            // this.nameBox.text.text = title;
            // this.nameBox.text.fill = colour;
            this.nameBox.visible = true;
        } else {
            this.nameBox.visible = false;
        }

        if (this.game.control.skipping || this.game.defaultValues.settings.textSpeed < 10){
            this.messageBox.message.text = text;
            this.messageBox.visible = true;
            this.ctc.visible = true;
            callback();
            return;
        }
        const textObj = this.messageBox.message;
        textObj.text = "";
        const words = text.split("");
        let count = 0;
        const completeText = () => {
            clearTimeout(this.game.gui.textLoop);
            textObj.text = text;
            this.game.gui.ctc.visible = true;
            callback();
        }

        this.textLoop = setInterval(() => {
            textObj.text += (words[count]);
            count++;
            if (count >= words.length){
                completeText();
            }
        }, this.game.defaultValues.settings.textSpeed);
        this.messageBox.visible = true;
        if (!this.game.control.auto){
            this.game.waitForClick(completeText);
        }
    }

    addThumbnail(thumbnail, slot) {
        if (this.saveSlots[slot]){
            this.loadThumbnail(thumbnail,this.saveSlots[slot])
        }
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
