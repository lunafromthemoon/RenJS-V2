"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
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
// export interface RJSSimpleGUIInterface extends RJSGUI {}
// todo to impl
var RJSSimpleGUI = /** @class */ (function (_super) {
    __extends(RJSSimpleGUI, _super);
    function RJSSimpleGUI() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RJSSimpleGUI.prototype.initAssets = function (gui) {
        // convert specific gui config to general one
        var toAssetList = function (list, type) {
            return Object.entries(list).map(function (_a) {
                var key = _a[0], file = _a[1];
                if (type == "spritesheet") {
                    var asset = String(file).split(" ");
                    return {
                        key: key,
                        file: asset[0].toString(),
                        w: parseInt(asset[1]),
                        h: parseInt(asset[2]),
                        type: type
                    };
                }
                else {
                    return { key: key, file: file.toString(), type: type, w: 0, h: 0 };
                }
            });
        };
        var imgs = toAssetList(gui.assets.images, 'image');
        var audio = toAssetList(gui.assets.audio, 'audio');
        var sprts = toAssetList(gui.assets.spritesheets, 'spritesheet');
        this.assets = imgs.concat(audio).concat(sprts);
        this.fonts = gui.assets.fonts;
        this.config = {
            hud: this.parseHud(gui.hud),
            menus: {
                main: this.parseMenu('main', gui.menus.main),
                settings: this.parseMenu('settings', gui.menus.settings),
                saveload: null
            }
        };
    };
    RJSSimpleGUI.prototype.parseHud = function (hudConfig) {
        var newConfig = {};
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
        };
        if (hudConfig.name) {
            newConfig['name-box'] = {
                id: 'nameBox',
                isTextCentered: hudConfig.name.textStyle.boundsAlignH == 'center',
                'offset-x': 0,
                'offset-y': 0,
                font: hudConfig.name.textStyle.font,
                x: newConfig['message-box'].x + hudConfig.name.position.x,
                y: newConfig['message-box'].y + hudConfig.name.position.y
            };
            if (!(newConfig['name-box'].isTextCentered)) {
                newConfig['name-box']['offset-y'] = hudConfig.name.textPosition.y;
                newConfig['name-box']['offset-x'] = hudConfig.name.textPosition.x;
                newConfig['name-box']['align'] = 'left';
            }
        }
        if (hudConfig.ctc) {
            var ctcAsset = this.assets.find(function (asset) { return asset.key == "ctc"; });
            newConfig.ctc = {
                id: "ctc",
                height: ctcAsset.h,
                width: ctcAsset.w,
                x: newConfig['message-box'].x + hudConfig.ctc.position.x,
                y: newConfig['message-box'].y + hudConfig.ctc.position.y,
                animationStyle: hudConfig.ctc.animated ? "spritesheet" : "alpha"
            };
        }
        var choiceAsset = this.assets.find(function (asset) { return asset.key == "choice"; });
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
        };
        if (!newConfig.choice.isBoxCentered) {
            newConfig.choice.x = hudConfig.choice.position.x;
            newConfig.choice.y = hudConfig.choice.position.y;
        }
        if (!newConfig.choice.isTextCentered) {
            newConfig.choice['offset-y'] = hudConfig.choice.textPosition.y;
            newConfig.choice['offset-x'] = hudConfig.choice.textPosition.x;
            newConfig.choice['align'] = 'left';
        }
        if (hudConfig.interrupt) {
            var interruptAsset = this.assets.find(function (asset) { return asset.key == "interrupt"; });
            newConfig.interrupt = {
                id: 'interrupt',
                color: hudConfig.interrupt.textStyle.fill,
                font: hudConfig.interrupt.textStyle.font,
                height: interruptAsset.h,
                width: interruptAsset.w,
                sfx: 'none',
                inlineWithChoice: true,
                isTextCentered: newConfig.choice.isTextCentered,
                'offset-x': newConfig.choice['offset-x'],
                'offset-y': newConfig.choice['offset-y'],
                align: newConfig.choice['align']
            };
        }
        if (hudConfig.buttons) {
            newConfig.buttons = [];
            for (var btn in hudConfig.buttons) {
                newConfig.buttons.push(this.parseButton(btn, hudConfig.buttons[btn]));
            }
        }
        return newConfig;
    };
    RJSSimpleGUI.prototype.parseMenu = function (name, menuConfig) {
        var newConfig = {
            background: { id: name + "Background" },
            buttons: [],
            sliders: []
        };
        if (menuConfig.music) {
            newConfig.backgroundMusic = menuConfig.music;
        }
        if (menuConfig.buttons) {
            for (var btn in menuConfig.buttons) {
                newConfig.buttons.push(this.parseButton(btn, menuConfig.buttons[btn]));
            }
        }
        if (menuConfig.sliders) {
            for (var btn in menuConfig.sliders) {
                newConfig.sliders.push(this.parseButton(btn, menuConfig.sliders[btn]));
            }
        }
        return newConfig;
    };
    RJSSimpleGUI.prototype.parseButton = function (buttonKey, buttonConfig) {
        var buttonAsset = this.assets.find(function (asset) { return asset.key == buttonConfig.sprite; });
        return {
            id: buttonConfig.sprite,
            sfx: 'none',
            binding: buttonKey,
            height: buttonAsset.h,
            width: buttonAsset.w,
            slot: 0,
            x: buttonConfig.position.x,
            y: buttonConfig.position.y
        };
    };
    return RJSSimpleGUI;
}(RJSGUI_1.default));
exports.default = RJSSimpleGUI;
//# sourceMappingURL=RJSSimpleGUI.js.map