import RJS from '../../core/RJS';
import {Sprite,Color} from 'phaser-ce';
import Label from './Label'

export default class NameBox extends Sprite {
    id: string
    text: Label
    game: RJS
    config: {
        id: string;
        asset: string;
        x: number;
        y: number;
        transition?: string;
        tintStyle?: string;
        text: {
            x: number;
            y: number;
            width: number;
            height: number;
            style: any;
            lineSpacing: number;
        };
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

    async show(text: string,color: string): Promise<any> {
        this.game.accessibility.name(text);
        this.text.setText(text, true);
        this.text.updateTransform();
        if (this.config.tintStyle === 'box'){
            this.tint = Color.hexToRGB(color);
        } else {
            // change name color
            this.text.fill = color;
        }
        this.visible = true;
        const transition = this.game.screenEffects.transition.get(this.config.transition);
        await transition(null,this);
    }

    async hide(transitionName?: string): Promise<any>{
        this.game.accessibility.name();
        if (!this.visible) return;
        if (!transitionName) transitionName = this.config.transition;
        const transition = this.game.screenEffects.transition.get(transitionName);
        await transition(this,null);
        this.visible = false;
        this.text.setText('', true);
    }

    destroy(): void {
    	this.text.destroy();
    	super.destroy();
    }
}
