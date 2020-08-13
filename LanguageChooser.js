var chooseLang = {

    init: function() {
        if (!(globalConfig.scaleMode == "EXACT_FIT")){
          game.scale.pageAlignHorizontally = true;
          game.scale.pageAlignVertically = true;
        }    
        game.scale.scaleMode = Phaser.ScaleManager[globalConfig.scaleMode];
        game.scale.refresh();
      },

    preload: function(){
        for (var i = globalConfig.i18n.langs.length - 1; i >= 0; i--) {
            var lang = globalConfig.i18n.langs[i];
            game.load.spritesheet(lang, globalConfig.i18n.path+lang+globalConfig.i18n.format, globalConfig.i18n.w, globalConfig.i18n.h);
        }
    },

    create: function(){
        var buttonSpace = (globalConfig.i18n.w+20);
        var offset = game.world.centerX-((globalConfig.i18n.langs.length*buttonSpace))/2;

        for (var i = globalConfig.i18n.langs.length - 1; i >= 0; i--) {
            var lang = globalConfig.i18n.langs[i];
            var x = offset + (i * buttonSpace);
            var button = game.add.button(x,game.world.centerY,lang,function(sprite){
                globalConfig.i18n.current = sprite.lang;
                game.state.start('bootstrap');
            },this,0,1,0,1);
            button.lang = lang;
        }
    }
}