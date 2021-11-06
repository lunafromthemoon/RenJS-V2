"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadStyle = exports.toHexColor = exports.setTextStyles = exports.preloadExtra = exports.preloadCharacter = exports.preloadAudio = exports.preloadCGS = exports.preloadBackground = exports.preparePath = void 0;
// export function initSplash (game: RJS): Sprite {
//     const splash = game.add.sprite(game.world.centerX, game.world.centerY, 'splash');
//     splash.anchor.set(0.5)
//     return splash
// }
// export function initLoadingBar (game: RJS): RJSSprite {
//     const position = game.config.loadingScreen.loadingBar.position;
//     let loadingBar: RJSSprite = game.add.sprite(position.x,position.y , 'loading') ;
//     if (loadingBar.animations.frameTotal > 1){
//         // load second frame as full bar
//         const bg = loadingBar;
//         loadingBar = game.add.sprite(position.x,position.y , 'loading',1);
//         loadingBar.background = bg;
//     }
//     return loadingBar
// }
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
    if (type === 'spritesheets') {
        var str = game.setup.extra[type][asset].split(' ');
        game.load.spritesheet(asset, preparePath(str[0], game), parseInt(str[1], 10), parseInt(str[2], 10));
    }
    else {
        game.load[type](asset, preparePath(game.setup.extra[type][asset], game));
    }
}
exports.preloadExtra = preloadExtra;
// sets text styles tags in a phaser text object (but NOT the text itself)
// returns final text without tags, that has to be set to text object as text_obj.text 
function setTextStyles(text, text_obj) {
    text_obj.clearFontValues();
    text_obj.clearColors();
    var styles = [];
    while (true) {
        var re = /\((color:((\w+|#(\d|\w)+))|italic|bold)\)/;
        var match = text.match(re);
        if (match) {
            var s = {
                start: text.search(re),
                style: match[1].includes("color") ? "color" : match[1],
                end: -1,
                color: null
            };
            if (s.style == "color") {
                s.color = match[2];
            }
            text = text.replace(re, "");
            var endIdx = text.indexOf("(end)");
            if (endIdx != -1) {
                text = text.replace("(end)", "");
                s.end = endIdx;
                styles.push(s);
            }
        }
        else
            break;
    }
    styles.forEach(function (s) {
        if (s.style == "italic") {
            text_obj.addFontStyle("italic", s.start);
            text_obj.addFontStyle("normal", s.end);
        }
        if (s.style == "bold") {
            text_obj.addFontWeight("bold", s.start);
            text_obj.addFontWeight("normal", s.end);
        }
        if (s.style == "color") {
            text_obj.addColor(s.color, s.start);
            text_obj.addColor(text_obj.fill, s.end);
        }
    });
    return text;
}
exports.setTextStyles = setTextStyles;
// convert hex color to number
function toHexColor(color) {
    // eslint-disable-next-line no-bitwise
    return (parseInt(color.substr(1), 16) << 8) / 256;
}
exports.toHexColor = toHexColor;
// load style css
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