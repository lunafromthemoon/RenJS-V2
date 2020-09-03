import 'pixi'
import 'p2'
import Phaser, {Game, Graphics} from 'phaser-ce';
import RJSControl from './RJSControl';
import BackgroundManager from '../managers/BackgroundManager';
import CharacterManager from '../managers/CharacterManager';
import AudioManager from '../managers/AudioManager';
import CGSManager from '../managers/CGSManager';
import TextManager from '../managers/TextManager';
import TweenManager from '../managers/TweenManager';
import LogicManager from '../managers/LogicManager';
import StoryManager from '../managers/StoryManager';
import Ambient from '../screen-effects/Ambient';
import Effects from '../screen-effects/Effects';
import Transition from '../screen-effects/Transition';
import {RJSGUI} from '../gui/RJSGUI';
import {RJSGameConfig} from './RJSGameConfig';
import {defaults, DefaultsInterface} from './Defaults';
import Boot from '../states/Boot';
import LanguageChooser from '../states/LanguageChooser';
import Loader from '../states/Loader';

export default class RJS extends Game {

    gameStarted = false
    control: RJSControl
    xShots = []
    blackOverlay: Graphics
    setup: any
    story: object
    gui: RJSGUI

    config: RJSGameConfig
    defaultValues: DefaultsInterface

    managers: {
        background?: BackgroundManager;
        character?: CharacterManager;
        audio: AudioManager;
        cgs?: CGSManager;
        text: TextManager;
        tween: TweenManager;
        logic: LogicManager;
        story: StoryManager;
    }

    screenEffects: {
        ambient: Ambient;
        effects: Effects;
        transition: Transition;
    }

    constructor(config: RJSGameConfig) {
        super()
        this.defaultValues = {...defaults}
        this.control = new RJSControl(this.defaultValues)
        this.config = config
        // this.initModulesInOrder()
    }

    launch (): void {
        this.preserveDrawingBuffer = true;
        this.state.add('loader', Loader)
        this.state.start('loader')
        this.state.add('bootstrap', Boot)
        if (this.config.i18n){
            this.state.add('chooseLang', LanguageChooser);
        }
    }

    pause (): void {
        this.control.paused = true;
        this.control.skipping = false;
        this.control.auto = false;

        this.takeXShot();
        this.gui.hideHUD();
    }

    takeXShot (): void {
        if (!this.xShots) this.xShots = [];
        this.xShots.push(this.canvas.toDataURL());
    }

    unpause (force?): void{
        this.control.paused = false;
        this.gui.showHUD();

        if (!this.control.resolve || force){
            this.managers.story.interpret();
        } else if (force) {
            this.control.resolve();
        }
    }

    setBlackOverlay (): void {
        this.blackOverlay = this.add.graphics(0, 0);
        this.blackOverlay.beginFill(0x000000, 1);
        this.blackOverlay.drawRect(0, 0, this.config.w, this.config.h);
        this.blackOverlay.endFill();
    }

    removeBlackOverlay (): void {
        if (this.blackOverlay){
            const tween = this.add.tween(this.blackOverlay);
            tween.onComplete.addOnce(() => {
                this.blackOverlay.destroy();
                this.blackOverlay = null;
            });
            tween.to({ alpha: 0 }, this.control.fadetime * 2, Phaser.Easing.Linear.None, true);
        }
    }

    start (): void {
        this.setBlackOverlay();
        this.control.paused = false;

        this.managers.story.startScene('start');

        this.removeBlackOverlay();
        this.gameStarted = true;

        this.managers.story.interpret();
    }

    skip (): void {
        this.defaultValues.skiptime = 50;
        this.control.skipping = true;
        if (this.control.waitForClick){
            this.control.waitForClick = false;
            this.control.nextAction();
        }
    }

    auto (): void {
        this.defaultValues.skiptime = 1000;
        this.control.auto = true;
        if (this.control.waitForClick){
            this.control.nextAction()
        }
    }

    save (slot?): void {
        if (!this.gameStarted){
            return;
        }
        if (!slot){
            slot = 0;
        }
        const data = {
            background: this.managers.background.current.name,
            characters: this.managers.character.showing,
            audio: this.managers.audio.current,
            cgs: this.managers.cgs.current,
            stack: this.control.execStack,
            vars: this.managers.logic.vars
        }

        // if (RenJS.customContent.save){
        //     RenJS.customContent.save(data);
        // }

        const dataSerialized = JSON.stringify(data);
        // Save choices log
        const log = JSON.stringify(this.managers.logic.choicesLog);

        localStorage.setItem('RenJSChoiceLog' + this.config.name,log);
        localStorage.setItem('RenJSDATA' + this.config.name + slot,dataSerialized);


        if (this.gui.addThumbnail && this.xShots && this.xShots.length) {
            const thumbnail = this.xShots[this.xShots.length-1];
            this.gui.addThumbnail(thumbnail, slot)
            localStorage.setItem('RenJSThumbnail' + this.config.name + slot,thumbnail);
        }

    }

