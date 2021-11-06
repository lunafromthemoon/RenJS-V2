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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Transition_1 = __importDefault(require("../screen-effects/Transition"));
var array_1 = require("../utils/array");
var CGSManager = /** @class */ (function () {
    function CGSManager(game) {
        this.game = game;
        this.cgs = {};
        this.current = {};
    }
    CGSManager.prototype.set = function (current) {
        return __awaiter(this, void 0, void 0, function () {
            var cg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.hideAll(Transition_1.default.CUT)];
                    case 1:
                        _a.sent();
                        this.current = current;
                        for (cg in this.current) {
                            if (cg) {
                                this.show(cg, Transition_1.default.CUT, this.current[cg]);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CGSManager.prototype.hideAll = function (transition) {
        if (transition === void 0) { transition = Transition_1.default.FADEOUT; }
        return __awaiter(this, void 0, void 0, function () {
            var promises, cg;
            return __generator(this, function (_a) {
                promises = [];
                for (cg in this.cgs) {
                    promises.push(this.hide(cg, transition));
                }
                return [2 /*return*/, Promise.all(promises)];
            });
        });
    };
    CGSManager.prototype.show = function (name, transitionName, props) {
        var position = props.position;
        var previousSprite = this.cgs[name];
        if (!previousSprite) {
            if (!position) {
                position = { x: this.game.world.centerX, y: this.game.world.centerY };
            }
            this.cgs[name] = this.game.managers.story[props.layer].create(position.x, position.y, name);
            this.cgs[name].anchor.set(0.5);
            this.cgs[name].alpha = 0;
            if (this.game.setup.cgs[name].animations) {
                for (var key in this.game.setup.cgs[name].animations) {
                    var str = this.game.setup.cgs[name].animations[key].split(' ');
                    // range of animation
                    var frames_1 = array_1.range(parseInt(str[0], 10), parseInt(str[1], 10));
                    var frameRate = 24;
                    if (str.length > 2) {
                        frameRate = parseInt(str[2], 10);
                    }
                    this.cgs[name].animations.add(key, frames_1, frameRate);
                }
            }
        }
        if (!position) {
            position = { x: this.cgs[name].x, y: this.cgs[name].y };
        }
        if (props.zoom) {
            this.cgs[name].scale.set(props.zoom);
        }
        var flipped = false;
        if (props.flipped !== undefined) {
            var currently_flipped = this.cgs[name].scale.x < 0;
            if (props.flipped === 'flip') {
                this.cgs[name].scale.x *= -1;
                flipped = !currently_flipped;
            }
            else {
                flipped = props.flipped;
                if (flipped != currently_flipped) {
                    this.cgs[name].scale.x *= -1;
                }
            }
        }
        if (props.angle) {
            this.cgs[name].angle = props.angle;
        }
        this.current[name] = { name: name, position: position, zoom: props.zoom, angle: props.angle, layer: props.layer, flipped: flipped };
        return this.transition.get(transitionName)(previousSprite, this.cgs[name], position);
    };
    CGSManager.prototype.animate = function (name, toAnimate, time) {
        return __awaiter(this, void 0, void 0, function () {
            var tweenables;
            var _this = this;
            return __generator(this, function (_a) {
                tweenables = {};
                if (toAnimate.alpha !== undefined && toAnimate.alpha !== null) {
                    tweenables.alpha = toAnimate.alpha;
                }
                if (toAnimate.angle !== undefined && toAnimate.angle !== null) {
                    tweenables.angle = toAnimate.angle;
                }
                if (toAnimate.position !== undefined && toAnimate.position !== null) {
                    tweenables.x = toAnimate.position.x;
                    tweenables.y = toAnimate.position.y;
                }
                if (toAnimate.zoom !== undefined && toAnimate.zoom !== null) {
                    if (!this.cgs[name].originalScale) {
                        this.cgs[name].originalScale = { width: this.cgs[name].width, height: this.cgs[name].height };
                    }
                    tweenables.height = this.cgs[name].originalScale.height * toAnimate.zoom;
                    tweenables.width = this.cgs[name].originalScale.width * toAnimate.zoom;
                }
                this.current[name] = __assign(__assign({}, this.current[name]), toAnimate);
                return [2 /*return*/, new Promise(function (resolve) {
                        // Cases for animation and when to resolve
                        // 1. Only tweenables: resolve with tween
                        // 2. Only spritesheet, not looped: resolve when animation stops
                        // 3. Only spritesheet, looped with timer: resolve when timer stops
                        // 4. Only spritesheet, looped with no timer: resolve immediately
                        // 5. Only spritesheet, STOP looped animation: resolve immediately
                        // 6. Spritesheet + tweenables: resolve with tween
                        var resolveFunction = resolve;
                        if (toAnimate.spritesheet) {
                            var stopAnimation = function () {
                                _this.cgs[name].animations.stop();
                                // this.cgs[name].frame = 0;
                                resolve();
                            };
                            if (toAnimate.spritesheet === 'STOP') {
                                // case 5, stop animation and resolve immediately
                                _this.cgs[name].frame = 0;
                                stopAnimation();
                            }
                            else {
                                var str = toAnimate.spritesheet.split(' ');
                                var animName = str[0];
                                var looped = str.includes('LOOPED');
                                var animation = _this.cgs[name].animations.getAnimation(animName);
                                if (str.includes('BACKWARDS')) {
                                    animation.reverseOnce();
                                }
                                animation.play(null, looped);
                                if (Object.keys(tweenables).length == 0) {
                                    // no tweenables, cases 2, 3 and 4
                                    if (!looped) {
                                        // case 2, 
                                        if (_this.game.control.skipping) {
                                            // if skipping game stop immediately
                                            return stopAnimation();
                                        }
                                        else {
                                            return animation.onComplete.addOnce(stopAnimation.bind(_this));
                                        }
                                    }
                                    else {
                                        if (!time) {
                                            // case 4, resolve immediately, don't stop animation
                                            return resolve();
                                        }
                                        else {
                                            // case 3, stop animation and resolve after timeout
                                            return _this.game.waitTimeout(time, stopAnimation.bind(_this));
                                        }
                                    }
                                }
                                else {
                                    // case 6, will resolve after tween
                                    resolveFunction = stopAnimation.bind(_this);
                                }
                            }
                        }
                        // case 1 or 6, will resolve after tween
                        _this.game.managers.tween.tween(_this.cgs[name], tweenables, resolveFunction, time, true);
                    })];
            });
        });
    };
    CGSManager.prototype.hide = function (name, transitionName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.transition.get(transitionName)(this.cgs[name], null)];
                    case 1:
                        _a.sent();
                        this.cgs[name].destroy();
                        delete this.cgs[name];
                        delete this.current[name];
                        return [2 /*return*/];
                }
            });
        });
    };
    CGSManager.prototype.isCGS = function (actor) {
        return actor in this.cgs;
    };
    return CGSManager;
}());
exports.default = CGSManager;
//# sourceMappingURL=CGSManager.js.map