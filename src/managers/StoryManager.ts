import {Group} from 'phaser-ce';
import RJS from '@/core/RJS';
import RJSAssetLoader from '@/core/RJSAssetLoader';
import {RJSSpriteManagerInterface} from '@/managers/RJSManager';
import StoryAction from '@/actions/StoryAction';

import StoryActionShow from '@/actions/StoryActionShow';
import StoryActionHide from '@/actions/StoryActionHide';
import StoryActionAnimate from '@/actions/StoryActionAnimate';
import StoryActionText from '@/actions/StoryActionText';
import StoryActionSay from '@/actions/StoryActionSay';
import StoryActionWait from '@/actions/StoryActionWait';
import StoryActionChoice from '@/actions/StoryActionChoice';
import StoryActionAudio from '@/actions/StoryActionAudio';
import StoryActionScene from '@/actions/StoryActionScene';
import StoryActionVar from '@/actions/StoryActionVar';
import StoryActionEffect from '@/actions/StoryActionEffect';
import StoryActionAmbient from '@/actions/StoryActionAmbient';
import StoryActionIf from '@/actions/StoryActionIf';
import StoryActionCall from '@/actions/StoryActionCall';
import StoryActionEnd from '@/actions/StoryActionEnd';

export interface StoryManagerInterface<T> {
    behindCharactersSprites: T;
    characterSprites: T;
    cgsSprites: T;
    backgroundSprites: T;
    interpret(): void;
    startScene(name: string): Promise<void>;
    currentScene: any[];
    actorsIndex: {[key: string]: string};
    interpreting: boolean;
    assetLoader?: RJSAssetLoader;
}


export default class StoryManager implements StoryManagerInterface<Group> {
    behindCharactersSprites: Group;
    cgsSprites: Group
    characterSprites: Group;
    actorsIndex: {[key: string]: string} = {};
    currentScene: any[] = [];
    backgroundSprites: Group
    interpreting = false;
    assetLoader?: RJSAssetLoader;
    reservedWords = ['WITH','AT','IN','FLIP','CONTINUE','LOOPED','FROM','FORCE']
    actionFactory: {[key: string]: typeof StoryAction}

    constructor(private game: RJS) {
        this.actionFactory = {
            'show': StoryActionShow,
            'hide': StoryActionHide,
            'animate': StoryActionAnimate,
            'say': StoryActionSay,
            'text': StoryActionText,
            'wait': StoryActionWait,
            'choice': StoryActionChoice,
            'visualchoice': StoryActionChoice,
            'interrupt': StoryActionChoice,
            'play': StoryActionAudio,
            'stop': StoryActionAudio,
            'scene': StoryActionScene,
            'var': StoryActionVar,
            'effect': StoryActionEffect,
            'ambient': StoryActionAmbient,
            'if': StoryActionIf,
            'call': StoryActionCall,
            'endgame': StoryActionEnd,
        }
        this.backgroundSprites = this.game.add.group();
        this.behindCharactersSprites = this.game.add.group();
        this.characterSprites = this.game.add.group();
        this.cgsSprites = this.game.add.group();

        this.backgroundSprites.visible = false;
        this.behindCharactersSprites.visible = false;
        this.characterSprites.visible = false;
        this.cgsSprites.visible = false;

        this.backgroundSprites.alpha = 0;
        this.behindCharactersSprites.alpha = 0;
        this.characterSprites.alpha = 0;
        this.cgsSprites.alpha = 0;

        if (this.game.setup.lazyloading){
            this.assetLoader = new RJSAssetLoader(this.game);
        }
    }

    async show(): Promise<any>{
        if (this.characterSprites.visible) return;
        const transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.menus);
        this.backgroundSprites.visible = true;
        this.behindCharactersSprites.visible = true;
        this.characterSprites.visible = true;
        this.cgsSprites.visible = true;
        transition(null,this.backgroundSprites);
        transition(null,this.behindCharactersSprites);
        transition(null,this.characterSprites);
        transition(null,this.cgsSprites);
        await this.game.gui.hud.showHUD();
    }

    async hide(): Promise<any>{
        if (!this.characterSprites.visible) return;
        // only hide if things are visible
        const transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.menus);
        transition(this.backgroundSprites, null);
        transition(this.behindCharactersSprites, null);
        transition(this.characterSprites, null);
        transition(this.cgsSprites, null);
        await this.game.gui.hud.hideHUD();
        this.backgroundSprites.visible = false;
        this.behindCharactersSprites.visible = false;
        this.characterSprites.visible = false;
        this.cgsSprites.visible = false;
    }

    interpret(): void {
        if (this.game.managers.story.currentScene.length === 0 || this.game.control.paused){
           this.interpreting = false;
           this.game.checkPlugins('onEndScene');
           return
        } else {
            const currentAction = this.game.managers.story.currentScene.shift();
            this.interpreting = true;
            // does extra stuff on every step
            // like updating the execution stack
            this.game.onInterpretActions()
            // interpret the action at hand
            this.game.managers.story.interpretAction(currentAction)

        }
    }

    // removes everything from screen immediately
    clearScene(): void {
        this.game.control.execStack.clear();
        this.game.gui.hud.clear('CUT');
        this.game.control.waitForClick = false;
        this.game.managers.character.hideAll('CUT');
        this.game.managers.audio.stopAll()
        this.game.managers.cgs.hideAll('CUT');
        this.game.managers.background.hide(undefined,'CUT');
        this.game.screenEffects.ambient.CLEAR();
        this.currentScene = [];
    }

    async startScene(name: string): Promise<void> {
        await this.game.gui.hud.clear();
        if (this.game.setup.lazyloading){
            // load scene or episode assets (not loaded yet)
            await this.assetLoader?.loadScene(name);
        }
        this.game.control.execStack.replace(name);
        this.currentScene = [...this.game.story[name]];
    }

    getActorType(actor: string): string | null {
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
        if (this.game.managers.cgs.isCGS(actor)){
            this.actorsIndex[actor] = 'cgs';
            return 'cgs';
        }
        return null;
    }

    getManagerByActorType (type: string): RJSSpriteManagerInterface | null {
        switch (type) {
            case 'characters': return this.game.managers.character
            case 'backgrounds': return this.game.managers.background
            case 'cgs': return this.game.managers.cgs
        }
        return null;
    }

    parseAction(actionRaw: {[key: string]: any}): StoryAction | null {
        const keyParams = Object.keys(actionRaw)[0].split(' ');
        const actionType = (keyParams[1] === 'says') ? 'say' : keyParams[0];
        const ActionClass = this.actionFactory[actionType];
        if (ActionClass){
            return new ActionClass(this.game,actionType,actionRaw);
        }
        return null;
    }

    async interpretAction(actionRaw: {[key: string]: any}): Promise<any> {
        // const action = this.parseAction(actionRaw);
        const storyAction = this.parseAction(actionRaw)
        this.game.control.nextAction = null;
        if (!storyAction){
            // nothing to do, unknown action or 'else'
            return this.game.resolveAction();
        }
        if (this.game.config.debugMode){
            console.log('Executing action: '+storyAction.actionType);
            console.log(storyAction);
        }
        await this.game.checkPlugins('onAction',[storyAction]);
        storyAction.execute();
    }
}
