
var RenJS = {

    gameStarted: false,

    pause: function(){
        RenJS.control.paused = true;
        RenJS.control.skipping = false;
        RenJS.control.auto = false;
        RenJS.takeXShot();
        RenJS.gui.hideHUD();
    },

    unpause: function(force){
        RenJS.control.paused = false;
        RenJS.gui.showHUD();
        if (!RenJS.control.resolve || force){            
            RenJS.storyManager.interpret();
        } else if (force) {
            RenJS.control.resolve();
        }
    },

    setBlackOverlay: function(){
        this.blackOverlay = game.add.graphics(0, 0);
        this.blackOverlay.beginFill(0x000000, 1);
        this.blackOverlay.drawRect(0, 0, globalConfig.w, globalConfig.h);
        this.blackOverlay.endFill();
    },

    removeBlackOverlay: function(){
        if (this.blackOverlay){
            var tween = game.add.tween(this.blackOverlay);
            tween.onComplete.addOnce(function(){            
                this.blackOverlay.destroy();
                this.blackOverlay = null;
            }, this);  
            tween.to({ alpha: 0 }, RenJS.control.fadetime*2, Phaser.Easing.Linear.None, true);
        }
    },

    start: function(){
        this.setBlackOverlay();
        RenJS.control.paused = false;
        RenJS.storyManager.startScene("start");
        this.removeBlackOverlay();
        RenJS.gameStarted = true;
        RenJS.storyManager.interpret();
    },

    skip: function(){
        config.skiptime = 50;
        RenJS.control.skipping = true;
        console.log("skipping");
        if (RenJS.control.waitForClick){
            RenJS.control.waitForClick = false;  
            RenJS.control.nextAction();
        }
    },

    auto: function(){
        config.skiptime = 1000;
        RenJS.control.auto = true;
        console.log("autoplaying");
        if (RenJS.control.waitForClick){
            RenJS.control.nextAction()
        }
        // RenJS.resolve();
    },

    takeXShot: function(argument) {
        if (!this.xShots) this.xShots = [];
        this.xShots.push(game.canvas.toDataURL());
    },

    save: function(slot) {
        if (!RenJS.gameStarted){
            return;
        }
        if (!slot){
            slot = 0;
        }
        var data = {
            background: RenJS.bgManager.current.name,
            characters: RenJS.chManager.showing,
            audio: RenJS.audioManager.current,
            cgs: RenJS.cgsManager.current,
            stack: RenJS.control.execStack,
            vars: RenJS.logicManager.vars
        }
        
        if (RenJS.customContent.save){
            RenJS.customContent.save(data);
        }
        var data = JSON.stringify(data);
        // Save choices log
        var log = JSON.stringify(RenJS.logicManager.choicesLog);
        localStorage.setItem("RenJSChoiceLog"+globalConfig.name,log);
        localStorage.setItem("RenJSDATA"+globalConfig.name+slot,data);
        if (RenJS.gui.addThumbnail && RenJS.xShots && RenJS.xShots.length){
            var thumbnail = RenJS.xShots[RenJS.xShots.length-1];
            RenJS.gui.addThumbnail(thumbnail,slot)
            localStorage.setItem("RenJSThumbnail"+globalConfig.name+slot,thumbnail);
        }
        
    },

    getSlotThumbnail: function(slot) {
        return localStorage.getItem("RenJSThumbnail"+globalConfig.name+slot)
    },

    load: function(slot){
        if (!slot){
            slot = 0;
        }
        var data = localStorage.getItem("RenJSDATA"+globalConfig.name+slot);
        if (!data){
            this.start();    
            return;
        } 
        data = JSON.parse(data);
        this.setBlackOverlay();
        // RenJS.transitions.FADETOCOLOUROVERLAY(0x000000);
        RenJS.bgManager.set(data.background);
        RenJS.chManager.set(data.characters);
        RenJS.audioManager.set(data.audio);
        RenJS.cgsManager.set(data.cgs);
        RenJS.logicManager.set(data.vars);
        RenJS.gui.clear();
        var stack = _.last(data.stack);
        var scene = stack.scene;
        var allActions = _.clone(RenJS.story[scene]);
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
                        var action = _.keys(nestedAction)[0];
                        allActions = nestedAction[action];

                }
                var newActions = allActions.slice(stack.c+1);;
                actions = newActions.concat(actions);
            }            
        }
        RenJS.control.execStack = data.stack;
        RenJS.storyManager.currentScene = actions;
        this.removeBlackOverlay();
        RenJS.unpause(true);
    },

    waitForClick: function(callback){
        RenJS.control.nextAction = callback ? callback : RenJS.resolve;
        if (RenJS.control.skipping || RenJS.control.auto){
            var act = RenJS.control.wholeAction;
            setTimeout(function(){
                console.log("skipping action "+RenJS.control.action);
                console.log(act);
                RenJS.control.nextAction();
            },config.skiptime);
        } else {
            RenJS.control.waitForClick = true;
        }
    },

    waitTimeout: function(time,callback){
        RenJS.control.nextAction = callback ? callback : RenJS.resolve;
        if (RenJS.control.skipping){
            RenJS.control.nextAction();
        } else {
            setTimeout(function(){
                RenJS.control.nextAction();
            },time ? time : config.timeout);
        }        
    },

    waitForClickOrTimeout: function(time,callback){        
        RenJS.control.nextAction = callback;
        RenJS.control.waitForClick = true;
        setTimeout(function(){
            RenJS.control.waitForClick = false;
            RenJS.control.nextAction();
        },time ? time : config.timeout);        
    },

    onTap: function(pointer,doubleTap){
        console.log("tapped");
        if (RenJS.control.paused){
            return;
        }
        if (pointer && RenJS.gui.ignoreTap(pointer)){
            return;
        }
        console.log("click not ignored");
        if (RenJS.control.waitForClick && !RenJS.control.clickLocked){
            RenJS.control.waitForClick = false;  
            RenJS.lockClick();
            RenJS.control.nextAction();
        }
        if (RenJS.control.skipping || RenJS.control.auto){
            RenJS.control.skipping = false;
            RenJS.control.auto = false;
        }
    },

    initInput: function () {
        // adds the control input
        game.input.onTap.add(this.onTap, this);
    },

    lockClick: function(){
        RenJS.control.clickLocked = true;
        setTimeout(function() {
            RenJS.control.clickLocked = false
        }, RenJS.control.clickCooldown);                                              
    },

    resolve: function(){
        if (RenJS.control.resolve != null){
            if (RenJS.control.doBeforeResolve != null){
                RenJS.control.doBeforeResolve();
                RenJS.control.doBeforeResolve = null;
            }
            // debugger;
            RenJS.control.waitForClick = false; 
            var resolve = RenJS.control.resolve;
            RenJS.control.resolve = null;     
            console.log("Resolving "+RenJS.control.action);
            resolve();
        }
    }
};

var config = _.clone(defaults);

//control variables
RenJS.control = {
    execStack:[{c:-1}],
    globalCounter: 0,
    paused: false,
    fadetime : config.fadetime,
    timeout : config.timeout,
    waitForClick : false,
    resolve : null,
    clickLocked: false,
    nextAction: null,
    doBeforeResolve: null,
    skipping: false,
    auto: false,
    clickCooldown: config.clickCooldown, 
}

RenJS.onInterpretActions = {
    updateStack: function(){
        RenJS.control.execStack[0].c++;
        RenJS.control.globalCounter++;
        // console.log("Stack is");
        // console.log(RenJS.control.execStack[0]);
        if (RenJS.control.execStack[0].c == RenJS.control.execStack[0].total){
            RenJS.control.execStack.shift();
            // console.log("Stack is");
            // console.log(RenJS.control.execStack[0]);
        }
    }
}
//init managers

RenJS.bgManager = new BackgroundManager();
RenJS.chManager = new CharactersManager();
RenJS.audioManager = new AudioManager();
RenJS.cgsManager = new CGSManager();
RenJS.textManager = new TextManager();
RenJS.tweenManager = new TweenManager();
RenJS.logicManager = new LogicManager();
RenJS.storyManager = new StoryManager();

