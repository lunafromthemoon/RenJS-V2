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
Object.defineProperty(exports, "__esModule", { value: true });
var phaser_ce_1 = require("phaser-ce");
var RJSSprite = /** @class */ (function (_super) {
    __extends(RJSSprite, _super);
    function RJSSprite(game, x, y) {
        return _super.call(this, game, x, y) || this;
    }
    RJSSprite.prototype.destroy = function () {
        if (this.background) {
            this.background.destroy();
        }
        _super.prototype.destroy.call(this);
    };
    return RJSSprite;
}(phaser_ce_1.Sprite));
exports.default = RJSSprite;
//# sourceMappingURL=RJSSprite.js.map