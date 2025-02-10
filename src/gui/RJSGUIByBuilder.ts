import RJSGUIByNewBuilder from './RJSGUIByNewBuilder';
import jsyaml from 'js-yaml';

export class RJSGUIByBuilder extends RJSGUIByNewBuilder {
  initAssets(gui: any): void {
    // converts assets and fonts
    super.initAssets(gui);

    // convert to new scheme with elements list per menu
    // each element has type and any other parameter it needs

    this.config.menus = {};
    const menus = ['main', 'settings', 'hud', 'saveload'];
    for (const menu of menus) {
      if (!gui.config[menu]) continue;
      const menuConfig = [];

      // if background present, convert to normal image
      if (gui.config[menu].background) {
        menuConfig.push({
          type: 'image',
          x: 0,
          y: 0,
          asset: gui.config[menu].background.id,
        });
        delete gui.config[menu].background;
      }
      if (gui.config[menu].backgroundMusic) {
        menuConfig.push({
          type: 'music',
          asset: gui.config[menu].backgroundMusic,
        });
        delete gui.config[menu].background;
      }

      if (gui.config[menu].choice) {
        const choiceConfig = gui.config[menu].choice;
        const choiceWidth = parseInt(gui.config[menu].choice.width, 10);
        const choice = {
          id: 'default',
          type: 'choices',
          asset: choiceConfig.id,
          x: choiceConfig.isBoxCentered
            ? this.game.world.centerX - choiceWidth / 2
            : choiceConfig.x,
          y: choiceConfig.isBoxCentered
            ? this.game.world.centerY
            : choiceConfig.y,
          alignment: choiceConfig.isBoxCentered ? 'centered' : 'topDown',
          separation: parseInt(choiceConfig.separation, 10),
          sfx: choiceConfig.sfx,
          chosenColor: choiceConfig['chosen-color'],
          text: this.convertText(choiceConfig),
        };
        menuConfig.push(choice);
        delete gui.config[menu].choice;
      }

      if (gui.config[menu]['message-box']) {
        const config = gui.config[menu]['message-box'];
        const messageBox: any = {
          id: 'default',
          type: 'messageBox',
          asset: config.id,
          x: config.x,
          y: config.y,
          sfx: config.sfx,
          alwaysOn: config['always-on'],
          text: this.convertText(config),
        };
        if (gui.config[menu].ctc) {
          const ctcConfig = gui.config[menu].ctc;
          messageBox.ctc = {
            x: ctcConfig.x - config.x,
            y: ctcConfig.y - config.y,
            asset: ctcConfig.id,
            animationStyle: ctcConfig.animationStyle,
          };
        }
        menuConfig.push(messageBox);
        delete gui.config[menu]['message-box'];
      }

      if (gui.config[menu]['name-box']) {
        const config = gui.config[menu]['name-box'];
        const nameBox: any = {
          id: 'default',
          type: 'nameBox',
          asset: config.id,
          x: config.x,
          y: config.y,
          text: this.convertText(config),
        };
        menuConfig.push(nameBox);
        delete gui.config[menu]['name-box'];
      }

      // list components
      // image -> {x:number,y:number,asset:string}
      // animations are just images now
      const imageTypes = ['animations', 'images'];
      for (const listType of imageTypes) {
        if (gui.config[menu][listType]) {
          for (const element of gui.config[menu][listType]) {
            menuConfig.push({
              type: 'image',
              x: element.x,
              y: element.y,
              asset: element.id,
            });
          }
          delete gui.config[menu][listType];
        }
      }

      // saveslot -> {x: number,y: number,asset: string,slot: number,thumbnail: {x: number,y: number,width: number,height: number}}
      if (gui.config[menu]['save-slots']) {
        for (const element of gui.config[menu]['save-slots']) {
          const saveSlot = {
            type: 'saveSlot',
            x: element.x,
            y: element.y,
            asset: element.id,
            slot: element.slot,
            thumbnail: {
              x: parseInt(element['thumbnail-x'], 10),
              y: parseInt(element['thumbnail-y'], 10),
              width: parseInt(element['thumbnail-width'], 10),
              height: parseInt(element['thumbnail-height'], 10),
            },
          };
          menuConfig.push(saveSlot);
        }
        delete gui.config[menu]['save-slots'];
      }

      // label -> {x:number,y:number,text:string,lineSpacing:number,style:any}
      if (gui.config[menu].labels) {
        for (const element of gui.config[menu].labels) {
          const label = {
            type: 'label',
            x: element.x,
            y: element.y,
            text: element.text,
            style: this.convertTextStyle(element),
          };
          menuConfig.push(label);
        }
        delete gui.config[menu].labels;
      }
      // slider -> {x: number,y: number,asset: string,binding: string,sfx: string, mask?:string}
      if (gui.config[menu].sliders) {
        for (const element of gui.config[menu].sliders) {
          const slider = {
            type: 'slider',
            x: element.x,
            y: element.y,
            asset: element.id,
            binding: 'changeUserPreference',
            userPreference: element.binding,
            sfx: element.sfx,
            mask: 'horizontal',
          };
          menuConfig.push(slider);
        }
        delete gui.config[menu].sliders;
      }

      // button -> {x:number,y:number,asset:string,sfx:string,binding:string,pushButton?:boolean,pushed?:boolean}
      if (gui.config[menu].buttons) {
        for (const element of gui.config[menu].buttons) {
          const button: any = {
            type: 'button',
            x: element.x,
            y: element.y,
            asset: element.id,
          };

          if (menus.includes(element.binding)) {
            button.binding = 'openMenu';
            button.menu = element.binding;
          } else if (element.binding === 'other') {
            button.binding = element['other-binding'];
          } else {
            button.binding = element.binding;
            if (element.binding === 'save' || element.binding === 'load') {
              button.slot = element.slot;
            }
          }
          menuConfig.push(button);
        }
        delete gui.config[menu].buttons;
      }
      if (menu === 'hud') {
        this.config.hud = menuConfig;
      } else {
        this.config.menus[menu] = menuConfig;
        delete gui.config[menu];
      }
    }
    if (this.game.config.debugMode) {
      delete gui.config.loader;
      console.log('Converted gui configuration');
      console.log(
        'Replace the config property for this into GUI.yaml file to use new gui configuration directly.'
      );
      console.log('MAKE SURE ===> GUIVersion=="2.0"');
      const configText = jsyaml.dump(JSON.parse(JSON.stringify(this.config)));
      console.log(configText);
    }
  }

