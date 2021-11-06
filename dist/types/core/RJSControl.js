"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ExecStack_1 = __importDefault(require("./ExecStack"));
var RJSControl = /** @class */ (function () {
    function RJSControl() {
        // game status controls
        this.skipping = false;
        this.unskippable = false;
        this.auto = false;
        this.paused = false;
        // click controls
        this.clickCooldown = 200;
        this.clickLocked = false;
        this.waitForClick = false;
        // story controls
        this.execStack = new ExecStack_1.default();
        this.actionsCounter = 0;
        this.nextAction = null;
        // this.clickCooldown = defaultValues.clickCooldown
        // this.fadetime = defaultValues.fadetime
        // this.timeout = defaultValues.timeout
    }
    return RJSControl;
}());
exports.default = RJSControl;
//# sourceMappingURL=RJSControl.js.map