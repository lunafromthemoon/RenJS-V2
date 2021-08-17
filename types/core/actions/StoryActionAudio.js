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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var StoryAction_1 = __importDefault(require("./StoryAction"));
var StoryActionAudio = /** @class */ (function (_super) {
    __extends(StoryActionAudio, _super);
    function StoryActionAudio(params, game, action) {
        var _this = _super.call(this, params, game) || this;
        _this.action = action;
        return _this;
    }
    StoryActionAudio.prototype.execute = function () {
        if (this.action == 'play') {
            if (this.params.actorType === 'music') {
                var audioType = this.params.asBGS ? 'bgs' : 'bgm';
                this.game.managers.audio.play(this.params.actor, audioType, this.params.looped, this.params.fromSeconds, this.params.transition, this.params.force);
            }
            else {
                this.game.managers.audio.playSFX(this.params.actor);
            }
        }
        else {
            this.game.managers.audio.stop(this.params.actor, this.params.transition);
        }
        this.resolve();
    };
    return StoryActionAudio;
}(StoryAction_1.default));
exports.default = StoryActionAudio;
//# sourceMappingURL=StoryActionAudio.js.map