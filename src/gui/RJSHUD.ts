import RJS from '../core/RJS';
import {Graphics,Color, Button} from 'phaser-ce';
import RJSMenu from './RJSMenu'
import MessageBox from './elements/MessageBox'
import BaseButton from './elements/BaseButton'
import NameBox from './elements/NameBox'
import ChoiceHandler from './elements/ChoiceHandler'

import { changeInputEnabled, hudSort } from '../utils/gui';
import { AccessibilityBounds } from './a11y/Accessibility';

export default class RJSHUD extends RJSMenu {
    mBoxes: {[key: string]: MessageBox} = {}
    nBoxes: {[key: string]: NameBox} = {}
    cHandlers: { [key: string]: ChoiceHandler } = {}

    skipClickArea: Phaser.Rectangle[] = []
    visualChoices: Graphics


    constructor(game: RJS, config) {
        super(game, config.slice().sort(hudSort));
        // add factories for hud specific elements
        this.elementFactory = Object.assign(this.elementFactory,{
            messageBox: this.createMessageBox.bind(this),
            nameBox: this.createNameBox.bind(this),
            choices: this.createChoiceHandler.bind(this),
            button: this.createButton.bind(this),
        });
    }

    // create HUD specific components

    createMessageBox(element): MessageBox{
        this.mBoxes[element.id] = new MessageBox(this.game,element)
        return this.mBoxes[element.id]
    }

    createNameBox(element): NameBox{
        this.nBoxes[element.id] = new NameBox(this.game,element)
        return this.nBoxes[element.id]
    }

    createChoiceHandler(element): ChoiceHandler{
        this.cHandlers[element.id] =  new ChoiceHandler(this.game,element)
        return this.cHandlers[element.id];
    }

    createButton(element): BaseButton{
        const btn: BaseButton = super.createButton(element);
        // when pressing a button, tapping should be ignored to avoid continuing the game
        this.skipClickArea.push(new Phaser.Rectangle(btn.x,btn.y,btn.width,btn.height))
        return btn;
    }

    // if skip or auto are push buttons, they will be indexed as skipButton and autoButton
    // these control setttings can be unset when tapping anywhere on the screen
    // this function will be called when this happens, so it can reset the push buttons
    unsetSkipButtons(): void{
        if (this.indexedElements.skipButton){
            this.indexedElements.skipButton.setPushed(false);
        }
        if (this.indexedElements.autoButton){
            this.indexedElements.autoButton.setPushed(false);
        }
    }

    // display character names
    // TODO: this should be async too
    showName(boxId, name, color): void{
        if (this.nBoxes[boxId]){
            this.nBoxes[boxId].show(name,color);
        }
    }
    // TODO: this should be async too
    hideName(boxId): void{
        if (this.nBoxes[boxId]){
            this.nBoxes[boxId].hide();
        }
    }

    // display text on message box
    async showText(boxId, text, sfx?): Promise<any>{
        return this.mBoxes[boxId].show(text,sfx);
    }

    async hideText(boxId): Promise<any>{
        await this.mBoxes[boxId].clear();
    }

    async showChoices(handlerId,choices): Promise<any>{
        return this.cHandlers[handlerId].show(choices)
    }
    // TODO: this should be async too
    hideChoices(handlerId): void{
        this.cHandlers[handlerId].hide()
    }

    async showVisualChoices(choices): Promise<any>{
        return new Promise(resolve=>{
            this.visualChoices = this.game.add.graphics();
            this.addChild(this.visualChoices);
            this.visualChoices.alpha = 0;
            const boxes = choices.map((choice,index) => this.createVisualChoice(choice,index,resolve));
            const transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.visualChoices);
            transition(null,this.visualChoices);

            this.game.accessibility.choices(
                choices.map((choice, index) => ({
                    // TODO: better accessible label - this is just the texture name,
                    // not something necessarily meant to be user-facing
                    label: choice.choiceText.split(' AT ')[0],
                    isActive: (): boolean => !this.game.control.unskippable && boxes[index].parent.parent === this.game.gui.menus[this.game.gui.currentMenu],
                    onclick: (): void => resolve(index),
                    getBounds: (): AccessibilityBounds => boxes[index].getBounds(),
                }))
            );
        });
    }

    createVisualChoice(choice, index, resolve): Button {
        const defaultChoicesConfig = this.cHandlers.default.config;
        // visual choice text -> spriteId AT x,y|positionId SFX sfxId
        const str = choice.choiceText.split(' ');
        const spriteId = str[0];
        let position = {x:0,y:0};
        let sfx = defaultChoicesConfig.sfx;
        if (str.indexOf('AT') !== -1){
            const posStr = str[str.indexOf('AT')+1];
            if (posStr in this.game.storyConfig.positions){
                position = this.game.storyConfig.positions[posStr];
            } else {
                const coords = posStr.split(',');
                position = {x:parseInt(coords[0], 10),y:parseInt(coords[1], 10)};
            }
        }
        if (str.indexOf('SFX') !== -1){
            sfx = str[str.indexOf('SFX')+1];
        }
        const visualChoice = this.game.add.button(position.x,position.y,spriteId,async (): Promise<any> => {
            if (sfx && sfx !== 'none') {
                this.game.managers.audio.playSFX(sfx);
            }
            await this.hideVisualChoices();
            resolve(index);
        },this,0,0,0,0);
        visualChoice.anchor.set(0.5);
        visualChoice.updateTransform();
        this.visualChoices.addChild(visualChoice);
        if (this.game.storyConfig.logChoices && defaultChoicesConfig.chosenColor && choice.previouslyChosen){
            visualChoice.tint = Color.hexToColor(this.config.chosenColor).color;
        }
        return visualChoice;
    }

    async hideVisualChoices(transitionName?): Promise<any>{
        if (!transitionName) transitionName = this.game.storyConfig.transitions.visualChoices;
        const transition = this.game.screenEffects.transition.get(transitionName);
        await transition(this.visualChoices,null);
        this.visualChoices.destroy()
        this.visualChoices = null;

        this.game.accessibility.choices();
    }

    ignoreTap(pointer): boolean{
        // If user clicks on buttons, the tap shouldn't count to continue the story
        return this.skipClickArea.find(area => area.contains(pointer.x,pointer.y)) !== undefined;
    }

    async clear(transition?): Promise<any>{
        const hiding = [];
        if (this.visualChoices) hiding.push(this.hideVisualChoices(transition));
        for (const mBox in this.mBoxes) hiding.push(this.mBoxes[mBox].clear(transition));
        for (const nBox in this.nBoxes) hiding.push(this.nBoxes[nBox].hide(transition));
        for (const cHandler in this.cHandlers) hiding.push(this.cHandlers[cHandler].hide(transition));
        await Promise.all(hiding);
    }

    async showHUD(): Promise<any>{
        await super.show();
    }

    async hideHUD(): Promise<any>{
        await super.hide();
    }

    // hud is shown along with the story layers
    // when hiding/pausing, only disable input

    async show(): Promise<any>{
        this.ignoreChildInput=false;
        this.forEach(child => {changeInputEnabled(child,true)})
    }

    async hide(): Promise<any>{
        this.ignoreChildInput=true;
        this.forEach(child => {changeInputEnabled(child,false)})
    }

    destroy(): void {
    	this.destroy();
    }
}
