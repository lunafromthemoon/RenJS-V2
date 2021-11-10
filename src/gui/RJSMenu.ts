import RJS from '../core/RJS';
import {Group,Text} from 'phaser-ce';

import {setTextStyles,getButtonFrames} from '../utils/gui'

import MaskSlider from './elements/MaskSlider'
import SaveSlot from './elements/SaveSlot'
import PushButton from './elements/PushButton'
import BaseButton from './elements/BaseButton'
import Label from './elements/Label'

export default class RJSMenu extends Group {
    id: string
    game: RJS
    elementFactory: {}
    saveSlots = {}
    // if element has id, index it for quick reference
    indexedElements: {} = {}
    backgroundMusic: string = null;

    constructor(game: RJS, public config) {
        super(game);
        this.game = game;
        this.visible = false;
        this.id = config.id;

        this.elementFactory = {
            image: this.createImage.bind(this),
            button: this.createButton.bind(this),
            label: this.createLabel.bind(this),
            slider: this.createSlider.bind(this),
            saveSlot: this.createSaveSlot.bind(this)
        }
    }

    init(){
        for (const elementConfig of this.config){
            // create element with factory
            if (elementConfig.type == 'music'){
                this.backgroundMusic = elementConfig.asset;
                continue;
            }
            const element = this.elementFactory[elementConfig.type](elementConfig);
            // index element if it has an id
            if (elementConfig.id){
                this.indexedElements[elementConfig] = element;
            }
            // add display element to group (this)
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

    createButton(element:{x:number,y:number,asset:string,sfx:string,binding:string,pushButton?:boolean,pushed?:boolean}) {
        if (element.pushButton){
            const btn = new PushButton(this.game,element)
            if (element.binding=='auto' || element.binding=='skip'){
                // auto and skip will be unset when tapping anywhere in the screen
                // always index for changing state when this happens
                this.indexedElements[element.binding+'Button'] = btn;
            }
            return btn;
        }
        return new BaseButton(this.game,element)
    }

    createSlider(element: {x: number,y: number,asset: string,binding: string,userPreference?:string,sfx: string, mask?:string}) {
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
        if (this.backgroundMusic){
            this.game.managers.audio.play(this.backgroundMusic,"bgm",true);
        }
        let transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.menus);
        await transition(null, this);
        // unlock unskippable
        this.game.control.unskippable = false;
    }

    async hide(mute:boolean = true){
        if (!this.visible) return;
        if (mute && this.backgroundMusic){
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
