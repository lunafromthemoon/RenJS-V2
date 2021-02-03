"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadStyle = exports.preloadExtra = exports.preloadCharacter = exports.preloadAudio = exports.preloadCGS = exports.preloadBackground = exports.preparePath = exports.initLoadingBar = exports.initSplash = void 0;
function initSplash(game) {
    var splash = game.add.sprite(game.world.centerX, game.world.centerY, 'splash');
    splash.anchor.set(0.5);
    return splash;
}
exports.initSplash = initSplash;
function initLoadingBar(game) {
    var position = game.config.splash.loadingBar.position;
    var loadingBar = game.add.sprite(position.x, position.y, 'loading');
    if (loadingBar.animations.frameTotal > 1) {
        // load second frame as full bar
        var bg = loadingBar;
        loadingBar = game.add.sprite(position.x, position.y, 'loading', 1);
        loadingBar.background = bg;
    }
    return loadingBar;
}
exports.initLoadingBar = initLoadingBar;
function preparePath(path, game) {
    if (game.config.i18n) {
        return path.replace('LANG', game.config.i18n.current);
    }
    else {
        return path;
    }
}
exports.preparePath = preparePath;
// preload assets, maybe relocate somewhere else
function preloadBackground(bgName, game) {
    var str = game.setup.backgrounds[bgName].split(' ');
    if (str.length === 1) {
        game.load.image(bgName, preparePath(str[0], game));
    }
    else {
        game.load.spritesheet(bgName, preparePath(str[0], game), parseInt(str[1], 10), parseInt(str[2], 10));
    }
}
exports.preloadBackground = preloadBackground;
function preloadCGS(cgName, game) {
    var cgs = game.setup.cgs[cgName];
    if (typeof cgs === 'string') {
        // normal cgs
        game.load.image(cgName, preparePath(cgs, game));
    }
    else {
        // spritesheet animation
        var str = cgs.spritesheet.split(' ');
        game.load.spritesheet(cgName, preparePath(str[0], game), parseInt(str[1], 10), parseInt(str[2], 10));
    }
}
exports.preloadCGS = preloadCGS;
function preloadAudio(audioName, audioType, game) {
    game.load.audio(audioName, preparePath(game.setup[audioType][audioName], game));
}
exports.preloadAudio = preloadAudio;
function preloadCharacter(chName, game) {
    var char = game.setup.characters[chName];
    for (var look in char.looks) {
        game.load.image(chName + '_' + look, preparePath(char.looks[look], game));
    }
}
exports.preloadCharacter = preloadCharacter;
function preloadExtra(asset, type, game) {
    // console.log("loading extra");
    // console.log(asset);
    // console.log(type);
    if (type === 'spritesheets') {
        var str = game.setup.extra[type][asset].split(' ');
        game.load.spritesheet(asset, preparePath(str[0], game), parseInt(str[1], 10), parseInt(str[2], 10));
    }
    else {
        game.load[type](asset, preparePath(game.setup.extra[type][asset], game));
    }
}
exports.preloadExtra = preloadExtra;
function loadStyle(href, callback) {
    // avoid duplicates
    for (var _i = 0, _a = Array.from(document.styleSheets); _i < _a.length; _i++) {
        var stylesheet = _a[_i];
        if (stylesheet.href === href) {
            return;
        }
    }
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = href;
    if (callback) {
        link.onload = function () { callback(); };
    }
    head.appendChild(link);
}
exports.loadStyle = loadStyle;
//# sourceMappingURL=utils.js.map