  convertText(config): {
    x: number;
    y: number;
    lineSpacing: number;
    style: any;
  } {
    const text: any = {
      x: config.isTextCentered ? 0 : parseInt(config['offset-x'], 10),
      y: config.isTextCentered ? 0 : parseInt(config['offset-y'], 10),
      lineSpacing: config.lineSpacing,
      style: this.convertTextStyle(config),
    };
    return text;
  }

  convertTextStyle(config): {
    font: string;
    fontSize: string;
    fill: string;
    align?: string;
    wordWrap?: boolean;
    wordWrapWidth?: number;
    boundsAlignV?: string;
    boundsAlignH?: string;
  } {
    const textStyle: any = {
      font: config.font,
      fontSize: config.size + 'px',
      fill: config.color,
    };
    if (config.align) {
      textStyle.align = config.align;
    }
    if (config['text-width']) {
      textStyle.wordWrap = true;
      textStyle.wordWrapWidth = config['text-width'];
    }
    if (config.isTextCentered) {
      textStyle.boundsAlignH = 'center';
      textStyle.boundsAlignV = 'middle';
    } else if (!config['text-width']) {
      textStyle.boundsAlignH = config.align ? config.align : 'left';
      textStyle.boundsAlignV = 'top';
    }
    return textStyle;
  }
}
export default RJSGUIByBuilder;
