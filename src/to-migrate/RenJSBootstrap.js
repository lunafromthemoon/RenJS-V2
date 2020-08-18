import {globalConfig} from "../dev-only/config";
import 'pixi'
import 'p2'
import Phaser from 'phaser-ce'
import {preload} from "./Preload";
import {chooseLang} from "./LanguageChooser";

export const game = new Phaser.Game(globalConfig.w, globalConfig.h, Phaser[globalConfig.mode], "");

game.preserveDrawingBuffer = true;

const bootstrap = {

  init: function() {
    if (globalConfig.i18n){
      return;
    }
    if (!(globalConfig.scaleMode == "EXACT_FIT")){
      game.scale.pageAlignHorizontally = true;
      game.scale.pageAlignVertically = true;
    }
    game.scale.scaleMode = Phaser.ScaleManager[globalConfig.scaleMode];
    game.scale.refresh();
  },

  preload: function () {
    game.load.image('splash',  preparePath(globalConfig.splash.loadingScreen));
    if (globalConfig.splash.loadingBar) {
      if (globalConfig.splash.loadingBar.fullBar){
        game.load.image('loading',  preparePath(globalConfig.splash.loadingBar.fullBar));
      }
      if (globalConfig.splash.loadingBar.asset){
        const w = globalConfig.splash.loadingBar.size.w;
        const h = globalConfig.splash.loadingBar.size.h;
        game.load.spritesheet('loading',  preparePath(globalConfig.splash.loadingBar.asset),w,h);
      }
    }
    // game.load.script('preload',  'RenJS/Preload.js');
  },

  create: function () {
    game.state.add('preload', preload);
    game.state.start('preload');
  }

};

export function preparePath(path){
  if (globalConfig.i18n){
    return path.replace("LANG",globalConfig.i18n.current);
  } else {
    return path;
  }
}

game.state.add('bootstrap', bootstrap);

if (globalConfig.i18n){
  game.state.add('chooseLang', chooseLang);
  game.state.start('chooseLang');
} else {
  game.state.start('bootstrap');
}
