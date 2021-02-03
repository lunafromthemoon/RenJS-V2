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
        function getKey(act) {
            return Object.keys(act)[0];
        }
        var key = getKey(this.params);
        var condition = key.substr(key.indexOf('('));
        var branches = {
            ISTRUE: this.params[key]
        };
        var next = this.game.managers.story.currentScene[0];
        if (next && getKey(next) === 'else') {
            branches.ISFALSE = next.else;
            this.game.managers.story.currentScene.shift();
        }
        this.game.managers.logic.branch(condition, branches);
        this.resolve();
    };
    return StoryActionEffect;
}(StoryAction_1.default));
exports.default = StoryActionEffect;
//# sourceMappingURL=StoryActionIf.js.map