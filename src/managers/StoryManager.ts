import RJSManager from './RJSManager';
import {Group} from 'phaser-ce';
import RJS from '../core/RJS';
import RJSManagerInterface from './RJSManager';
import StoryActionFactory from '../core/actions/StoryActionFactory'
import StoryAction from '../core/actions/StoryAction';

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
            this.game.onInterpretActions()
            // interpret the action at hand
            this.game.managers.story.interpretAction(currentAction)

        }
    }

    startScene(name: string): void {
        this.game.control.execStack.replace(name);
        this.game.managers.logic.clearChoices(); // For any interrup still showing
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
            this.actorsIndex[actor] = 'characters';
            return 'characters';
        }
        if (this.game.managers.background.isBackground(actor)){
            this.actorsIndex[actor] = 'backgrounds';
            return 'backgrounds';
        }
        if (this.game.managers.audio.isMusic(actor)){
            this.actorsIndex[actor] = 'music';
            return 'music';
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
            case 'characters': return this.game.managers.character
            case 'backgrounds': return this.game.managers.background
            case 'cgs': return this.game.managers.cgs
        }
    }

    interpretAction(action): void {
        const actionParams = {
            withTransition: ['show','hide','play','stop'],
            withPosition: ['show'],
            withContinue: ['show','hide'],
        }
        function getKey(act): any {
            return Object.keys(act)[0];
        }

        const key = getKey(action);
        const keyParams = key.split(' ');
        let mainAction; let actor;
        if (keyParams[1] === 'says') {
            mainAction = 'say';
            actor = keyParams[0];
            action.look = (keyParams.length > 2) ? keyParams[2] : null;
        } else {
            mainAction = keyParams[0];
            actor = keyParams[1];
        }
        action.actor = actor;
        action.actorType = this.getActorType(actor);
        // parse WITH and AT
        const params = action[key];
        action.body = params;
        if (actionParams.withTransition.includes(mainAction)){
            const str = params ? params.split(' ') : [];
            if (str.indexOf('WITH') !== -1){
                action.transition = str[str.indexOf('WITH') +1];
            } else {
                // default transition for the actor type
                action.transition = this.game.storyConfig.transitions.defaults[action.actorType];
            }
        }
        if (params && actionParams.withPosition.includes(mainAction)){
            const str = params ? params.split(' ') : [];
            if (str.indexOf('AT') !== -1){
                action.position = str[str.indexOf('AT')+1];
                if (action.position in this.game.storyConfig.positions){
                    action.position = this.game.storyConfig.positions[action.position];
                } else {
                    const coords = action.position.split(',');
                    action.position = {x:parseInt(coords[0], 10),y:parseInt(coords[1], 10)};
                }
            }
            if (str.indexOf('FLIP') !== -1){
                action.flipped = 'flip';
            }
            if (str.length>0 && str[0] !== 'AT' && str[0] !== 'WITH'){
                action.look = str[0];
            }
        }
        action.contAfterTrans = false;
        if (params && actionParams.withContinue.includes(mainAction)){
            const str = params ? params.split(' ') : [];
            action.contAfterTrans = str.indexOf('CONTINUE') !== -1
        }
        action.manager = this.getManagerByActorType(action.actorType);
        // this.game.control.action = mainAction
        // this.game.control.wholeAction = params;
        this.game.control.nextAction = null;
        if (mainAction === 'else'){
            // nothing to do, already resolved in previous if action
            return this.game.resolveAction();
        }
        const storyAction: StoryAction = StoryActionFactory(mainAction,action,this.game);
        storyAction.execute();
    }
}
