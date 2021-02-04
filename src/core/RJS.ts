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
export default class RJS extends Game {

    gameStarted = false
    control: RJSControl
    xShots = []
    blackOverlay: Graphics
    setup: any
    story: object
    guiSetup: any
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

        // this.state.add('loader', Loader)
        // this.state.start('loader')
        this.state.add('bootstrap', Boot)
        if (this.config.i18n){
            this.state.add('chooseLang', LanguageChooser);
            this.state.start('chooseLang')
        } else {
            this.state.start('bootstrap')
        }
    }

    setupScreen(): void {
        if (!(this.config.scaleMode === Phaser.ScaleManager.EXACT_FIT)){
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
        }
        this.scale.scaleMode = Phaser.ScaleManager[this.config.scaleMode];
        this.scale.refresh();
    }

    async initStory () {
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
        this.managers.story.setupStory()
        await this.gui.init();

        this.initInput();
        
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
        // preload the fonts by adding text, else they wont be fully loaded :\
        for (const font of this.gui.fonts){
            this.add.text(20, -100, font, {font: '42px ' + font});
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

    endGame(): void {
        this.setBlackOverlay();
        this.managers.story.clearScene();
        this.gameStarted = false;
        this.control.paused = true;
        for (const plugin in this.pluginsRJS) {
            if (this.pluginsRJS[plugin].teardown){
                this.pluginsRJS[plugin].teardown();
            }
        }
        this.removeBlackOverlay();
        this.gui.showMenu('main');
    }

    async start () {
        this.setBlackOverlay();
        this.control.paused = false;
        this.managers.story.clearScene();
        await this.managers.story.startScene('start');
        for (const plugin in this.pluginsRJS) {
            if (this.pluginsRJS[plugin].onStart){
                this.pluginsRJS[plugin].onStart();
            }
        }
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

    mute(): void {
        this.managers.audio.mute();
    }

    save (slot?): void {
        if (!this.gameStarted){
            return;
        }
        if (!slot){
            slot = 0;
        }
        for (const plugin in this.pluginsRJS) {
            if (this.pluginsRJS[plugin].onSave){
                 this.pluginsRJS[plugin].onSave();
            }
        }
        const data = {
            background: this.managers.background.current.name,
            characters: this.managers.character.showing,
            audio: this.managers.audio.getActive(),
            cgs: this.managers.cgs.current,
            ambients: this.screenEffects.ambient.current,
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
        this.managers.story.clearScene();
        this.managers.background.set(dataParsed.background);
        await this.managers.character.set(dataParsed.characters);
        this.managers.audio.set(dataParsed.audio);
        await this.managers.cgs.set(dataParsed.cgs);
        this.managers.logic.set(dataParsed.vars);
        this.screenEffects.ambient.set(dataParsed.ambients);
        this.gui.clear();
        // resolve stack
        this.control.execStack = new ExecStack(dataParsed.stack);
        this.managers.story.currentScene = this.control.execStack.getActions(this.story);
        
        for (const plugin in this.pluginsRJS) {
            if (this.pluginsRJS[plugin].onLoad){
                this.pluginsRJS[plugin].onLoad();
            }
        }
        this.gameStarted = true;
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
