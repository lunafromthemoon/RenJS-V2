import RJS from '../../core/RJS';
import {Graphics,Button} from 'phaser-ce';
import {toHexColor,setTextStyles,getButtonFrames} from '../../utils/gui'
import Label from './Label'

export default class ChoiceHandler extends Graphics {

    game: RJS

    config: {
        asset: string,
        x: number,
        y: number,
        alignment: string, //centered|bottomUp|topDown
        separation: number,
        chosenColor: string,
        transition?: string,
        sfx: string,
        text: {
            x: number,
            y: number,
            width: number,
            height: number,
            lineSpacing?: number,
            style: any
        },
        background?:{
            x: number,
            y: number,
            asset: string
        }
    }

    boxes: Button[] = []

    constructor(game: RJS, config) {
        super(game, 0, 0);
        this.game = game;
        this.config = config;
        if (!this.config.transition){
            this.config.transition = this.game.storyConfig.transitions.textChoices;
        }
        this.alpha = 0;
        this.visible = false;
        if (this.config.background){
            const bg = this.game.add.sprite(this.config.background.x,this.config.background.y, this.config.background.asset)
            this.addChild(bg);
        }
    }

    async show(choices: any[]): Promise<any> {
        return new Promise(resolve=>{
            choices.forEach((choice,index) => {
                const box = this.createChoiceBox(choice,this.config.x,this.config.y,index,choices.length,resolve);
                this.boxes.push(box)
            });
            let transition = this.game.screenEffects.transition.get(this.config.transition);
            // wait some miliseconds before showing the boxes so the text is properly set
            setTimeout(()=>{
                this.visible = true;
                transition(null,this);
            },20)
             
        })
        
    }

    createChoiceBox(choice, x,y, index,totalChoices,resolve) {
        const chBox = this.game.add.button(x,y, this.config.asset, async () => {
            if (this.config.sfx && this.config.sfx !== 'none') {
                this.game.managers.audio.playSFX(this.config.sfx);
            }
            await this.hide();
            resolve(index);
        },this,1,0,2,0);
        this.addChild(chBox);

        if (this.config.alignment=='centered'){
            chBox.y -= (chBox.height*totalChoices + this.config.separation*(totalChoices-1))/2
        }
        const separation = index*(chBox.height+this.config.separation*(this.config.alignment=='bottomUp' ? -1 : 1))
        chBox.y += separation;
        chBox.setFrames(...getButtonFrames(chBox.animations.frameTotal))
        const text = new Label(this.game,this.config.text,chBox);
        text.setText(setTextStyles(choice.choiceText,text), true);
        chBox.addChild(text);
        
        if (choice.previouslyChosen){
            chBox.tint = toHexColor(this.config.chosenColor);
        }
        return chBox;
    }

    async hide(transitionName?): Promise<any> {
        if (!this.visible) return;
        if (!transitionName) transitionName = this.config.transition;
        let transition = this.game.screenEffects.transition.get(transitionName);
        await transition(this,null);
        // hide all boxes
        this.boxes.forEach(box=>box.destroy());
        this.boxes = [];
        this.visible = false;
    }

    destroy(): void {
    	super.destroy();
    }


}
