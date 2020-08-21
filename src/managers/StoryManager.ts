import RJSManager from './RJSManager';
import {Group} from 'phaser-ce';
import RJSGame from '../RJSGame';

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

    private game: RJSGame

    constructor(game: RJSGame) {
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

    async interpretAction(action): Promise<any> {
        const actionParams = {
            withTransition: ['show','hide','play','stop'],
            withPosition: ['show'],
            withContinue: ['show','hide','effect']
        }
        function getKey(act): any {
            return Object.keys(act)[0];
        }

        RenJS.control.resolve = resolve;
        const key = getKey(action);
        const keyParams = key.split(' ');
        let mainAction; let actor;
        if (keyParams[1] == 'says') {
            mainAction = 'say';
            actor = keyParams[0];
        } else {
            mainAction = keyParams[0];
            actor = keyParams[1];
        }
        const actorType = RenJS.storyManager.getActorType(actor);
        // parse WITH and AT
        const params = action[key];
        if (actionParams.withTransition.includes(mainAction)){
            var str = params ? params.split(' ') : [];
            if (str.indexOf('WITH')!=-1){
                action.transitionName = str[str.indexOf('WITH')+1];
            } else {
                action.transitionName = config.transitions[actorType];
            }
            action.transition = RenJS.transitions[action.transitionName];
        }
        if (params && actionParams.withPosition.includes(mainAction)){
            var str = params ? params.split(' ') : [];
            if (str.indexOf('AT')!=-1){
                action.position = str[str.indexOf('AT')+1];
                if (action.position in config.positions){
                    action.position = config.positions[action.position];
                } else {
                    const coords = action.position.split(',');
                    action.position = {x:parseInt(coords[0]),y:parseInt(coords[1])};
                }
            }
            if (str.length>0 && str[0]!='AT' && str[0]!='WITH'){
                action.look = str[0];
            }
        }
        let contAfterTrans = false;
        if (params && actionParams.withContinue.includes(mainAction)){
            var str = params ? params.split(' ') : [];
            contAfterTrans = str.indexOf('CONTINUE')!=-1
        }
        action.manager = RenJS[actorType+'Manager'];
        RenJS.control.action = mainAction;
        RenJS.control.wholeAction = params;
        RenJS.control.nextAction = null;
        console.log('Doing '+RenJS.control.action);
        switch(RenJS.control.action){
            // Asnyc actions, will resolve after some actions
            case 'show' :
                var transitioning = action.manager.show(actor,action.transition,action);
                if (!contAfterTrans) return transitioning.then(RenJS.resolve);
                break;
            case 'hide' :
                if (actor == 'CHARS'){
                    return RenJS.chManager.hideAll(action.transition).then(RenJS.resolve);
                }
                if (actor == 'ALL'){
                    const promises = [RenJS.bgManager.hide(),RenJS.chManager.hideAll(),RenJS.cgsManager.hideAll()];
                    return Promise.all(promises).then(RenJS.resolve);
                }
                var transitioning = action.manager.hide(actor,action.transition);
                if (!contAfterTrans) return transitioning.then(RenJS.resolve);
                break;
            case 'animate' :
                var transitioning = RenJS.cgsManager.animate(actor,action,action.time);
                if (!contAfterTrans) return transitioning.then(RenJS.resolve);
                break;
            case 'effect' :
                var transitioning = RenJS.effects[actor](action);
                if (!contAfterTrans) return transitioning.then(RenJS.resolve);
                break;
            case 'say' :
                var look = (keyParams.length > 2) ? keyParams[2] : null;
                return RenJS.textManager.say(actor,look,params).then(RenJS.resolve);
            case 'text' :
                return RenJS.textManager.show(params).then(RenJS.resolve);
            // Wait for user action input, will resolve on its own
            case 'wait' :
                if (params == 'click'){
                    RenJS.waitForClick();
                } else {
                    RenJS.waitTimeout(parseInt(params));
                }
                return;
            case 'call' :
                return RenJS.customContent[actor](params);
            case 'choice' :
                RenJS.control.skipping = false;
                return RenJS.logicManager.showChoices([...params]);
            case 'visualchoice' :
                RenJS.control.skipping = false;
                return RenJS.logicManager.showVisualChoices([...params]);

            // Synch actions, will resolve after case
            case 'interrupt' :
                RenJS.logicManager.interrupt(actor,[...params]);
                break;
            case 'var' :
                RenJS.logicManager.setVar(actor,params);
                break;
            case 'if' :
                var condition = key.substr(key.indexOf('('));
                var branches = {
                    ISTRUE: action[key]
                };
                var next = RenJS.storyManager.currentScene[0];
                if (next && getKey(next) == 'else'){
                    branches.ISFALSE = next.else;
                    RenJS.storyManager.currentScene.shift();
                }
                RenJS.logicManager.branch(condition,branches);
                break;
            case 'else' :
                break;
            case 'play' :
                // debugger;
                if (actorType == 'bgm'){
                    RenJS.audioManager.play(actor, 'bgm', action.looped, action.transitionName);
                } else {
                    RenJS.audioManager.playSFX(actor);
                }
                break;
            case 'stop' :
                RenJS.audioManager.stop('bgm',action.transitionName);
                break;
            case 'ambient' :
                RenJS.ambient[actor](action.sfx);
                break;
            case 'scene' :
                RenJS.storyManager.startScene(params);
                break;

        }
    }




}
