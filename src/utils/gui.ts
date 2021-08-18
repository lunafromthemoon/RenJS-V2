import RJS from '../core/RJS';
import {Sprite,Text} from 'phaser-ce';
import RJSSprite from '../components/RJSSprite';

export function changeInputEnabled(displayObj,enabled){
  if (displayObj.input){
    displayObj.input.enabled = enabled;  
  }
  for (const child of displayObj.children){
    changeInputEnabled(child,enabled);
  }
  
}

export function createText(game,config): Text{
    const text = game.add.text(config.x, config.y, "" , config.style);
    if (config.lineSpacing){
        text.lineSpacing = config.lineSpacing;
    }
    if (config.width && config.height){
      text.setTextBounds(config.x,config.y,config.width,config.height)
    }
    return text;
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