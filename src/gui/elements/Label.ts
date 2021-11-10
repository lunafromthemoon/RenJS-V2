import RJS from '../../core/RJS';
import {Text} from 'phaser-ce';
import {setTextStyles} from '../../utils/gui'


export default class Label extends Text {

    styleChanges: {[key: string]: any} = {};

    config: {
        x: number,
        y: number,
        text?: string,
        lineSpacing: number,
        style: any
    }

    constructor(game: RJS, config, parent?) {
        super(game, config.x, config.y,'',config.style);
        this.config = config;
        if (config.lineSpacing){
            this.lineSpacing = config.lineSpacing;
        }
        if (config.style.boundsAlignH && config.style.boundsAlignV && parent){
          this.setTextBounds(this.x,this.y,parent.width,parent.height)
        }
        if (this.config.text){
            this.setText(setTextStyles(this.config.text,this), true);
        }
    }

    changeStyle(style){
        // change some style options and save original value them to reset
        for (const prop in style){
            this.styleChanges[prop] = this[prop];
            this[prop] = style[prop];
        }
    }

    resetStyle(){
        for (const prop in this.styleChanges){
            this[prop] = this.styleChanges[prop];
        }
        this.styleChanges = {}
    }


}
