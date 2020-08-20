import _ from 'underscore'
import {game} from "./RenJSBootstrap";
import {RenJS, config} from "./RenJS";

export function StoryManager(){

    this.actorsIndex = {};

    this.setupStory = function() {
        //load backgrounds
        this.backgroundSprites = game.add.group();
        _.each(RenJS.setup.backgrounds,function(filename,background){
            var str = filename.split(" ");
            if (str.length == 1){
                RenJS.bgManager.add(background);
            } else {
                var framerate = str.length == 4 ? parseInt(str[3]) : 16;
                RenJS.bgManager.add(background,true,framerate);
            }

        });
        //load characters
        this.behindCharactersSprites = game.add.group();
        this.characterSprites = game.add.group();
        _.each(RenJS.setup.characters,function(character,name){
            var displayName = character.displayName ? character.displayName : name;
            RenJS.chManager.add(name,displayName,character.speechColour,character.looks);
        });
        this.cgsSprites = game.add.group();
    }

    this.startScene = function(name){
        RenJS.control.execStack = [{c:-1,scene:name}];
        RenJS.logicManager.clearChoices(); //For any interrup still showing
        // RenJS.chManager.hideAll();
        // RenJS.bgManager.hide();
        // RenJS.cgsManager.hideAll();
        // RenJS.audioManager.stop();
        this.currentScene = _.clone(RenJS.story[name]);

    }

    this.getActorType = function(actor){
        // is actor background or character
        if (!actor) {
            return null;
        }
        if (this.actorsIndex[actor]){
            return this.actorsIndex[actor];
        }
        if (RenJS.chManager.isCharacter(actor)){
            this.actorsIndex[actor] = "ch";
            return "ch";
        }
        if (RenJS.bgManager.isBackground(actor)){
            this.actorsIndex[actor] = "bg";
            return "bg";
        }
        if (RenJS.audioManager.isMusic(actor)){
            this.actorsIndex[actor] = "bgm";
            return "bgm";
        }
        if (RenJS.audioManager.isSfx(actor)){
            this.actorsIndex[actor] = "sfx";
            return "sfx";
        }
        this.actorsIndex[actor] = "cgs";
        return "cgs";
    }

    this.interpretAction = function(action){
        var actionParams = {
            withTransition: ["show","hide","play","stop"],
            withPosition: ["show"],
            withContinue: ["show","hide","effect"]
        }
        function getKey(act){
            return _.keys(act)[0];
        }
        return new Promise(function(resolve, reject) {
            RenJS.control.resolve = resolve;
            var key = getKey(action);
            var keyParams = key.split(" ");
            var mainAction,actor;
            if (keyParams[1] == "says") {
                mainAction = "say";
                actor = keyParams[0];
            } else {
                mainAction = keyParams[0];
                actor = keyParams[1];
            }
            var actorType = RenJS.storyManager.getActorType(actor);
            //parse WITH and AT
            var params = action[key];
            if (_.contains(actionParams.withTransition,mainAction)){
                var str = params ? params.split(" ") : [];
                if (str.indexOf("WITH")!=-1){
                    action.transitionName = str[str.indexOf("WITH")+1];
                } else {
                    action.transitionName = config.transitions[actorType];
                }
                action.transition = RenJS.transitions[action.transitionName];
            }
            if (params && _.contains(actionParams.withPosition,mainAction)){
                var str = params ? params.split(" ") : [];
                if (str.indexOf("AT")!=-1){
                    action.position = str[str.indexOf("AT")+1];
                    if (_.has(config.positions,action.position)){
                        action.position = config.positions[action.position];
                    } else {
                        var coords = action.position.split(",");
                        action.position = {x:parseInt(coords[0]),y:parseInt(coords[1])};
                    }
                }
                if (str.length>0 && str[0]!="AT" && str[0]!="WITH"){
                    action.look = str[0];
                }
            }
            var contAfterTrans = false;
            if (params && _.contains(actionParams.withContinue,mainAction)){
                var str = params ? params.split(" ") : [];
                contAfterTrans = str.indexOf("CONTINUE")!=-1
            }
            action.manager = RenJS[actorType+"Manager"];
            RenJS.control.action = mainAction;
            RenJS.control.wholeAction = params;
            RenJS.control.nextAction = null;
            console.log("Doing "+RenJS.control.action);
            switch(RenJS.control.action){
                // Asnyc actions, will resolve after some actions
                case "show" :
                    var transitioning = action.manager.show(actor,action.transition,action);
                    if (!contAfterTrans) return transitioning.then(RenJS.resolve);
                    break;
                case "hide" :
                    if (actor == "CHARS"){
                        return RenJS.chManager.hideAll(action.transition).then(RenJS.resolve);
                    }
                    if (actor == "ALL"){
                        var promises = [RenJS.bgManager.hide(),RenJS.chManager.hideAll(action.transition),RenJS.cgsManager.hideAll()];
                        return Promise.all(promises).then(RenJS.resolve);
                    }
                    var transitioning = action.manager.hide(actor,action.transition);
                    if (!contAfterTrans) return transitioning.then(RenJS.resolve);
                    break;
                case "animate" :
                    var transitioning = RenJS.cgsManager.animate(actor,action,action.time);
                    if (!contAfterTrans) return transitioning.then(RenJS.resolve);
                    break;
                 case "effect" :
                    var transitioning = RenJS.effects[actor](action);
                    if (!contAfterTrans) return transitioning.then(RenJS.resolve);
                    break;
                case "say" :
                    var look = (keyParams.length > 2) ? keyParams[2] : null;
                    return RenJS.textManager.say(actor,look,params).then(RenJS.resolve);
                case "text" :
                    return RenJS.textManager.show(params).then(RenJS.resolve);
                // Wait for user action input, will resolve on its own
                case "wait" :
                    if (params == "click"){
                        RenJS.waitForClick();
                    } else {
                        RenJS.waitTimeout(parseInt(params));
                    }
                    return;
                case "call" :
                    return RenJS.customContent[actor](params);
                case "choice" :
                    RenJS.control.skipping = false;
                    return RenJS.logicManager.showChoices(_.clone(params));
                case "visualchoice" :
                    RenJS.control.skipping = false;
                    return RenJS.logicManager.showVisualChoices(_.clone(params));

                // Synch actions, will resolve after case
                case "interrupt" :
                    RenJS.logicManager.interrupt(actor,_.clone(params));
                    break;
                case "var" :
                    RenJS.logicManager.setVar(actor,params);
                    break;
                case "if" :
                    var condition = key.substr(key.indexOf("("));
                    var branches = {
                        ISTRUE: action[key]
                    };
                    var next = _.first(RenJS.storyManager.currentScene);
                    if (next && getKey(next) == "else"){
                        branches.ISFALSE = next.else;
                        RenJS.storyManager.currentScene.shift();
                    }
                    RenJS.logicManager.branch(condition,branches);
                    break;
                case "else" :
                    break;
                case "play" :
                    // debugger;
                    if (actorType == "bgm"){
                        RenJS.audioManager.play(actor, "bgm", action.looped, action.transitionName);
                    } else {
                        RenJS.audioManager.playSFX(actor);
                    }
                    break;
                case "stop" :
                    RenJS.audioManager.stop("bgm",action.transitionName);
                    break;
                case "ambient" :
                    RenJS.ambient[actor](action.sfx);
                    break;
                case "scene" :
                    RenJS.storyManager.startScene(params);
                    break;

            }
            // Resolve synch actions
            RenJS.resolve();
        });
    }

    this.interpret = function() {
        return new Promise(function(resolve, reject) {
            if (RenJS.storyManager.currentScene.length == 0 || RenJS.control.paused){
                // console.log("Resolving something here");
                resolve();
            } else {
                var action = RenJS.storyManager.currentScene.shift();
                _.each(RenJS.onInterpretActions,function(additionalAction){
                    //does extra stuff on every step
                    //like updating the execution stack
                    //or counting the interruption steps
                    additionalAction(action);
                });
                console.log("About to do");
                console.log(action);
                RenJS.storyManager.interpretAction(action).then(function(){
                    console.log("Done with last action "+_.keys(action)[0]);
                    return RenJS.storyManager.interpret();
                }).then(function(){
                    resolve();
                });
            }
        });
    }

}
