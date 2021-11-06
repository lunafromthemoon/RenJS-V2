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
Object.defineProperty(exports, "__esModule", { value: true });
var phaser_ce_1 = require("phaser-ce");
var MaskedSlider = /** @class */ (function (_super) {
    __extends(MaskedSlider, _super);
    function MaskedSlider(game, config, min, max, startValue) {
        var _this = _super.call(this, game, config.x, config.y, config.asset) || this;
        _this.min = min;
        _this.max = max;
        _this.config = config;
        _this.game = game;
        _this.visible = false;
        _this.id = config.id;
        _this.range = _this.max - _this.min;
        _this.currentValue = startValue;
        _this.sliderFull = _this.game.add.sprite(0, 0, config.asset, 1);
        _this.addChild(_this.sliderFull);
        _this.sliderFull.inputEnabled = true;
        _this.sliderFull.events.onInputDown.add(function (sprite, pointer) {
            var val = (pointer.x - _this.x);
            _this.currentValue = (val / _this.width) * _this.range + _this.min;
            _this.updateMask();
            _this.game.gui.buttonsAction[_this.config.binding](_this.config, _this.currentValue);
            // this.game.userPreferences.setPreference(sprite.binding,newVal);
            // if (sprite.binding == "bgmv"){
            //     this.game.managers.audio.changeVolume('bgm',newVal);
            // }
            if (_this.config.sfx && _this.config.sfx !== 'none') {
                var volume = _this.config.binding == "bgmv" ? _this.currentValue : _this.game.userPreferences.sfxv;
                _this.game.managers.audio.playSFX(_this.config.sfx, volume);
            }
        });
        return _this;
    }
    MaskedSlider.prototype.updateMask = function () {
        // left to right
        if (this.sliderFull.mask)
            this.sliderFull.mask.destroy();
        var sliderMask = this.game.add.graphics(this.config.x, this.config.y);
        sliderMask.beginFill(0xffffff);
        var maskWidth = this.width * (this.currentValue - this.min) / this.range;
        sliderMask.drawRect(0, 0, maskWidth, this.height);
        sliderMask.endFill();
        this.sliderFull.mask = sliderMask;
    };
    return MaskedSlider;
}(phaser_ce_1.Sprite));
exports.default = MaskedSlider;
//# sourceMappingURL=MaskSlider.js.map