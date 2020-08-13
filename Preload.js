var preload = {

  init: createLoadingPage,
  // function () {
  //   //TODO: LOAD RENJS OWN SPLASH SCREEN
  //   this.splash = game.add.sprite(game.world.centerX, game.world.centerY, 'splash');
  //   this.splash.anchor.set(0.5);
  //   if (globalConfig.splash.loadingBar) {
  //       var position = globalConfig.splash.loadingBar.position;
  //       this.loadingBar = game.add.sprite(position.x,position.y , "loading");
  //       if (this.loadingBar.animations.frameTotal > 1){
  //           // load second frame as full bar
  //           this.loadingBar = game.add.sprite(position.x,position.y , "loading",1);
  //       }
  //   }
  // },

  preload: function () {
    this.load.setPreloadSprite(this.loadingBar);
    //load external libraries
    game.load.script('esprima',  'libs/esprima.js');
    game.load.script('yaml',  'libs/js-yaml.min.js');
    game.load.script('underscore',  'libs/underscore-min.js');
    //load RenJS
    game.load.script('Defaults',  'RenJS/Defaults.js');
    game.load.script('RenJSBuilderMadeGUI',  'RenJS/RenJSBuilderMadeGUI.js');
    game.load.script('SimpleGUI',  'RenJS/SimpleGUI.js');
    game.load.script('AudioManager',  'RenJS/AudioManager.js');
    game.load.script('BackgroundManager',  'RenJS/BackgroundManager.js');
    game.load.script('CGSManager',  'RenJS/CGSManager.js');
    game.load.script('CharactersManager',  'RenJS/CharactersManager.js');
    game.load.script('LogicManager',  'RenJS/LogicManager.js');
    game.load.script('TextManager',  'RenJS/TextManager.js');
    game.load.script('TweenManager',  'RenJS/TweenManager.js');
    game.load.script('StoryManager',  'RenJS/StoryManager.js');
    game.load.script('RenJS',  'RenJS/RenJS.js');
    game.load.script('Effects',  'RenJS/Effects.js');
    game.load.script('Ambient',  'RenJS/Ambient.js');
    game.load.script('Transitions',  'RenJS/Transitions.js');
    game.load.script('CustomContent',  'RenJS/CustomContent.js');
    //load Story Files
    loadStyle(preparePath(globalConfig.fonts));
    game.load.text("guiConfig", preparePath(globalConfig.guiConfig));
    game.load.text("storySetup", preparePath(globalConfig.storySetup));
    for (var i = globalConfig.storyText.length - 1; i >= 0; i--) {
      game.load.text("story"+i, preparePath(globalConfig.storyText[i]));
    };
  },

  create: function () {
    //load the setup
    RenJS.setup = jsyaml.load(game.cache.getText("storySetup"));
    //load the story text
    var story = {};
    _.each(globalConfig.storyText,function (file,index) {
        var text = jsyaml.load(game.cache.getText("story"+index));
        story = _.extend(story,text);
    });
    RenJS.story = story;  
    //load and create the GUI
    var gui = jsyaml.load(game.cache.getText("guiConfig"));
    console.log(gui)
    if (gui.madeWithRenJSBuilder){
        RenJS.gui = new RenJSBuilderMadeGUI(gui);
    } else {
        RenJS.gui = new SimpleGUI(gui);
    }
    
    //preload the fonts by adding text, else they wont be fully loaded :\
    _.each(RenJS.gui.getFonts(),function(font){
        // console.log("loading" + font)
        game.add.text(20, 20, font, {font: '42px '+font});
    });
    //start preloading story
    game.state.add('preloadStory', preloadStory);
    game.state.start('preloadStory');
  }
}

var preloadStory = {
  init: createLoadingPage,
  // function () {
  //   this.splash = game.add.sprite(game.world.centerX, game.world.centerY, 'splash');
  //   this.splash.anchor.set(0.5);
  //   if (globalConfig.splash.loadingBar) {
  //       var position = globalConfig.splash.loadingBar.position;
  //       this.loadingBar = game.add.sprite(position.x,position.y , "loading");
  //   }
  // },

  preload: function () {
    this.load.setPreloadSprite(this.loadingBar);
    //preload gui
    _.each(RenJS.gui.getAssets(),function(asset){
        if (asset.type == "spritesheet"){
            game.load.spritesheet(asset.key, preparePath(asset.file), asset.w, asset.h);
        } else {
            game.load[asset.type](asset.key, preparePath(asset.file));
        }
    });

    //preload backgrounds
    _.each(RenJS.setup.backgrounds,function(filename,background){
        var str = filename.split(" ");
        if (str.length == 1){
            game.load.image(background, preparePath(filename));
        } else {
            game.load.spritesheet(background, preparePath(str[0]), parseInt(str[1]),parseInt(str[2]));
        }
    });
    //preload cgs
    _.each(RenJS.setup.cgs,function(cgs,key){
        if (typeof cgs === 'string' || cgs instanceof String){
            // normal cgs
            game.load.image(key, preparePath(cgs));
        } else {
            // spritesheet animation      
            var str = cgs.spritesheet.split(" ");            
            game.load.spritesheet(key, preparePath(str[0]), parseInt(str[1]),parseInt(str[2]));
        }
        
    });
    // preload background music
    _.each(RenJS.setup.music,function(filename,music){
        game.load.audio(music, preparePath(filename));
    });
    //preload sfx
    _.each(RenJS.setup.sfx,function(filename,key){
        game.load.audio(key, preparePath(filename));
    },this);
    //preload characters
    _.each(RenJS.setup.characters,function(character,name){
        _.each(character.looks,function(filename,look){
            game.load.image(name+"_"+look, preparePath(filename));
        });
    });
    if (RenJS.setup.extra){
        _.each(RenJS.setup.extra,function(assets,type){
            if (type=="spritesheets"){
                _.each(assets,function(file,key){
                    var str = file.split(" ");
                    game.load.spritesheet(key, preparePath(str[0]), parseInt(str[1]),parseInt(str[2]));
                });
            } else {
                _.each(assets,function(file,key){
                    // console.log("loading "+key+ " "+file+" of type "+type);
                    game.load[type](key, preparePath(file));
                });
            }
        });
    }
  },

  create: function() {
    //init game and start main menu
    game.state.add('init', init);
    game.state.start('init');
  }
}

var init = {
  create:function(){            
    RenJS.storyManager.setupStory();
    RenJS.gui.init();
    RenJS.initInput();
    RenJS.audioManager.init(function(){
        RenJS.gui.showMenu("main");    
    });
  },

  render: function() {
    // if (RenJS.gui && RenJS.gui.hud && RenJS.gui.hud.area){
    //     _.each(RenJS.gui.hud.area,function(area){
    //         game.debug.rectangle(area);
    //     });
    // }
  }
}

//utils

function createLoadingPage() {
    this.splash = game.add.sprite(game.world.centerX, game.world.centerY, 'splash');
    this.splash.anchor.set(0.5);
    if (globalConfig.splash.loadingBar) {
        var position = globalConfig.splash.loadingBar.position;
        this.loadingBar = game.add.sprite(position.x,position.y , "loading");
        if (this.loadingBar.animations.frameTotal > 1){
            // load second frame as full bar
            this.loadingBar = game.add.sprite(position.x,position.y , "loading",1);
        }
    }
}

function loadStyle(href, callback){
    // avoid duplicates
    for(var i = 0; i < document.styleSheets.length; i++){
        if(document.styleSheets[i].href == href){
            return;
        }
    }
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = href;
    if (callback) { link.onload = function() { callback() } }
    head.appendChild(link);
}