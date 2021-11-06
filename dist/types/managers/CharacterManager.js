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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Transition_1 = __importDefault(require("../screen-effects/Transition"));
var Character_1 = __importDefault(require("../entities/Character"));
var CharacterManager = /** @class */ (function () {
    function CharacterManager(game) {
        this.game = game;
        this.characters = {};
        this.showing = {};
        // this.characters = this.game.setup.characters;
        this.loadCharacters();
    }
    CharacterManager.prototype.loadCharacters = function () {
        for (var name_1 in this.game.setup.characters) {
            var character = this.game.setup.characters[name_1];
            var displayName = character.displayName ? character.displayName : name_1;
            var voice = character.voice;
            if (voice && voice != "none") {
                voice = this.game.add.audio(character.voice);
                // play silently once so we have the duration set
                voice.play();
                voice.stop();
            }
            // this.add(name,displayName,character.speechColour,character.looks);
            this.characters[name_1] = new Character_1.default(name_1, displayName, character.speechColour, voice);
        }
    };
    // add (name, displayName, speechColour, looks): void {
    // this.characters[name] = new Character(displayName,speechColour);
    // for (const look in looks) {
    // this.addLook(this.characters[name],look,name+'_'+look);
    // }
    // }
    CharacterManager.prototype.createLook = function (character, lookName) {
        var imgKey = character.keyName + '_' + lookName;
        var look = this.game.managers.story.characterSprites.create(this.game.storyConfig.positions.DEFAULT.x, this.game.storyConfig.positions.DEFAULT.y, imgKey);
        look.anchor.set(0.5, 1);
        look.alpha = 0;
        look.name = lookName;
        return look;
    };
    CharacterManager.prototype.set = function (showing) {
        return __awaiter(this, void 0, void 0, function () {
            var name_2, props, character;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.hideAll(Transition_1.default.CUT)];
                    case 1:
                        _a.sent();
                        this.showing = showing;
                        for (name_2 in this.showing) {
                            props = this.showing[name_2];
                            character = this.characters[name_2];
                            character.currentLook = this.createLook(character, props.look);
                            character.currentLook.x = props.position.x;
                            character.currentLook.y = props.position.y;
                            character.currentLook.scale.x = props.scaleX;
                            character.currentLook.alpha = 1;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CharacterManager.prototype.show = function (name, transitionName, props) {
        var ch = this.characters[name];
        var oldLook = ch.currentLook;
        var newLook = props.look ? props.look : oldLook ? oldLook.name : "normal";
        ch.currentLook = this.createLook(ch, newLook);
        if (!props.position) {
            props.position = (oldLook !== null) ? { x: oldLook.x, y: oldLook.y } : this.game.storyConfig.positions.DEFAULT;
        }
        if (props.flipped !== undefined) {
            if (props.flipped === 'flip') {
                ch.lastScale *= -1;
            }
            else {
                ch.lastScale = props.flipped ? -1 : 1;
            }
        }
        this.showing[name] = { look: ch.currentLook.name, position: props.position, scaleX: ch.lastScale };
        var transitioning = this.transition.get(transitionName)(oldLook, ch.currentLook, props.position, ch.lastScale);
        transitioning.then(function () {
            if (oldLook)
                oldLook.destroy();
        });
        return transitioning;
    };
    CharacterManager.prototype.hide = function (name, transitionName) {
        return __awaiter(this, void 0, void 0, function () {
            var ch, oldLook, transitioning;
            return __generator(this, function (_a) {
                ch = this.characters[name];
                oldLook = ch.currentLook;
                ch.lastScale = 1;
                ch.currentLook = null;
                delete this.showing[name];
                transitioning = this.transition.get(transitionName)(oldLook, null);
                transitioning.then(function () {
                    if (oldLook)
                        oldLook.destroy();
                });
                return [2 /*return*/, transitioning];
            });
        });
    };
    CharacterManager.prototype.hideAll = function (transitionName) {
        return __awaiter(this, void 0, void 0, function () {
            var promises, char;
            var _this = this;
            return __generator(this, function (_a) {
                if (!transitionName) {
                    transitionName = function () { return _this.transition.FADEOUT; };
                }
                promises = [];
                for (char in this.showing) {
                    promises.push(this.hide(char, transitionName));
                }
                return [2 /*return*/, Promise.all(promises)];
            });
        });
    };
    CharacterManager.prototype.isCharacter = function (actor) {
        return actor in this.characters || actor === 'CHARS' || actor === 'ALL';
    };
    return CharacterManager;
}());
exports.default = CharacterManager;
//# sourceMappingURL=CharacterManager.js.map