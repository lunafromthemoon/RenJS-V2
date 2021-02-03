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
var StoryAction_1 = __importDefault(require("./StoryAction"));
var StoryActionEffect = /** @class */ (function (_super) {
    __extends(StoryActionEffect, _super);
    function StoryActionEffect(params, game) {
        return _super.call(this, params, game) || this;
    }
    StoryActionEffect.prototype.execute = function () {
        if (this.game.screenEffects.effects[this.params.actor]) {
            var transitioning = this.game.screenEffects.effects[this.params.actor](this.params);
            this.resolve(transitioning, this.params.contAfterTrans);
        }
        else if (this.game.pluginsRJS[this.params.actor]) {
            this.game.pluginsRJS[this.params.actor].execute(this.params);
            // plugins resolve themselves
        }
        else {
            this.resolve();
        }
    };
    return StoryActionEffect;
}(StoryAction_1.default));
exports.default = StoryActionEffect;
//# sourceMappingURL=StoryActionEffect.js.map