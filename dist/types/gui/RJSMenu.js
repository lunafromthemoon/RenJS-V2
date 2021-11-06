"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var phaser_ce_1 = require("phaser-ce");
var utils_1 = require("../states/utils");
var MaskSlider_1 = __importDefault(require("./elements/MaskSlider"));
var SaveSlot_1 = __importDefault(require("./elements/SaveSlot"));
var RJSMenu = /** @class */ (function (_super) {
    __extends(RJSMenu, _super);
    function RJSMenu(game, config) {
        var _this = _super.call(this, game, config.x, config.y, config.asset) || this;
        _this.config = config;
        // if element has id, index it for quick reference
        _this.indexedElements = {};
        _this.game = game;
        _this.visible = false;
        _this.id = config.id;
        _this.indexedElements;
        _this.elementFactory = {
            image: _this.createImage,
            button: _this.createButton,
            label: _this.createLabel,
            slider: _this.createSlider,
            saveSlot: _this.createSaveSlot
        };
        return _this;
    }
    RJSMenu.prototype.init = function () {
        for (var _i = 0, _a = this.config.elements; _i < _a.length; _i++) {
            var elementConfig = _a[_i];
            var element = this.elementFactory[elementConfig.type](elementConfig);
            if (elementConfig.id) {
                this.indexedElements[elementConfig] = element;
            }
        }
    };
    RJSMenu.prototype.createImage = function (element) {
        var spr = this.game.add.sprite(element.x, element.y, element.asset, 0, this);
        if (spr.animations.frameTotal) {
            spr.animations.add('do').play();
        }
        return spr;
    };
    RJSMenu.prototype.createLabel = function (element) {
        var label = this.game.add.text(element.x, element.y, "", element.style, this);
        if (element.lineSpacing) {
            label.lineSpacing = element.lineSpacing;
        }
        label.text = utils_1.setTextStyles(element.text, label);
        return label;
    };
    RJSMenu.prototype.createButton = function (element) {
        var _this = this;
        // button frames -> over|out|down|up
        var buttonFrames = {
            1: [[0, 0, 0, 0], [1, 1, 1, 1]],
            2: [[1, 0, 1, 0], [3, 2, 3, 2]],
            3: [[1, 0, 2, 0], [4, 3, 5, 3]],
            4: [[1, 0, 2, 3], [5, 4, 6, 7]],
        };
        var btn = this.game.add.button(element.x, element.y, element.asset, function () {
            if (element.sfx && element.sfx !== 'none') {
                _this.game.managers.audio.playSFX(element.sfx);
            }
            if (element.pushButton) {
                element.pushed = !element.pushed;
                btn.setFrames.apply(btn, buttonFrames[frames][element.pushed ? 1 : 0]);
            }
            _this.game.gui.buttonsAction[element.binding](element);
        }, this, 0, 0, 0, 0, this);
        var frames = btn.animations.frameTotal / (element.pushButton ? 2 : 1);
        if (element.pushButton && element.pushed) {
            // change frames
            btn.setFrames.apply(btn, buttonFrames[frames][1]);
        }
        else {
            btn.setFrames.apply(btn, buttonFrames[frames][0]);
        }
        return btn;
    };
    RJSMenu.prototype.createSlider = function (element) {
        var startVal = this.game.userPreferences[element.binding];
        var range = this.game.propertyRanges[element.binding];
        var slider = new MaskSlider_1.default(this.game, element, startVal, range[0], range[1]);
        return slider;
    };
    RJSMenu.prototype.createSaveSlot = function (element) {
        return new SaveSlot_1.default(this.game, element);
        // this.saveSlots[element.slot] = sprite;
    };
    RJSMenu.prototype.show = function (text, color) {
        return __awaiter(this, void 0, void 0, function () {
            var transition;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.alpha = 0;
                        this.visible = true;
                        // menu transitions are unskippable
                        this.game.control.unskippable = true;
                        if (this.config.backgroundMusic) {
                            this.game.managers.audio.play(this.config.backgroundMusic, "bgm", true);
                        }
                        transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.menus);
                        return [4 /*yield*/, transition(null, this)];
                    case 1:
                        _a.sent();
                        // unlock unskippable
                        this.game.control.unskippable = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    RJSMenu.prototype.hide = function (mute) {
        return __awaiter(this, void 0, void 0, function () {
            var transition;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (mute && this.config.backgroundMusic) {
                            this.game.managers.audio.stop('bgm');
                        }
                        this.game.control.unskippable = true;
                        transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.menus);
                        return [4 /*yield*/, transition(this, null)];
                    case 1:
                        _a.sent();
                        this.game.control.unskippable = false;
                        this.visible = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    RJSMenu.prototype.destroy = function () {
        this.destroy();
    };
    return RJSMenu;
}(phaser_ce_1.Group));
exports.default = RJSMenu;
//# sourceMappingURL=RJSMenu.js.map