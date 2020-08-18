import {RenJS, config} from "./RenJS";
import {game} from "./RenJSBootstrap";
import {globalConfig} from "../dev-only/config";
export function RenJSBuilderMadeGUI(meta){
    this.gui = meta;

    // public methods

    this.getAssets = function(){
        function toAssetList(list,type,path){
            return Object.keys(list).map(key => {
                return {
                    key:key,
                    file:path+list[key].fileName,
                    type:type,
                    w:list[key].w,
                    h:list[key].h}
            });
        }
        var imgs = toAssetList(this.gui.assets.images,"image",this.gui.assetsPath);
        var audio = toAssetList(this.gui.assets.audio,"audio",this.gui.assetsPath);
        var sprts = toAssetList(this.gui.assets.spritesheets,"spritesheet",this.gui.assetsPath);
        return imgs.concat(audio).concat(sprts);
    }

    this.getFonts = function() {
        return Object.keys(this.gui.assets.fonts);
    }

    this.init = function() {
        this.initHUD(this.gui.config.hud);
        this.menus = {};
        this.initMenu('main',this.gui.config.main)
        this.initMenu('settings',this.gui.config.settings)
        this.initMenu('saveload',this.gui.config.saveload)
    }

        //show menu
    this.showMenu = function(menu){
        RenJS.pause();
        this.previousMenu = this.currentMenu;
        this.currentMenu = menu;
        this.menus[menu].alpha = 0;
        this.menus[menu].visible = true;
        game.add.tween(this.menus[menu]).to( {alpha:1}, 750,null,true);
        if (this.gui.config[menu].backgroundMusic && !this.gui.config[menu].backgroundMusic.isPlaying && !config.settings.muted){
            this.currentMusic = this.gui.config[menu].backgroundMusic;
            this.currentMusic.fadeIn(1000);
        }
    };

    this.changeMenu = function(menu) {
        var previous = this.currentMenu;
        if (previous){
            if (menu) {
                // hide previous menu and show this
                this.hideMenu(previous,this.gui.config[menu].backgroundMusic,function() {
                    // console.log('here')
                    this.showMenu(menu);
                    this.previousMenu = previous;
                }.bind(this));
                return
            } else {
                // just hide menu
                this.hideMenu(previous,true);
            }
        }
        if (menu){
            this.showMenu(menu);
        }
    };

    this.currentMusic = null;

    //hide menu
    this.hideMenu = function(menu,mute,callback){
        if (!menu){
            menu = this.currentMenu;
        }
        var tween = game.add.tween(this.menus[menu]).to( {alpha:0}, 400);
        tween.onComplete.add(function(){
            this.menus[menu].visible = false;
            this.currentMenu = null;
            if (callback){
                callback()
            }
            // if (this.previousMenu){
            //     this.showMenu(this.previousMenu);
            // }
        },this);
        console.log('hiding')
        console.log(menu)
        console.log(mute)
        // console.log(this.gui.config[menu])
        if (mute && this.currentMusic){
            this.currentMusic.fadeOut(400);
        }
        tween.start();
    }

    this.ignoreTap = function(pointer){
        // Tap should be ignored if the player clicked on a hud button.
        return this.skipClickArea.find(area => area.contains(pointer.x,pointer.y)) != undefined;
    }

    this.showChoices = function(choices,execId){
        this.choices.removeAll(true);

        var choiceConfig = this.gui.config.hud.choice;
        var interruptConfig = this.gui.config.hud.choice;

        if (interruptConfig && !interruptConfig.inlineWithChoice){
            // separate choices from interrupts
        }

        var x = (choiceConfig.isBoxCentered) ? this.gui.resolution[0]/2 - choiceConfig.width/2 : choiceConfig.x;
        var y = (choiceConfig.isBoxCentered) ? this.gui.resolution[1]/2 - (choiceConfig.height*choices.length + parseInt(choiceConfig.separation)*(choices.length-1))/2 : choiceConfig.y;

        choices.forEach((choice,index) => {
            var choiceType = choice.interrupt ? interruptConfig : choiceConfig;
            this.createChoiceBox(choice,[x,y],index,choiceType,execId)
        },this);
    }

    this.createChoiceBox = function(choice, pos,index,choiceConfig,execId) {
      var separation = index*(parseInt(choiceConfig.height)+parseInt(choiceConfig.separation));
      var chBox = game.add.button(pos[0], pos[1]+separation, choiceConfig.id,function(){
          if (choiceConfig.sfx && choiceConfig.sfx != 'none') {
            var sfx = game.add.audio(choiceConfig.sfx);
            sfx.onStop.addOnce(sfx.destroy);
            sfx.play();
          }
          this.choices.removeAll(true);
          RenJS.logicManager.choose(index,choice.choiceText,execId);
        },this,1,0,2,0,this.choices);
      if (chBox.animations.frameTotal == 2 || chBox.animations.frameTotal == 4){
        chBox.setFrames(1,0,1,0)
      }
      if (choice.interrupt && choice.remainingSteps==1 && chBox.animations.frameTotal > 3){
        if (chBox.animations.frameTotal == 4){
            chBox.setFrames(3,2,3,2);
        } else {
            chBox.setFrames(4,3,5,3);
        }
      }
      chBox.choiceId = choice.choiceId;
      chBox.name = choice.choiceId;
      var textStyle = {font: choiceConfig.size+'px '+choiceConfig.font, fill: choiceConfig.color};
      var text = game.add.text(0,0, choice.choiceText, textStyle);
      setTextPosition(chBox,text, choiceConfig);
      if (globalConfig.logChoices && RenJS.logicManager.choicesLog[execId].indexOf(choice.choiceText) != -1){
        function colorToSigned24Bit(s) {
            return (parseInt(s.substr(1), 16) << 8) / 256;
        }
        chBox.tint = colorToSigned24Bit(this.gui.config.hud.choice['chosen-color']);
      }
      return chBox;
    }

    this.changeToLastInterrupt = function(choiceId){
        var choice = this.choices.getByName(choiceId);
        if (choice.animations.frameTotal == 4){
            choice.setFrames(3,2,3,2);
        } else {
            choice.setFrames(4,3,5,3);
        }
    }

    this.hideChoice = function(choiceId){
        var choice = this.choices.getByName(choiceId);
        if (choice){
            this.choices.remove(choice,true);
        }
    }

    this.hideChoices = function(){
        this.choices.removeAll();
    }

    this.clear = function(){
        //clears choices and text
        this.hideChoices();
        this.hideText();
    }

    this.showHUD = function(){
        this.hud.visible = true;
    }

    this.hideHUD = function(){
        this.hud.visible = false;
    }

    //dialogue and text
    this.showText = function(text,title,colour,callback){
        if  (title && this.nameBox) {
            this.nameBox.text.text = title;
            this.nameBox.text.fill = colour;
            this.nameBox.visible = true;
        } else {
            this.nameBox.visible = false;
        }
        if (RenJS.control.skipping || config.settings.textSpeed < 10){
            this.messageBox.message.text = text;
            this.messageBox.visible = true;
            this.ctc.visible = true;
            callback();
            return;
        }
        var textObj = this.messageBox.message;
        textObj.text = "";
        var words = text.split("");
        var count = 0;
        function completeText(){
            clearTimeout(RenJS.gui.textLoop);
            textObj.text = text;
            RenJS.gui.ctc.visible = true;
            callback();
        }

        this.textLoop = setInterval(function(){
            textObj.text += (words[count]);
            count++;
            if (count >= words.length){
                completeText();
            }
        }, config.settings.textSpeed);
        this.messageBox.visible = true;
        if (!RenJS.control.auto){
            RenJS.waitForClick(completeText);
        }
    }

    this.getChoiceTextStyle = function() {
        var choiceConfig = this.gui.config.hud.choice;
        return {font: choiceConfig.size+'px '+choiceConfig.font, fill: choiceConfig.color};
    }

    this.hideText = function(){
        this.messageBox.visible = false;
    }

    // private methods

    this.initHUD = function(hudConfig) {
        this.hud = game.add.group();
        this.hud.visible = false;
        // click on this area will be ignored
        this.skipClickArea = [];
        if (hudConfig.buttons){
            hudConfig.buttons.forEach(btn => {
                var w = parseInt(btn.width)
                var h = parseInt(btn.height)
                this.skipClickArea.push(new Phaser.Rectangle(btn.x,btn.y,w,h))
            },this);
        }
        if (hudConfig['message-box']){
            var mBox = hudConfig['message-box'];
            this.messageBox = game.add.sprite(mBox.x,mBox.y,mBox.id,0,this.hud);
            this.messageBox.visible = false;
            var textStyle = {font: mBox.size+'px '+mBox.font, fill: mBox.color};
            var text = game.add.text(mBox['offset-x'],mBox['offset-y'], "", textStyle);
            text.wordWrap = true;
            text.align = mBox.align;
            text.wordWrapWidth = mBox['text-width'];
            this.messageBox.message = text;
            this.messageBox.addChild(text);
        }
        if (hudConfig['name-box']){
            var x = hudConfig['name-box'].x - mBox.x;
            var y = hudConfig['name-box'].y - mBox.y;
            this.nameBox = game.add.sprite(x,y,hudConfig['name-box'].id,0,this.hud);
            // this.nameBox.visible = false;
            var textStyle = {font: hudConfig['name-box'].size+'px '+hudConfig['name-box'].font, fill: hudConfig['name-box'].color}
            var text = game.add.text(0,0, "", textStyle);
            setTextPosition(this.nameBox,text, hudConfig['name-box'])
            this.messageBox.addChild(this.nameBox)
        }
        if (hudConfig.ctc) {
            var x = hudConfig['ctc'].x - mBox.x;
            var y = hudConfig['ctc'].y - mBox.y;
            this.ctc = game.add.sprite(x,y,hudConfig.ctc.id);
            // this.ctc.visible = false;
            if (hudConfig.ctc.animationStyle == 'spritesheet'){
              this.ctc.animations.add('do').play(true)
            } else {
              this.ctc.alpha = 0;
              this.ctc.tween = game.add.tween(this.ctc).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None,true,0,-1);
            }
            this.messageBox.addChild(this.ctc)
        }
        if (hudConfig.choice){
            this.choices = game.add.group();
        }
        if (hudConfig.interrupt && !hudConfig.interrupt.inlineWithChoice){
            this.interrupts = game.add.group();
        }

        this.loadGeneralComponents(hudConfig,this.hud)
    }

    function setTextPosition(sprite,text, component) {
      if (component.isTextCentered) {
          text.setTextBounds(0,0, sprite.width, sprite.height);
          text.boundsAlignH = 'center';
          text.boundsAlignV = 'middle';
        } else {
          var offsetX = parseInt(component['offset-x']);
          var offsetY = parseInt(component['offset-y']);
          text.setTextBounds(offsetX,offsetY, sprite.width, sprite.height);
          text.boundsAlignH = component.align;
          text.boundsAlignV = 'top'
        }
        sprite.addChild(text);
        sprite.text = text;
    }

    this.loadGeneralComponents = function(menuConfig,menu) {
        var components = ['images','animations','labels','save-slots','buttons','sliders'];
        components.forEach(component => {
            if (component in menuConfig) {
                for (var i = menuConfig[component].length - 1; i >= 0; i--) {
                  this.loadComponent(component,menuConfig[component][i],menu)
                }
            }
        },this);
    }

    this.initMenu = function(name,menuConfig) {
        if (!menuConfig) return;
        this.menus[name] = game.add.group();
        this.menus[name].visible = false;
        // load bg
        if (menuConfig.background){
            game.add.image(0,0,menuConfig.background.id,0,this.menus[name]);
        }
        this.loadGeneralComponents(menuConfig,this.menus[name]);
        if (menuConfig.backgroundMusic){
            menuConfig.backgroundMusic = game.add.audio(menuConfig.backgroundMusic);
        };
    }

    this.loadButton = function(component,menu) {
        var btn = game.add.button(component.x,component.y,component.id,function(){
          console.log('click on button')
          if (component.sfx && component.sfx != 'none') {
            var sfx = game.add.audio(component.sfx);
            sfx.onStop.addOnce(sfx.destroy);
            sfx.play()
          }
          this.buttonsAction[component.binding](component)
        },this,1,0,2,0,menu);
        btn.component = component;
        if (btn.animations.frameTotal == 2){
          btn.setFrames(1,0,1,0)
        }
    }

    this.loadSlider = function(component,menu) {
        var sliderFull = game.add.image(component.x,component.y,component.id,0,menu);
        if (sliderFull.animations.frameTotal == 2){
          sliderFull = game.add.image(component.x,component.y,component.id,0,menu);
          sliderFull.frame = 1;
        }
        var sliderMask = game.add.graphics(component.x,component.y,menu);
        sliderMask.beginFill(0xffffff);
        var currentVal = config.settings[component.binding];
        var limits = config.limits[component.binding];
        var maskWidth = sliderFull.width*(currentVal-limits[0])/(limits[1]-limits[0]);
        sliderMask.drawRect(0,0,maskWidth,sliderFull.height);
        sliderFull.mask = sliderMask;
        sliderFull.inputEnabled=true;
        sliderFull.limits = limits;
        sliderFull.binding = component.binding;
        sliderFull.events.onInputDown.add(function(sprite,pointer){
            var val = (pointer.x-sprite.x);
            sprite.mask.width = val;
            var newVal = (val/sprite.width)*(sprite.limits[1] - sprite.limits[0])+sprite.limits[0];
            this.sliderValueChanged[sprite.binding](newVal);
        }, this);
    }

    this.addThumbnail = function(thumbnail,slot) {
       if (this.saveSlots[slot]){
        this.loadThumbnail(thumbnail,this.saveSlots[slot])
       }
    }

    this.loadSaveSlot = function(component,menu) {
        if (!this.saveSlots){
            this.saveSlots = {};
        }
        var sprite = game.add.sprite(component.x,component.y,component.id,0,menu);
        sprite.config = component;
        var thumbnail = RenJS.getSlotThumbnail(component.slot);
        if (thumbnail) {
            this.loadThumbnail(thumbnail,sprite);
        }
        this.saveSlots[component.slot] = sprite;
    }

    this.loadThumbnail = function(thumbnail,parent) {
        var id = 'thumbnail'+Math.floor(Math.random() * 5000);
        game.load.image(id, thumbnail);
        game.load.onLoadComplete.addOnce(function() {
            var thmbSprite = game.add.sprite(parent.config['thumbnail-x'],parent.config['thumbnail-y'],id);
            thmbSprite.width = parent.config['thumbnail-width']
            thmbSprite.height = parent.config['thumbnail-height']
            parent.addChild(thmbSprite);
        }, this);
        game.load.start();
    }

    this.loadComponent = function(type,component,menu) {
        switch (type) {
          case 'images' :
            game.add.image(component.x,component.y,component.id,0,menu);
          break;
          case 'animations' :
            var spr = game.add.sprite(component.x,component.y,component.id,0,menu);
            spr.animations.add('do').play(true)
          break;
          case 'buttons' :  this.loadButton(component,menu); break;
          case 'labels' :
            var color = component.color ? component.color : "#ffffff"
            game.add.text(component.x, component.y, component.text, {font: component.size+'px '+component.font, fill: color},menu);
          break;
          case 'sliders' : this.loadSlider(component,menu); break;
          case 'save-slots' : this.loadSaveSlot(component,menu); break;
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

    this.buttonsAction = {
        start: function(){
            RenJS.gui.changeMenu(null);
            RenJS.gui.showHUD();
            RenJS.start();
        },
        load: function(component){
            RenJS.gui.changeMenu(null);
            RenJS.gui.showHUD();
            console.log(component.slot)
            RenJS.load(parseInt(component.slot));
        },

        auto: RenJS.auto,
        skip: RenJS.skip,
        save: function (component) {
            RenJS.save(parseInt(component.slot));
        },
        saveload: function(argument) {
            RenJS.pause();
            RenJS.gui.changeMenu("saveload");
        },
        settings: function(){
            // RenJS.onTap();
            RenJS.pause();
            // RenJS.resolve();
            RenJS.gui.changeMenu("settings");
        },
        return: function(){
            var prev = RenJS.gui.previousMenu;
            RenJS.gui.changeMenu(prev);
            if (!prev) {
                RenJS.unpause();
            }
        },
        mute: function (argument) {
            RenJS.audioManager.mute();
        }
    }


}
