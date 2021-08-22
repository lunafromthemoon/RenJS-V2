import RJSGUI from './RJSGUI';
import {Group} from 'phaser-ce';
import RJS from '../core/RJS';
import {GUIAsset} from './elements/GUIAsset';
import RJSSlider from '../components/RJSSlider';
import RJSSprite from '../components/RJSSprite';
import RJSButton from '../components/RJSButton';
import ChoiceButton from '../components/ChoiceButton';

export default class RJSGUIByBuilder extends RJSGUI {

    initAssets(gui: any){
        // convert specific gui config to general one
        const toAssetList = (list,type,path): GUIAsset[] => {
            return Object.keys(list).map(key => (
                {
                    key,
                    file:path+list[key].fileName,
                    type,
                    w:list[key].w,
                    h:list[key].h
                }
            ));
        }
        const imgs = toAssetList(gui.assets.images,'image',gui.assetsPath);
        const audio = toAssetList(gui.assets.audio,'audio',gui.assetsPath);
        const sprts = toAssetList(gui.assets.spritesheets,'spritesheet',gui.assetsPath);

        this.assets = imgs.concat(audio).concat(sprts);
        this.fonts = Object.keys(gui.assets.fonts);
        // this.config = {
        //     hud: gui.config.hud, 
        //     menus: {
        //         main: gui.config.main,
        //         settings: gui.config.settings,
        //         saveload: gui.config.saveload
        //     }
        // }
        // convert to new scheme with elements list per menu 
        // each element has type and any other parameter it needs
        this.config = gui.config;
        var menus = ['loader','main','settings','hud','saveload']
        for (const menu of menus){
            if (!gui.config[menu].elements){
              gui.config[menu].elements = [];
            }
            // if background present, convert to normal image
            if (gui.config[menu].background){
              console.log("adding background to "+menu);
              gui.config[menu].elements.push({type:'image',x:0,y:0,asset:gui.config[menu].background.id});
              delete gui.config[menu].background
            }

            if (gui.config[menu].choice){
                const choiceConfig = gui.config[menu].choice;
                const choiceWidth = parseInt(gui.config[menu].choice.width,10)
                const choiceHeight = parseInt(gui.config[menu].choice.height,10)
                const choice = {
                    id:'default',
                    type: 'choices',
                    asset: choiceConfig.id,
                    x: choiceConfig.isBoxCentered ? this.game.world.centerX - choiceWidth/2 : choiceConfig.x,
                    y: choiceConfig.isBoxCentered ? this.game.world.centerY: choiceConfig.y,
                    alignment: choiceConfig.isBoxCentered ? 'centered' : 'topDown',
                    separation: parseInt(choiceConfig.separation, 10),
                    sfx: choiceConfig.sfx,
                    chosenColor: choiceConfig['chosen-color'],
                    text: this.convertText(choiceConfig) 
                }
                gui.config[menu].elements.push(choice);
                delete gui.config[menu].choice
            }

            if (gui.config[menu]['message-box']){
                const config = gui.config[menu]['message-box'];
                const messageBox:any = {
                    id:'default',
                    type: 'messageBox',
                    asset: config.id,
                    x: config.x,
                    y: config.y,
                    sfx: config.sfx,
                    alwaysOn: config['always-on'],
                    text: this.convertText(config)
                }
                if (gui.config[menu].ctc){
                    const ctcConfig = gui.config[menu].ctc;
                    messageBox.ctc = {
                        x: ctcConfig.x - config.x,
                        y: ctcConfig.y - config.y,
                        asset: ctcConfig.id,
                        animationStyle: ctcConfig.animationStyle,
                    }
                }
                gui.config[menu].elements.push(messageBox);
                delete gui.config[menu]['message-box']
                console.log("adding message box to "+menu);
            }

            if (gui.config[menu]['name-box']){
                const config = gui.config[menu]['name-box'];
                const nameBox:any = {
                    id:'default',
                    type: 'nameBox',
                    asset: config.id,
                    x: config.x,
                    y: config.y,
                    text: this.convertText(config)
                }
                gui.config[menu].elements.push(nameBox);
                delete gui.config[menu]['name-box']
                console.log("adding name box to "+menu);
            }

            // list components
            // image -> {x:number,y:number,asset:string}
            // animations are just images now
            var imageTypes = ['animations','images']
            for (const listType of imageTypes){
                if (gui.config[menu][listType]){
                    for (var i = 0; i < gui.config[menu][listType].length; i++) {
                      const element = gui.config[menu][listType][i];
                      gui.config[menu].elements.push({type:'image',x:element.x,y:element.y,asset:element.id});
                    }
                    delete gui.config[menu][listType]
                    console.log("adding "+listType+" box to "+menu);
                }
            }

            // saveslot -> {x: number,y: number,asset: string,slot: number,thumbnail: {x: number,y: number,width: number,height: number}}
            if (gui.config[menu]['save-slots']){
                for (var i = 0; i < gui.config[menu]['save-slots'].length; i++) {
                  const element = gui.config[menu]['save-slots'][i];
                  const saveSlot = {
                      type:'saveSlot',
                      x: element.x,
                      y: element.y,
                      asset:element.id,
                      slot: element.slot,
                      thumbnail: {
                          x: parseInt(element['thumbnail-x']),
                          y: parseInt(element['thumbnail-y']),
                          width: parseInt(element['thumbnail-width']),
                          height: parseInt(element['thumbnail-height']),
                      }
                  }
                  gui.config[menu].elements.push(saveSlot);
                }
                delete gui.config[menu]['save-slots']
                console.log("adding save-slots to "+menu);
            }

            // label -> {x:number,y:number,text:string,lineSpacing:number,style:any}
            if (gui.config[menu].labels){
                for (var i = 0; i < gui.config[menu].labels.length; i++) {
                  const element = gui.config[menu].labels[i];
                  const label = {
                      type:'label',
                      x: element.x,
                      y: element.y,
                      text: element.text,
                      style: this.convertTextStyle(element)
                  }
                  gui.config[menu].elements.push(label);
                }
                delete gui.config[menu].labels
                console.log("adding label to "+menu);
            }
            // slider -> {x: number,y: number,asset: string,binding: string,sfx: string, mask?:string}
            if (gui.config[menu].sliders){
                for (var i = 0; i < gui.config[menu].sliders.length; i++) {
                  const element = gui.config[menu].sliders[i];
                  const slider = {
                      type:'slider',
                      x: element.x,
                      y: element.y,
                      asset:element.id,
                      binding: "changeUserPreference",
                      userPreference: element.binding,
                      sfx: element.sfx,
                      mask: 'horizontal'
                  }
                  gui.config[menu].elements.push(slider);
                }
                delete gui.config[menu].sliders
                console.log("adding sliders to "+menu);
            }
            
            // button -> {x:number,y:number,asset:string,sfx:string,binding:string,pushButton?:boolean,pushed?:boolean}
            if (gui.config[menu].buttons){
                for (var i = 0; i < gui.config[menu].buttons.length; i++) {
                  const element = gui.config[menu].buttons[i];
                  const button: any = {
                      type:'button',
                      x: element.x,
                      y: element.y,
                      asset:element.id
                  }

                  if (menus.includes(element.binding)){
                      button.binding = 'openMenu';
                      button.menu = element.binding;
                  } else if (element.binding == 'other'){
                      button.binding = element['other-binding'];
                  } else {
                      button.binding = element.binding
                      if (element.binding == 'save' || element.binding=='load'){
                          button.slot = element.slot;
                      }
                  }
                  gui.config[menu].elements.push(button);
                }
                delete gui.config[menu].buttons
                console.log("adding buttons to "+menu);
            }
        }
    }

    convertText(config){
        const text:any = {
            x: config.isTextCentered ? 0 : parseInt(config['offset-x'], 10),
            y: config.isTextCentered ? 0 : parseInt(config['offset-y'], 10),
            lineSpacing: config.lineSpacing,
            style: this.convertTextStyle(config)
        }
        // if (config.width && config.height){
        //     text.width = parseInt(config.width)
        //     text.height = parseInt(config.height)
        // }
        return text
    }

    convertTextStyle(config){
        const textStyle:any = {
            font: config.font,
            fontSize: config.size+'px',
            fill: config.color
        }
        if (config.align){
            textStyle.align = config.align;
        }
        if (config['text-width']){
            textStyle.wordWrap = true;
            textStyle.wordWrapWidth = config['text-width'];
        }
        if (config.isTextCentered) {
            textStyle.boundsAlignH = 'center';
            textStyle.boundsAlignV = 'middle';
        } else if (!config['text-width']){
            textStyle.boundsAlignH = config.align ? config.align : 'left'
            textStyle.boundsAlignV = 'top'
        }
        return textStyle;
    }

}
