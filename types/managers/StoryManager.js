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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var RJSAssetLoader_1 = __importDefault(require("../core/RJSAssetLoader"));
var StoryActionFactory_1 = __importDefault(require("../core/actions/StoryActionFactory"));
var StoryManager = /** @class */ (function () {
    function StoryManager(game) {
        this.game = game;
        this.actorsIndex = {};
    }
    StoryManager.prototype.setupStory = function () {
        this.backgroundSprites = this.game.add.group();
        this.behindCharactersSprites = this.game.add.group();
        this.characterSprites = this.game.add.group();
        this.cgsSprites = this.game.add.group();
        if (this.game.setup.lazyloading) {
            this.assetLoader = new RJSAssetLoader_1.default(this.game);
        }
    };
    StoryManager.prototype.set = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        //
    };
    StoryManager.prototype.interpret = function () {
        if (this.game.managers.story.currentScene.length === 0 || this.game.control.paused) {
            this.interpreting = false;
            return;
        }
        else {
            var currentAction = this.game.managers.story.currentScene.shift();
            this.interpreting = true;
            // does extra stuff on every step
            // like updating the execution stack
            // or counting the interruption steps
            this.game.onInterpretActions();
            // interpret the action at hand
            this.game.managers.story.interpretAction(currentAction);
        }
    };
    StoryManager.prototype.clearScene = function () {
        this.game.control.execStack.clear();
        this.game.managers.logic.clearChoices(); // For any interrup still showing
        this.game.managers.character.hideAll("CUT");
        this.game.managers.audio.stopAll();
        this.game.managers.cgs.hideAll("CUT");
        this.game.managers.background.hide(null, "CUT");
        this.game.screenEffects.ambient.CLEAR();
        this.currentScene = [];
    };
    StoryManager.prototype.startScene = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.game.setup.lazyloading) return [3 /*break*/, 2];
                        // load scene or episode assets (not loaded yet) 
                        return [4 /*yield*/, this.assetLoader.loadScene(name)];
                    case 1:
                        // load scene or episode assets (not loaded yet) 
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.game.control.execStack.replace(name);
                        this.game.managers.logic.clearChoices(); // For any interrup still showing
                        this.currentScene = __spreadArray([], this.game.story[name]);
                        return [2 /*return*/];
                }
            });
        });
    };
    StoryManager.prototype.getActorType = function (actor) {
        // is actor background or character
        if (!actor) {
            return null;
        }
        if (this.actorsIndex[actor]) {
            return this.actorsIndex[actor];
        }
        if (this.game.managers.character.isCharacter(actor)) {
            this.actorsIndex[actor] = 'characters';
            return 'characters';
        }
        if (this.game.managers.background.isBackground(actor)) {
            this.actorsIndex[actor] = 'backgrounds';
            return 'backgrounds';
        }
        if (this.game.managers.audio.isMusic(actor)) {
            this.actorsIndex[actor] = 'music';
            return 'music';
        }
        if (this.game.managers.audio.isSfx(actor)) {
            this.actorsIndex[actor] = 'sfx';
            return 'sfx';
        }
        this.actorsIndex[actor] = 'cgs';
        return 'cgs';
    };
    StoryManager.prototype.getManagerByActorType = function (type) {
        switch (type) {
            case 'characters': return this.game.managers.character;
            case 'backgrounds': return this.game.managers.background;
            case 'cgs': return this.game.managers.cgs;
        }
    };
    StoryManager.prototype.parseAction = function (action) {
        var actionParams = {
            withTransition: ['show', 'hide', 'play', 'stop'],
            withPosition: ['show'],
            withContinue: ['show', 'hide'],
        };
        function getKey(act) {
            return Object.keys(act)[0];
        }
        var key = getKey(action);
        var keyParams = key.split(' ');
        var mainAction;
        var actor;
        if (keyParams[1] === 'says') {
            mainAction = 'say';
            actor = keyParams[0];
            action.look = (keyParams.length > 2) ? keyParams[2] : null;
        }
        else {
            mainAction = keyParams[0];
            actor = keyParams[1];
        }
        action.mainAction = mainAction;
        action.actor = actor;
        action.actorType = this.getActorType(actor);
        // parse WITH and AT
        var params = action[key];
        action.body = params;
        if (actionParams.withTransition.includes(mainAction)) {
            var str = params ? params.split(' ') : [];
            if (str.indexOf('WITH') !== -1) {
                action.transition = str[str.indexOf('WITH') + 1];
            }
            else {
                // default transition for the actor type
                action.transition = this.game.storyConfig.transitions.defaults[action.actorType];
            }
        }
        if (mainAction == "show" && action.actorType == "cgs") {
            var str = params ? params.split(' ') : [];
            if (str.indexOf('BEHIND') !== -1) {
                action.layer = 'behindCharactersSprites';
            }
            else {
                action.layer = 'cgsSprites';
            }
        }
        if (params && actionParams.withPosition.includes(mainAction)) {
            var str = params ? params.split(' ') : [];
            if (str.indexOf('AT') !== -1) {
                action.position = str[str.indexOf('AT') + 1];
                if (action.position in this.game.storyConfig.positions) {
                    action.position = this.game.storyConfig.positions[action.position];
                }
                else {
                    var coords = action.position.split(',');
                    action.position = { x: parseInt(coords[0], 10), y: parseInt(coords[1], 10) };
                }
            }
            if (str.indexOf('FLIP') !== -1) {
                action.flipped = 'flip';
            }
            if (str.length > 0 && str[0] !== 'AT' && str[0] !== 'WITH') {
                action.look = str[0];
            }
        }
        action.contAfterTrans = false;
        if (params && actionParams.withContinue.includes(mainAction)) {
            var str = params ? params.split(' ') : [];
            action.contAfterTrans = str.indexOf('CONTINUE') !== -1;
        }
        action.manager = this.getManagerByActorType(action.actorType);
        return action;
    };
    StoryManager.prototype.interpretAction = function (actionRaw) {
        var action = this.parseAction(actionRaw);
        // this.game.control.action = mainAction
        // this.game.control.wholeAction = params;
        this.game.control.nextAction = null;
        if (action.mainAction === 'else') {
            // nothing to do, already resolved in previous if action
            return this.game.resolveAction();
        }
        var storyAction = StoryActionFactory_1.default(action.mainAction, action, this.game);
        storyAction.execute();
    };
    return StoryManager;
}());
exports.default = StoryManager;
//# sourceMappingURL=StoryManager.js.map