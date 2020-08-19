import RJSControl from './RJSControl';
import {Graphics} from 'phaser-ce';
import RJSGame from './RJSGame';
import BackgroundManager from './managers/BackgroundManager';
import CharacterManager from './managers/CharacterManager';
import AudioManager from './managers/AudioManager';
import CGSManager from './managers/CGSManager';
import TextManager from './managers/TextManager';
import TweenManager from './managers/TweenManager';
import LogicManager from './managers/LogicManager';
import StoryManager from './managers/StoryManager';
import Ambient from './screen-effects/Ambient';
import Effects from './screen-effects/Effects';
import Transition from './screen-effects/Transition';

class RJS {
    game: RJSGame
    constructor(game: RJSGame) {
        this.game = game
    }
    gameStarted = false
    control: RJSControl
    xShots = []
    blackOverlay: Graphics

    managers: {
        background: BackgroundManager
        character: CharacterManager
        audio: AudioManager
        cgs: CGSManager
        text: TextManager
        tween: TweenManager
        logic: LogicManager
        story: StoryManager
    }

    screenEffects: {
        ambient: Ambient
        effects: Effects,
        transition: Transition
    }

    pause () {
        this.control.paused = true;
        this.control.skipping = false;
        this.control.auto = false;

        this.takeXShot();
        // @todo implement gui
        // this.gui.hideHUD();
    }

    takeXShot (argument?) {
        if (!this.xShots) this.xShots = [];
        this.xShots.push(this.game.canvas.toDataURL());
    }

    unpause (force?){
        this.control.paused = false;
        // @todo implement gui
        // this.gui.showHUD();

        if (!this.control.resolve || force){
            // @todo implement storyManager
            // this.storyManager.interpret();
        } else if (force) {
            this.control.resolve();
        }
    }

    setBlackOverlay (){
        this.blackOverlay = this.game.add.graphics(0, 0);
        this.blackOverlay.beginFill(0x000000, 1);
        this.blackOverlay.drawRect(0, 0, this.game.config.w, this.game.config.h);
        this.blackOverlay.endFill();
    }

    removeBlackOverlay (){
        if (this.blackOverlay){
            const tween = this.game.add.tween(this.blackOverlay);
            tween.onComplete.addOnce(() => {
                this.blackOverlay.destroy();
                this.blackOverlay = null;
            });
            tween.to({ alpha: 0 }, this.control.fadetime * 2, Phaser.Easing.Linear.None, true);
        }
    }

    start (){
        this.setBlackOverlay();
        this.control.paused = false;

        // @todo implement storyManager
        // this.storyManager.startScene("start");

        this.removeBlackOverlay();
        this.gameStarted = true;

        // @todo implement storyManager
        // this.storyManager.interpret();
    }

    skip (){
        this.game.defaultValues.skiptime = 50;
        this.control.skipping = true;
        if (this.control.waitForClick){
            this.control.waitForClick = false;
            this.control.nextAction();
        }
    }

    auto (){
        this.game.defaultValues.skiptime = 1000;
        this.control.auto = true;
        if (this.control.waitForClick){
            this.control.nextAction()
        }
    }

    save (slot?) {
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

        localStorage.setItem('RenJSChoiceLog' + this.game.config.name,log);
        localStorage.setItem('RenJSDATA' + this.game.config.name + slot,dataSerialized);
        // @todo implement gui
        // if (this.gui.addThumbnail && this.xShots && this.xShots.length){
        //     const thumbnail = this.xShots[this.xShots.length-1];
        //     this.gui.addThumbnail(thumbnail,slot)
        //     localStorage.setItem('RenJSThumbnail' + this.game.config.name + slot,thumbnail);
        // }

    }

}

export default RJS
