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
var StoryActionAmbient = /** @class */ (function (_super) {
    __extends(StoryActionAmbient, _super);
    function StoryActionAmbient(params, game) {
        return _super.call(this, params, game) || this;
    }
    StoryActionAmbient.prototype.execute = function () {
        if (this.game.screenEffects.ambient[this.params.actor]) {
            this.game.screenEffects.ambient[this.params.actor](this.params);
            this.resolve();
        }
        else if (this.game.pluginsRJS[this.params.actor]) {
            this.game.pluginsRJS[this.params.actor].execute(this.params);
            // plugins resolve themselves
        }
        else {
            this.resolve();
        }
    };
    return StoryActionAmbient;
}(StoryAction_1.default));
exports.default = StoryActionAmbient;
//# sourceMappingURL=StoryActionAmbient.js.map