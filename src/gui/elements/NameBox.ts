import {Sprite,Text} from 'phaser-ce';
import {toHexColor} from '../../states/utils'


export default class NameBox extends Sprite {
    id: string
    text: Text
    config: {
        id: string,
        asset: string,
        x: number,
        y: number,
        tintStyle: string,
        text: {
            x: number,
            y: number,
            style: any,
            lineSpacing: number
        }
    }

    constructor(game: Phaser.Game, config) {
        super(game, config.x, config.y,config.asset);
        this.config = config;
        this.visible = false;
        this.id = this.config.id;
        // this.nameBox.visible = false;
        this.text = this.game.add.text(this.config.text.x,this.config.text.y, '', this.config.text.style);
        if (this.config.text.lineSpacing){
            this.text.lineSpacing = this.config.text.lineSpacing;
        }
        this.addChild(this.text);
    }

    show(text,color): void {
        this.text.text = text;
        if (this.config.tintStyle == 'box'){
            this.tint = toHexColor(color);
        } else {
            // change name color
            this.text.fill = color;
        }
        this.visible = true;
    }

    hide(){
        this.text.text = '';
        this.visible = false;
    }

    destroy(): void {
    	this.text.destroy();
    	super.destroy();
    }
}
