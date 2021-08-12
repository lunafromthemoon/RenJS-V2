import RJS from '../core/RJS';
import {Sprite,Text} from 'phaser-ce';
import RJSSprite from '../components/RJSSprite';

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
}

export function preloadExtra(asset:string, type:string, game:RJS){
    if (type === 'spritesheets') {
        const str = game.setup.extra[type][asset].split(' ');
        game.load.spritesheet(asset, preparePath(str[0], game), parseInt(str[1], 10), parseInt(str[2], 10));
    } else {
        game.load[type](asset, preparePath(game.setup.extra[type][asset], game));
    }
}

// sets text styles tags in a phaser text object (but NOT the text itself)
// returns final text without tags, that has to be set to text object as text_obj.text 
export function setTextStyles(text:string,text_obj:Text): string {
  text_obj.clearFontValues();
  text_obj.clearColors()
  let styles = []
  while(true){
    let re = /\((color:((\w+|#(\d|\w)+))|italic|bold)\)/
    let match = text.match(re);
    if (match){
      let s = {
        start: text.search(re),
        style: match[1].includes("color") ? "color" : match[1],
        end: -1,
        color: null
      }
      if (s.style == "color"){
        s.color = match[2];
      }
      text = text.replace(re,"")
      let endIdx = text.indexOf("(end)");
      if (endIdx!=-1){
        text = text.replace("(end)","")
        s.end = endIdx;
        styles.push(s)
      }
    } else break;
  }
  styles.forEach(s=>{
    if (s.style=="italic"){
      text_obj.addFontStyle("italic", s.start);
      text_obj.addFontStyle("normal", s.end);
    }
    if (s.style=="bold"){
      text_obj.addFontWeight("bold", s.start);
      text_obj.addFontWeight("normal", s.end);
    }
    if (s.style=="color"){
      text_obj.addColor(s.color, s.start)
      text_obj.addColor(text_obj.fill, s.end)
    }
  })
  return text;
}

// convert hex color to number
export function toHexColor(color) {
    // eslint-disable-next-line no-bitwise
    return (parseInt(color.substr(1), 16) << 8) / 256;
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
