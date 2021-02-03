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
var StoryActionWait = /** @class */ (function (_super) {
    __extends(StoryActionWait, _super);
    function StoryActionWait(params, game) {
        return _super.call(this, params, game) || this;
    }
    StoryActionWait.prototype.execute = function () {
        if (this.params.wait === 'click') {
            this.game.waitForClick();
        }
        else {
            this.game.waitTimeout(parseInt(this.params.wait, 10));
        }
        // this action is resolved on its own
    };
    return StoryActionWait;
}(StoryAction_1.default));
exports.default = StoryActionWait;
//# sourceMappingURL=StoryActionWait.js.map