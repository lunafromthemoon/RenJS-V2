import RJSManager from './RJSManager';
import {Group} from 'phaser-ce';
import RJS from '../core/RJS';
import RJSManagerInterface from './RJSManager';

export interface StoryManagerInterface<T> extends RJSManagerInterface {
    behindCharactersSprites: T;
    characterSprites: T;
    cgsSprites: T;
    backgroundSprites: T;
    interpret();
    startScene(name: string);
    currentScene: any[];
    actorsIndex: object;
}


export default class StoryManager implements StoryManagerInterface<Group> {
    behindCharactersSprites: Group;
    cgsSprites: Group
    characterSprites: Group;
    actorsIndex = {}
    currentScene: any[];
    backgroundSprites: Group

    private game: RJS

    constructor(game: RJS) {
        this.game = game
    }

    setupStory(): void {
        // load backgrounds
        this.backgroundSprites = this.game.add.group();
        for (const background in this.game.setup.backgrounds){
            const str = this.game.setup.backgrounds[background].split(' ');
            if (str.length === 1){
                this.game.managers.background.add(background);
            } else {
                const framerate = str.length === 4 ? parseInt(str[3], 10) : 16;
                this.game.managers.background.add(background,true,framerate);
            }
        }
        // load characters
        this.behindCharactersSprites = this.game.add.group();
        this.characterSprites = this.game.add.group();
        for (const name in this.game.setup.characters){
            const character = this.game.setup.characters[name];
            const displayName = character.displayName ? character.displayName : name;
            this.game.managers.character.add(name,displayName,character.speechColour,character.looks);
        }
        this.cgsSprites = this.game.add.group();
    }

    set(...args: any): void {
        //
    }

    interpret(): void {
        if (this.game.managers.story.currentScene.length === 0 || this.game.control.paused){
            // console.log("Resolving something here");
           return
        } else {
            const currentAction = this.game.managers.story.currentScene.shift();
            // does extra stuff on every step
            // like updating the execution stack
            // or counting the interruption steps
            for (const action in this.game.onInterpretActions){
                this.game.onInterpretActions(action)
            }
            this.game.managers.story.interpretAction(currentAction)
            // return this.game.managers.story.interpret();

        }
    }

    startScene(name: string): void {
        this.game.control.execStack = [{c:-1,scene:name}];
        this.game.managers.logic.clearChoices(); // For any interrup still showing
        // RenJS.chManager.hideAll();
        // RenJS.bgManager.hide();
        // RenJS.cgsManager.hideAll();
        // RenJS.audioManager.stop();
        this.currentScene = [...this.game.story[name]];
    }

    getActorType(actor): string {
        // is actor background or character
        if (!actor) {
            return null;
        }
        if (this.actorsIndex[actor]){
            return this.actorsIndex[actor];
        }
        if (this.game.managers.character.isCharacter(actor)){
            this.actorsIndex[actor] = 'ch';
            return 'ch';
        }
        if (this.game.managers.background.isBackground(actor)){
            this.actorsIndex[actor] = 'bg';
            return 'bg';
        }
        if (this.game.managers.audio.isMusic(actor)){
            this.actorsIndex[actor] = 'bgm';
            return 'bgm';
        }
        if (this.game.managers.audio.isSfx(actor)){
            this.actorsIndex[actor] = 'sfx';
            return 'sfx';
        }
        this.actorsIndex[actor] = 'cgs';
        return 'cgs';
    }

    getManagerByActorType (type: string): RJSManager {
        switch (type) {
            case 'ch': return this.game.managers.character
            case 'bg': return this.game.managers.background
            case 'cgs': return this.game.managers.cgs
        }
    }

