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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var StoryAction_1 = __importDefault(require("./StoryAction"));
var StoryActionText = /** @class */ (function (_super) {
    __extends(StoryActionText, _super);
    function StoryActionText(params, game, isVisualChoice, isInterrupt) {
        var _this = _super.call(this, params, game) || this;
        _this.isVisualChoice = isVisualChoice;
        _this.isInterrupt = isInterrupt;
        return _this;
    }
    StoryActionText.prototype.execute = function () {
        // stop skipping in player choice
        this.game.control.skipping = false;
        this.game.input.enabled = true;
        if (this.isVisualChoice) {
            this.game.managers.logic.showVisualChoices(__spreadArray([], this.params.body));
        }
        else if (this.isInterrupt) {
            this.game.managers.logic.interrupt(this.params.actor, __spreadArray([], this.params.body));
        }
        else {
            this.game.managers.logic.showChoices(__spreadArray([], this.params.body));
        }
        // this action is resolved on its own
    };
    return StoryActionText;
}(StoryAction_1.default));
exports.default = StoryActionText;
//# sourceMappingURL=StoryActionChoice.js.map