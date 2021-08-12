import RJS from '../core/RJS';
import {Group,Text} from 'phaser-ce';
import {toHexColor,setTextStyles} from '../states/utils'
import MaskSlider from './elements/MaskSlider'
import SaveSlot from './elements/SaveSlot'

export default class RJSMenu extends Group {
    id: string
    game: RJS
    elementFactory: {}
    // if element has id, index it for quick reference
    indexedElements: {} = {}

    constructor(game: RJS, private config) {
        super(game, config.x, config.y,config.asset);
        this.game = game;
        this.visible = false;
        this.id = config.id;
        this.indexedElements

        this.elementFactory = {
            image: this.createImage,            
            button: this.createButton,
            label: this.createLabel,
            slider: this.createSlider,
            saveSlot: this.createSaveSlot
        }
    }

    createImage(element) {
        const spr = this.game.add.sprite(element.x,element.y,element.asset,0,this);
        if (spr.animations.frameTotal){
            spr.animations.add('do').play()
        }
        return spr;
    }

    createLabel(element) {
        const label = this.game.add.text(element.x, element.y, "" , element.style, this);
        label.text = setTextStyles(element.text,label);
        return label
    }

    createButton(element) {
        const btn = this.game.add.button(element.x,element.y,element.asset,() => {
            if (element.sfx && element.sfx !== 'none') {
                this.game.managers.audio.playSFX(element.sfx);
            }
            this.game.gui.buttonsAction[element.binding](element)
        },this,1,0,2,0,this);
        if (btn.animations.frameTotal === 2){
            btn.setFrames(1,0,1,0)
        }
        if (element.pushButton){

        }
        return btn;
    }

    createSlider(element) {
        const startVal = this.game.userPreferences[element.binding];
        const range = this.game.propertyRanges[element.binding];
        const slider = new MaskSlider(this.game,element,startVal,range[0],range[1]);
        return slider
    }

    createSaveSlot(element) {
        return new SaveSlot(this.game,element)
        // this.saveSlots[element.slot] = sprite;
    }

    show(text,color): void {
        this.visible = true;
    }

    hide(){
        this.visible = false;
    }

    destroy(): void {
    	this.destroy();
    }
}
