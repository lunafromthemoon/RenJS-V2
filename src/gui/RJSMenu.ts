import RJS from '../core/RJS';
import {Group,Text} from 'phaser-ce';

import {setTextStyles,getButtonFrames} from '../utils/gui'

import MaskSlider from './elements/MaskSlider'
import SaveSlot from './elements/SaveSlot'
import PushButton from './elements/PushButton'
import Label from './elements/Label'

export default class RJSMenu extends Group {
    id: string
    game: RJS
    elementFactory: {}
    saveSlots = {}
    // if element has id, index it for quick reference
    indexedElements: {} = {}

    constructor(game: RJS, public config) {
        super(game, config.x, config.y,config.asset);
        this.game = game;
        this.visible = false;
        this.id = config.id;
        this.indexedElements

        this.elementFactory = {
            image: this.createImage.bind(this),            
            button: this.createButton.bind(this),
            label: this.createLabel.bind(this),
            slider: this.createSlider.bind(this),
            saveSlot: this.createSaveSlot.bind(this)
        }
    }

    init(){
        for (const elementConfig of this.config.elements){
            const element = this.elementFactory[elementConfig.type](elementConfig);
            if (elementConfig.id){
                this.indexedElements[elementConfig] = element;
            }
            this.addChild(element);
        }
    }

    createImage(element:{x:number,y:number,asset:string}) {
        const spr = this.game.add.sprite(element.x,element.y,element.asset,0);
        if (spr.animations.frameTotal){
            spr.animations.add('do').play()
        }
        return spr;
    }

    createLabel(element:{x:number,y:number,text:string,lineSpacing:number,style:any}) {
        return new Label(this.game, element)
    }

    createButton(element:{x:number,y:number,asset:string,sfx:string,binding:string,slot:string,pushButton?:boolean,pushed?:boolean}) {
        if (element.pushButton){
            return new PushButton(this.game,element)
        }
        // create normal button
        const btn = this.game.add.button(element.x,element.y,element.asset,() => {
            if (element.sfx && element.sfx !== 'none') {
                this.game.managers.audio.playSFX(element.sfx);
            }
            this.game.gui.bindingActions[element.binding](element)
        },this);
        btn.setFrames(...getButtonFrames(btn.animations.frameTotal))
        return btn;
    }

    createSlider(element: {x: number,y: number,asset: string,binding: string,userPreference:string,sfx: string, mask?:string}) {
        let value = 0.5;
        if (element.binding == 'changeUserPreference'){
            const preference = this.game.userPreferences.preferences[element.userPreference];
            value = (preference.value-preference.min)/(preference.max - preference.min);
        }
        const slider = new MaskSlider(this.game,element,value);
        return slider
    }

    createSaveSlot(element:{x: number,y: number,asset: string,slot: number,thumbnail: {x: number,y: number,width: number,height: number}}) {
        const saveSlot = new SaveSlot(this.game,element)
        this.saveSlots[element.slot] = saveSlot;
        return saveSlot;
    }

    // add thumbnail to specific save slot
    addThumbnail(thumbnail, slot) {
        if (this.saveSlots[slot]){
            this.saveSlots[slot].loadThumbnail(thumbnail)
        }
    }

    async show() {
        if (this.visible) return;
        this.alpha = 0;
        this.visible = true;
        // menu transitions are unskippable
        this.game.control.unskippable = true;
        if (this.config.backgroundMusic){
            this.game.managers.audio.play(this.config.backgroundMusic,"bgm",true);
        }
        let transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.menus);
        await transition(null, this);
        // unlock unskippable
        this.game.control.unskippable = false;
    }

    async hide(mute:boolean = true){
        if (!this.visible) return;
        if (mute && this.config.backgroundMusic){
            this.game.managers.audio.stop('bgm');
        }
        this.game.control.unskippable = true;
        let transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.menus);
        await transition(this, null);
        this.game.control.unskippable = false;
        this.visible = false;
    }

    destroy(): void {
    	this.destroy();
    }
}
