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
import {RJSGUI} from './gui/RJSGUI';

class RJS {

    game: RJSGame
    gameStarted = false
    control: RJSControl
    xShots = []
    blackOverlay: Graphics
    setup: any
    story: object
    gui: RJSGUI

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

    constructor(game: RJSGame) {
        this.game = game
    }

    pause () {
        this.control.paused = true;
        this.control.skipping = false;
        this.control.auto = false;

        this.takeXShot();
        this.gui.hideHUD();
    }

    takeXShot (argument?) {
        if (!this.xShots) this.xShots = [];
        this.xShots.push(this.game.canvas.toDataURL());
    }

    unpause (force?){
        this.control.paused = false;
        this.gui.showHUD();

        if (!this.control.resolve || force){
            this.managers.story.interpret();
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

        this.managers.story.startScene("start");

        this.removeBlackOverlay();
        this.gameStarted = true;

        this.managers.story.interpret();
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
        if (this.gui.addThumbnail && this.xShots && this.xShots.length) {
            const thumbnail = this.xShots[this.xShots.length-1];
            this.gui.addThumbnail(thumbnail,slot)
            localStorage.setItem('RenJSThumbnail' + this.game.config.name + slot,thumbnail);
        }

    }

    getSlotThumbnail (slot) {
        return localStorage.getItem("RenJSThumbnail" + this.game.defaultValues.name + slot)
    }

    load (slot){
        if (!slot){
            slot = 0;
        }
        let data = localStorage.getItem("RenJSDATA" + this.game.defaultValues.name + slot);
        if (!data){
            this.start();
            return;
        }
        data = JSON.parse(data);
        this.setBlackOverlay();
        // RenJS.transitions.FADETOCOLOUROVERLAY(0x000000);
        this.managers.background.set(data.background);
        this.managers.character.set(data.characters);
        this.managers.audio.set(data.audio);
        this.managers.cgs.set(data.cgs);
        this.managers.logic.logicManager.set(data.vars);
        this.gui.clear();
        var stack = data.stack[data.stack.length-1];
        var scene = stack.scene;
        var allActions = [...RenJS.story[scene]];
        var actions = allActions.slice(stack.c);
        if(data.stack.length != 1){
            for (var i = data.stack.length-2;i>=0;i--){
                var nestedAction = allActions[stack.c];
                stack = data.stack[i];
                switch(stack.action){
                    case "interrupt":
                        nestedAction = allActions[data.stack[i+1].interrupting];
                        allActions = nestedAction.interrupt[stack.index][stack.op];
                        break;
                    case "choice":
                        allActions = nestedAction.choice[stack.index][stack.op];
                        break;
                    case "if":
                        var action = Object.keys(nestedAction)[0];
                        allActions = nestedAction[action];

                }
                var newActions = allActions.slice(stack.c+1);;
                actions = newActions.concat(actions);
            }
        }
        this.control.execStack = data.stack;
        this.managers.story.currentScene = actions;
        this.removeBlackOverlay();
        RenJS.unpause(true);
    }

}

export default RJS
