import RJS from '../core/RJS';
import {Group} from 'phaser-ce';
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

    // config = {hud:null, menus: {main:null,settings:null,saveload:null}}
    config: any
    assets: GUIAsset[] = []
    fonts: string[] = []
    // gui graphical elements
    menus: { [key: string]: any } = {string:RJSMenu};
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
    initAssets(gui: any){
        // convert specific gui config to general one
        // has to init this.assets, this.fonts and this.config
    }

    async init() {
        // decode audios used in the menu
        const audioList = [];
        for (let i = 0; i < this.assets.length; i++) {
            if (this.assets[i].type=='audio'){
                audioList.push(this.assets[i].key);
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

    getCurrent(){
        return this.menus[this.currentMenu];
    }

    async showMenu(menu) {
        // this.game.pause();
        this.previousMenu = this.currentMenu;
        this.currentMenu = menu;
        this.game.world.bringToTop(this.menus[menu])
        await this.menus[menu].show();
    }

    async hideMenu(menu, mute, callback?) {
        if (!menu){
            menu = this.currentMenu;
        }
        await this.menus[menu].hide(mute);
        this.currentMenu = null;
        if (callback){
            callback()
        }
    }

    async changeMenu(menu) {
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
            start: async () => {
                // hide current menu
                await this.game.gui.changeMenu('hud');
                this.game.start();
            },
            load: async (element) => {
                // hide current menu
                await this.game.gui.changeMenu('hud');
                this.game.loadSlot(parseInt(element.slot, 10));
            },
            save: (element) => {
                this.game.save(parseInt(element.slot, 10));
            },
            auto: this.game.auto.bind(this.game),
            skip: this.game.skip.bind(this.game),
            mute: (element,mute) =>{
                // mutes or unmutes audio and saves preference
                this.game.managers.audio.mute(mute);
             },
            openMenu: (element)=>{
                this.game.pause();
                this.changeMenu(element.menu);
            },
            return: async () => {
                const prev = this.previousMenu;
                await this.game.gui.changeMenu(prev);
                if (prev=='hud') {
                    this.game.unpause();
                }
            },
            // slider bindings
            changeUserPreference: (element,value) => {
                this.game.userPreferences.set(element.userPreference,value);
                if (element.userPreference == 'bgmv'){
                    // change music volume immediately
                    this.game.managers.audio.changeVolume(this.game.userPreferences.get(element.userPreference));
                }
            }
        };
    }

    // ----------------------------------------------------------------
    // GUI story interaction
    // ----------------------------------------------------------------

    // clear() {
    //     this.hideChoices();
    //     this.hideText();
    // }

    // hideText() {
    //     if(!this.messageBox.alwaysOn){
    //         this.messageBox.visible = false;
    //     }
    //     this.messageBox.message.text = '';
    //     if (this.ctc){
    //         this.ctc.visible = false;
    //     }
    // }

    // hideChoice(choiceId): void {
    //     const choice = this.choices.getByName(choiceId);
    //     if (choice){
    //         this.choices.remove(choice,true);
    //     }
    // }

    // changeToLastInterrupt(choiceId): void {
    //     const choice = this.choices.getByName(choiceId);
    //     if (choice.animations.frameTotal === 4) {
    //         choice.setFrames(3,2,3,2);
    //     } else {
    //         choice.setFrames(4,3,5,3);
    //     }
    // }

    // hideChoices(): void {
    //     this.choices.removeAll();
    // }

    // setTextStyles(text,text_obj): string {
    //   text_obj.clearFontValues();
    //   text_obj.clearColors()
    //   let styles = []
    //   while(true){
    //     let re = /\((color:((\w+|#(\d|\w)+))|italic|bold)\)/
    //     let match = text.match(re);
    //     if (match){
    //       let s = {
    //         start: text.search(re),
    //         style: match[1].includes("color") ? "color" : match[1],
    //         end: -1,
    //         color: null
    //       }
    //       if (s.style == "color"){
    //         s.color = match[2];
    //       }
    //       text = text.replace(re,"")
    //       let endIdx = text.indexOf("(end)");
    //       if (endIdx!=-1){
    //         text = text.replace("(end)","")
    //         s.end = endIdx;
    //         styles.push(s)
    //       }
    //     } else break;
    //   }
    //   styles.forEach(s=>{
    //     if (s.style=="italic"){
    //       text_obj.addFontStyle("italic", s.start);
    //       text_obj.addFontStyle("normal", s.end);
    //     }
    //     if (s.style=="bold"){
    //       text_obj.addFontWeight("bold", s.start);
    //       text_obj.addFontWeight("normal", s.end);
    //     }
    //     if (s.style=="color"){
    //       text_obj.addColor(s.color, s.start)
    //       text_obj.addColor(text_obj.fill, s.end)
    //     }
    //   })
    //   return text;
    // }

    // showText(text, title, colour, sfx, callback) {
    //     if  (this.nameBox) {
    //         this.nameBox.text.text = title!=undefined ? title : "";
    //         if (colour && this.config.hud['name-box'].tintStyle == "box"){
    //             // tint the whole box
    //             this.nameBox.tint = this.toHexColor(colour);
    //             this.nameBox.text.fill = this.config.hud['name-box'].color;
    //         } else {
    //             // change name color
    //             this.nameBox.text.fill = colour;
    //         }

    //         this.nameBox.visible = title!=undefined;

    //     }
    //     if (sfx=='none'){
    //         // if character voice configured as none, don't make any sound
    //         sfx=null;
    //     } else if (!sfx && this.messageBox.sfx){
    //         sfx = this.messageBox.sfx;
    //     }

    //     let textSpeed = this.sliderLimits.textSpeed[1] - this.game.userPreferences.textSpeed
    //     if (this.game.control.skipping || textSpeed < 10){
    //         this.messageBox.message.text = text;
    //         this.messageBox.visible = true;
    //         this.ctc.visible = true;
    //         callback();
    //         return;
    //     }
    //     const textObj = this.messageBox.message;
    //     textObj.text = '';
    //     let finalText = setTextStyles(text,textObj)
    //     const words = finalText.split('');
    //     let count = 0;
    //     const completeText = () => {
    //         clearTimeout(this.textLoop);
    //         textObj.text = finalText;
    //         this.game.gui.ctc.visible = true;
    //         callback();
    //     }
    //     let waitingFor = 0;
    //     // how many characters to add per sfx played
    //     let charPerSfx = this.game.storyConfig.charPerSfx ?  this.game.storyConfig.charPerSfx : 1;

    //     if (sfx && charPerSfx=='auto'){
    //         charPerSfx = Math.ceil(sfx.durationMS/textSpeed);
    //     }
    //     // sfx will only play when sfxCharCount == 0, and will reset when sfxCharCount == charPerSfx
    //     let sfxCharCount = 0;


    //     this.textLoop = setInterval(() => {
    //         if (waitingFor>0) {
    //             waitingFor--;
    //             return;
    //         }
    //         textObj.text += (words[count]);

    //         if (sfx){
    //             if (words[count] == " " || this.punctuationMarks.includes(words[count]) || sfxCharCount==charPerSfx){
    //                 // reset count, but don't play
    //                 sfxCharCount=-1;
    //             } else if (sfxCharCount==0){
    //                 sfx.play();
    //                 sfx.volume = this.game.userPreferences.sfxv;
    //             }
    //             sfxCharCount++;
    //         }

    //         if (this.punctuationMarks.includes(words[count])){
    //             waitingFor = this.punctuationWait;

    //         }
    //         count++;
    //         if (count >= words.length){
    //             completeText();
    //         }
    //     }, textSpeed);
    //     this.messageBox.visible = true;
    //     if (!this.game.control.auto){
    //         this.game.waitForClick(completeText);
    //     }
    // }

    // showChoices(choices, execId) {
    //     this.choices.removeAll(true);
    //     this.choices.alpha = 0;
    //     let choiceConfig = this.config.hud.choice;
    //     const interruptConfig = this.config.hud.interrupt;

    //     if (interruptConfig && !interruptConfig.inlineWithChoice){
    //         // separate choices from interrupts
    //         choiceConfig = interruptConfig
    //     }
    //     const x = (choiceConfig.isBoxCentered) ?
    //         this.game.world.centerX - choiceConfig.width/2 :
    //         choiceConfig.x;
    //     const y = (choiceConfig.isBoxCentered) ?
    //         this.game.world.centerY - (choiceConfig.height*choices.length + parseInt(choiceConfig.separation, 10)*(choices.length-1))/2 :
    //         choiceConfig.y;

    //     choices.forEach((choice,index) => {
    //         this.createChoiceBox(choice,[x,y],index,choiceConfig,execId)
    //     });
    //     let transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.textChoices);
    //     transition(null,this.choices);
    // }

    // createChoiceBox(choice, pos, index, choiceConfig, execId) {
    //     const separation = index*(parseInt(choiceConfig.height, 10)+parseInt(choiceConfig.separation, 10));
    //     const chBox: ChoiceButton = this.game.add.button(pos[0], pos[1]+separation, choiceConfig.id, () => {
    //         if (choiceConfig.sfx && choiceConfig.sfx !== 'none') {
    //             this.game.managers.audio.playSFX(choiceConfig.sfx);
    //         }
    //         let transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.textChoices);
    //         transition(this.choices,null).then(()=>{
    //             this.choices.removeAll(true);
    //             this.game.managers.logic.choose(index,choice.choiceText,execId);
    //         })

    //     },this,1,0,2,0,this.choices);
    //     if (chBox.animations.frameTotal === 2 || chBox.animations.frameTotal === 4){
    //         chBox.setFrames(1,0,1,0)
    //     }
    //     if (choice.interrupt && choice.remainingSteps===1 && chBox.animations.frameTotal > 3){
    //         if (chBox.animations.frameTotal === 4){
    //             chBox.setFrames(3,2,3,2);
    //         } else {
    //             chBox.setFrames(4,3,5,3);
    //         }
    //     }
    //     chBox.choiceId = choice.choiceId;
    //     chBox.name = choice.choiceId;

    //     const textStyle = this.getTextStyle('choice');

    //     const text = this.game.add.text(0, 0, "" , textStyle);
    //     const finalText = setTextStyles(choice.choiceText,text);
    //     text.text = finalText;
    //     text.visible = false;
    //     this.setTextPosition(chBox,text, choiceConfig);
    //     setTimeout(()=>{text.visible = true},20)
    //     if (this.game.storyConfig.logChoices && this.game.managers.logic.choicesLog[execId].indexOf(choice.choiceText) !== -1){
    //         chBox.tint = this.toHexColor(choiceConfig['chosen-color']);
    //     }
    //     return chBox;
    // }

    // ----------------------------------------------------------------
    // Helper functions
    // ----------------------------------------------------------------

    // toHexColor(color) {
    //     // eslint-disable-next-line no-bitwise
    //     return (parseInt(color.substr(1), 16) << 8) / 256;

    // }

    // setTextPosition(sprite, text, element) {
    //     text.lineSpacing = element.lineSpacing ? element.lineSpacing : 0;
    //     if (element.isTextCentered) {
    //         text.setTextBounds(0,0, sprite.width, sprite.height);
    //         text.boundsAlignH = 'center';
    //         text.boundsAlignV = 'middle';
    //     } else {
    //         const offsetX = parseInt(element['offset-x'], 10);
    //         const offsetY = parseInt(element['offset-y'], 10);
    //         text.setTextBounds(offsetX,offsetY, sprite.width, sprite.height);
    //         text.boundsAlignH = element.align;
    //         text.boundsAlignV = 'top'
    //         if (element['text-width']){
    //             text.wordWrap = true;
    //             text.align = element.align;
    //             text.wordWrapWidth = element['text-width'];
    //         }
    //     }
    //     sprite.addChild(text);
    //     sprite.text = text;
    // }

}