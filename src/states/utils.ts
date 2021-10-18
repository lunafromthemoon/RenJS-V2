import RJS from '../core/RJS';
import {Sprite,Text} from 'phaser-ce';

export function preparePath(path: string, game: RJS): string {
    if (game.config.i18n){
        return path.replace('LANG', game.config.i18n.current);
    } else {
        return path;
    }
}

// preload assets, maybe relocate somewhere else
export function preloadBackground(bgName: string, game: RJS): void {
    const str = game.setup.backgrounds[bgName].split(' ');
    if (str.length === 1) {
        game.load.image(bgName, preparePath(str[0], game));
    } else {
        game.load.spritesheet(bgName, preparePath(str[0], game), parseInt(str[1], 10), parseInt(str[2], 10));
    }
}

export function preloadCGS(cgName: string, game:RJS):void {
    const cgs = game.setup.cgs[cgName];
    if (typeof cgs === 'string') {
        // normal cgs
        game.load.image(cgName, preparePath(cgs, game));
    } else {
        // spritesheet animation
        const str = cgs.spritesheet.split(' ');
        game.load.spritesheet(cgName, preparePath(str[0], game), parseInt(str[1], 10), parseInt(str[2], 10));
    }
}

export function preloadAudio(audioName: string, audioType, game: RJS): void {
    game.load.audio(audioName, preparePath(game.setup[audioType][audioName], game));
}

export function preloadCharacter(chName: string, game:RJS):void {
    const char = game.setup.characters[chName];
    for (const look in char.looks) {
        game.load.image(chName + '_' + look, preparePath(char.looks[look], game));
    }
    for (const portrait in char.portraits) {
        game.load.image(chName + '_portrait_' + portrait, preparePath(char.portraits[portrait], game));
    }
}

export function preloadExtra(asset:string, type:string, game:RJS){
    if (type === 'spritesheets') {
        const str = game.setup.extra[type][asset].split(' ');
        game.load.spritesheet(asset, preparePath(str[0], game), parseInt(str[1], 10), parseInt(str[2], 10));
    } else {
        game.load[type](asset, preparePath(game.setup.extra[type][asset], game));
    }
}



export function guid(): string {
    return 'ss'.replace(/s/g, s4);
}

function s4(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

// load style css

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
