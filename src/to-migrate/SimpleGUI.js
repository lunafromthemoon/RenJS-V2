import _ from 'underscore'
import {config, RenJS} from "./RenJS";
import {game} from "./RenJSBootstrap";
import {globalConfig} from "../dev-only/config";
export function SimpleGUI(meta){
    this.elements = meta ;

    this.getAssets = function(){
        var imgs = Object.entries(this.elements.assets.images).map(([key, asset]) => (
          {key:key, file:asset, type: "image"}
        ));
        var spritesheets = Object.entries(this.elements.assets.spritesheets).map(([key, asset]) => {
            var e = asset.split(" ");
            return {key:key,file:e[0],w:parseInt(e[1]),h:parseInt(e[2]), type: "spritesheet"};
        });
        list = Object.entries(this.elements.assets.audio).map(([key, asset]) => (
          {key:key, file:asset, type: "audio"}
        ));
        return [...imgs,...spritesheets,...audio];
    }

    this.getFonts = function(argument) {
        return this.elements.assets.fonts;
    }

    this.getChoiceTextStyle = function() {
        return this.elements.hud.choice.textStyle;
    }

    // this.getSpriteInfo = function(spriteInfo){
    //     var info = spriteInfo.split(" ");
    //     return {x: parseInt(info[1]), y:parseInt(info[2]), key:info[0]};
    // }

    // this.getBoundingBoxInfo = function(bbInfo){
    //     var info = bbInfo.split(" ");
    //     return {x: parseInt(info[0]), y:parseInt(info[1]), w:parseInt(info[2]), h:parseInt(info[3])};
    // }

    this.init = function(){
        this.initHUD();
        this.initChoices();
        this.menus = {};
        for (const menuName in this.elements.menus){
            this.initMenu(name,this.elements.menus[menuName]);
        }
    }



    this.getTextStyle = function(textStyle){
        return {...config.defaultTextStyle,...textStyle};
    }

    this.initHUD = function(){
        this.hud = {
            group: game.add.group()
        };
        // this.hud.group.alpha = 0;
        this.hud.area = [];
        for (const area of this.elements.hud.area){
            var a = area.split(" ");
            // debugger;
            var x = parseInt(a[0]);
            var y = parseInt(a[1]);
            var w = parseInt(a[2])-x;
            var h = parseInt(a[3])-y;
            this.hud.area.push(new Phaser.Rectangle(x,y,w,h));
        }
        this.hud.group.visible = false;
        var messageBox = this.elements.hud.message;
        this.hud.messageBox = game.add.image(messageBox.position.x,messageBox.position.y,"messageBox",0,this.hud.group);
        var style = this.getTextStyle(messageBox.textStyle);

        this.hud.messageBox.visible = false;

        this.hud.text = game.add.text(messageBox.textPosition.x,messageBox.textPosition.y, "", style,this.hud.group);
        this.hud.messageBox.addChild(this.hud.text);

        if (this.elements.hud.name){
            var name = this.elements.hud.name;
            this.hud.nameBox = game.add.image(name.position.x,name.position.y,"nameBox",0,this.hud.group);
            this.hud.messageBox.addChild(this.hud.nameBox);
            var nameStyle = this.getTextStyle(name.textStyle);
            this.hud.name = game.add.text(0,0, "", nameStyle,this.hud.group);
            if (name.textBounds){
                this.hud.name.setTextBounds(name.textBounds.x, name.textBounds.y, name.textBounds.w, name.textBounds.h);
            } else {
                this.hud.name.setTextBounds(0,0, this.hud.nameBox.width, this.hud.nameBox.height);
            }
            this.hud.nameBox.addChild(this.hud.name);
        }
        if (this.elements.hud.ctc) {
            var ctc = this.elements.hud.ctc;
            this.hud.ctc = game.add.sprite(ctc.position.x,ctc.position.y,"ctc");
            this.hud.ctc.animated = ctc.animated;
            if (this.hud.ctc.animated){
                this.hud.ctc.animations.add('click');

            }
            this.hud.messageBox.addChild(this.hud.ctc);
        }
        this.HUDButtons = this.initButtons(this.elements.hud.buttons,this.hud.group);
    }

    this.initButtons = function(buttonsMeta,group){
        var buttons = {};
        for (const action in buttonsMeta){
            var btn = buttonsMeta[action];
            if (!btn.frames){
                btn.frames = [0,1,0,1];
            }
            buttons[action] = game.add.button(btn.position.x,btn.position.y,btn.sprite,this.buttonActions[action],
              this,btn.frames[0],btn.frames[1],btn.frames[2],btn.frames[3],group);
        }
        return buttons;
    }

    this.initMenu = function(name,menu){
        this.menus[name] = {
            group: game.add.group()
        };
        // this.menus[name].group.alpha = 0;
        this.menus[name].group.visible = false;

        this.menus[name].background = game.add.image(0,0,name+"Background",0,this.menus[name].group);
        if (menu.music && !config.settings.muted){
            this.menus[name].music = game.add.audio(menu.music);
            this.menus[name].music.onDecoded.add(function(){
                this.menus[name].music.ready = true;
            }, this);
        }
        this.menus[name].buttons = this.initButtons(menu.buttons,this.menus[name].group);
        this.initSliders(menu.sliders,this.menus[name].group);

    }

    this.initSliders = function(slidersMeta,group){
        for (const prop in slidersMeta) {
            var slider = slidersMeta[prop]
            var sliderFull = game.add.image(slider.position.x,slider.position.y,slider.sprite,0,group);
            var sliderMask = game.add.graphics(slider.position.x,slider.position.y,group);
            sliderMask.beginFill(0xffffff);

            var currentVal = config.settings[prop];
            var limits = config.limits[prop];
            var maskWidth = sliderFull.width*(currentVal-limits[0])/(limits[1]-limits[0]);
            sliderMask.drawRect(0,0,maskWidth,sliderFull.height);
            sliderFull.mask = sliderMask;
            sliderFull.inputEnabled=true;
            sliderFull.limits = limits;
            sliderFull.prop = prop;
            sliderFull.events.onInputDown.add(function(sprite,pointer){
                var val = (pointer.x-sprite.x);
                sprite.mask.width = val;
                var newVal = (val/sprite.width)*(sprite.limits[1] - sprite.limits[0])+sprite.limits[0];
                this.sliderValueChanged[sprite.prop](newVal);
            }, this);
        }
    }



    this.sliderValueChanged = {
        textSpeed: function(newVal){
            config.settings.textSpeed = newVal;
        },
        autoSpeed: function(newVal){
            config.settings.autoSpeed = newVal;
        },
        bgmv: function(newVal){
            config.settings.bgmv = newVal;
            RenJS.audioManager.changeVolume("bgm",newVal);
        },
        sfxv: function(newVal){
            config.settings.sfxv = newVal;
        },
    }
    //menu actions
    this.buttonActions = {
        start: function(){
            RenJS.gui.hideMenu();
            RenJS.gui.showHUD();
            RenJS.start();
        },
        load: function(config){
            RenJS.gui.hideMenu();
            RenJS.load(0);
        },
        auto: RenJS.auto,
        skip: RenJS.skip,
        save: function (config) {
            RenJS.save(0);
        },
        settings: function(){
            // RenJS.onTap();
            RenJS.pause();
            // RenJS.resolve();
            RenJS.gui.showMenu("settings");
        },
        return: function(){
            RenJS.gui.hideMenu();
            RenJS.unpause();
        },
        mute: function (argument) {
            RenJS.audioManager.mute();
        }

    }

    //show menu
    this.showMenu = function(menu){
        RenJS.pause();
        this.previousMenu = this.currentMenu;
        this.currentMenu = menu;
        this.menus[menu].group.visible = true;
        game.add.tween(this.menus[menu].group).to( {alpha:1}, 750,null,true);
        if (this.menus[menu].music){
            var music = this.menus[menu].music;
            if (music.ready){
                music.fadeIn(1000);
            } else {
               setTimeout(function() {
                 music.fadeIn(1000);
               }, 1000);
            }

        }
    };

    //hide menu
    this.hideMenu = function(menu){
        var menu = this.currentMenu;
        // console.log("hiding "+menu);
        var tween = game.add.tween(this.menus[menu].group).to( {alpha:0}, 400);
        tween.onComplete.add(function(){
            this.menus[menu].group.visible = false;
            this.currentMenu = null;
            if (this.previousMenu){
                this.showMenu(this.previousMenu);
            }
        },this);
        if (this.menus[menu].music && this.menus[menu].music.ready){
            this.menus[menu].music.fadeOut(400);
        }
        tween.start();

    }

    this.initChoices = function(type){
        this.hud.choices = {
            group: game.add.group(),
            map: {},
            textStyles:{
                choice:this.getTextStyle(this.elements.hud.choice.textStyle),
                interrupt:this.getTextStyle(this.elements.hud.interrupt.textStyle)
            },
        };
    }

    //choice and interrupt buttons
    this.showChoices = function(choices,execId){
        this.hideChoices();
        var position = this.elements.hud.choice.position;
        if (!position){
            position = {x:game.world.centerX};
            position.y = game.world.centerY - (choices.length*this.elements.hud.choice.separation)/2;
            position.anchor = {x:0.5,y:0};
        }
        choices.forEach((choice,index) => {
            var y = position.y + this.elements.hud.choice.separation*index;
            var key = "choice";
            var frames = [0,1,0,1];
            var textStyle = this.hud.choices.textStyles.choice;

            if (choice.interrupt){
                key = "interrupt";
                textStyle = this.hud.choices.textStyles.interrupt;
                if (choice.remainingSteps==1){
                    frames = [2,3,2,3];
                }
            }
            var chBox = game.add.button(position.x, y, key, function(){
                RenJS.gui.hideChoices();
                RenJS.logicManager.choose(index,choice.choiceText,execId);
            }, RenJS.logicManager, frames[0],frames[1],frames[2],frames[3],this.hud.choices.group);
            if (position.anchor){
                chBox.anchor.set(position.anchor.x,position.anchor.y);
            }

            var chText = game.add.text(0,0, choice.choiceText, textStyle);
            var textPosition = this.elements.hud.choice.textPosition;
            if (!textPosition){
                textPosition = !position.anchor ? [0,0] : [-chBox.width*position.anchor.x,-chBox.height*position.anchor.y];
            }
            chText.setTextBounds(textPosition[0],textPosition[1], chBox.width, chBox.height);
            chBox.addChild(chText);
            chBox.execId = execId;
            if (globalConfig.logChoices && RenJS.logicManager.choicesLog[execId].indexOf(choice.choiceText) != -1){
                //TODO: Change your box however you want to!
                chBox.tint = 0xAA8282;
            }
            this.hud.choices.map[choice.choiceId]=chBox;
        },this);
    }

    this.changeToLastInterrupt = function(choiceId){
        if (this.hud.choices.map[choiceId]){
            this.hud.choices.map[choiceId].setFrames(2,3,2,3);
        }
    }

    this.hideChoice = function(choiceId){
        if (this.hud.choices.map[choiceId]){
            this.hud.choices.group.remove(this.hud.choices.map[choiceId]);
            delete this.hud.choices.map[choiceId];
        }
    }

    this.hideChoices = function(){
        this.hud.choices.map = {};
        this.hud.choices.group.removeAll(true);
    }

    this.clear = function(){
        //clears choices and text
        this.hideChoices();
        this.hideText();
    }

    this.showHUD = function(){
        this.hud.group.visible = true;
    }

    this.hideHUD = function(){
        this.hud.group.visible = false;
    }

    //dialogue and text
    this.showText = function(text,title,colour,callback){
        // console.log("Showing");
        if  (title && this.hud.nameBox) {
            this.hud.name.clearColors();
            this.hud.name.addColor(colour,0);
            this.hud.name.text = title;
            this.hud.nameBox.visible = true;
        } else {
            this.hud.nameBox.visible = false;
        }
        if (RenJS.control.skipping || config.settings.textSpeed < 10){
            this.hud.text.text = text;
            this.hud.messageBox.visible = true;
            RenJS.gui.showCTC();
            callback();
            return;
        }
        var textObj = this.hud.text;
        textObj.text = "";
        var words = text.split("");
        var count = 0;
        this.textLoop = setInterval(function(){

            textObj.text += (words[count]);
            count++;
            if (count >= words.length){
                clearTimeout(RenJS.gui.textLoop);
                // debugger;
                RenJS.gui.showCTC();
                callback();
            }
        }, config.settings.textSpeed);
        // this.hud.group.visible = true;
        this.hud.messageBox.visible = true;
        if (!RenJS.control.auto){
            RenJS.waitForClick(function(){
                clearTimeout(RenJS.gui.textLoop);
                textObj.text = text;
                RenJS.gui.showCTC();
                callback();
            });
        }

    }

    this.hideText = function(){
        this.hud.messageBox.visible = false;
        this.hideCTC();
    }

    this.hideCTC = function(){
        if (this.hud.ctc){
            this.hud.ctc.visible = false;
            if (this.hud.ctc.animated){
                this.hud.ctc.animations.stop();
            } else {
                if (this.hud.ctc.tween){
                    this.hud.ctc.tween.stop();
                }
            }
        }
    }

    this.showCTC = function(){
        var ctc = RenJS.gui.hud.ctc;
        ctc.visible = true;
        if (ctc.animated) {
            ctc.animations.play('click', 15, true);
        } else {
            ctc.alpha = 0;
            ctc.tween = game.add.tween(ctc).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None,true,0,-1);
        }
    }

    this.ignoreTap = function(pointer){
        // Tap should be ignored if the player clicked on a hud button.
        var inside = RenJS.gui.hud.area.find(area => area.contains(pointer.x,pointer.y));
        return inside != null && inside != undefined;
    }
}
