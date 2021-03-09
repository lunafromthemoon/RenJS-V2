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
var Transition = /** @class */ (function () {
    function Transition(game) {
        this.game = game;
        this.tweenManager = game.managers.tween;
    }
    Transition.prototype.get = function (name) {
        if (this[name]) {
            return this[name].bind(this);
        }
        else if (this.game.pluginsRJS[name]) {
            return this.game.pluginsRJS[name].onCall.bind(this.game.pluginsRJS[name]);
        }
    };
    Transition.prototype.CUT = function (from, to, position, scaleX) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (from) {
                    from.alpha = 0;
                }
                if (to) {
                    setNewProperties(to, position, scaleX);
                    to.alpha = 1;
                }
                return [2 /*return*/];
            });
        });
    };
    Transition.prototype.FADE = function (from, to, position, scaleX) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!from)
                    return [2 /*return*/, this.FADEIN(to, position, scaleX)];
                if (!to)
                    return [2 /*return*/, this.FADEOUT(from)];
                return [2 /*return*/, new Promise(function (resolve) {
                        _this.tweenManager.chain([
                            {
                                sprite: from, tweenables: { alpha: 0 },
                                callback: function () {
                                    setNewProperties(to, position, scaleX);
                                    resolve();
                                }
                            },
                            { sprite: to, tweenables: { alpha: 1 } }
                        ], false, _this.game.storyConfig.fadetime);
                    })];
            });
        });
    };
    Transition.prototype.FADEOUT = function (from) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        _this.tweenManager.tween(from, { alpha: 0 }, resolve, _this.game.storyConfig.fadetime, true, 0, false);
                    })];
            });
        });
    };
    Transition.prototype.FADEIN = function (to, position, scaleX) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        setNewProperties(to, position, scaleX);
                        _this.tweenManager.tween(to, { alpha: 1 }, resolve, _this.game.storyConfig.fadetime, true, 0, false);
                    })];
            });
        });
    };
    Transition.prototype.FUSION = function (from, to, position, scaleX) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!from || !to) {
                    return [2 /*return*/, this.FADE(from, to, position)];
                }
                return [2 /*return*/, new Promise(function (resolve) {
                        if (from.parent) {
                            from.parent.bringToTop(from);
                        }
                        setNewProperties(to, position, scaleX);
                        to.alpha = 1;
                        _this.tweenManager.tween(from, { alpha: 0 }, function () {
                            resolve();
                        }, _this.game.storyConfig.fadetime, true, 0, false);
                    })];
            });
        });
    };
    Transition.prototype.MOVE = function (from, to, position, scaleX) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!from || !to) {
                    return [2 /*return*/, this.CUT(from, to, position)];
                }
                return [2 /*return*/, new Promise(function (resolve) {
                        _this.tweenManager.tween(from, { x: position.x, y: position.y }, function () {
                            setNewProperties(to, position, scaleX);
                            from.alpha = 0;
                            to.alpha = 1;
                            resolve();
                        }, _this.game.storyConfig.fadetime, true, 0, false);
                    })];
            });
        });
    };
    Transition.prototype.FADETOCOLOUR = function (from, to, colour, position, scaleX) {
        return __awaiter(this, void 0, void 0, function () {
            var sprBg;
            var _this = this;
            return __generator(this, function (_a) {
                sprBg = this.game.add.graphics(0, 0);
                // this.fadeColor = fadeColor ? fadeColor : 0x000000;
                sprBg.beginFill(colour, 1);
                sprBg.drawRect(0, 0, this.game.config.w, this.game.config.h);
                sprBg.alpha = 0;
                sprBg.endFill();
                return [2 /*return*/, new Promise(function (resolve) {
                        _this.tweenManager.chain([
                            {
                                sprite: sprBg, tweenables: { alpha: 1 },
                                callback: function () {
                                    if (from) {
                                        from.alpha = 0;
                                    }
                                    if (to) {
                                        setNewProperties(to, position, scaleX);
                                        to.alpha = 1;
                                    }
                                }
                            },
                            {
                                sprite: sprBg, tweenables: { alpha: 0 },
                                callback: function () {
                                    sprBg.destroy();
                                    resolve();
                                }
                            }
                        ], false, _this.game.storyConfig.fadetime);
                    })];
            });
        });
    };
    Transition.prototype.FADETOBLACK = function (from, to, position, scaleX) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.FADETOCOLOUR(from, to, 0x000000, position, scaleX)];
            });
        });
    };
    Transition.prototype.FADETOWHITE = function (from, to, position, scaleX) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.FADETOCOLOUR(from, to, 0xFFFFFF, position, scaleX)];
            });
        });
    };
    Transition.prototype.FADETOBG = function (from, to, position, scaleX) {
        return __awaiter(this, void 0, void 0, function () {
            var bgColor;
            return __generator(this, function (_a) {
                bgColor = this.game.config.backgroundColor;
                return [2 /*return*/, this.FADETOCOLOUR(from, to, bgColor, position, scaleX)];
            });
        });
    };
    Transition.CUT = 'CUT';
    Transition.FADE = 'FADE';
    Transition.FADEOUT = 'FADEOUT';
    Transition.FADEIN = 'FADEIN';
    Transition.FUSION = 'FUSION';
    Transition.MOVE = 'MOVE';
    Transition.FADETOCOLOUR = 'FADETOCOLOUR';
    return Transition;
}());
exports.default = Transition;
var setNewProperties = function (sprite, position, scaleX) {
    if (position) {
        sprite.x = position.x;
        sprite.y = position.y;
    }
    if (scaleX !== null && scaleX !== undefined) {
        sprite.scale.x = scaleX;
    }
};
//# sourceMappingURL=Transition.js.map