import {Group} from 'phaser-ce';
import RJS from '../core/RJS';
import RJSManagerInterface from './RJSManager';
import StoryAction from '../core/actions/StoryAction';

type Choice = {
    index: any,
    actions: any[],
    available: boolean,
    choiceText: string,
    previouslyChosen: boolean,
    interrupt?: boolean,
    origin?: any,
};

export interface LogicManagerInterface<T> extends RJSManagerInterface {
    choicesLog: object;
    vars: object;

    currentChoices: Choice[];
    // interrupting: boolean;
    visualChoices?: T;
}

export default class LogicManager implements LogicManagerInterface<Group> {
    choicesLog: object;
    vars: object = {};
    currentChoices: Choice[];
    interrupting?: {origin: number;execId: string};
    showingText = false;

    constructor(private game: RJS) {
        if (this.game.setup.vars){
            this.vars = this.game.setup.vars
        }
        const log = localStorage.getItem('RenJSChoiceLog'+game.config.name);
        this.choicesLog = log ? JSON.parse(log) : {};
    }

    set(vars): void {
        this.vars = {...this.vars, ...vars};
        this.currentChoices = [];
        this.interrupting = null;
    }

    setVar(name: string, value: any): void {
        value = value+'';
        value = this.parseVars(value);
        try {
            // eslint-disable-next-line no-eval
            this.vars[name] = eval(value);
        } catch(e) {
            this.vars[name] = value;
        }
    }

    updateChoiceLog(index: number): void{
        const execId = this.interrupting ? this.interrupting.execId : this.getExecStackId()
        if (!this.choicesLog[execId].includes(index)){
            this.choicesLog[execId].push(index);
            // Save choices log
            const log = JSON.stringify(this.choicesLog);
            localStorage.setItem('RenJSChoiceLog' + this.game.config.name,log);
        }
    }

    choiceInLog(index: number): boolean{
        return this.choicesLog[this.getExecStackId()].includes(index);
    }

    evalExpression(expression): boolean {
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
                if (useQM && typeof value === 'string'){
                    value = '"'+value+'"';
                }
                text = text.replace(v,value);
            }
        }
        return text;
    }

    parseChoice(index: number, choice): Choice {
        const rawText = Object.keys(choice)[0];
        const parsedChoice: Choice = {
            index,
            actions: choice[rawText] || [],
            available: true,
            choiceText: this.parseVars(rawText),
            previouslyChosen: this.choiceInLog(index)
        }
        // check conditional option
        const params = rawText.split('!if');
        if (params.length > 1){
            parsedChoice.available = this.evalExpression(params[1]);
            parsedChoice.choiceText = params[0].trim();
        }
        if (choice.interrupt){
            parsedChoice.interrupt = true;
            parsedChoice.origin = choice.interrupt;
        }
        return parsedChoice
    }



    async choose(index: number): Promise<void> {
        const chosenOption = this.currentChoices[index];
        // update choice log
        this.updateChoiceLog(chosenOption.index);
        if (this.game.storyConfig.keepStoryLog){
            // add the chosen options to the story log
            this.game.storyLog.push({message: chosenOption.choiceText, choice: true});
        }
        // add new action to scene
        const actions = chosenOption.actions;
        this.game.managers.story.currentScene = actions.concat(this.game.managers.story.currentScene);
        if (this.showingText){
            // correct stack index, so it will skip the text action
            index++;
        }
        // update stack
        if (this.interrupting){
            // resolving an interrupt, add actions and update stack
            this.game.control.execStack.stack('interrupt',actions.length,chosenOption.index,chosenOption.origin);
        } else {
            this.game.control.execStack.stack('choice',actions.length,chosenOption.index);
        }
        if (this.game.config.debugMode){
            console.log('Choice taken '+ index+ ' : '+chosenOption.choiceText);
        }
        await this.clearChoices();
        if (!this.interrupting){
            // interrupts resolve immediately
            this.game.resolveAction();
        } else {
            // stop interrupting
            this.interrupting = null;
        }
    }


    getExecStackId(): string {
        const execId =  this.game.control.execStack.hash();
        if (!this.choicesLog[execId]){
            this.choicesLog[execId]=[];
        }
        return execId;
    }

    async checkTextAction(firstChoice): Promise<boolean>{
        const action: StoryAction=this.game.managers.story.parseAction({...firstChoice});
        if (action && (action.actionType === 'say' || action.actionType === 'text')){
            const textAction = action;
            // set property so the text will not be hidden after it's shown
            textAction.dontHide = true;
            return new Promise(resolve=>{
                // replace resolve function so the text action won't call resolveAction
                textAction.resolve = async (transition): Promise<any> =>{
                    await transition
                    resolve(true);
                }
                // show text action
                textAction.execute()
            })
        }
        return false;
    }

    async showChoices(boxId: string, choices: any[]): Promise<void> {
        this.showingText = await this.checkTextAction(choices[0]);
        if (this.showingText){
            choices.shift();
        }
        // const ch = choices.map(choice => ({...choice})).filter(choice => this.evalChoice(choice))
        this.currentChoices = choices.map((choice,index) => this.parseChoice(index,choice))
        this.currentChoices = this.currentChoices.filter(choice=>choice.available)
        let chosenIdx = -1;
        if (!boxId) boxId = 'default';
        if (boxId === 'visualChoices'){
            chosenIdx = await this.game.gui.hud.showVisualChoices(this.currentChoices);
        } else {
            // text choices
            chosenIdx = await this.game.gui.hud.showChoices(boxId,this.currentChoices);
        }
        this.choose(chosenIdx);
    }

    interrupt(boxId, choices): any {
        this.interrupting = {origin: this.game.control.execStack.top().c, execId:this.getExecStackId()};
        this.showChoices(boxId,choices);
        // interrupts don't wait for player to make the choice
        this.game.resolveAction();
    }

    async clearChoices(): Promise<any> {
        // clears everything
        await this.game.gui.hud.clear();
        this.currentChoices = [];
        this.showingText = false;
    }
}


