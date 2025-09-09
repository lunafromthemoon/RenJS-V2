import RJS from '../../core/RJS';
import {Graphics,Button,Color} from 'phaser-ce';
import LabelButton from './LabelButton';
import { AccessibilityBounds } from '../a11y/Accessibility';

export class ChoiceHandler extends Graphics {

    game: RJS

    config: {
        asset: string;
        x: number;
        y: number;
        alignment: string; // centered|bottomUp|topDown
        separation: number;

        transition?: string;
        sfx: string;
        text: any; // backwards compatibility
        label: {
            x: number;
            y: number;
            width: number;
            height: number;
            lineSpacing?: number;
            style: any;
        };
        background?: {
            x: number;
            y: number;
            asset: string;
        };
        // previously chosen options can be shown in a different color/style
        chosenColor: string;
        chosenStyle: any;
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
        if (this.config.text && !this.config.label){
            // compatibility for choice boxes with LabelButtons
            this.config.label = this.config.text
        }
    }

    async show(choices: any[]): Promise<any> {
        return new Promise(resolve=>{
            choices.forEach((choice,index) => {
                const box = this.createChoiceBox(choice,this.config.x,this.config.y,index,choices.length,resolve);
                this.boxes.push(box)
            });
            const visible = this.visible;
            this.visible = true;
            this.updateTransform();
            this.visible = visible;
            const transition = this.game.screenEffects.transition.get(this.config.transition);
            // wait some miliseconds before showing the boxes so the text is properly set
            setTimeout(()=>{
                this.visible = true;
                transition(null,this);
            },20)

            this.game.accessibility.choices(
                choices.map((choice, index) => ({
                    label: choice.choiceText,
                    isActive: (): boolean => !this.game.control.unskippable && this.boxes[index].parent.parent === this.game.gui.menus[this.game.gui.currentMenu],
                    onclick: (): void => resolve(index),
                    onfocus: (): void => { this.boxes[index].frame = 1; },
                    onblur: (): void => { this.boxes[index].frame = 0; },
                    getBounds: (): AccessibilityBounds => this.boxes[index].getBounds(),
                }))
            );
        })

    }

    createChoiceBox(choice, x,y, index,totalChoices,resolve): Button     {
        const chBox = new LabelButton(this.game,this.config);
        chBox.onClick = async ()=>{
            await this.hide();
            resolve(index);
        }
        chBox.label.changeText(choice.choiceText)
        this.addChild(chBox);

        if (this.config.alignment === 'centered'){
            chBox.y -= (chBox.height*totalChoices + this.config.separation*(totalChoices-1))/2
        } else if (this.config.alignment === 'bottomUp'){
            chBox.y -= (chBox.height*totalChoices + this.config.separation*(totalChoices-1))
        }
        const separation = index*(chBox.height+this.config.separation)
        chBox.y += separation;
        if (this.game.storyConfig.logChoices && choice.previouslyChosen){
            if (this.config.chosenColor){
                chBox.tint = Color.hexToColor(this.config.chosenColor).color
            }
            if (this.config.chosenStyle){
                for (const prop in this.config.chosenStyle){
                    chBox.label[prop] = this.config.chosenStyle[prop]
                }
            }

        }
        return chBox;
    }

    async hide(transitionName?): Promise<any> {
        this.game.accessibility.choices();
        if (!this.visible) return;
        if (!transitionName) transitionName = this.config.transition;
        const transition = this.game.screenEffects.transition.get(transitionName);
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
export default ChoiceHandler