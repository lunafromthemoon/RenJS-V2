"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Plugin = /** @class */ (function () {
    function Plugin(name, game) {
        this.game = game;
        this.name = name;
    }
    Plugin.prototype.onInit = function () { };
    Plugin.prototype.onStart = function () { };
    Plugin.prototype.onLoad = function (slot, data) { };
    Plugin.prototype.onSave = function (slot, data) { };
    Plugin.prototype.onCall = function (params) { };
    Plugin.prototype.onTeardown = function () {
    };
    return Plugin;
}());
exports.default = Plugin;
//# sourceMappingURL=Plugin.js.map