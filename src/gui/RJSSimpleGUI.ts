import RJSGUI from './RJSGUI';
import {GUIAsset} from './elements/GUIAsset';
// export interface RJSSimpleGUIInterface extends RJSGUI {}

// todo to impl
export default class RJSSimpleGUI extends RJSGUI {

    initAssets(gui: any){
        // convert specific gui config to general one
        const toAssetList = (list,type:string): GUIAsset[] => {
            return Object.entries(list).map(([key, file]) => {
                if (type == "spritesheet"){
                    const asset = String(file).split(" ");
                    return {
                        key,
                        file:asset[0].toString(),
                        w:parseInt(asset[1]),
                        h:parseInt(asset[2]), 
                        type
                    }
                } else {
                    return {key, file:file.toString(), type, w:0, h:0}
                }
            });
        }
        const imgs = toAssetList(gui.assets.images,'image');
        const audio = toAssetList(gui.assets.audio,'audio');
        const sprts = toAssetList(gui.assets.spritesheets,'spritesheet');

        this.assets = imgs.concat(audio).concat(sprts);
        this.fonts = gui.assets.fonts;
        this.config = {
            hud: this.parseHud(gui.hud), 
            menus: {
                main: this.parseMenu('main',gui.menus.main),
                settings: this.parseMenu('settings',gui.menus.settings),
                saveload: null
            }
        }
    }

    parseHud(hudConfig) {
        let newConfig: any = {};
        newConfig['message-box'] = {
            id: "messageBox",
          'text-width': hudConfig.message.textStyle.wordWrapWidth,
          'offset-x': hudConfig.message.textPosition.x,
          'offset-y': hudConfig.message.textPosition.y,
          align: 'left',
          color: hudConfig.message.textStyle.fill,
          font: hudConfig.message.textStyle.font,
          sfx: 'none',
          y: hudConfig.message.position.y,
          x: hudConfig.message.position.x
        }
        if (hudConfig.name){
            newConfig['name-box'] = {
              id: 'nameBox',
              isTextCentered: hudConfig.name.textStyle.boundsAlignH == 'center',
              'offset-x': 0,
              'offset-y': 0,
              font: hudConfig.name.textStyle.font,
              x: newConfig['message-box'].x + hudConfig.name.position.x,
              y: newConfig['message-box'].y + hudConfig.name.position.y
            };
            if (!(newConfig['name-box'].isTextCentered)){
                newConfig['name-box']['offset-y'] = hudConfig.name.textPosition.y;
                newConfig['name-box']['offset-x'] = hudConfig.name.textPosition.x;
                newConfig['name-box']['align'] = 'left';
            }
        }

        if (hudConfig.ctc){
            let ctcAsset = this.assets.find(asset=>asset.key == "ctc");
            newConfig.ctc = {
              id: "ctc",
              height: ctcAsset.h,
              width: ctcAsset.w,
              x: newConfig['message-box'].x + hudConfig.ctc.position.x,
              y: newConfig['message-box'].y + hudConfig.ctc.position.y,
              animationStyle: hudConfig.ctc.animated ? "spritesheet" : "alpha"
            }
        }

        let choiceAsset = this.assets.find(asset=>asset.key == "choice");

        newConfig.choice = {
          id: 'choice',
          isBoxCentered: !hudConfig.choice.position,
          separation: hudConfig.choice.separation - choiceAsset.h,
          height: choiceAsset.h,
          width: choiceAsset.w,
          sfx: 'none',
          // text 
          isTextCentered: hudConfig.choice.textStyle.boundsAlignH == 'center',
          'chosen-color': '#AA8282',
          color: hudConfig.choice.textStyle.fill,
          font: hudConfig.choice.textStyle.font
        }

        if (!newConfig.choice.isBoxCentered){
            newConfig.choice.x = hudConfig.choice.position.x;
            newConfig.choice.y = hudConfig.choice.position.y;
        }

        if(!newConfig.choice.isTextCentered){
            newConfig.choice['offset-y'] = hudConfig.choice.textPosition.y;
            newConfig.choice['offset-x'] = hudConfig.choice.textPosition.x;
            newConfig.choice['align'] = 'left';
        }

        if (hudConfig.interrupt){
            let interruptAsset = this.assets.find(asset=>asset.key == "interrupt");
            newConfig.interrupt = {
              id: 'interrupt',
              color: hudConfig.interrupt.textStyle.fill,
              font: hudConfig.interrupt.textStyle.font,
              height: interruptAsset.h,
              width: interruptAsset.w,
              sfx: 'none',
              inlineWithChoice: true,
              isTextCentered: newConfig.choice.isTextCentered,
              'offset-x' : newConfig.choice['offset-x'],
              'offset-y' : newConfig.choice['offset-y'],
              align : newConfig.choice['align']
            }
        }

        if (hudConfig.buttons){
            newConfig.buttons = [];
            for (let btn in hudConfig.buttons){
                newConfig.buttons.push(this.parseButton(btn,hudConfig.buttons[btn]));
            }
            
        }

        return newConfig;
    }

    parseMenu(name,menuConfig){
        let newConfig:any = {
            background: {id: name+"Background"},
            buttons: [],
            sliders: []
        };

        if (menuConfig.music){
            newConfig.backgroundMusic = menuConfig.music;
        }

        if (menuConfig.buttons){
            for (let btn in menuConfig.buttons){
                newConfig.buttons.push(this.parseButton(btn,menuConfig.buttons[btn]));
            }
        }

        if (menuConfig.sliders){
            for (let btn in menuConfig.sliders){
                newConfig.sliders.push(this.parseButton(btn,menuConfig.sliders[btn]));
            }
        }

        return newConfig;

    }

    parseButton(buttonKey, buttonConfig){
        let buttonAsset = this.assets.find(asset=>asset.key == buttonConfig.sprite);
        return {
            id: buttonConfig.sprite,
            sfx: 'none',
            binding: buttonKey,
            height: buttonAsset.h,
            width: buttonAsset.w,
            slot: 0,
            x: buttonConfig.position.x,
            y: buttonConfig.position.y
        }
    }

}
