import RJS from '../core/RJS';
import {Group,Text} from 'phaser-ce';

import {setTextStyles,createText} from '../utils/gui'

import MaskSlider from './elements/MaskSlider'
import SaveSlot from './elements/SaveSlot'

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
        const label = createText(this.game,element)
        return label
    }

    createButton(element:{x:number,y:number,asset:string,sfx:string,binding:string,slot:string,pushButton?:boolean,pushed?:boolean}) {
        // button frames -> over|out|down|up
        const buttonFrames = {
            1: [[0,0,0,0],[1,1,1,1]],
            2: [[1,0,1,0],[3,2,3,2]],
            3: [[1,0,2,0],[4,3,5,3]],
            4: [[1,0,2,3],[5,4,6,7]],
        }
        const btn = this.game.add.button(element.x,element.y,element.asset,() => {
            if (element.sfx && element.sfx !== 'none') {
                this.game.managers.audio.playSFX(element.sfx);
            }
            if (element.pushButton){
                element.pushed = !element.pushed;
                btn.setFrames(...buttonFrames[frames][element.pushed ? 1 : 0])
            }
            this.game.gui.bindingActions[element.binding](element)
        },this,0,0,0,0);
        const frames = btn.animations.frameTotal/(element.pushButton ? 2 : 1);
        
        if (element.pushButton && element.pushed){
            // change frames
            btn.setFrames(...buttonFrames[frames][1])
        } else {
            btn.setFrames(...buttonFrames[frames][0])    
        }
        return btn;
    }

    createSlider(element: {x: number,y: number,asset: string,binding: string,userPreference:string,sfx: string, mask?:string}) {
        const startVal = this.game.userPreferences[element.userPreference];
        const range = this.game.propertyRanges[element.userPreference];
        const slider = new MaskSlider(this.game,element,startVal,range[0],range[1]);
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
