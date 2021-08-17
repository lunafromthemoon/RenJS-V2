import RJS from '../../core/RJS';
import {Graphics,Button} from 'phaser-ce';
import {toHexColor,setTextStyles,createText} from '../../utils/gui'

export default class ChoiceHandler extends Graphics {

    game: RJS

    config: {
        asset: string,
        x: number,
        y: number,
        alignment: string, //centered|bottomUp|topDown
        separation: number,
        chosenColor: string,
        sfx: string,
        text: {
            x: number,
            y: number,
            width: number,
            height: number,
            lineSpacing?: number,
            style: any
        },
    }

    boxes: Button[] = []

    constructor(game: RJS, config) {
        super(game, 0, 0);
        this.game = game;
        this.config = config;
        this.visible = false;
    }

    async show(choices: any[]): Promise<any> {
        this.visible = true;
        return new Promise(resolve=>{
            choices.forEach((choice,index) => {
                const box = this.createChoiceBox(choice,this.config.x,this.config.y,index,choices.length,resolve);
                this.boxes.push(box)
            });
            let transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.textChoices);
            transition(null,this); 
        })
        
    }

    async hide(): Promise<any> {
        let transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.textChoices);
        await transition(this,null);
        // hide all boxes
        this.boxes.forEach(box=>box.destroy());
        this.boxes = [];
        this.visible = false;
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
        if (chBox.animations.frameTotal === 2 || chBox.animations.frameTotal === 4){
            chBox.setFrames(1,0,1,0)
        }
        const text = createText(this.game,this.config.text);
        text.text = setTextStyles(choice.choiceText,text);
        chBox.addChild(text);
        // text.visible = false;
        // setTimeout(()=>{text.visible = true},20)
        if (choice.previouslyChosen){
            chBox.tint = toHexColor(this.config.chosenColor);
        }
        return chBox;
    }

    destroy(): void {
    	super.destroy();
    }


}
