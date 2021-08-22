import RJS from '../core/RJS';
import {Group,Graphics,Text} from 'phaser-ce';
import {toHexColor} from '../utils/gui'
import RJSMenu from './RJSMenu'
import MessageBox from './elements/MessageBox'
import NameBox from './elements/NameBox'
import ChoiceHandler from './elements/ChoiceHandler'

import {changeInputEnabled} from '../utils/gui'

export default class RJSHUD extends RJSMenu {
    mBoxes = {}
    nBoxes = {}
    cHandlers = {}
    
    skipClickArea: Phaser.Rectangle[] = []
    visualChoices: Graphics
    

    constructor(game: RJS, config) {
        super(game, config);
        // add factories for hud specific elements
        this.elementFactory = Object.assign(this.elementFactory,{
            messageBox: this.createMessageBox.bind(this),
            nameBox: this.createNameBox.bind(this),
            choices: this.createChoiceHandler.bind(this),
            button: this.createButton.bind(this),
        });
    }

    // create HUD specific components

    createMessageBox(element) {
        this.mBoxes[element.id] = new MessageBox(this.game,element)
        return this.mBoxes[element.id]
    }

    createNameBox(element) {
        this.nBoxes[element.id] = new NameBox(this.game,element)
        return this.nBoxes[element.id]
    }

    createChoiceHandler(element) {
        this.cHandlers[element.id] =  new ChoiceHandler(this.game,element)
        return this.cHandlers[element.id];
    }

    createButton(element){
        const btn = super.createButton(element);
        // when pressing a button, tapping should be ignored to avoid continuing the game
        this.skipClickArea.push(new Phaser.Rectangle(btn.x,btn.y,btn.width,btn.height))
        return btn;
    }

    showName(boxId, name, color){
        console.log(boxId)
        this.nBoxes[boxId].show(name,color);
    }

    hideName(boxId){
        this.nBoxes[boxId].hide();
    }

    // display text on message box
    async showText(boxId, text, sfx?): Promise<any>{
        return this.mBoxes[boxId].show(text,sfx);
    }

    hideText(boxId){
        this.mBoxes[boxId].clear();
    }

    async showChoices(handlerId,choices): Promise<any>{
        return this.cHandlers[handlerId].show(choices)
    }

    hideChoices(handlerId){
        console.log("hiding")
        this.cHandlers[handlerId].hide()
    }

    async showVisualChoices(choices): Promise<any>{
        return new Promise(resolve=>{
            this.visualChoices = this.game.add.graphics();
            this.addChild(this.visualChoices);
            this.visualChoices.alpha = 0;
            choices.forEach((choice,index) => {
                this.createVisualChoice(choice,index,resolve);
            });
            let transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.visualChoices);
            transition(null,this.visualChoices);
        });
    }

    createVisualChoice(choice, index, resolve) {
        const defaultChoicesConfig = this.cHandlers['default'].config;
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
        const visualChoice = this.game.add.button(position.x,position.y,str[0],async () => {
            if (sfx && sfx !== 'none') {
                this.game.managers.audio.playSFX(sfx);
            }
            await this.hideVisualChoices();
            resolve(index);
        },this,0,0,0,0);
        this.visualChoices.addChild(visualChoice);
        if (choice.previouslyChosen){
            visualChoice.tint = toHexColor(defaultChoicesConfig.chosenColor);
        }
        visualChoice.anchor.set(0.5);
    }

    async hideVisualChoices(transitionName?) {
        if (!transitionName) transitionName = this.game.storyConfig.transitions.visualChoices;
        let transition = this.game.screenEffects.transition.get(transitionName);
        await transition(this.visualChoices,null);
        this.visualChoices.destroy()
        this.visualChoices = null;
    }

    ignoreTap(pointer) {
        // If user clicks on buttons, the tap shouldn't count to continue the story
        return this.skipClickArea.find(area => area.contains(pointer.x,pointer.y)) !== undefined;
    }

    async clear(transition?) {
        let hiding = [];
        if (this.visualChoices) hiding.push(this.hideVisualChoices(transition));
        for (const mBox in this.mBoxes) hiding.push(this.mBoxes[mBox].clear(transition));
        for (const nBox in this.nBoxes) hiding.push(this.nBoxes[nBox].hide(transition));
        for (const cHandler in this.cHandlers) hiding.push(this.cHandlers[cHandler].hide(transition));
        await Promise.all(hiding);
    }

    async showHUD(){
        console.log("really showing hud")
        await super.show();
    }

    async hideHUD(){
        console.log("really hiding hud")
        await super.hide();
    }

    // hud is shown along with the story layers
    // when hiding/pausing, only disable input

    async show() {
        console.log("showing hud")
        this.ignoreChildInput=false;
        this.forEach(child => {changeInputEnabled(child,true)})
    }

    async hide(mute:boolean = true){
        console.log("hiding hud")
        this.ignoreChildInput=true;
        this.forEach(child => {changeInputEnabled(child,false)})
    }

    destroy(): void {
    	this.destroy();
    }
}
