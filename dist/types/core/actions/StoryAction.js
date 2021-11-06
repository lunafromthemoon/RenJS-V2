"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StoryAction = /** @class */ (function () {
    function StoryAction(params, game) {
        this.game = game;
        this.params = params;
    }
    StoryAction.prototype.resolve = function (transitioning, cont) {
        var _this = this;
        if (transitioning && !cont) {
            transitioning.then(function () { return _this.game.resolveAction(); });
        }
        else {
            this.game.resolveAction();
        }
    };
    StoryAction.prototype.execute = function () {
    };
    return StoryAction;
}());
exports.default = StoryAction;
//# sourceMappingURL=StoryAction.js.map