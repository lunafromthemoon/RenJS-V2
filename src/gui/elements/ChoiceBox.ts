import RJS from '../../core/RJS';
import {Button,Text} from 'phaser-ce';
import {toHexColor,setTextStyles} from '../../states/utils'

export default class ChoiceBox extends Button {
    id: string
    text: Text

    constructor(game: RJS, private config, id:string, text:string, previouslyChosen:boolean, callback) {
        super(game, 0, 0,config.asset,callback,game,1,0,2,0);
        this.visible = false;
        this.id = config.id;
        // this.nameBox.visible = false;
        this.text = this.game.add.text(config.text.x,config.text.y, '', config.text.style);
        this.text.text = setTextStyles(text,this.text);
        this.addChild(this.text);

        // const chBox: ChoiceButton = this.game.add.button(pos[0], pos[1]+separation, choiceConfig.id, () => {
        //     if (choiceConfig.sfx && choiceConfig.sfx !== 'none') {
        //         this.game.managers.audio.playSFX(choiceConfig.sfx);
        //     }
        //     let transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.textChoices);
        //     transition(this.choices,null).then(()=>{
        //         this.choices.removeAll(true);
        //         this.game.managers.logic.choose(index,choice.choiceText,execId);
        //     })
            
        // },this,1,0,2,0,this.choices);
        if (this.animations.frameTotal === 2 || this.animations.frameTotal === 4){
            this.setFrames(1,0,1,0)
        }
        // if (choice.interrupt && choice.remainingSteps===1 && chBox.animations.frameTotal > 3){
        //     if (chBox.animations.frameTotal === 4){
        //         chBox.setFrames(3,2,3,2);
        //     } else {
        //         chBox.setFrames(4,3,5,3);
        //     }
        // }
        this.id = id;
        // chBox.name = choice.choiceId;

        // const textStyle = this.getTextStyle('choice');

        // const text = this.game.add.text(0, 0, "" , textStyle);
        
        // setTimeout(()=>{this.text.visible = true},20)
        if (previouslyChosen){
            this.tint = toHexColor(config.chosenColor);
        }
    }

    destroy(): void {
    	this.text.destroy();
    	super.destroy();
    }


}
