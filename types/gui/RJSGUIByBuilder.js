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
        this.config = {
            hud: gui.config.hud,
            menus: {
                main: gui.config.main,
                settings: gui.config.settings,
                saveload: gui.config.saveload
            }
        };
    };
    return RJSGUIByBuilder;
}(RJSGUI_1.default));
exports.default = RJSGUIByBuilder;
//# sourceMappingURL=RJSGUIByBuilder.js.map