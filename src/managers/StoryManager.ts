import RJSManager from './RJSManager';
import {Group} from 'phaser-ce';
import RJS from '../RJS';

export interface StoryManagerInterface<T> extends RJSManager {
    behindCharactersSprites: T;
    characterSprites: T;
    cgsSprites: T;
    backgroundSprites: T;
    interpret();
    startScene(name: string);
    currentScene: any[];
    actorsIndex: object;
}

// todo to impl
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
        for (const background in this.game.RJS.setup.backgrounds){
            const str = this.game.RJS.setup.backgrounds[background].split(' ');
            if (str.length === 1){
                this.game.RJS.managers.background.add(background);
            } else {
                const framerate = str.length === 4 ? parseInt(str[3], 10) : 16;
                this.game.RJS.managers.background.add(background,true,framerate);
            }
        }
        // load characters
        this.behindCharactersSprites = this.game.add.group();
        this.characterSprites = this.game.add.group();
        for (const name in this.game.RJS.setup.characters){
            const character = this.game.RJS.setup.characters[name];
            const displayName = character.displayName ? character.displayName : name;
            this.game.RJS.managers.character.add(name,displayName,character.speechColour,character.looks);
        }
        this.cgsSprites = this.game.add.group();
    }

    set(...args: any): void {
        //
    }

    interpret(): void {
        //
    }

    startScene(name: string): void {
        this.game.RJS.control.execStack = [{c:-1,scene:name}];
        this.game.RJS.managers.logic.clearChoices(); // For any interrup still showing
        // RenJS.chManager.hideAll();
        // RenJS.bgManager.hide();
        // RenJS.cgsManager.hideAll();
        // RenJS.audioManager.stop();
        this.currentScene = [...this.game.RJS.story[name]];
    }

    getActorType(actor): string {
        // is actor background or character
        if (!actor) {
            return null;
        }
        if (this.actorsIndex[actor]){
            return this.actorsIndex[actor];
        }
        if (this.game.RJS.managers.character.isCharacter(actor)){
            this.actorsIndex[actor] = 'ch';
            return 'ch';
        }
        if (this.game.RJS.managers.background.isBackground(actor)){
            this.actorsIndex[actor] = 'bg';
            return 'bg';
        }
        if (this.game.RJS.managers.audio.isMusic(actor)){
            this.actorsIndex[actor] = 'bgm';
            return 'bgm';
        }
        if (this.game.RJS.managers.audio.isSfx(actor)){
            this.actorsIndex[actor] = 'sfx';
            return 'sfx';
        }
        this.actorsIndex[actor] = 'cgs';
        return 'cgs';
    }

    getManagerByActorType (type: string): RJSManager {
        switch (type) {
            case 'ch': return this.game.RJS.managers.character
            case 'bg': return this.game.RJS.managers.background
            case 'cgs': return this.game.RJS.managers.cgs
        }
    }

    async interpretAction(action): Promise<any> {
        const actionParams = {
            withTransition: ['show','hide','play','stop'],
            withPosition: ['show'],
            withContinue: ['show','hide','effect']
        }
        function getKey(act): any {
            return Object.keys(act)[0];
        }

        // this.game.RJS.control.resolve = resolve;
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
                action.transitionName = str[str.indexOf('WITH') +1];
            } else {
                action.transitionName = this.game.defaultValues.transitions[actorType];
            }
            action.transition = this.game.defaultValues.transitions[action.transitionName];
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
        this.game.RJS.control.action = mainAction
        this.game.RJS.control.wholeAction = params;
        this.game.RJS.control.nextAction = null;
        // console.log('Doing '+RenJS.control.action);
        switch(this.game.RJS.control.action){
            // Asnyc actions, will resolve after some actions
            case 'show' :
                if (!contAfterTrans) return action.manager.show(actor, action.transition, action);
                break;
            case 'hide' :
                if (actor === 'CHARS') {
                    return this.game.RJS.managers.character.hideAll(action.transition)
                }
                if (actor === 'ALL') {
                    return Promise.all([this.game.RJS.managers.background.hide(), this.game.RJS.managers.character.hideAll(), this.game.RJS.managers.cgs.hideAll()]);
                }
                if (!contAfterTrans) return action.manager.hide(actor, action.transition);
                break;
            case 'animate' :
                if (!contAfterTrans) return this.game.RJS.managers.cgs.animate(actor, action, action.time);
                break;
            case 'effect' :
                if (!contAfterTrans) return this.game.RJS.screenEffects.effects[actor](action);
                break;
            case 'say' :
                const look = (keyParams.length > 2) ? keyParams[2] : null;
                return this.game.RJS.managers.text.say(actor, look, params)
            case 'text' :
                return this.game.RJS.managers.text.show(params);
            // Wait for user action input, will resolve on its own
            case 'wait' :
                if (params === 'click'){
                    this.game.RJS.waitForClick();
                } else {
                    this.game.RJS.waitTimeout(parseInt(params, 10));
                }
                return;
                // todo impl
            // case 'call' :
            //     return this.game.RJS..customContent[actor](params);
            case 'choice' :
                this.game.RJS.control.skipping = false;
                return this.game.RJS.managers.logic.showChoices([...params]);
            case 'visualchoice' :
                this.game.RJS.control.skipping = false;
                return this.game.RJS.managers.logic.showVisualChoices([...params]);

            // Synch actions, will resolve after case
            case 'interrupt' :
                this.game.RJS.managers.logic.interrupt(actor,[...params]);
                break;
            case 'var' :
                this.game.RJS.managers.logic.setVar(actor,params);
                break;
            case 'if' :
                const condition = key.substr(key.indexOf('('));
                const branches: {
                    ISTRUE: boolean;
                    ISFALSE?: boolean;
                } = {
                    ISTRUE: action[key]
                }
                const next = this.game.RJS.managers.story.currentScene[0];
                if (next && getKey(next) === 'else'){
                    branches.ISFALSE = next.else;
                    this.game.RJS.managers.story.currentScene.shift();
                }
                this.game.RJS.managers.logic.branch(condition, branches);
                break;
            case 'else' :
                break;
            case 'play' :
                // debugger;
                if (actorType === 'bgm') {
                    this.game.RJS.managers.audio.play(actor, 'bgm', action.looped, action.transitionName);
                } else {
                    this.game.RJS.managers.audio.playSFX(actor);
                }
                break;
            case 'stop' :
                this.game.RJS.managers.audio.stop('bgm', action.transitionName);
                break;
            case 'ambient' :
                this.game.RJS.screenEffects.ambient[actor](action.sfx);
                break;
            case 'scene' :
                this.game.RJS.managers.story.startScene(params);
                break;
        }
    }
}
