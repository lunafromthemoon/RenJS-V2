"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TextManager = /** @class */ (function () {
    function TextManager(game) {
        this.textLog = [];
        this.game = game;
    }
    TextManager.prototype.set = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        //
    };
    TextManager.prototype.show = function (text, title, colour, sfx, dontHide) {
        var _this = this;
        return new Promise(function (resolve) {
            var t = _this.game.managers.logic.parseVars(text.toString());
            if (_this.game.storyConfig.logText) {
                _this.textLog.push({ text: t, title: title, colour: colour });
            }
            _this.game.gui.showText(t, title, colour, sfx, function () {
                _this.game.waitForClick(function () {
                    if (!dontHide) {
                        _this.game.gui.hideText();
                    }
                    // this.game.resolveAction();
                    resolve(true);
                });
            });
        });
    };
    ;
    TextManager.prototype.hide = function () {
        this.game.gui.hideText();
    };
    TextManager.prototype.say = function (name, look, text, dontHide) {
        var character = this.game.managers.character.characters[name];
        if (look) {
            this.game.managers.character.show(name, this.game.storyConfig.transitions.say, { look: look });
        }
        return this.show(text, character.name, character.speechColour, character.voice, dontHide);
    };
    return TextManager;
}());
exports.default = TextManager;
//# sourceMappingURL=TextManager.js.map