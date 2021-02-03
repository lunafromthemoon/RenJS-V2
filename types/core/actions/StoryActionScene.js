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
var StoryActionScene = /** @class */ (function (_super) {
    __extends(StoryActionScene, _super);
    function StoryActionScene(params, game) {
        return _super.call(this, params, game) || this;
    }
    StoryActionScene.prototype.execute = function () {
        var scene = this.game.managers.logic.parseVars(this.params.scene);
        this.resolve(this.game.managers.story.startScene(scene));
    };
    return StoryActionScene;
}(StoryAction_1.default));
exports.default = StoryActionScene;
//# sourceMappingURL=StoryActionScene.js.map