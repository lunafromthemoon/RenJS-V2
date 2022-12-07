import 'pixi'
import 'p2'
import Phaser, {Game, Graphics} from 'phaser-ce';
import RJSControl from './RJSControl';
import ExecStack from './ExecStack';
import BackgroundManager from '../managers/BackgroundManager';
import CharacterManager from '../managers/CharacterManager';
import Accessibility, { AccessibilityConfig } from '../gui/a11y/Accessibility';
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
import PACKAGE from '../../package.json';

const version = PACKAGE.version;


export default class RJS extends Game {

    gameStarted = false
    control: RJSControl
    xShots = []
    blackOverlay: Graphics
    setup: any
    story: {[key: string]: any}
    guiSetup: any
    gui: RJSGUI
    tools: any = {}
    screenReady = false;

    pluginsRJS: any = {}

    addPlugin(name: string, cls: any): void {
        this.pluginsRJS[name] = new cls(name,this)
    }

    get renjsversion(): string{
        return version
    }

    config: RJSGameConfig
    userPreferences: UserPreferences
    storyConfig: StoryConfig
    storyAccessibility?: AccessibilityConfig;
    accessibility: Accessibility;

    storyLog: any[] = []

    interruptAction: any = null

    managers: {
        background: BackgroundManager;
        character: CharacterManager;
        audio: AudioManager;
        cgs: CGSManager;
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

    propertyRanges: {
        textSpeed: number[];
        autoSpeed: number[];
        bgmv: number[];
        sfxv: number[];
    } = {
        textSpeed: [10,100],
        autoSpeed: [50,300],
        bgmv: [0,1],
        sfxv: [0,1]
    };

    constructor(config: RJSGameConfig) {
        super(config.w,config.h,config.renderer, config.parent)
        this.control = new RJSControl();
        this.config = config;
        this.accessibility = new Accessibility(this);
        // this.userPreferences = new UserPreferences(this);
    }

    launch (): void {
        this.preserveDrawingBuffer = true;
        this.state.add('bootstrap', Boot)
        if (this.config.i18n){
            // try to load previously chosen Language
            const lang = localStorage.getItem('RenJS_I18N' + this.config.name);
            if (this.config.i18n.langs[lang]){
                this.config.i18n.current = lang;
                this.state.start('bootstrap');
            } else {
                this.state.add('chooseLang', LanguageChooser);
                this.state.start('chooseLang');
            }
        } else {
            this.state.start('bootstrap')
        }
    }

    setupScreen(): void {
        if (this.screenReady) return;
        this.scale.scaleMode = this.config.scaleMode;
        if (!(this.config.scaleMode === Phaser.ScaleManager.EXACT_FIT)){
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
        }

        if (this.config.scaleMode === undefined){
            this.scale.setResizeCallback((scale,parentBounds)=>{
                this.config.userScale(scale,parentBounds);
            },this)
        }

        this.scale.refresh();
        this.screenReady = true;
    }

    phaserUpdateHandler(): void {
        this.checkPlugins('onUpdateLoop');
    }

    async initStory(): Promise<any> {
        this.stage.backgroundColor = this.storyConfig.backgroundColor || 0;
        this.userPreferences = new UserPreferences(this,this.storyConfig.userPreferences);

        this.managers = {
            tween: new TweenManager(this),
            story: new StoryManager(this),
            audio: new AudioManager(this),
            logic: new LogicManager(this),
            text: new TextManager(this),
            background: new BackgroundManager(this),
            character: new CharacterManager(this), // need transition
            cgs: new CGSManager(this) // need transition
        }

        this.screenEffects = {
            ambient: new Ambient(this), // need audio
            effects: new Effects(this), // need audio et tween
            transition: new Transition(this) // need tween
        }
        this.managers.character.transition = this.screenEffects.transition;
        this.managers.cgs.transition = this.screenEffects.transition;


        // init game and start main menu
        await this.gui.init();

        this.initInput();

        await this.checkPlugins('onInit');

        if (!this.setup.lazyloading){
            // decode audio for all game
            if (!this.setup.music) this.setup.music = {};
            if (!this.setup.sfx) this.setup.sfx = {};
            const audioList = Object.keys(this.setup.music).concat(Object.keys(this.setup.sfx));
            await this.managers.audio.decodeAudio(audioList);
        }  else {
            if (this.setup.lazyloading.backgroundLoading){
                this.managers.story.assetLoader.loadEpisodeInBackground(0);
            }
        }

    }

    async checkPlugins(signal: string,params?: any[]): Promise<any>{
        for (const plugin in this.pluginsRJS) {
            if (this.pluginsRJS[plugin][signal]){
                await this.pluginsRJS[plugin][signal](...params);
            }
        }
    }

    pause(): void {
        this.control.paused = true;
        this.control.skipping = false;
        this.control.auto = false;
        this.takeXShot();
    }

    takeXShot(): void {
        if (!this.xShots) this.xShots = [];
        this.xShots.push(this.canvas.toDataURL('image/jpeg'));
    }

    async unpause(): Promise<any>{
        this.control.paused = false;
        // await this.gui.hud.show();
        if (!this.control.waitForClick && this.managers.logic.currentChoices.length === 0){
            this.resolveAction();
        }
    }

    async endGame(): Promise<any> {
        await this.managers.story.hide();
        this.managers.story.clearScene();
        this.gameStarted = false;
        this.pause();
        await this.checkPlugins('onTeardown');
        this.gui.changeMenu('main');
    }

    async start(initialVars = {}): Promise<any> {
        await this.managers.story.hide();
        this.control.paused = false;
        this.managers.story.clearScene();
        // on start game, clear the vars o initialize for a new game +
        this.managers.logic.vars = initialVars;
        await this.managers.story.startScene('start');
        await this.checkPlugins('onStart');
        await this.managers.story.show();
        this.gameStarted = true;
        this.managers.story.interpret();
    }

    skip (): void {
        if (this.control.skipping){
            this.control.skipping = false;
            return;
        }
        this.control.skipping = true;
        if (this.control.waitForClick){
            this.control.waitForClick = false;
            this.control.nextAction();
        }
    }

    auto (): void {
        if (this.control.auto){
            this.control.auto = false;
            return;
        }
        this.control.auto = true;
        if (this.control.waitForClick){
            this.control.waitForClick = false;
            this.control.nextAction();
        }
    }

    async save (slot?): Promise<any> {
        if (!this.gameStarted){
            return;
        }
        if (!slot){
            slot = 0;
        }
        const bg = this.managers.background.current;
        const data = {
            background: bg ? bg.name : null,
            characters: this.managers.character.showing,
            audio: this.managers.audio.getActive(),
            cgs: this.managers.cgs.current,
            ambients: this.screenEffects.ambient.current,
            stack: this.control.execStack.shallowCopy(),
            vars: this.managers.logic.vars,
            storyLog: this.storyLog
            // should include any interrupts showing
        }

        await this.checkPlugins('onSave',[slot,data]);
        const dataSerialized = JSON.stringify(data);
        localStorage.setItem('RenJSDATA' + this.config.name + slot,dataSerialized);

        if (this.xShots && this.xShots.length) {
            const thumbnail = this.xShots[this.xShots.length-1];
            this.gui.getCurrent().addThumbnail(thumbnail, slot)
            localStorage.setItem('RenJSThumbnail' + this.config.name + slot,thumbnail);
        }
        if (this.config.debugMode){
            console.log('Saved data in slot '+slot);
            console.log(data);
        }
    }

    getSlotThumbnail(slot): string {
        return localStorage.getItem('RenJSThumbnail' + this.config.name + slot)
    }

    async loadSlot(slot): Promise<void> {
        if (!slot){
            slot = 0;
        }
        const data = localStorage.getItem('RenJSDATA' + this.config.name + slot);
        const dataParsed = data ? JSON.parse(data) : {};
        await this.checkPlugins('onLoad',[slot,dataParsed]);
        if (Object.keys(dataParsed).length === 0){
            this.start();
            return;
        }
        await this.managers.story.hide();
        this.managers.story.clearScene();
        this.managers.background.set(dataParsed.background);
        this.managers.character.set(dataParsed.characters);
        this.managers.audio.set(dataParsed.audio);
        this.managers.cgs.set(dataParsed.cgs);
        this.managers.logic.set(dataParsed.vars);
        this.screenEffects.ambient.set(dataParsed.ambients);
        await this.gui.hud.clear();
        // resolve stack
        this.control.execStack = new ExecStack(dataParsed.stack);
        this.storyLog = dataParsed.storyLog;
        this.managers.story.currentScene = this.control.execStack.getActions(this.story);
        await this.checkPlugins('onLoaded');
        this.gameStarted = true;
        await this.managers.story.show();
        if (this.config.debugMode){
            console.log('Loaded data from slot '+slot);
            console.log(dataParsed);
        }
        this.unpause();
    }

    waitForClick(callback?): void {
        this.control.nextAction = callback ? callback : this.resolveAction;
        if (this.control.skipping || this.control.auto){
            let timeout = this.control.skipping ? this.storyConfig.skiptime : this.storyConfig.autotime;
            if (this.control.auto){
                // max autospeed == 300
                timeout = 350 - this.userPreferences.get('autoSpeed');
            }
            setTimeout(this.control.nextAction.bind(this), timeout);
        } else {
            if (this.config.debugMode){
                console.log('Waiting for click');
            }
            this.control.waitForClick = true;
        }
    }

    async asyncWait(time: number): Promise<any> {
        return new Promise(resolve=>{
            const stop = ()=>{
                resolve(true)
            }
            if (time>0){
                this.waitTimeout(time, stop)
            } else {
                this.waitForClick(stop)
            }
        })
    }

    waitTimeout(time, callback?): void {
        this.control.nextAction = callback ? callback : this.resolveAction;
        if (this.control.skipping){
            this.control.nextAction.call(this);
        } else {
            setTimeout(this.control.nextAction.bind(this),time ? time : this.storyConfig.timeout);
        }
    }

    waitForClickOrTimeout(time,callback): void {
        this.control.nextAction = callback;
        this.control.waitForClick = true;
        setTimeout(((): void => {
                this.control.waitForClick = false;
                this.control.nextAction();
            }).bind(this),time ? time : this.storyConfig.timeout);
    }

    // controls the game flow when an action requires the player to 'click to continue'
    onTap(pointer): void {
        if (this.control.paused){
            return;
        }
        // if skipping or autoplaying, the tap will only unset these settings
        if (this.control.skipping || this.control.auto){
            this.gui.hud.unsetSkipButtons();
            this.control.skipping = false;
            this.control.auto = false;
            return;
        }
        // ignore the tap when clicking on a HUD button or other special areas
        if (pointer && this.gui.hud.ignoreTap(pointer)){
            return;
        }
        // continue with next action and lock the click for some miliseconds
        if (this.control.waitForClick && !this.control.clickLocked){
            if (this.config.debugMode){
                console.log('Clicked, continue with next action.');
            }
            this.control.waitForClick = false;
            this.lockClick();
            this.control.nextAction();
        }

    }

    initInput(): void {
        // adds the control input
        this.input.onTap.add(this.onTap, this);
        // add keyboard binding
        //  Stop the following keys from propagating up to the browser
        this.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);
        // spacebar == ontap, continue with the game
        this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.onTap, this);
    }

    lockClick(): void {
        this.control.clickLocked = true;
        setTimeout(() => {
            this.control.clickLocked = false
        }, this.control.clickCooldown);
    }

    resolveAction = (): void => {
        this.control.waitForClick = false;
        if (this.config.debugMode){
            console.log('Resolving action.');
        }
        if (!this.control.paused){
            this.managers.story.interpret()
        }

    }

    onInterpretActions(): void {
        // called before interpreting action
        // update stack
        this.control.actionsCounter++;
        this.control.execStack.advance();
    }

}
