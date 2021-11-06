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
var BackgroundManager = /** @class */ (function () {
    function BackgroundManager(game) {
        this.game = game;
        this.backgrounds = {};
        this.current = null;
        if (game.setup.backgrounds) {
            this.backgrounds = game.setup.backgrounds;
        }
    }
    BackgroundManager.prototype.createBackground = function (name) {
        var str = this.backgrounds[name].split(' ');
        var pos = this.game.storyConfig.positions.BACKGROUND ?
            this.game.storyConfig.positions.BACKGROUND :
            { x: this.game.world.centerX, y: this.game.world.centerY };
        var bg = this.game.managers.story.backgroundSprites.create(pos.x, pos.y, name);
        bg.alpha = 0;
        bg.visible = false;
        bg.name = name;
        bg.anchor.set(0.5);
        if (str.length != 1) {
            var framerate = str.length === 4 ? parseInt(str[3], 10) : 16;
            bg.animated = true;
            bg.animations.add('run', null, framerate);
        }
        return bg;
    };
    BackgroundManager.prototype.set = function (name) {
        if (this.current) {
            this.current.destroy();
        }
        if (!name) {
            this.current = null;
            return;
        }
        this.current = this.createBackground(name);
        this.current.alpha = 1;
        this.current.visible = true;
        if (this.current.animated) {
            this.current.animations.play('run', null, true);
        }
    };
    BackgroundManager.prototype.show = function (name, transitionName) {
        return __awaiter(this, void 0, void 0, function () {
            var oldBg, transitioning;
            return __generator(this, function (_a) {
                oldBg = this.current;
                this.current = name ? this.createBackground(name) : null;
                if (this.current) {
                    this.current.visible = true;
                    if (this.current.animated) {
                        this.current.animations.play('run', null, true);
                    }
                }
                transitioning = this.game.screenEffects.transition.get(transitionName)(oldBg, this.current);
                transitioning.then(function () {
                    if (oldBg)
                        oldBg.destroy();
                });
                return [2 /*return*/, transitioning];
            });
        });
    };
    BackgroundManager.prototype.hide = function (bg, transitionName) {
        if (transitionName === void 0) { transitionName = 'FADEOUT'; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.show(null, transitionName)];
            });
        });
    };
    BackgroundManager.prototype.isBackground = function (actor) {
        return actor in this.backgrounds;
    };
    return BackgroundManager;
}());
exports.default = BackgroundManager;
//# sourceMappingURL=BackgroundManager.js.map