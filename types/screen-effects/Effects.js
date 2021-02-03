"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var Effects = /** @class */ (function () {
    function Effects(game) {
        this.game = game;
        this.audioManager = game.managers.audio;
        this.tweenManager = game.managers.tween;
    }
    Effects.prototype.SHAKE = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.game.camera.shake(0.01, 200);
                return [2 /*return*/];
            });
        });
    };
    Effects.prototype.ROLLINGCREDITS = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var bg, style, credits, separation, i, nextLine, timePerLine, tweenChain;
            var _this = this;
            return __generator(this, function (_a) {
                // params: text (list of strings), music (music id), timePerLine (int), endGame (boolean)
                this.game.control.unskippable = true;
                bg = this.game.add.graphics(0, 0);
                if (params.music) {
                    this.audioManager.play(params.music, 'bgm', true, 'FADE');
                }
                bg.beginFill(0x000000, 1);
                bg.drawRect(0, 0, this.game.config.w, this.game.config.h);
                bg.endFill();
                bg.alpha = 0;
                style = __assign({}, this.game.gui.getTextStyle('choice'));
                credits = this.game.add.text(this.game.world.centerX, this.game.config.h + 30, params.text[0], style);
                credits.anchor.set(0.5);
                separation = 35;
                for (i = 1; i < params.text.length; i++) {
                    if (params.text[i]) {
                        nextLine = this.game.add.text(0, i * separation, params.text[i], style);
                        nextLine.anchor.set(0.5);
                        credits.addChild(nextLine);
                    }
                }
                timePerLine = params.time ? params.timePerLine : 700;
                tweenChain = [
                    { sprite: bg, tweenables: { alpha: 1 }, time: this.game.storyConfig.fadetime },
                    { sprite: credits, tweenables: { y: -(separation * params.text.length + 30) }, time: timePerLine * params.text.length },
                ];
                return [2 /*return*/, new Promise(function (resolve) {
                        tweenChain.push({
                            sprite: bg, tweenables: { alpha: 0 }, time: _this.game.storyConfig.fadetime,
                            callback: function () {
                                bg.destroy();
                                credits.destroy();
                                _this.audioManager.stop('bgm', 'FADE');
                                _this.game.control.unskippable = false;
                                if (!params.endGame) {
                                    resolve();
                                }
                                else {
                                    _this.game.endGame();
                                }
                            }
                        });
                        _this.tweenManager.chain(tweenChain, true);
                    })];
            });
        });
    };
    Effects.prototype.FLASHIMAGE = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var image;
            var _this = this;
            return __generator(this, function (_a) {
                if (params.screenShake) {
                    this.SHAKE();
                }
                if (params.sfx) {
                    this.audioManager.playSFX(params.sfx);
                }
                image = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, params.image);
                image.anchor.set(0.5);
                return [2 /*return*/, new Promise(function (resolve) {
                        setTimeout(function () {
                            var tween = _this.game.add.tween(image);
                            tween.to({ alpha: 0 }, _this.game.storyConfig.fadetime / 2, Phaser.Easing.Linear.None);
                            tween.onComplete.add(function () {
                                image.destroy();
                                resolve();
                            });
                            tween.start();
                        }, _this.game.storyConfig.fadetime / 3);
                    })];
            });
        });
    };
    return Effects;
}());
exports.default = Effects;
//# sourceMappingURL=Effects.js.map