    interpretAction(action): void {
        const actionParams = {
            withTransition: ['show','hide','play','stop'],
            withPosition: ['show'],
            withContinue: ['show','hide','effect']
        }
        function getKey(act): any {
            return Object.keys(act)[0];
        }

        // this.game.control.resolve = resolve;
        const key = getKey(action);
        const keyParams = key.split(' ');
        let mainAction; let actor;
        if (keyParams[1] === 'says') {
            mainAction = 'say';
            actor = keyParams[0];
        } else {
            mainAction = keyParams[0];
            actor = keyParams[1];
        }
        const actorType = this.getActorType(actor);
        // parse WITH and AT
        const params = action[key];
        if (actionParams.withTransition.includes(mainAction)){
            const str = params ? params.split(' ') : [];
            if (str.indexOf('WITH') !== -1){
                action.transition = str[str.indexOf('WITH') +1];
            } else {
                action.transition = this.game.defaultValues.transitions[actorType];
            }
            // action.transition = () => this.game.screenEffects.transition[action.transitionName];
        }
        if (params && actionParams.withPosition.includes(mainAction)){
            const str = params ? params.split(' ') : [];
            if (str.indexOf('AT') !== -1){
                action.position = str[str.indexOf('AT')+1];
                if (action.position in this.game.defaultValues.positions){
                    action.position = this.game.defaultValues.positions[action.position];
                } else {
                    const coords = action.position.split(',');
                    action.position = {x:parseInt(coords[0], 10),y:parseInt(coords[1], 10)};
                }
            }
            if (str.length>0 && str[0] !== 'AT' && str[0] !== 'WITH'){
                action.look = str[0];
            }
        }
        let contAfterTrans = false;
        if (params && actionParams.withContinue.includes(mainAction)){
            const str = params ? params.split(' ') : [];
            contAfterTrans = str.indexOf('CONTINUE') !== -1
        }
        action.manager = this.getManagerByActorType(actorType);
        // RenJS.control.action = mainAction;
        this.game.control.action = mainAction
        this.game.control.wholeAction = params;
        this.game.control.nextAction = null;
        // console.log('Doing '+RenJS.control.action);
        console.log(action)
        switch(this.game.control.action){
            // Asnyc actions, will resolve after some actions
            case 'show' :
            // each action should be a subclass of StoryAction
                var transition: Promise<any> = action.manager.show(actor, action.transition, action);
                if (!contAfterTrans){
                    console.log(transition)
                    transition.then(()=> this.game.resolveAction())
                    return
                }
                break;
            case 'hide' :
                var transition: Promise<any> = null;
                if (actor === 'CHARS') {
                    transition = this.game.managers.character.hideAll(action.transition)
                } else if (actor === 'ALL') {
                    transition = Promise.all([this.game.managers.background.hide(action.transition), this.game.managers.character.hideAll(action.transition), this.game.managers.cgs.hideAll(action.transition)]);
                } else {
                    transition = action.manager.hide(actor, action.transition);
                }
                if (!contAfterTrans){
                    transition.then(()=> this.game.resolveAction())
                    return
                }
                break;
            case 'animate' :
                var transition: Promise<any> = this.game.managers.cgs.animate(actor, action, action.time);
                if (!contAfterTrans){
                    transition.then(()=> this.game.resolveAction())
                    return
                }
                break;
            case 'effect' :
                // if (!contAfterTrans) return this.game.screenEffects.effects[actor](action);
                // break;
            case 'say' :
                const look = (keyParams.length > 2) ? keyParams[2] : null;
                this.game.managers.text.say(actor, look, params);
                return;
            case 'text' :
                this.game.managers.text.show(params);
                return
            // Wait for user action input, will resolve on its own
            case 'wait' :
                if (params === 'click'){
                    this.game.waitForClick();
                } else {
                    this.game.waitTimeout(parseInt(params, 10));
                }
                return;
                // todo impl
            // case 'call' :
            //     return this.game..customContent[actor](params);
            case 'choice' :
                this.game.control.skipping = false;
                this.game.managers.logic.showChoices([...params]);
                return
            case 'visualchoice' :
                this.game.control.skipping = false;
                this.game.managers.logic.showVisualChoices([...params]);
                return 
            // Synch actions, will resolve after case
            case 'interrupt' :
                this.game.managers.logic.interrupt(actor,[...params]);
                break;
            case 'var' :
                this.game.managers.logic.setVar(actor,params);
                break;
            case 'if' :
                const condition = key.substr(key.indexOf('('));
                const branches: {
                    ISTRUE: boolean;
                    ISFALSE?: boolean;
                } = {
                    ISTRUE: action[key]
                }
                const next = this.game.managers.story.currentScene[0];
                if (next && getKey(next) === 'else'){
                    branches.ISFALSE = next.else;
                    this.game.managers.story.currentScene.shift();
                }
                this.game.managers.logic.branch(condition, branches);
                break;
            case 'else' :
                break;
            case 'play' :
                // debugger;
                if (actorType === 'bgm') {
                    this.game.managers.audio.play(actor, 'bgm', action.looped, action.transitionName);
                } else {
                    this.game.managers.audio.playSFX(actor);
                }
                break;
            case 'stop' :
                this.game.managers.audio.stop('bgm', action.transitionName);
                break;
            case 'ambient' :
                this.game.screenEffects.ambient[actor](action.sfx);
                break;
            case 'scene' :
                this.game.managers.story.startScene(params);
                break;
        }
        this.game.resolveAction()
    }
}
