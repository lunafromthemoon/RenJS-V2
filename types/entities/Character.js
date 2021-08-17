"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Character = /** @class */ (function () {
    function Character(keyName, name, speechColour, voice) {
        this.currentLook = null;
        this.lastScale = 1;
        this.voice = null;
        this.keyName = keyName;
        this.name = name;
        this.speechColour = speechColour;
        this.voice = voice;
    }
    return Character;
}());
exports.default = Character;
//# sourceMappingURL=Character.js.map