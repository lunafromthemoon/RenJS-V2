import {Group} from 'phaser-ce';
import RJS from '../core/RJS';
import RJSManagerInterface from './RJSManager';

export interface LogicManagerInterface<T> extends RJSManagerInterface {
    choicesLog: object;
    vars: object;
    currentChoices: any[];
    // interrupting: boolean;
    visualChoices?: T;
}

export default class LogicManager implements LogicManagerInterface<Group> {
    choicesLog: object;
    vars: object = {};
    currentChoices: any[];
    // interrupting: boolean;
    visualChoices: Group = null;
    showingText: boolean = false;

    constructor(private game: RJS) {
        const log = localStorage.getItem('RenJSChoiceLog'+game.config.name);
        if (this.game.setup.vars){
            this.vars = this.game.setup.vars
        }
        this.choicesLog = log ? JSON.parse(log) : {};
    }

    set(vars): void {
        this.vars = vars;
        this.currentChoices = [];
        // this.interrupting = false;
        if (this.visualChoices){
            this.visualChoices.destroy();
        }
    }

    setVar(name, value): void {
        value = value+'';
        value = this.parseVars(value);
        try {
            // eslint-disable-next-line no-eval
            this.vars[name] = eval(value);
        } catch(e) {
            this.vars[name] = value;
        }
    }

    updateChoiceLog(execId,choiceText){
        if (!this.choicesLog[execId].includes(choiceText)){

            this.choicesLog[execId].push(choiceText);
            // Save choices log
            const log = JSON.stringify(this.choicesLog);
            localStorage.setItem('RenJSChoiceLog' + this.game.config.name,log);
        }
        
    }

    evalExpression(expression): any {
        expression = expression + '';
        expression = this.parseVars(expression,true);
        try {
            // eslint-disable-next-line no-eval
            return eval(expression);
        } catch(e) {
            return false;
        }
    }

    branch(expression, branches): void {
        const val = this.evalExpression(expression);
        let actions;
        if (val && branches.ISTRUE){
            actions = branches.ISTRUE;
        }
        if (!val && branches.ISFALSE){
            // if we branch to "else" action, advance stack on one
            this.game.control.execStack.top().c++;
            actions = branches.ISFALSE;
        }
        if(actions){
            this.game.managers.story.currentScene = actions.concat(this.game.managers.story.currentScene);
            this.game.control.execStack.stack('if',actions.length)
        }
    }

    parseVars(text, useQM?): string {
        const vars = text.match(/\{(.*?)\}/g);
        if (vars) {
            for (const v of vars){
                const varName = v.substring(1,v.length-1);
                let value = this.vars[varName]
                if (useQM && typeof value == 'string'){
                    value = '\"'+value+'\"';
                }
                text = text.replace(v,value);
            }
        }
        return text;
    }

    evalChoice(choice): any {
        const choiceText = Object.keys(choice)[0];
        choice.choiceId = 'Choice'+ guid();
        // choice text can have vars
        choice.choiceText = this.parseVars(choiceText);
        // actions when chose will be kept in actions
        choice.actions = choice[choiceText];
        delete choice[choiceText];
        // check conditional option
        const params = choiceText.split('!if');
        if (params.length > 1){
            const val = this.evalExpression(params[1]);
            if (val) {
                // remove the if part of the text
                choice.choiceText = params[0];
            }
            return val;
        }
        return true; // unconditional choice
    }

