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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
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
        if (this.isVisualChoice) {
            this.game.managers.logic.showVisualChoices(__spreadArrays(this.params.body));
        }
        else if (this.isInterrupt) {
            this.game.managers.logic.interrupt(this.params.actor, __spreadArrays(this.params.body));
        }
        else {
            this.game.managers.logic.showChoices(__spreadArrays(this.params.body));
        }
        // this action is resolved on its own
    };
    return StoryActionText;
}(StoryAction_1.default));
exports.default = StoryActionText;
//# sourceMappingURL=StoryActionChoice.js.map