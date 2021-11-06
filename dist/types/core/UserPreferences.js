"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserPreferences = /** @class */ (function () {
    function UserPreferences(game, defaultPreferences) {
        this.game = game;
        this.textSpeed = 20;
        this.autoSpeed = 150;
        this.bgmv = 0.5;
        this.sfxv = 0.5;
        this.muted = false;
        var data = localStorage.getItem('RenJSUserPreferences' + game.config.name);
        if (data) {
            this.setPreferences(JSON.parse(data));
        }
        else {
            this.setPreferences(defaultPreferences);
        }
    }
    UserPreferences.prototype.setPreferences = function (preferences) {
        if (preferences) {
            for (var prefence in preferences) {
                this[prefence] = preferences[prefence];
            }
        }
    };
    UserPreferences.prototype.setPreference = function (type, value) {
        this[type] = value;
        this.savePreferences();
    };
    UserPreferences.prototype.savePreferences = function () {
        var preferences = { textSpeed: this.textSpeed, autoSpeed: this.autoSpeed, bgmv: this.bgmv, sfxv: this.sfxv, muted: this.muted };
        localStorage.setItem('RenJSUserPreferences' + this.game.config.name, JSON.stringify(preferences));
    };
    return UserPreferences;
}());
exports.default = UserPreferences;
//# sourceMappingURL=UserPreferences.js.map