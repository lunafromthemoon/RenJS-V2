"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var AudioManager = /** @class */ (function () {
    function AudioManager(game) {
        this.current = { bgm: null, bgs: null };
        // audioLoaded: boolean;
        this.musicList = {};
        this.sfx = {};
        this.game = game;
        this.changeVolume("bgm", game.userPreferences.bgmv);
    }
    AudioManager.prototype.play = function (key, type, looped, transition) {
        if (looped === undefined) {
            looped = true;
        }
        // stop old music
        this.stop(type, transition);
        // add new music
        this.current[type] = this.game.add.audio(key);
        if (!this.game.userPreferences.muted) {
            if (transition === 'FADE') {
                this.current[type].fadeIn(1500, looped);
            }
            else {
                this.current[type].play('', 0, 1, looped);
            }
        }
    };
    AudioManager.prototype.stop = function (type, transition) {
        if (!this.current[type]) {
            return;
        }
        if (!this.game.userPreferences.muted) {
            this.stopAudio(this.current[type], transition);
            this.current[type] = null;
        }
    };
    AudioManager.prototype.stopAudio = function (audio, transition) {
        if (transition === 'FADE') {
            audio.onFadeComplete.add(function () {
                audio.destroy();
            });
            audio.fadeOut(1500);
        }
        else {
            audio.destroy();
        }
    };
    AudioManager.prototype.playSFX = function (key) {
        if (!this.game.userPreferences.muted) {
            var sfx_1 = this.game.sound.play(key, this.game.userPreferences.sfxv);
            sfx_1.onStop.addOnce(function () {
                sfx_1.destroy();
            });
        }
    };
    AudioManager.prototype.set = function (current) {
        this.current = current;
        if (current.bgm) {
            this.play(current.bgm, 'bgm', true, 'FADE');
        }
        if (current.bgs) {
            this.play(current.bgs, 'bgs', true, 'FADE');
        }
    };
    AudioManager.prototype.changeVolume = function (type, volume) {
        this.game.sound.volume = volume;
    };
    AudioManager.prototype.decodeAudio = function (audioList) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // if (this.game.setup.music){
                //     Object.keys(this.game.setup.music).forEach(key => {
                //         this.musicList[key] = this.game.add.audio(key);
                //         audioList.push(this.musicList[key]);
                //     },this);
                // }
                // if (this.game.setup.sfx){
                //     Object.keys(this.game.setup.sfx).forEach(key => {
                //         this.sfx[key] = this.game.add.audio(key);
                //         audioList.push(this.sfx[key]);
                //     });
                // }
                return [2 /*return*/, new Promise(function (resolve) {
                        _this.game.sound.setDecodedCallback(audioList, function () {
                            // this.audioLoaded = true;
                            resolve();
                        });
                    })];
            });
        });
    };
    AudioManager.prototype.isMusic = function (actor) {
        return actor in this.game.setup.music;
    };
    AudioManager.prototype.isSfx = function (actor) {
        return actor in this.game.setup.sfx;
    };
    AudioManager.prototype.mute = function () {
        if (this.game.userPreferences.muted) {
            if (this.current.bgm) {
                this.musicList[this.current.bgm].play('', 0, 1, true);
            }
            if (this.current.bgs) {
                this.musicList[this.current.bgs].play('', 0, 1, true);
            }
        }
        else {
            if (this.current.bgm) {
                this.musicList[this.current.bgm].stop();
            }
            if (this.current.bgs) {
                this.musicList[this.current.bgs].stop();
            }
        }
        this.game.userPreferences.setPreference('muted', !this.game.userPreferences.muted);
    };
    AudioManager.prototype.stopAll = function () {
        this.stop('bgs', 'FADE');
        this.stop('bgm', 'FADE');
    };
    return AudioManager;
}());
exports.default = AudioManager;
//# sourceMappingURL=AudioManager.js.map