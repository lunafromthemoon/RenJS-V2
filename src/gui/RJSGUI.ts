import RJS from '../core/RJS';
import {Group} from 'phaser-ce';
import RJSSlider from '../components/RJSSlider';
import RJSSprite from '../components/RJSSprite';
import RJSButton from '../components/RJSButton';
import ChoiceButton from '../components/ChoiceButton';
import {GUIAssets} from './Assets';

export interface RJSGUIInterface {
    init();
    getTextStyle(type:string);
    assets: GUIAssets[]
    fonts: string[]

    showMenu(menu);
    showChoices(choices, execId);
    hideChoice(choiceId);
    hideChoices();
    changeToLastInterrupt(choiceId);
    clear();
    showText(text, title, colour, callback);
    hideText();
    ignoreTap(pointer);
    addThumbnail?(thumbnail, slot);
    changeMenu(menu): void;
    sliderLimits: {
        textSpeed: number[];
        autoSpeed: number[];
        bgmv: number[];
        sfxv: number[];
    };

}

export default class RJSGUI implements RJSGUIInterface {
    buttonsAction = {};

    config = {hud:null, menus: {main:null,settings:null,saveload:null}}
    assets: GUIAssets[] = []
    fonts: string[] = []
    // gui graphical components
    menus = {};
    hud: Group = null;
    messageBox: any
    ctc: RJSSprite
    nameBox: RJSSprite
    choices: Group
    interrupts: Group
    saveSlots = {}
    // interval object to show text per letter 
    textLoop = null;

    sliderLimits = {
        textSpeed: [10,150],
        autoSpeed: [50,300],
        bgmv: [0,1],
        sfxv: [0,1]
    };

    skipClickArea = []

    // menu navigation
    currentMenu = null
    previousMenu = null

    constructor(gui, protected game: RJS) {
        this.initAssets(gui);
        this.initButtonsActions();
    }

    // ----------------------------------------------------------------
    // Init the gui, build the elements and menus
    // ----------------------------------------------------------------
    initAssets(gui: any){
        // convert specific gui config to general one
        // has to init this.assets, this.fonts and this.config
    }

    init() {
        this.initHUD(this.config.hud);
        this.initMenu('main',this.config.menus.main)
        this.initMenu('settings',this.config.menus.settings)
        this.initMenu('saveload',this.config.menus.saveload)
    }

