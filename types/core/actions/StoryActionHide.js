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
var StoryActionHide = /** @class */ (function (_super) {
    __extends(StoryActionHide, _super);
    function StoryActionHide(params, game) {
        return _super.call(this, params, game) || this;
    }
    StoryActionHide.prototype.execute = function () {
        var transitioning = null;
        if (this.params.actor === 'CHARS') {
            transitioning = this.game.managers.character.hideAll(this.params.transition);
        }
        else if (this.params.actor === 'ALL') {
            transitioning = Promise.all([
                this.game.managers.background.hide(this.params.transition),
                this.game.managers.character.hideAll(this.params.transition),
                this.game.managers.cgs.hideAll(this.params.transition)
            ]);
        }
        else {
            transitioning = this.params.manager.hide(this.params.actor, this.params.transition);
        }
        this.resolve(transitioning, this.params.contAfterTrans);
    };
    return StoryActionHide;
}(StoryAction_1.default));
exports.default = StoryActionHide;
//# sourceMappingURL=StoryActionHide.js.map