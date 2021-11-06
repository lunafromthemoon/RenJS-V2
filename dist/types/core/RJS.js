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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
require("pixi");
require("p2");
var phaser_ce_1 = __importStar(require("phaser-ce"));
var RJSControl_1 = __importDefault(require("./RJSControl"));
var ExecStack_1 = __importDefault(require("./ExecStack"));
var BackgroundManager_1 = __importDefault(require("../managers/BackgroundManager"));
var CharacterManager_1 = __importDefault(require("../managers/CharacterManager"));
var AudioManager_1 = __importDefault(require("../managers/AudioManager"));
var CGSManager_1 = __importDefault(require("../managers/CGSManager"));
var TextManager_1 = __importDefault(require("../managers/TextManager"));
var TweenManager_1 = __importDefault(require("../managers/TweenManager"));
var LogicManager_1 = __importDefault(require("../managers/LogicManager"));
var StoryManager_1 = __importDefault(require("../managers/StoryManager"));
var Ambient_1 = __importDefault(require("../screen-effects/Ambient"));
var Effects_1 = __importDefault(require("../screen-effects/Effects"));
var Transition_1 = __importDefault(require("../screen-effects/Transition"));
var UserPreferences_1 = __importDefault(require("./UserPreferences"));
var Boot_1 = __importDefault(require("../states/Boot"));
var LanguageChooser_1 = __importDefault(require("../states/LanguageChooser"));
var RJS = /** @class */ (function (_super) {
    __extends(RJS, _super);
    function RJS(config) {
        var _this = _super.call(this, config.w, config.h, config.renderer, config.parent) || this;
        _this.gameStarted = false;
        _this.xShots = [];
        _this.tools = {};
        _this.screenReady = false;
        _this.pluginsRJS = {};
        _this.interruptAction = null;
        _this.propertyRanges = {
            textSpeed: [10, 100],
            autoSpeed: [50, 300],
            bgmv: [0, 1],
            sfxv: [0, 1]
        };
        _this.control = new RJSControl_1.default();
        _this.config = config;
        return _this;
        // this.userPreferences = new UserPreferences(this);
    }
    RJS.prototype.addPlugin = function (name, cls) {
        this.pluginsRJS[name] = new cls(name, this);
        this.pluginsRJS[name] = new cls(name, this);
    };
    RJS.prototype.launch = function () {
        this.preserveDrawingBuffer = true;
        // this.state.add('loader', Loader)
        // this.state.start('loader')
        this.state.add('bootstrap', Boot_1.default);
        if (this.config.i18n) {
            // try to load previously chosen Language
            var lang = localStorage.getItem('RenJS_I18N' + this.config.name);
            if (this.config.i18n.langs[lang]) {
                this.config.i18n.current = lang;
                this.state.start('bootstrap');
            }
            else {
                this.state.add('chooseLang', LanguageChooser_1.default);
                this.state.start('chooseLang');
            }
        }
        else {
            this.state.start('bootstrap');
        }
    };
    RJS.prototype.setupScreen = function () {
        var _this = this;
        if (this.screenReady)
            return;
        this.scale.scaleMode = this.config.scaleMode;
        if (!(this.config.scaleMode === phaser_ce_1.default.ScaleManager.EXACT_FIT)) {
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
        }
        if (this.config.scaleMode === undefined) {
            this.scale.setResizeCallback(function (scale, parentBounds) {
                _this.config.userScale(scale, parentBounds);
            }, this);
        }
        this.scale.refresh();
        this.screenReady = true;
    };
    RJS.prototype.initStory = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, plugin, audioList;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.userPreferences = new UserPreferences_1.default(this, this.storyConfig.userPreferences);
                        this.managers = {
                            tween: new TweenManager_1.default(this),
                            story: new StoryManager_1.default(this),
                            audio: new AudioManager_1.default(this),
                            logic: new LogicManager_1.default(this),
                            text: new TextManager_1.default(this),
                            background: new BackgroundManager_1.default(this),
                            character: new CharacterManager_1.default(this),
                            cgs: new CGSManager_1.default(this) // need transition
                        };
                        this.screenEffects = {
                            ambient: new Ambient_1.default(this),
                            effects: new Effects_1.default(this),
                            transition: new Transition_1.default(this) // need tween
                        };
                        this.managers.character.transition = this.screenEffects.transition;
                        this.managers.cgs.transition = this.screenEffects.transition;
                        // init game and start main menu
                        this.managers.story.setupStory();
                        return [4 /*yield*/, this.gui.init()];
                    case 1:
                        _c.sent();
                        this.initInput();
                        _a = [];
                        for (_b in this.pluginsRJS)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        plugin = _a[_i];
                        if (!this.pluginsRJS[plugin].onInit) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.pluginsRJS[plugin].onInit()];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        if (!!this.setup.lazyloading) return [3 /*break*/, 7];
                        // decode audio for all game
                        if (!this.setup.music)
                            this.setup.music = {};
                        if (!this.setup.sfx)
                            this.setup.sfx = {};
                        audioList = Object.keys(this.setup.music).concat(Object.keys(this.setup.sfx));
                        return [4 /*yield*/, this.managers.audio.decodeAudio(audioList)];
                    case 6:
                        _c.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        if (this.setup.lazyloading.backgroundLoading) {
                            this.managers.story.assetLoader.loadEpisodeInBackground(0);
                        }
                        _c.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    RJS.prototype.pause = function (keepGUI) {
        this.control.paused = true;
        this.control.skipping = false;
        this.control.auto = false;
        this.takeXShot();
        if (!keepGUI) {
            this.gui.hideHUD();
        }
    };
    RJS.prototype.takeXShot = function () {
        if (!this.xShots)
            this.xShots = [];
        this.xShots.push(this.canvas.toDataURL("image/jpeg"));
    };
    RJS.prototype.unpause = function (force) {
        this.control.paused = false;
        this.gui.showHUD();
        if (!this.control.waitForClick && this.managers.logic.currentChoices.length == 0) {
            this.resolveAction();
        }
    };
    RJS.prototype.setBlackOverlay = function () {
        this.blackOverlay = this.add.graphics(0, 0);
        this.managers.story.cgsSprites.addChild(this.blackOverlay);
        var color = this.config.backgroundColor ? this.config.backgroundColor : 0x000000;
        this.blackOverlay.beginFill(color, 1);
        this.blackOverlay.drawRect(0, 0, this.config.w, this.config.h);
        this.blackOverlay.endFill();
    };
    RJS.prototype.removeBlackOverlay = function () {
        var _this = this;
        if (this.blackOverlay) {
            var tween = this.add.tween(this.blackOverlay);
            tween.onComplete.addOnce(function () {
                _this.blackOverlay.destroy();
                _this.blackOverlay = null;
            });
            tween.to({ alpha: 0 }, this.storyConfig.fadetime * 2, phaser_ce_1.default.Easing.Linear.None, true);
        }
    };
    RJS.prototype.endGame = function () {
        this.setBlackOverlay();
        this.managers.story.clearScene();
        this.gameStarted = false;
        this.control.paused = true;
        for (var plugin in this.pluginsRJS) {
            if (this.pluginsRJS[plugin].onTeardown) {
                this.pluginsRJS[plugin].onTeardown();
            }
        }
        this.removeBlackOverlay();
        this.gui.changeMenu('main');
    };
    RJS.prototype.start = function (initialVars) {
        if (initialVars === void 0) { initialVars = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var plugin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setBlackOverlay();
                        this.control.paused = false;
                        this.managers.story.clearScene();
                        // on start game, clear the vars o initialize for a new game +
                        this.managers.logic.vars = initialVars;
                        return [4 /*yield*/, this.managers.story.startScene('start')];
                    case 1:
                        _a.sent();
                        for (plugin in this.pluginsRJS) {
                            if (this.pluginsRJS[plugin].onStart) {
                                this.pluginsRJS[plugin].onStart();
                            }
                        }
                        this.removeBlackOverlay();
                        this.gameStarted = true;
                        this.managers.story.interpret();
                        return [2 /*return*/];
                }
            });
        });
    };
    RJS.prototype.skip = function () {
        this.control.skipping = true;
        if (this.control.waitForClick) {
            this.control.waitForClick = false;
            this.control.nextAction();
        }
    };
    RJS.prototype.auto = function () {
        this.control.auto = true;
        if (this.control.waitForClick) {
            this.control.waitForClick = false;
            this.control.nextAction();
        }
    };
    RJS.prototype.mute = function () {
        this.managers.audio.mute();
    };
    RJS.prototype.save = function (slot) {
        if (!this.gameStarted) {
            return;
        }
        if (!slot) {
            slot = 0;
        }
        var bg = this.managers.background.current;
        var data = {
            background: bg ? bg.name : null,
            characters: this.managers.character.showing,
            audio: this.managers.audio.getActive(),
            cgs: this.managers.cgs.current,
            ambients: this.screenEffects.ambient.current,
            stack: this.control.execStack.shallowCopy(),
            vars: this.managers.logic.vars
            // should include any interrupts showing
        };
        for (var plugin in this.pluginsRJS) {
            if (this.pluginsRJS[plugin].onSave) {
                this.pluginsRJS[plugin].onSave(slot, data);
            }
        }
        var dataSerialized = JSON.stringify(data);
        localStorage.setItem('RenJSDATA' + this.config.name + slot, dataSerialized);
        if (this.gui.addThumbnail && this.xShots && this.xShots.length) {
            var thumbnail = this.xShots[this.xShots.length - 1];
            this.gui.addThumbnail(thumbnail, slot);
            localStorage.setItem('RenJSThumbnail' + this.config.name + slot, thumbnail);
        }
    };
    RJS.prototype.getSlotThumbnail = function (slot) {
        return localStorage.getItem('RenJSThumbnail' + this.config.name + slot);
    };
    RJS.prototype.loadSlot = function (slot) {
        return __awaiter(this, void 0, void 0, function () {
            var data, dataParsed, plugin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!slot) {
                            slot = 0;
                        }
                        data = localStorage.getItem('RenJSDATA' + this.config.name + slot);
                        if (!data) {
                            this.start();
                            return [2 /*return*/];
                        }
                        dataParsed = JSON.parse(data);
                        for (plugin in this.pluginsRJS) {
                            if (this.pluginsRJS[plugin].onLoad) {
                                this.pluginsRJS[plugin].onLoad(slot, dataParsed);
                            }
                        }
                        this.setBlackOverlay();
                        this.managers.story.clearScene();
                        this.managers.background.set(dataParsed.background);
                        return [4 /*yield*/, this.managers.character.set(dataParsed.characters)];
                    case 1:
                        _a.sent();
                        this.managers.audio.set(dataParsed.audio);
                        return [4 /*yield*/, this.managers.cgs.set(dataParsed.cgs)];
                    case 2:
                        _a.sent();
                        this.managers.logic.set(dataParsed.vars);
                        this.screenEffects.ambient.set(dataParsed.ambients);
                        this.gui.clear();
                        // resolve stack
                        this.control.execStack = new ExecStack_1.default(dataParsed.stack);
                        this.managers.story.currentScene = this.control.execStack.getActions(this.story);
                        this.gameStarted = true;
                        this.removeBlackOverlay();
                        this.unpause(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    RJS.prototype.waitForClick = function (callback) {
        this.control.nextAction = callback ? callback : this.resolveAction;
        if (this.control.skipping || this.control.auto) {
            var timeout = this.control.skipping ? this.storyConfig.skiptime : this.storyConfig.autotime;
            if (this.control.auto && this.userPreferences.autoSpeed) {
                // max autospeed == 300
                timeout = 350 - this.userPreferences.autoSpeed;
            }
            setTimeout(this.control.nextAction.bind(this), timeout);
        }
        else {
            this.control.waitForClick = true;
        }
    };
    RJS.prototype.waitTimeout = function (time, callback) {
        this.control.nextAction = callback ? callback : this.resolveAction;
        if (this.control.skipping) {
            this.control.nextAction.call(this);
        }
        else {
            setTimeout(this.control.nextAction.bind(this), time ? time : this.storyConfig.timeout);
        }
    };
    RJS.prototype.waitForClickOrTimeout = function (time, callback) {
        var _this = this;
        this.control.nextAction = callback;
        this.control.waitForClick = true;
        setTimeout((function () {
            _this.control.waitForClick = false;
            _this.control.nextAction();
        }).bind(this), time ? time : this.storyConfig.timeout);
    };
    RJS.prototype.onTap = function (pointer, doubleTap) {
        if (this.control.paused) {
            return;
        }
        if (pointer && this.gui.ignoreTap(pointer)) {
            return;
        }
        if (this.control.waitForClick && !this.control.clickLocked) {
            this.control.waitForClick = false;
            this.lockClick();
            this.control.nextAction();
        }
        if (this.control.skipping || this.control.auto) {
            this.control.skipping = false;
            this.control.auto = false;
        }
    };
    RJS.prototype.initInput = function () {
        // adds the control input
        this.input.onTap.add(this.onTap, this);
        // add keyboard binding
        //  Stop the following keys from propagating up to the browser
        this.input.keyboard.addKeyCapture([phaser_ce_1.default.Keyboard.LEFT, phaser_ce_1.default.Keyboard.RIGHT, phaser_ce_1.default.Keyboard.SPACEBAR]);
        // spacebar == ontap, continue with the game
        this.input.keyboard.addKey(phaser_ce_1.default.Keyboard.SPACEBAR).onDown.add(this.onTap, this);
    };
    RJS.prototype.lockClick = function () {
        var _this = this;
        this.control.clickLocked = true;
        setTimeout(function () {
            _this.control.clickLocked = false;
        }, this.control.clickCooldown);
    };
    RJS.prototype.resolveAction = function () {
        this.control.waitForClick = false;
        if (!this.control.paused) {
            this.managers.story.interpret();
        }
    };
    RJS.prototype.onInterpretActions = function () {
        // called before interpreting action
        // update stack
        this.control.actionsCounter++;
        this.control.execStack.advance();
        // update interrupts
        this.managers.logic.updateInterruptions();
    };
    return RJS;
}(phaser_ce_1.Game));
exports.default = RJS;
//# sourceMappingURL=RJS.js.map