import RJS from '../core/RJS';
import {Sprite,Text} from 'phaser-ce';

export function getButtonFrames(total: number, pushed = false){
  // button frames -> over|out|down|up
  const buttonFrames = {
      1: {normal: [0,0,0,0],pushed:[1,1,1,1]},
      2: {normal: [1,0,1,0],pushed:[3,2,3,2]},
      3: {normal: [1,0,2,0],pushed:[4,3,5,3]},
      4: {normal: [1,0,2,3],pushed:[5,4,6,7]},
  }
  return buttonFrames[total][pushed ? 'pushed' : 'normal']
}

export function changeInputEnabled(displayObj,enabled){
  if (displayObj.input){
    displayObj.input.enabled = enabled;
  }
  for (const child of displayObj.children){
    changeInputEnabled(child,enabled);
  }

}

// sets text styles tags in a phaser text object (but NOT the text itself)
// returns final text without tags, that has to be set to text object as textObj.text
export function setTextStyles(text: string,textObj: Text): string {
  textObj.clearFontValues();
  textObj.clearColors()
  const styles = []
  while(true){
    const re = /\((color:((\w+|#(\d|\w)+))|italic|bold)\)/
    const match = re.exec(text);
    if (match){
      const s = {
        start: text.search(re),
        style: match[1].includes('color') ? 'color' : match[1],
        end: -1,
        color: null
      }
      if (s.style == 'color'){
        s.color = match[2];
      }
      text = text.replace(re,'')
      const endIdx = text.indexOf('(end)');
      if (endIdx!=-1){
        text = text.replace('(end)','')
        s.end = endIdx;
        styles.push(s)
      }
    } else break;
  }
  styles.forEach(s=>{
    if (s.style=='italic'){
      textObj.addFontStyle('italic', s.start);
      textObj.addFontStyle('normal', s.end);
    }
    if (s.style=='bold'){
      textObj.addFontWeight('bold', s.start);
      textObj.addFontWeight('normal', s.end);
    }
    if (s.style=='color'){
      textObj.addColor(s.color, s.start)
      textObj.addColor(textObj.fill, s.end)
    }
  })
  return text;
}

// convert hex color to number
export function toHexColor(color) {
    // eslint-disable-next-line no-bitwise
    return (parseInt(color.substr(1), 16) << 8) / 256;
}

/**
 * compareFn for hud config elements.
 * ensures that name box is on top of dialogue,
 * and that choices and buttons are on top of both
 */
export function hudSort(a: { type: string }, b: { type: string }) {
  const order = [
    'messageBox',
    'nameBox',
    'button',
    'choices',
  ];
  const idxA = order.indexOf(a.type);
  const idxB = order.indexOf(b.type);
  if (idxA === undefined || idxB === undefined) return 0;
  return idxA - idxB;
}