    initMenu(name: string, menuConfig: any) {
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

    initHUD(hudConfig: any) {
        if (!hudConfig) return;
        this.hud = this.game.add.group()
        this.hud.visible = false;

        if (hudConfig.buttons){
            hudConfig.buttons.forEach(btn => {
                const w = parseInt(btn.width, 10)
                const h = parseInt(btn.height, 10)
                this.skipClickArea.push(new Phaser.Rectangle(btn.x,btn.y,w,h))
            },this);
        }
        let mBox
        if (hudConfig['message-box']){
            mBox = hudConfig['message-box'];
            this.messageBox = this.game.add.sprite(mBox.x,mBox.y,mBox.id,0,this.hud);
            this.messageBox.visible = false;
            const textStyle = this.getTextStyle('message-box');
            const text = this.game.add.text(mBox['offset-x'],mBox['offset-y'], '', textStyle);
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
            const textStyle = this.getTextStyle('name-box');
            const text = this.game.add.text(0,0, '', textStyle);
            this.setTextPosition(this.nameBox,text, hudConfig['name-box'])
            this.messageBox.addChild(this.nameBox)
        }
        if (hudConfig.ctc) {
            const x = hudConfig.ctc.x - mBox.x;
            const y = hudConfig.ctc.y - mBox.y;
            this.ctc = this.game.add.sprite(x,y,hudConfig.ctc.id);
            // this.ctc.visible = false;
            if (hudConfig.ctc.animationStyle === 'spritesheet') {
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

    getTextStyle(type){
        let style = this.config.hud[type];
        return {
            font: style.size ? style.size+'px '+style.font : style.font, 
            fill: style.color
        }
    }

    // ----------------------------------------------------------------
    // Load different GUI component: images, animations, buttons, etc
    // ----------------------------------------------------------------

    loadGeneralComponents(menuConfig, menu) {
        const components = ['images','animations','labels','save-slots','buttons','sliders'];
        components.forEach(component => {
            if (component in menuConfig) {
                for (let i = menuConfig[component].length - 1; i >= 0; i--) {
                    this.loadComponent(component,menuConfig[component][i],menu)
                }
            }
        });
    }

    loadComponent(type, component, menu) {
        switch (type) {
            case 'images' :
                this.game.add.image(component.x,component.y,component.id,0,menu);
                break;
            case 'animations' :
                const spr = this.game.add.sprite(component.x,component.y,component.id,0,menu);
                spr.animations.add('do').play()
                break;
            case 'buttons' :  this.loadButton(component,menu); break;
            case 'labels' :
                const color = component.color ? component.color : '#ffffff'
                this.game.add.text(component.x, component.y, component.text, {font: component.size+'px '+component.font, fill: color},menu);
                break;
            case 'sliders' : this.loadSlider(component,menu); break;
            case 'save-slots' : this.loadSaveSlot(component,menu); break;
        }
    }

    loadButton(component, menu) {
        const btn: RJSButton = this.game.add.button(component.x,component.y,component.id,() => {
            if (component.sfx && component.sfx !== 'none') {
                const sfx = this.game.add.audio(component.sfx);
                sfx.onStop.addOnce(sfx.destroy);
                sfx.play()
            }
            this.buttonsAction[component.binding](component)
        },this,1,0,2,0,menu);
        btn.component = component;
        if (btn.animations.frameTotal === 2){
            btn.setFrames(1,0,1,0)
        }
    }

    loadSaveSlot(component, menu) {
        const sprite: RJSSprite = this.game.add.sprite(component.x,component.y,component.id,0,menu);
        sprite.config = component;
        const thumbnail = this.game.getSlotThumbnail(component.slot);
        if (thumbnail) {
            this.loadThumbnail(thumbnail,sprite);
        }
        this.saveSlots[component.slot] = sprite;
    }

    loadSlider(component, menu) {
        let sliderFull: RJSSlider = this.game.add.sprite(component.x,component.y,component.id,0,menu);
        if (sliderFull.animations.frameTotal === 2){
            sliderFull = this.game.add.sprite(component.x,component.y,component.id,0,menu);
            sliderFull.frame = 1;
        }
        const createMask = (slider: RJSSlider,currentVal) => {
            const sliderMask = this.game.add.graphics(slider.x,slider.y,menu);
            sliderMask.beginFill(0xffffff);
            const maskWidth = slider.width*(currentVal-slider.limits[0])/(slider.limits[1]-slider.limits[0]);
            sliderMask.drawRect(0,0,maskWidth,slider.height);
            sliderMask.endFill();
            return sliderMask;
        }
        const currentVal = this.game.userPreferences[component.binding];
        sliderFull.limits = this.sliderLimits[component.binding];
        sliderFull.binding = component.binding;
        sliderFull.mask = createMask(sliderFull,currentVal);
        sliderFull.inputEnabled = true;
        sliderFull.events.onInputDown.add((sprite,pointer) => {
            const val = (pointer.x-sprite.x);
            const newVal = (val/sprite.width)*(sprite.limits[1] - sprite.limits[0])+sprite.limits[0];
            sprite.mask.destroy();
            sprite.mask = createMask(sprite,newVal);
            this.game.userPreferences.setPreference(sprite.binding,newVal);
            if (sprite.binding == "bgmv"){
                this.game.managers.audio.changeVolume('bgm',newVal);
            }
        });
    }

    loadThumbnail(thumbnail, parent) {
        const id = 'thumbnail'+Math.floor(Math.random() * 5000);
        this.game.load.image(id, thumbnail);
        this.game.load.onLoadComplete.addOnce(() => {
            const thmbSprite = this.game.add.sprite(parent.config['thumbnail-x'],parent.config['thumbnail-y'],id);
            thmbSprite.width = parent.config['thumbnail-width']
            thmbSprite.height = parent.config['thumbnail-height']
            parent.addChild(thmbSprite);
        }, this);
        this.game.load.start();
    }

    // ----------------------------------------------------------------
    // GUI user interaction, buttons and sliders
    // ----------------------------------------------------------------

    ignoreTap(pointer) {
        // If user clicks on buttons, the tap shouldn't count to continue the story
        return this.skipClickArea.find(area => area.contains(pointer.x,pointer.y)) !== undefined;
    }

    addThumbnail(thumbnail, slot) {
        if (this.saveSlots[slot]){
            this.loadThumbnail(thumbnail,this.saveSlots[slot])
        }
    }

    async showMenu(menu) {
        this.game.pause();
        this.previousMenu = this.currentMenu;
        this.currentMenu = menu;
        this.menus[menu].alpha = 0;
        this.menus[menu].visible = true;
        this.game.control.unskippable = true;
        let music = this.config.menus[menu].backgroundMusic;
        if (music && !music.isPlaying && !this.game.userPreferences.muted){
            music.fadeIn(1000);
        }
        let transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.menus);
        await transition(null, this.menus[menu]);
        this.game.control.unskippable = false;
        
    }

    async hideMenu(menu, mute, callback?) {
        if (!menu){
            menu = this.currentMenu;
        }
        let music = this.config.menus[menu].backgroundMusic;
        if (mute && music && music.isPlaying){
            music.fadeOut(400);
        }
        this.game.control.unskippable = true;
        let transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.menus);
        await transition(this.menus[menu], null);
        this.game.control.unskippable = false;
        this.menus[menu].visible = false;
        this.currentMenu = null;
        if (callback){
            callback()
        }
    }

    showHUD() {
        this.hud.visible = true;
    }

    hideHUD() {
        this.hud.visible = false;
    }    

    async changeMenu(menu) {
        const previous = this.currentMenu;
        if (previous){
            if (menu) {
                // hide previous menu and show this
                await this.hideMenu(previous,this.config.menus[menu].backgroundMusic);
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

    initButtonsActions (): void {
        const game = this.game
        this.buttonsAction = {
            async start() {
                game.gui.showHUD();
                await game.gui.changeMenu(null);
                game.start();
            },
            async load (component){
                game.gui.showHUD();
                await game.gui.changeMenu(null);
                game.loadSlot(parseInt(component.slot, 10));
            },

            auto: game.auto.bind(game),
            skip: game.skip.bind(game),
            mute: game.managers.audio.mute.bind(game.managers.audio),
            save (component) {
                game.save(parseInt(component.slot, 10));
            },
            saveload (argument?) {
                game.pause();
                game.gui.changeMenu('saveload');
            },
            settings(){
                game.pause();
                game.gui.changeMenu('settings');
            },
            async return(){
                const prev = game.gui.previousMenu;
                await game.gui.changeMenu(prev);
                if (!prev) {
                    game.unpause();
                }
            },
            
        };
    }

    // ----------------------------------------------------------------
    // GUI story interaction
    // ----------------------------------------------------------------

    clear() {
        this.hideChoices();
        this.hideText();
    }

    hideText() {
        this.messageBox.visible = false;
        this.messageBox.message.text = '';
        if (this.ctc){
            this.ctc.visible = false;
        }
    }

    hideChoice(choiceId): void {
        const choice = this.choices.getByName(choiceId);
        if (choice){
            this.choices.remove(choice,true);
        }
    }

    changeToLastInterrupt(choiceId): void {
        const choice = this.choices.getByName(choiceId);
        if (choice.animations.frameTotal === 4) {
            choice.setFrames(3,2,3,2);
        } else {
            choice.setFrames(4,3,5,3);
        }
    }

    hideChoices(): void {
        this.choices.removeAll();
    }

    setTextStyles(text,text_obj): string {
      text_obj.clearFontValues();
      text_obj.clearColors()
      let styles = []
      while(true){
        let re = /\((color:((\w+|#(\d|\w)+))|italic|bold)\)/
        let match = text.match(re);
        if (match){
          let s = {
            start: text.search(re),
            style: match[1].includes("color") ? "color" : match[1],
            end: -1,
            color: null
          }
          if (s.style == "color"){
            s.color = match[2];
          }
          text = text.replace(re,"")
          let endIdx = text.indexOf("(end)");
          if (endIdx!=-1){
            text = text.replace("(end)","")
            s.end = endIdx;
            styles.push(s)
          }
        } else break;
      }
      styles.forEach(s=>{
        if (s.style=="italic"){
          text_obj.addFontStyle("italic", s.start);
          text_obj.addFontStyle("normal", s.end);
        }
        if (s.style=="bold"){
          text_obj.addFontWeight("bold", s.start);
          text_obj.addFontWeight("normal", s.end);
        }
        if (s.style=="color"){
          text_obj.addColor(s.color, s.start)
          text_obj.addColor(text_obj.fill, s.end)
        }
      })
      return text;
    }

    showText(text, title, colour, callback) {
        if  (title && this.nameBox) {
            this.nameBox.text.text = title;
            this.nameBox.text.fill = colour;
            this.nameBox.visible = true;
        } else {
            this.nameBox.visible = false;
        }
        let textSpeed = this.sliderLimits.textSpeed[1] - this.game.userPreferences.textSpeed
        if (this.game.control.skipping || textSpeed < 10){
            this.messageBox.message.text = text;
            this.messageBox.visible = true;
            this.ctc.visible = true;
            callback();
            return;
        }
        const textObj = this.messageBox.message;
        textObj.text = '';
        let finalText = this.setTextStyles(text,textObj)
        const words = finalText.split('');
        let count = 0;
        const completeText = () => {
            clearTimeout(this.textLoop);
            textObj.text = finalText;
            this.game.gui.ctc.visible = true;
            callback();
        }

        this.textLoop = setInterval(() => {
            textObj.text += (words[count]);
            count++;
            if (count >= words.length){
                completeText();
            }
        }, textSpeed);
        this.messageBox.visible = true;
        if (!this.game.control.auto){
            this.game.waitForClick(completeText);
        }
    }

    showChoices(choices, execId) {
        this.choices.removeAll(true);
        this.choices.alpha = 0;
        let choiceConfig = this.config.hud.choice;
        const interruptConfig = this.config.hud.interrupt;

        if (interruptConfig && !interruptConfig.inlineWithChoice){
            // separate choices from interrupts
            choiceConfig = interruptConfig
        }
        const x = (choiceConfig.isBoxCentered) ? 
            this.game.world.centerX - choiceConfig.width/2 : 
            choiceConfig.x;
        const y = (choiceConfig.isBoxCentered) ? 
            this.game.world.centerY - (choiceConfig.height*choices.length + parseInt(choiceConfig.separation, 10)*(choices.length-1))/2 : 
            choiceConfig.y;

        choices.forEach((choice,index) => {
            this.createChoiceBox(choice,[x,y],index,choiceConfig,execId)
        });
        let transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.textChoices);
        transition(null,this.choices);
    }

    createChoiceBox(choice, pos, index, choiceConfig, execId) {
        const separation = index*(parseInt(choiceConfig.height, 10)+parseInt(choiceConfig.separation, 10));
        const chBox: ChoiceButton = this.game.add.button(pos[0], pos[1]+separation, choiceConfig.id, () => {
            if (choiceConfig.sfx && choiceConfig.sfx !== 'none') {
                const sfx = this.game.add.audio(choiceConfig.sfx);
                sfx.onStop.addOnce(sfx.destroy);
                sfx.play();
            }
            let transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.textChoices);
            transition(this.choices,null).then(()=>{
                this.choices.removeAll(true);
                this.game.managers.logic.choose(index,choice.choiceText,execId);
            })
            
        },this,1,0,2,0,this.choices);
        if (chBox.animations.frameTotal === 2 || chBox.animations.frameTotal === 4){
            chBox.setFrames(1,0,1,0)
        }
        if (choice.interrupt && choice.remainingSteps===1 && chBox.animations.frameTotal > 3){
            if (chBox.animations.frameTotal === 4){
                chBox.setFrames(3,2,3,2);
            } else {
                chBox.setFrames(4,3,5,3);
            }
        }
        chBox.choiceId = choice.choiceId;
        chBox.name = choice.choiceId;

        const textStyle = this.getTextStyle('choice');
        const text = this.game.add.text(0, 0, choice.choiceText, textStyle);
        text.visible = false;
        this.setTextPosition(chBox,text, choiceConfig);
        setTimeout(()=>{text.visible = true},20)
        if (this.game.storyConfig.logChoices && this.game.managers.logic.choicesLog[execId].indexOf(choice.choiceText) !== -1){
            chBox.tint = this.toHexColor(choiceConfig['chosen-color']);
        }
        return chBox;
    }

    // ----------------------------------------------------------------
    // Helper functions
    // ----------------------------------------------------------------

    toHexColor(color) {
        // eslint-disable-next-line no-bitwise
        return (parseInt(color.substr(1), 16) << 8) / 256;

    }

    setTextPosition(sprite, text, component) {
        if (component.isTextCentered) {
            text.setTextBounds(0,0, sprite.width, sprite.height);
            text.boundsAlignH = 'center';
            text.boundsAlignV = 'middle';
        } else {
            const offsetX = parseInt(component['offset-x'], 10);
            const offsetY = parseInt(component['offset-y'], 10);
            text.setTextBounds(offsetX,offsetY, sprite.width, sprite.height);
            text.boundsAlignH = component.align;
            text.boundsAlignV = 'top'
        }
        sprite.addChild(text);
        sprite.text = text;
    }
    
}