    showVisualChoices(choices): void {
        // clone
        const ch = choices.map(choice => ({...choice}));
        // filter (eval choice modifies the choice adding id and clearing text)
        this.currentChoices = ch.filter(this.evalChoice);
        this.visualChoices = this.game.add.group();
        this.visualChoices.alpha = 0;
        const execId = this.getExecStackId();
        for (let i = 0; i < this.currentChoices.length; i++) {
            const key = Object.keys(this.currentChoices[i])[0];
            const str = key.split(' ');
            const pos = str[2].split(',');
            const position = {x: parseInt(pos[0], 10), y: parseInt(pos[1], 10)};
            this.createVisualChoice(str[0],position,i,key,execId);
        }
        let transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.visualChoices);
        transition(null,this.visualChoices);
    }

    createVisualChoice(image, position, index, key, execId): Phaser.Button {
        const button = this.game.add.button(position.x,position.y,image,() => {
            let transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.visualChoices);
            transition(this.visualChoices,null).then(()=>{
                this.visualChoices.destroy();
                this.choose(index,key,execId);
            })
        },this,0,0,0,0,this.visualChoices);

        // if (this.game.gui.getChosenOptionColor && this.choicesLog[execId].indexOf(key) !== -1){
            // button.tint = this.game.gui.getChosenOptionColor();
            // previously chosen choice
        // }
        button.anchor.set(0.5);
        return button;
    }

    choose(index, choiceText, execId): void {
        // remove message box if showing message
        if (this.showingText){
            this.game.managers.text.hide()
            this.showingText = false;
        }
        // update choice log
        this.updateChoiceLog(execId,choiceText);
        if (this.game.storyConfig.logText){
            this.game.managers.text.textLog.push({text:choiceText,title:"choice"});
        }
        let chosenOption = this.currentChoices[index];
        // add new action to scene
        const actions = chosenOption.actions;
        this.game.managers.story.currentScene = actions.concat(this.game.managers.story.currentScene);
        // update stack
        if (chosenOption.interrupt){
            // resolving an interrupt, add actions and update stack 
            this.game.control.execStack.stack('interrupt',actions.length,index,chosenOption.origin);
        } else {
            this.game.control.execStack.stack('choice',actions.length,index);
        }

        this.currentChoices = [];
        if (!chosenOption.interrupt){
            // interrupts resolve immediately
            this.game.resolveAction();
        } 
    }


    getExecStackId(): string {
        const execId =  this.game.control.execStack.hash();
        if (!this.choicesLog[execId]){
            this.choicesLog[execId]=[];
        }
        return execId;
    }

    async checkTextAction(firstChoice){
        let action=this.game.managers.story.parseAction({...firstChoice});
        if (action.mainAction == "say" || action.mainAction == "text"){
            if (action.actor){
                await this.game.managers.text.say(action.actor, action.look, action.body, true);
            } else {
                await this.game.managers.text.show(action.body,null,null,null,true);
            }
            return true;
        }
        return false;
    }

    async showChoices(choices) {
        this.showingText = await this.checkTextAction(choices[0]);
        if (this.showingText){
            choices.shift();
        }
        const ch = choices.map(choice => ({...choice})).filter(choice => this.evalChoice(choice))
        this.currentChoices = this.currentChoices.concat(ch);
        this.game.gui.showChoices(this.currentChoices,this.getExecStackId());
    }

    interrupt(steps, choices): any {
        // TODO: fix this shit
        // this.interrupting = true;
        const s = parseInt(steps, 10);
        choices.forEach(choice => {
            choice.interrupt = true;
            choice.origin = this.game.control.execStack.top().c;
            if (!isNaN(s) && s>0){
                choice.remainingSteps = s+1;
            }
        })
        this.showChoices(choices);
        // interrupts don't wait for player to make the choice
        this.game.resolveAction();
    }

    updateInterruptions():void {
        var interrupts = this.currentChoices.filter(choice => choice.interrupt);
        interrupts.forEach(interrupt => {
            if (interrupt.remainingSteps){
                interrupt.remainingSteps--;
                if (interrupt.remainingSteps === 1){
                    this.game.gui.changeToLastInterrupt(interrupt.choiceId);
                } else if (interrupt.remainingSteps === 0){
                    this.game.gui.hideChoice(interrupt.choiceId);
                }
            }
        })
    }

    clearChoices(): any {
        this.game.gui.hideChoices();
        this.currentChoices = [];
        // this.interrupting = false;
        if (this.visualChoices){
            this.visualChoices.destroy();
        }
        if (this.showingText){
            this.game.managers.text.hide()
            this.showingText = false;
        }
    }
}

function guid(): string {
    return 'ss'.replace(/s/g, s4);
}

function s4(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}
