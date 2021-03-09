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
var RJSState_1 = __importDefault(require("./RJSState"));
var LanguageChooser = /** @class */ (function (_super) {
    __extends(LanguageChooser, _super);
    function LanguageChooser() {
        return _super.call(this) || this;
    }
    LanguageChooser.prototype.init = function () {
        this.game.setupScreen();
    };
    LanguageChooser.prototype.preload = function () {
        if ()
            this.game.load.image(asset.key, preparePath(asset.file, this.game));
        for (var lang in this.game.config.i18n.langs) {
            var cfg = this.game.config.i18n.langs[lang];
            this.game.load.spritesheet(lang, cfg.asset, cfg.size.w, cfg.size.h);
        }
    };
    LanguageChooser.prototype.create = function () {
        var _this = this;
        var _loop_1 = function (lang) {
            var cfg = this_1.game.config.i18n.langs[lang];
            this_1.game.add.button(cfg.position.x, cfg.position.y, lang, function (sprite) {
                _this.game.config.i18n.current = lang;
                console.log(lang);
                _this.game.state.start('bootstrap');
            }, this_1, 1, 0, 1, 0);
        };
        var this_1 = this;
        for (var lang in this.game.config.i18n.langs) {
            _loop_1(lang);
        }
    };
    return LanguageChooser;
}(RJSState_1.default));
exports.default = LanguageChooser;
//# sourceMappingURL=LanguageChooser.js.map