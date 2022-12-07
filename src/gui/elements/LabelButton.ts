import RJS from '../../core/RJS';
import Label from './Label'
import BaseButton from './BaseButton';

export default class LabelButton extends BaseButton {

    game: RJS;

    label: Label;

    lastFrame: number|string;

    config: {
        x: number;
        y: number;
        asset: string;
        sfx: string;
        binding: string;
        pushed?: boolean;
        text?: any
        label: {
            x: number;
            y: number;
            text?: string;
            lineSpacing: number;
            style: any;
            overStyle?: any;
            clickedStyle?: any;
        }
    }

    constructor(game: RJS, config) {
        super(game, config);
        this.label = new Label(this.game,this.config.label,this);
        this.addChild(this.label);
        this.lastFrame = this.frame;
        if (this.config.label.overStyle){
            this.onInputOver.add(()=>{
                if (this.lastFrame !== this.frame){
                    this.lastFrame = this.frame;
                    this.label.changeStyle(this.config.label.overStyle)
                }
            })
            this.onInputOut.add(()=>{
                if (this.lastFrame !== this.frame){
                    this.lastFrame = this.frame;
                    this.label.resetStyle()
                }
            })
        }
        if (this.config.label.clickedStyle){
            this.onInputDown.add(()=>{
                if (this.lastFrame !== this.frame){
                    this.lastFrame = this.frame;
                    this.label.changeStyle(this.config.label.clickedStyle)
                }
            })
            this.onInputUp.add(()=>{
                if (this.lastFrame !== this.frame){
                    this.lastFrame = this.frame;
                    this.label.resetStyle()
                }
            })
        }
    }
}