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
        this.active = { bgm: null, bgs: null };
        this.sfxCache = {};
        this.game = game;
        this.changeVolume("bgm", game.userPreferences.bgmv);
    }
    AudioManager.prototype.getActive = function () {
        return this.active;
    };
    AudioManager.prototype.play = function (key, type, looped, fromSeconds, transition, force) {
        var _this = this;
        if (type === void 0) { type = 'bgm'; }
        if (looped === void 0) { looped = false; }
        if (fromSeconds === void 0) { fromSeconds = null; }
        if (transition === void 0) { transition = 'FADE'; }
        if (force === void 0) { force = false; }
        if (!force && this.current[type] && this.current[type].key == key && this.current[type].isPlaying) {
            // music is the same, and it's playing, do nothing
            return;
        }
        // stop old music
        this.stop(type, transition);
        if (this.unavailableAudio.includes(key)) {
            console.warn("Audio related to key " + key + " is unavailable for playback.");
            return;
        }
        // add new music
        var music = this.game.add.audio(key);
        this.active[type] = {
            key: key,
            looped: looped,
            fromSeconds: fromSeconds,
            transition: transition
        };
        this.current[type] = music;
        var marker = '';
        if (looped && fromSeconds) {
            marker = 'intro';
            // looped = false;
            music.addMarker(marker, 0, fromSeconds, null, false);
            music.onMarkerComplete.addOnce(function () {
                music.addMarker("looped", fromSeconds, music.totalDuration - fromSeconds, null, true);
                music.play("looped");
                music.volume = _this.game.userPreferences.bgmv;
            });
        }
        music.play(marker, 0, null, looped);
        // volume has to be set after it starts or it will ignore it
        if (transition == 'FADE') {
            music.volume = 0;
            this.game.add.tween(music).to({ volume: this.game.userPreferences.bgmv }, 1500, null, true);
        }
        else {
            music.volume = this.game.userPreferences.bgmv;
        }
    };
    AudioManager.prototype.stop = function (type, transition) {
        if (transition === void 0) { transition = 'FADE'; }
        if (!this.current[type]) {
            return;
        }
        if (!this.game.userPreferences.muted) {
            this.stopAudio(this.current[type], transition);
            this.current[type] = null;
            this.active[type] = null;
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
    AudioManager.prototype.playSFX = function (key, volume) {
        if (this.unavailableAudio.includes(key)) {
            console.warn("SFX related to key " + key + " is unavailable for playback.");
            return;
        }
        if (!this.game.userPreferences.muted) {
            var sfx = this.sfxCache[key] ? this.sfxCache[key] : this.game.add.audio(key);
            this.sfxCache[key] = sfx;
            sfx.volume = volume ? volume : this.game.userPreferences.sfxv;
            sfx.play();
        }
    };
    AudioManager.prototype.set = function (active) {
        for (var _i = 0, _a = ['bgm', 'bgs']; _i < _a.length; _i++) {
            var type = _a[_i];
            if (!active[type])
                continue;
            this.play(active[type].key, type, active[type].looped, active[type].fromSeconds, active[type].transition);
        }
    };
    AudioManager.prototype.changeVolume = function (type, volume) {
        if (this.current.bgm) {
            this.current.bgm.volume = this.game.userPreferences.bgmv;
        }
        if (this.current.bgs) {
            this.current.bgs.volume = this.game.userPreferences.bgmv;
        }
    };
    AudioManager.prototype.decodeAudio = function (audioList) {
        return __awaiter(this, void 0, void 0, function () {
            var availableAudios;
            var _this = this;
            return __generator(this, function (_a) {
                availableAudios = audioList.filter(function (audio) { return _this.game.cache.checkSoundKey(audio); });
                this.unavailableAudio = audioList.filter(function (audio) { return !_this.game.cache.checkSoundKey(audio); });
                if (availableAudios.length == 0)
                    return [2 /*return*/];
                return [2 /*return*/, new Promise(function (resolve) {
                        _this.game.sound.setDecodedCallback(availableAudios, function () {
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
            this.game.sound.volume = this.game.userPreferences.bgmv;
        }
        else {
            this.game.sound.volume = 0;
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