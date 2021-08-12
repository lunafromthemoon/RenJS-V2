import {Sprite,Text} from 'phaser-ce';
import {toHexColor} from '../../states/utils'


export default class NameBox extends Sprite {
    id: string
    text: Text

    constructor(game: Phaser.Game, private config) {
        super(game, config.x, config.y,config.asset);
        this.visible = false;
        this.id = config.id;
        // this.nameBox.visible = false;
        this.text = this.game.add.text(config.text.x,config.text.y, '', config.text.style);
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
