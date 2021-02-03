"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TextManager = /** @class */ (function () {
    function TextManager(game) {
        this.game = game;
    }
    TextManager.prototype.set = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        //
    };
    TextManager.prototype.show = function (text, title, colour) {
        var _this = this;
        var t = this.game.managers.logic.parseVars(text.toString());
        this.game.gui.showText(t, title, colour, function () {
            _this.game.waitForClick(function () {
                _this.game.gui.hideText();
                _this.game.resolveAction();
            });
        });
    };
    ;
    TextManager.prototype.hide = function () {
        this.game.gui.hideText();
    };
    TextManager.prototype.say = function (name, look, text) {
        var character = this.game.managers.character.characters[name];
        if (look) {
            this.game.managers.character.show(name, this.game.storyConfig.transitions.say, { look: look });
        }
        this.show(text, character.name, character.speechColour);
    };
    return TextManager;
}());
exports.default = TextManager;
//# sourceMappingURL=TextManager.js.map