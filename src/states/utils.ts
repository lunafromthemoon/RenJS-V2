import RJS from '../core/RJS';
import {Sprite} from 'phaser-ce';
import RJSSprite from '../entities/RJSSprite';

export function initSplash (game: RJS): Sprite {
    const splash = game.add.sprite(game.world.centerX, game.world.centerY, 'splash');
    splash.anchor.set(0.5)
    return splash
}

export function initLoadingBar (game: RJS): Sprite {
    const position = game.config.splash.loadingBar.position;
    let loadingBar: RJSSprite = game.add.sprite(position.x,position.y , 'loading') ;
    if (loadingBar.animations.frameTotal > 1){
        // load second frame as full bar
        loadingBar = game.add.sprite(position.x,position.y , 'loading',1);
        loadingBar.background = loadingBar
    }

    return loadingBar
}

export function preparePath(path: string, game: RJS): string {
    if (game.config.i18n){
        return path.replace('LANG', game.config.i18n.current);
    } else {
        return path;
    }
}

export function loadStyle(href, callback?): void {
    // avoid duplicates
    for (const stylesheet of Array.from(document.styleSheets)){
        if(stylesheet.href === href){
            return;
        }
    }
    const head  = document.getElementsByTagName('head')[0];
    const link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = href;
    if (callback) {
        link.onload = () => { callback() }
    }
    head.appendChild(link);
}
