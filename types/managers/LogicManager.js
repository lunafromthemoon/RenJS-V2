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
var LogicManager = /** @class */ (function () {
    function LogicManager(game) {
        this.game = game;
        this.vars = {};
        // interrupting: boolean;
        this.visualChoices = null;
        this.showingText = false;
        var log = localStorage.getItem('RenJSChoiceLog' + game.config.name);
        if (this.game.setup.vars) {
            this.vars = this.game.setup.vars;
        }
        this.choicesLog = log ? JSON.parse(log) : {};
    }
    LogicManager.prototype.set = function (vars) {
        this.vars = __assign(__assign({}, this.vars), vars);
        this.currentChoices = [];
        // this.interrupting = false;
        if (this.visualChoices) {
            this.visualChoices.destroy();
        }
    };
    LogicManager.prototype.setVar = function (name, value) {
        value = value + '';
        value = this.parseVars(value);
        try {
            // eslint-disable-next-line no-eval
            this.vars[name] = eval(value);
        }
        catch (e) {
            this.vars[name] = value;
        }
    };
    LogicManager.prototype.updateChoiceLog = function (execId, choiceText) {
        if (!this.choicesLog[execId].includes(choiceText)) {
            this.choicesLog[execId].push(choiceText);
            // Save choices log
            var log = JSON.stringify(this.choicesLog);
            localStorage.setItem('RenJSChoiceLog' + this.game.config.name, log);
        }
    };
    LogicManager.prototype.evalExpression = function (expression) {
        expression = expression + '';
        expression = this.parseVars(expression, true);
        try {
            // eslint-disable-next-line no-eval
            return eval(expression);
        }
        catch (e) {
            return false;
        }
    };
    LogicManager.prototype.branch = function (expression, branches) {
        var val = this.evalExpression(expression);
        var actions;
        if (val && branches.ISTRUE) {
            actions = branches.ISTRUE;
        }
        if (!val && branches.ISFALSE) {
            // if we branch to "else" action, advance stack on one
            this.game.control.execStack.top().c++;
            actions = branches.ISFALSE;
        }
        if (actions) {
            this.game.managers.story.currentScene = actions.concat(this.game.managers.story.currentScene);
            this.game.control.execStack.stack('if', actions.length);
        }
    };
    LogicManager.prototype.parseVars = function (text, useQM) {
        var vars = text.match(/\{(.*?)\}/g);
        if (vars) {
            for (var _i = 0, vars_1 = vars; _i < vars_1.length; _i++) {
                var v = vars_1[_i];
                var varName = v.substring(1, v.length - 1);
                var value = this.vars[varName];
                if (useQM && typeof value == 'string') {
                    value = '\"' + value + '\"';
                }
                text = text.replace(v, value);
            }
        }
        return text;
    };
    LogicManager.prototype.evalChoice = function (choice) {
        var choiceText = Object.keys(choice)[0];
        choice.choiceId = 'Choice' + guid();
        // choice text can have vars
        choice.choiceText = this.parseVars(choiceText);
        // actions when chose will be kept in actions
        choice.actions = choice[choiceText];
        delete choice[choiceText];
        // check conditional option
        var params = choiceText.split('!if');
        if (params.length > 1) {
            var val = this.evalExpression(params[1]);
            if (val) {
                // remove the if part of the text
                choice.choiceText = params[0];
            }
            return val;
        }
        return true; // unconditional choice
    };
    LogicManager.prototype.showVisualChoices = function (choices) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, ch, execId, i, str, pos, position, transition;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.checkTextAction(choices[0])];
                    case 1:
                        _a.showingText = _b.sent();
                        if (this.showingText) {
                            choices.shift();
                        }
                        ch = choices.map(function (choice) { return (__assign({}, choice)); });
                        // filter (eval choice modifies the choice adding id and clearing text)
                        this.currentChoices = ch.filter(this.evalChoice.bind(this));
                        this.visualChoices = this.game.add.group();
                        this.visualChoices.alpha = 0;
                        execId = this.getExecStackId();
                        for (i = 0; i < this.currentChoices.length; i++) {
                            str = this.currentChoices[i].choiceText.split(' ');
                            pos = str[2].split(',');
                            position = { x: parseInt(pos[0], 10), y: parseInt(pos[1], 10) };
                            this.createVisualChoice(str[0], position, i, this.currentChoices[i].choiceText, execId);
                        }
                        transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.visualChoices);
                        transition(null, this.visualChoices);
                        return [2 /*return*/];
                }
            });
        });
    };
    LogicManager.prototype.createVisualChoice = function (image, position, index, key, execId) {
        var _this = this;
        var button = this.game.add.button(position.x, position.y, image, function () {
            var transition = _this.game.screenEffects.transition.get(_this.game.storyConfig.transitions.visualChoices);
            transition(_this.visualChoices, null).then(function () {
                _this.visualChoices.destroy();
                _this.choose(index, key, execId);
            });
        }, this, 0, 0, 0, 0, this.visualChoices);
        // if (this.game.gui.getChosenOptionColor && this.choicesLog[execId].indexOf(key) !== -1){
        // button.tint = this.game.gui.getChosenOptionColor();
        // previously chosen choice
        // }
        button.anchor.set(0.5);
        return button;
    };
    LogicManager.prototype.choose = function (index, choiceText, execId) {
        // update choice log
        this.updateChoiceLog(execId, choiceText);
        if (this.game.storyConfig.logText) {
            this.game.managers.text.textLog.push({ text: choiceText, title: "choice" });
        }
        var chosenOption = this.currentChoices[index];
        // add new action to scene
        var actions = chosenOption.actions;
        this.game.managers.story.currentScene = actions.concat(this.game.managers.story.currentScene);
        // remove message box if showing message
        if (this.showingText) {
            this.game.managers.text.hide();
            this.showingText = false;
            // correct stack index, so it will skip the text action
            index++;
        }
        // update stack
        if (chosenOption.interrupt) {
            // resolving an interrupt, add actions and update stack 
            this.game.control.execStack.stack('interrupt', actions.length, index, chosenOption.origin);
        }
        else {
            this.game.control.execStack.stack('choice', actions.length, index);
        }
        this.currentChoices = [];
        if (!chosenOption.interrupt) {
            // interrupts resolve immediately
            this.game.resolveAction();
        }
    };
    LogicManager.prototype.getExecStackId = function () {
        var execId = this.game.control.execStack.hash();
        if (!this.choicesLog[execId]) {
            this.choicesLog[execId] = [];
        }
        return execId;
    };
    LogicManager.prototype.checkTextAction = function (firstChoice) {
        return __awaiter(this, void 0, void 0, function () {
            var action;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        action = this.game.managers.story.parseAction(__assign({}, firstChoice));
                        if (!(action.mainAction == "say" || action.mainAction == "text")) return [3 /*break*/, 5];
                        if (!action.actor) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.game.managers.text.say(action.actor, action.look, action.body, true)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.game.managers.text.show(action.body, null, null, null, true)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, true];
                    case 5: return [2 /*return*/, false];
                }
            });
        });
    };
    LogicManager.prototype.showChoices = function (choices) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, ch;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.checkTextAction(choices[0])];
                    case 1:
                        _a.showingText = _b.sent();
                        if (this.showingText) {
                            choices.shift();
                        }
                        ch = choices.map(function (choice) { return (__assign({}, choice)); }).filter(function (choice) { return _this.evalChoice(choice); });
                        this.currentChoices = this.currentChoices.concat(ch);
                        this.game.gui.showChoices(this.currentChoices, this.getExecStackId());
                        return [2 /*return*/];
                }
            });
        });
    };
    LogicManager.prototype.interrupt = function (steps, choices) {
        var _this = this;
        // TODO: fix this shit
        // this.interrupting = true;
        var s = parseInt(steps, 10);
        choices.forEach(function (choice) {
            choice.interrupt = true;
            choice.origin = _this.game.control.execStack.top().c;
            if (!isNaN(s) && s > 0) {
                choice.remainingSteps = s + 1;
            }
        });
        this.showChoices(choices);
        // interrupts don't wait for player to make the choice
        this.game.resolveAction();
    };
    LogicManager.prototype.updateInterruptions = function () {
        var _this = this;
        var interrupts = this.currentChoices.filter(function (choice) { return choice.interrupt; });
        interrupts.forEach(function (interrupt) {
            if (interrupt.remainingSteps) {
                interrupt.remainingSteps--;
                if (interrupt.remainingSteps === 1) {
                    _this.game.gui.changeToLastInterrupt(interrupt.choiceId);
                }
                else if (interrupt.remainingSteps === 0) {
                    _this.game.gui.hideChoice(interrupt.choiceId);
                }
            }
        });
    };
    LogicManager.prototype.clearChoices = function () {
        this.game.gui.hideChoices();
        this.currentChoices = [];
        // this.interrupting = false;
        if (this.visualChoices) {
            this.visualChoices.destroy();
        }
        if (this.showingText) {
            this.game.managers.text.hide();
            this.showingText = false;
        }
    };
    return LogicManager;
}());
exports.default = LogicManager;
function guid() {
    return 'ss'.replace(/s/g, s4);
}
function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}
//# sourceMappingURL=LogicManager.js.map