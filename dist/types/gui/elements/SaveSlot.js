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
var SaveSlot = /** @class */ (function (_super) {
    __extends(SaveSlot, _super);
    function SaveSlot(game, config) {
        var _this = _super.call(this, game, config.x, config.y, config.asset) || this;
        _this.game = game;
        var thumbnailData = _this.game.getSlotThumbnail(_this.config.slot);
        if (thumbnailData) {
            _this.loadThumbnail(thumbnailData);
        }
        return _this;
        // this.saveSlots[element.slot] = sprite;
    }
    SaveSlot.prototype.loadThumbnail = function (thumbnail) {
        var _this = this;
        var id = 'thumbnail' + Math.floor(Math.random() * 5000);
        this.game.load.image(id, thumbnail);
        this.game.load.onLoadComplete.addOnce(function () {
            var thmbSprite = _this.game.add.sprite(_this.config.thumbnail.x, _this.config.thumbnail.y, id);
            thmbSprite.width = _this.config.thumbnail.width;
            thmbSprite.height = _this.config.thumbnail.height;
            _this.addChild(thmbSprite);
        }, this);
        this.game.load.start();
    };
    SaveSlot.prototype.destroy = function () {
        this.thumbnail.destroy();
        _super.prototype.destroy.call(this);
    };
    return SaveSlot;
}(phaser_ce_1.Sprite));
exports.default = SaveSlot;
//# sourceMappingURL=SaveSlot.js.map