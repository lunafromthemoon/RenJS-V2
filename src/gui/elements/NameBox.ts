import {Sprite,Text} from 'phaser-ce';
import {toHexColor,createText} from '../../utils/gui'


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
            width: number,
            height: number,
            style: any,
            lineSpacing: number
        }
    }

    constructor(game: Phaser.Game, config) {
        super(game, config.x, config.y,config.asset);
        this.config = config;
        this.visible = false;
        this.id = this.config.id;
        this.config.text.width = this.width;
        this.config.text.height = this.height;
        this.text = createText(this.game,this.config.text);
        this.addChild(this.text);
    }

    show(text,color): void {
        console.log(text)
        console.log(color)
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
