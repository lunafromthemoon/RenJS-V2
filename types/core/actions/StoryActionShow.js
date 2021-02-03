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
var StoryActionShow = /** @class */ (function (_super) {
    __extends(StoryActionShow, _super);
    function StoryActionShow(params, game) {
        return _super.call(this, params, game) || this;
    }
    StoryActionShow.prototype.execute = function () {
        var transitioning = this.params.manager.show(this.params.actor, this.params.transition, this.params);
        this.resolve(transitioning, this.params.contAfterTrans);
    };
    return StoryActionShow;
}(StoryAction_1.default));
exports.default = StoryActionShow;
//# sourceMappingURL=StoryActionShow.js.map