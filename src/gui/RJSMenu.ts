import RJS from '../core/RJS';
import {Group,Text} from 'phaser-ce';
import {toHexColor,setTextStyles} from '../../states/utils'

export default class RJSMenu extends Group {
    id: string
    game: RJS

    constructor(game: RJS, private config) {
        super(game, config.x, config.y,config.asset);
        this.game = game;
        this.visible = false;
        this.id = config.id;
    }

    createElement(element):void {
        switch (element.type) {
            case 'images' :
                this.game.add.image(element.x,element.y,element.id,0,this);
                break;
            case 'animations' :
                const spr = this.game.add.sprite(element.x,element.y,element.id,0,this);
                spr.animations.add('do').play()
                break;
            case 'buttons' :  this.createButton(element); break;
            case 'labels' : this.createLabel(element); break;
            case 'sliders' : this.loadSlider(element,menu); break;
            case 'save-slots' : this.loadSaveSlot(element,menu); break;
        }
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
        if (element.pushButton)
    }

    createLabel(element){
        const label = this.game.add.text(element.x, element.y, "" , element.style, this);
        label.text = setTextStyles(element.text,label);
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
