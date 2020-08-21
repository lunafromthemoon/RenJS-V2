import RJSGame from '../RJSGame';
import {Sprite} from 'phaser-ce';

export function initSplash (game: RJSGame): Sprite {
    const splash = game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'splash');
    splash.anchor.set(0.5)
    return splash
}

export function initLoadingBar (game: RJSGame): Sprite {
    const position = game.config.splash.loadingBar.position;
    let loadingBar = game.add.sprite(position.x,position.y , 'loading');
    if (loadingBar.animations.frameTotal > 1){
        // load second frame as full bar
        loadingBar = game.add.sprite(position.x,position.y , 'loading',1);
    }

    return loadingBar
}

export function preparePath(path: string, game: RJSGame): string {
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
