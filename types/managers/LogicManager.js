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
Object.defineProperty(exports, "__esModule", { value: true });
var LogicManager = /** @class */ (function () {
    function LogicManager(game) {
        this.game = game;
        this.vars = {};
        // interrupting: boolean;
        this.visualChoices = null;
        var log = localStorage.getItem('RenJSChoiceLog' + game.config.name);
        if (this.game.setup.vars) {
            this.vars = this.game.setup.vars;
        }
        this.choicesLog = log ? JSON.parse(log) : {};
    }
    LogicManager.prototype.set = function (vars) {
        this.vars = vars;
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
        choice.choiceText = choiceText;
        var params = choiceText.split('!if');
        if (params.length > 1) {
            var val = this.evalExpression(params[1]);
            if (val) {
                var next = choice[choiceText];
                delete choice[choiceText];
                choice.choiceText = params[0];
                choice[params[0]] = next;
            }
            return val;
        }
        return true; // unconditional choice
    };
    LogicManager.prototype.showVisualChoices = function (choices) {
        // clone
        var ch = choices.map(function (choice) { return (__assign({}, choice)); });
        // filter (eval choice modifies the choice adding id and clearing text)
        this.currentChoices = ch.filter(this.evalChoice);
        this.visualChoices = this.game.add.group();
        this.visualChoices.alpha = 0;
        var execId = this.getExecStackId();
        for (var i = 0; i < this.currentChoices.length; i++) {
            var key = Object.keys(this.currentChoices[i])[0];
            var str = key.split(' ');
            var pos = str[2].split(',');
            var position = { x: parseInt(pos[0], 10), y: parseInt(pos[1], 10) };
            this.createVisualChoice(str[0], position, i, key, execId);
        }
        var transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.visualChoices);
        transition(null, this.visualChoices);
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
        var chosenOption = this.currentChoices[index];
        // add new action to scene
        var actions = chosenOption[choiceText];
        this.game.managers.story.currentScene = actions.concat(this.game.managers.story.currentScene);
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
    LogicManager.prototype.showChoices = function (choices) {
        var _this = this;
        var ch = choices.map(function (choice) { return (__assign({}, choice)); }).filter(function (choice) { return _this.evalChoice(choice); });
        this.currentChoices = this.currentChoices.concat(ch);
        this.game.gui.showChoices(this.currentChoices, this.getExecStackId());
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