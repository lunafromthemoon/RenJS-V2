import 'pixi'
import 'p2'
import Phaser, {Game, Graphics} from 'phaser-ce';
import RJSControl from './RJSControl';
import ExecStack from './ExecStack';
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
import RJSGUI from '../gui/RJSGUI';
import {RJSGameConfig,StoryConfig} from './RJSGameConfig';
import UserPreferences from './UserPreferences';
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

    pluginsRJS: any = {}

    addPlugin(name: string, cls: any): void {
        this.pluginsRJS[name] = new cls(name,this)
    }

    config: RJSGameConfig
    userPreferences: UserPreferences 
    storyConfig: StoryConfig

    interruptAction: any = null

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
        super(config.w,config.h,config.renderer)
        this.control = new RJSControl();
        this.config = config;
        this.userPreferences = new UserPreferences(this);
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
        this.xShots.push(this.canvas.toDataURL("image/jpeg"));
    }

    unpause (force?): void{
        this.control.paused = false;
        this.gui.showHUD();
        if (!this.control.waitForClick){
            this.resolveAction();
        }
    }

    setBlackOverlay (): void {
        this.blackOverlay = this.add.graphics(0, 0);
        this.managers.story.cgsSprites.addChild(this.blackOverlay);
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
            tween.to({ alpha: 0 }, this.storyConfig.fadetime * 2, Phaser.Easing.Linear.None, true);
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
        this.control.skipping = true;
        if (this.control.waitForClick){
            this.control.waitForClick = false;
            this.control.nextAction();
        }
    }

    auto (): void {
        this.control.auto = true;
        if (this.control.waitForClick){
            this.control.waitForClick = false;
            this.control.nextAction();
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
            stack: this.control.execStack.shallowCopy(),
            vars: this.managers.logic.vars
            // should include any interrupts showing
        }
        const dataSerialized = JSON.stringify(data);
        
        localStorage.setItem('RenJSDATA' + this.config.name + slot,dataSerialized);


        if (this.gui.addThumbnail && this.xShots && this.xShots.length) {
            const thumbnail = this.xShots[this.xShots.length-1];
            this.gui.addThumbnail(thumbnail, slot)
            localStorage.setItem('RenJSThumbnail' + this.config.name + slot,thumbnail);
        }

    }

    getSlotThumbnail (slot): string {
        return localStorage.getItem('RenJSThumbnail' + this.config.name + slot)
    }

    async loadSlot (slot): Promise<void> {
        if (!slot){
            slot = 0;
        }
        const data = localStorage.getItem('RenJSDATA' + this.config.name + slot);
        if (!data){
            this.start();
            return;
        }
        const dataParsed = JSON.parse(data);

        this.setBlackOverlay();
        this.gameStarted = true;
        this.managers.background.set(dataParsed.background);
        await this.managers.character.set(dataParsed.characters);
        this.managers.audio.set(dataParsed.audio);
        await this.managers.cgs.set(dataParsed.cgs);
        this.managers.logic.set(dataParsed.vars);
        this.gui.clear();
        // resolve stack
        this.control.execStack = new ExecStack(dataParsed.stack);
        this.managers.story.currentScene = this.control.execStack.getActions(this.story);
        this.removeBlackOverlay();
        this.unpause(true);
    }

    waitForClick (callback?): void {
        this.control.nextAction = callback ? callback : this.resolveAction;
        if (this.control.skipping || this.control.auto){
            let timeout = this.control.skipping ? this.storyConfig.skiptime : this.storyConfig.autotime;
            if (this.control.auto && this.userPreferences.autoSpeed){
                // max autospeed == 300
                timeout = 350 - this.userPreferences.autoSpeed;
            }
            setTimeout(this.control.nextAction.bind(this), timeout);
        } else {
            this.control.waitForClick = true;
        }
    }

    waitTimeout (time, callback?): void {
        this.control.nextAction = callback ? callback : this.resolveAction;
        if (this.control.skipping){
            this.control.nextAction.call(this);
        } else {
            setTimeout(this.control.nextAction.bind(this),time ? time : this.storyConfig.timeout);
        }
    }

    waitForClickOrTimeout (time,callback): void {
        this.control.nextAction = callback;
        this.control.waitForClick = true;
        setTimeout((() => {
                this.control.waitForClick = false;
                this.control.nextAction();
            }).bind(this),time ? time : this.storyConfig.timeout);
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

    resolveAction(): void {
        this.control.waitForClick = false;
        if (!this.control.paused){
            this.managers.story.interpret()
        }

    }

    onInterpretActions(): void {
        // called before interpreting action
        // update stack
        this.control.actionsCounter++;
        this.control.execStack.advance();
        // update interrupts
        this.managers.logic.updateInterruptions();
    }

}