    getSlotThumbnail (slot): string {
        return localStorage.getItem('RenJSThumbnail' + this.defaultValues.name + slot)
    }

    async loadSlot (slot): Promise<void> {
        if (!slot){
            slot = 0;
        }
        const data = localStorage.getItem('RenJSDATA' + this.defaultValues.name + slot);
        if (!data){
            this.start();
            return;
        }
        const dataParsed = JSON.parse(data);
        this.setBlackOverlay();
        // RenJS.transitions.FADETOCOLOUROVERLAY(0x000000);
        this.managers.background.set(dataParsed.background);
        await this.managers.character.set(dataParsed.characters);
        this.managers.audio.set(dataParsed.audio);
        await this.managers.cgs.set(dataParsed.cgs);
        this.managers.logic.set(dataParsed.vars);
        this.gui.clear();
        let stack = dataParsed.stack[dataParsed.stack.length-1];
        const scene = stack.scene;
        let allActions = [...this.story[scene]];
        let actions = allActions.slice(stack.c);
        if(dataParsed.stack.length !== 1){
            for (let i = dataParsed.stack.length-2;i>=0;i--){
                let nestedAction = allActions[stack.c];
                stack = dataParsed.stack[i];
                switch(stack.action){
                    case 'interrupt':
                        nestedAction = allActions[dataParsed.stack[i+1].interrupting];
                        allActions = nestedAction.interrupt[stack.index][stack.op];
                        break;
                    case 'choice':
                        allActions = nestedAction.choice[stack.index][stack.op];
                        break;
                    case 'if':
                        const action = Object.keys(nestedAction)[0];
                        allActions = nestedAction[action];

                }
                const newActions = allActions.slice(stack.c+1);
                actions = newActions.concat(actions);
            }
        }
        this.control.execStack = dataParsed.stack;
        this.managers.story.currentScene = actions;
        this.removeBlackOverlay();
        this.unpause(true);
    }

    waitForClick (callback?): void {
        this.control.nextAction = callback ? callback : this.resolve;
        if (this.control.skipping || this.control.auto){
            setTimeout(() => {
                this.control.nextAction();
            }, this.defaultValues.skiptime);
        } else {
            this.control.waitForClick = true;
        }
    }

    waitTimeout (time, callback?): void {
        this.control.nextAction = callback ? callback : this.resolve;
        if (this.control.skipping){
            this.control.nextAction();
        } else {
            setTimeout( () => {
                this.control.nextAction();
            },time ? time : this.defaultValues.timeout);
        }
    }

    waitForClickOrTimeout (time,callback): void {
        this.control.nextAction = callback;
        this.control.waitForClick = true;
        setTimeout(() => {
            this.control.waitForClick = false;
            this.control.nextAction();
        },time ? time : this.defaultValues.timeout);
    }

    onTap (pointer, doubleTap?): void {

        if (this.control.paused){
            return;
        }
        if (pointer && this.gui.ignoreTap(pointer)){
            return;
        }

        if (this.control.waitForClick && !this.control.clickLocked){
            this.control.waitForClick = false;
            this.lockClick();
            this.control.nextAction();
        }
        if (this.control.skipping || this.control.auto){
            this.control.skipping = false;
            this.control.auto = false;
        }
    }

    initInput(): void {
        // adds the control input
        this.input.onTap.add(this.onTap, this);
    }

    lockClick(): void {
        this.control.clickLocked = true;
        setTimeout(() => {
            this.control.clickLocked = false
        }, this.control.clickCooldown);
    }

    resolve(): void {
        if (this.control.resolve != null){
            if (this.control.doBeforeResolve != null){
                this.control.doBeforeResolve();
                this.control.doBeforeResolve = null;
            }
            // debugger;
            this.control.waitForClick = false;
            const resolve = this.control.resolve;
            this.control.resolve = null;
            resolve();
        }
    }

    onInterpretActions = {
        updateStack(): void {
            this.control.execStack[0].c++;
            this.control.globalCounter++;
            if (this.control.execStack[0].c === this.control.execStack[0].total){
                this.control.execStack.shift();

            }
        },
        interruptAction: null
    }

    // initScreenEffects (): void {
    //
    //
    // }
    //
    // initManagers (): void {
    //
    //
    //
    // }

    // initModulesInOrder (): void {
    //     this.managers = {
    //         tween: new TweenManager(this),
    //         story: new StoryManager(this),
    //         audio: new AudioManager(this),
    //         logic: new LogicManager(this),
    //         text: new TextManager(this),
    //         background: null, // need transition
    //         character: null, // need transition
    //         cgs: null // need transition story tween
    //     }
    //
    //     this.screenEffects = {
    //         ambient: new Ambient(this), // need audio et story
    //         effects: new Effects(this), // need audio et tween
    //         transition: new Transition(this) // need tween
    //     }
    //     this.managers.background = new BackgroundManager(this)
    //     this.managers.character = new CharacterManager(this)
    //
    //     this.managers.cgs = new CGSManager(this)
    //
    // }
}
