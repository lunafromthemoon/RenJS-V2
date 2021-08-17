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
var utils_1 = require("../../states/utils");
var NameBox = /** @class */ (function (_super) {
    __extends(NameBox, _super);
    function NameBox(game, config) {
        var _this = _super.call(this, game, config.x, config.y, config.asset) || this;
        _this.config = config;
        _this.visible = false;
        _this.id = _this.config.id;
        // this.nameBox.visible = false;
        _this.text = _this.game.add.text(_this.config.text.x, _this.config.text.y, '', _this.config.text.style);
        if (_this.config.text.lineSpacing) {
            _this.text.lineSpacing = _this.config.text.lineSpacing;
        }
        _this.addChild(_this.text);
        return _this;
    }
    NameBox.prototype.show = function (text, color) {
        this.text.text = text;
        if (this.config.tintStyle == 'box') {
            this.tint = utils_1.toHexColor(color);
        }
        else {
            // change name color
            this.text.fill = color;
        }
        this.visible = true;
    };
    NameBox.prototype.hide = function () {
        this.text.text = '';
        this.visible = false;
    };
    NameBox.prototype.destroy = function () {
        this.text.destroy();
        _super.prototype.destroy.call(this);
    };
    return NameBox;
}(phaser_ce_1.Sprite));
exports.default = NameBox;
//# sourceMappingURL=NameBox.js.map