import RJS from '../../core/RJS';
import {Sprite,Text} from 'phaser-ce';
import {toHexColor} from '../../utils/gui'
import Label from './Label'

export default class NameBox extends Sprite {
    id: string
    text: Label
    game: RJS
    config: {
        id: string,
        asset: string,
        x: number,
        y: number,
        transition?: string,
        tintStyle: string,
        text: {
            x: number,
            y: number,
            width: number,
            height: number,
            style: any,
            lineSpacing: number
        }
    }

    constructor(game: RJS, config) {
        super(game, config.x, config.y,config.asset);
        this.config = config;
        if (!this.config.transition){
            this.config.transition = this.game.storyConfig.transitions.nameBox;
        }
        this.visible = false;
        this.id = this.config.id;
        this.text = new Label(game,this.config.text,this);
        this.addChild(this.text);
    }

    async show(text,color) {
        // console.log(text)
        // console.log(color)
        this.text.text = text;
        if (this.config.tintStyle == 'box'){
            this.tint = toHexColor(color);
        } else {
            // change name color
            this.text.fill = color;
        }
        this.visible = true;
        let transition = this.game.screenEffects.transition.get(this.config.transition);
        await transition(null,this);
    }

    async hide(transitionName?){
        if (!this.visible) return;
        if (!transitionName) transitionName = this.config.transition;
        let transition = this.game.screenEffects.transition.get(transitionName);
        await transition(this,null);
        this.visible = false;
        this.text.text = '';
    }

    destroy(): void {
    	this.text.destroy();
    	super.destroy();
    }
}
