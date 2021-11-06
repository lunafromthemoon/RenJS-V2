"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var RJSGUI_1 = __importDefault(require("./RJSGUI"));
var RJSGUIByBuilder = /** @class */ (function (_super) {
    __extends(RJSGUIByBuilder, _super);
    function RJSGUIByBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RJSGUIByBuilder.prototype.initAssets = function (gui) {
        // convert specific gui config to general one
        var toAssetList = function (list, type, path) {
            return Object.keys(list).map(function (key) { return ({
                key: key,
                file: path + list[key].fileName,
                type: type,
                w: list[key].w,
                h: list[key].h
            }); });
        };
        var imgs = toAssetList(gui.assets.images, 'image', gui.assetsPath);
        var audio = toAssetList(gui.assets.audio, 'audio', gui.assetsPath);
        var sprts = toAssetList(gui.assets.spritesheets, 'spritesheet', gui.assetsPath);
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
        /*
        Text Style is as Phaser.Text needs
        
        
        
        

        */
        var menus = ['loader', 'main', 'settings', 'hud', 'saveload'];
        for (var _i = 0, menus_1 = menus; _i < menus_1.length; _i++) {
            var menu = menus_1[_i];
            if (!gui.config[menu].elements) {
                gui.config[menu].elements = [];
            }
            // if background present, convert to normal image
            if (gui.config[menu].background) {
                gui.config[menu].elements.push({ type: 'image', x: 0, y: 0, asset: gui.config[menu].background.id });
                delete gui.config[menu].background;
            }
            if (gui.config[menu].choice) {
                var choiceConfig = gui.config[menu].choice;
                var choice = {
                    id: 'default',
                    type: 'choices',
                    assets: choiceConfig.id,
                    x: choiceConfig.isBoxCentered ? this.game.world.centerX - choiceConfig.width / 2 : choiceConfig.x,
                    y: choiceConfig.isBoxCentered ? this.game.world.centerY - choiceConfig.height / 2 : choiceConfig.y,
                    alignment: choiceConfig.isBoxCentered ? 'centered' : 'topDown',
                    separation: parseInt(choiceConfig.separation, 10),
                    sfx: choiceConfig.sfx,
                    chosenColor: choiceConfig['chosen-color'],
                    text: {
                        x: choiceConfig.isTextCentered ? 0 : parseInt(choiceConfig['offset-x'], 10),
                        y: choiceConfig.isTextCentered ? 0 : parseInt(choiceConfig['offset-y'], 10),
                        lineSpacing: choiceConfig.lineSpacing,
                        style: {
                            font: choiceConfig.font,
                            size: choiceConfig.font + "px",
                            fill: choiceConfig.color,
                            align: choiceConfig.isTextCentered ? 'center' : choiceConfig.align,
                            // boundsAlignH: choiceConfig.isTextCentered ? 'center' : choiceConfig.align,
                            // boundsAlignV: choiceConfig.isTextCentered ? 'middle' : 'top',
                            wordWrap: true,
                            wordWrapWidth: choiceConfig['text-width']
                        }
                    }
                };
            }
            if (gui.config[menu]['message-box']) {
                var choiceConfig = gui.config[menu];
                'message-box';
                var choice = {
                    id: 'default',
                    type: 'choices',
                    assets: choiceConfig.id,
                    x: choiceConfig.isBoxCentered ? this.game.world.centerX - choiceConfig.width / 2 : choiceConfig.x,
                    y: choiceConfig.isBoxCentered ? this.game.world.centerY - choiceConfig.height / 2 : choiceConfig.y,
                    alignment: choiceConfig.isBoxCentered ? 'centered' : 'topDown',
                    separation: parseInt(choiceConfig.separation, 10),
                    sfx: choiceConfig.sfx,
                    chosenColor: choiceConfig['chosen-color'],
                    text: {
                        x: choiceConfig.isTextCentered ? 0 : parseInt(choiceConfig['offset-x'], 10),
                        y: choiceConfig.isTextCentered ? 0 : parseInt(choiceConfig['offset-y'], 10),
                        lineSpacing: choiceConfig.lineSpacing,
                        style: {
                            font: choiceConfig.font,
                            size: choiceConfig.font + "px",
                            fill: choiceConfig.color,
                            align: choiceConfig.isTextCentered ? 'center' : choiceConfig.align,
                            // boundsAlignH: choiceConfig.isTextCentered ? 'center' : choiceConfig.align,
                            // boundsAlignV: choiceConfig.isTextCentered ? 'middle' : 'top',
                            wordWrap: true,
                            wordWrapWidth: choiceConfig['text-width']
                        }
                    }
                };
            }
            var singleComponents = ['choice', 'interrupt', 'message-box', 'ctc', 'name-box'];
            for (var _a = 0, singleComponents_1 = singleComponents; _a < singleComponents_1.length; _a++) {
                var component = singleComponents_1[_a];
                if (component in gui.config[menu]) {
                    // add type to component configuration
                    gui.config[menu][component].type = component;
                    gui.config[menu][component].asset = gui.config[menu][component].id;
                    delete gui.config[menu][component].id;
                    // add component to elements list
                    gui.config[menu].elements.push(gui.config[menu][component]);
                    // remove from main menu configuration
                    delete gui.config[menu][component];
                }
            }
            // list components
            // image -> {x:number,y:number,asset:string}
            // animations are just images now
            var imageTypes = ['animations', 'images'];
            for (var _b = 0, imageTypes_1 = imageTypes; _b < imageTypes_1.length; _b++) {
                var listType = imageTypes_1[_b];
                if (gui.config[menu][listType]) {
                    for (var i = 0; i < gui.config[menu][listType].length; i++) {
                        var element = gui.config[menu][listType][i];
                        gui.config[menu].elements.push({ type: 'image', x: element.x, y: element.y, asset: element.id });
                    }
                }
            }
            // saveslot -> {x: number,y: number,asset: string,slot: number,thumbnail: {x: number,y: number,width: number,height: number}}
            if (gui.config[menu]['save-slots']) {
                for (var i = 0; i < gui.config[menu]['save-slots'].length; i++) {
                    var element = gui.config[menu]['save-slots'][i];
                    var saveSlot = {
                        type: 'saveSlot',
                        x: element.x,
                        y: element.y,
                        asset: element.id,
                        slot: element.slot,
                        thumbnail: {
                            x: parseInt(element['thumbnail-x']),
                            y: parseInt(element['thumbnail-y']),
                            width: parseInt(element['thumbnail-width']),
                            height: parseInt(element['thumbnail-height']),
                        }
                    };
                    gui.config[menu].elements.push(saveSlot);
                }
            }
            // label -> {x:number,y:number,text:string,lineSpacing:number,style:any}
            if (gui.config[menu].labels) {
                for (var i = 0; i < gui.config[menu].labels.length; i++) {
                    var element = gui.config[menu].labels[i];
                    var label = {
                        type: 'label',
                        x: element.x,
                        y: element.y,
                        text: element.text,
                        style: {
                            font: element.font,
                            size: element.size + 'px',
                            fill: element.color
                        }
                    };
                    gui.config[menu].elements.push(label);
                }
            }
            // slider -> {x: number,y: number,asset: string,binding: string,sfx: string, mask?:string}
            if (gui.config[menu].sliders) {
                for (var i = 0; i < gui.config[menu].sliders.length; i++) {
                    var element = gui.config[menu].sliders[i];
                    var slider = {
                        type: 'slider',
                        x: element.x,
                        y: element.y,
                        asset: element.id,
                        binding: element.binding,
                        sfx: element.sfx,
                        mask: 'horizontal'
                    };
                    gui.config[menu].elements.push(slider);
                }
            }
            // button -> {x:number,y:number,asset:string,sfx:string,binding:string,pushButton?:boolean,pushed?:boolean}
            if (gui.config[menu].buttons) {
                for (var i = 0; i < gui.config[menu].buttons.length; i++) {
                    var element = gui.config[menu].buttons[i];
                    var button = {
                        type: 'button',
                        x: element.x,
                        y: element.y,
                        asset: element.id,
                        binding: element.binding == 'other' ? element['other-binding'] : element.binding,
                        slot: element.slot
                    };
                    gui.config[menu].elements.push(button);
                }
            }
        }
    };
    return RJSGUIByBuilder;
}(RJSGUI_1.default));
exports.default = RJSGUIByBuilder;
//# sourceMappingURL=RJSGUIByBuilder.js.map