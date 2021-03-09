"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var object_hash_1 = __importDefault(require("object-hash"));
var ExecStack = /** @class */ (function () {
    function ExecStack(stack) {
        var _this = this;
        this.execStack = [];
        if (stack) {
            stack.forEach(function (item) {
                _this.execStack.push(item);
            });
        }
    }
    ExecStack.prototype.shallowCopy = function () {
        // convert to list of objects for saving
        return this.execStack.map(function (item) { return { c: item.c, total: item.total, scope: item.scope, index: item.index, origin: item.origin }; });
    };
    ExecStack.prototype.hash = function () {
        return object_hash_1.default(this.shallowCopy());
    };
    ExecStack.prototype.top = function () {
        // the current scope is at the top of the stack
        return this.execStack[0];
    };
    ExecStack.prototype.bottom = function () {
        return this.execStack[this.execStack.length - 1];
    };
    ExecStack.prototype.clear = function () {
        this.execStack = [];
    };
    ExecStack.prototype.replace = function (scope) {
        // replace the whole stack, scope will be a new scene
        this.execStack = [{ c: -1, scope: scope }];
    };
    ExecStack.prototype.stack = function (scope, total, index, origin) {
        if (index === void 0) { index = -1; }
        if (origin === void 0) { origin = -1; }
        // stack a new scope, normally a branch but could be another scene
        this.execStack.unshift({ c: -1, total: total, scope: scope, index: index, origin: origin });
    };
    ExecStack.prototype.advance = function () {
        // advance the counter on the top scope
        this.top().c++;
        // if counter is total, then this scope (scene, if or choice) is over
        if (this.top().c === this.top().total) {
            this.execStack.shift();
        }
        // if execStack is empty, game over
    };
    ExecStack.prototype.getActions = function (story) {
        var stack = this.bottom();
        // find all action of the scene
        // scene name should be the bottom stack scope
        var allActions = __spreadArray([], story[stack.scope]);
        // get only actions after stack counter
        var actions = allActions.slice(stack.c);
        if (this.execStack.length !== 1) {
            // there are some nested scopes
            for (var i = this.execStack.length - 2; i >= 0; i--) {
                // nested scope should be the action at the counter
                var nestedScope = allActions[stack.c - 1];
                stack = this.execStack[i];
                switch (stack.scope) {
                    case 'interrupt':
                        // the nested scope will not be the last counter, but in the stack origin
                        nestedScope = allActions[stack.origin];
                        var int_op = Object.keys(nestedScope.interrupt[stack.index])[0];
                        allActions = nestedScope.interrupt[stack.index][int_op];
                        break;
                    case 'choice':
                        // find sub scope corresponding to index
                        var ch_op = Object.keys(nestedScope.choice[stack.index])[0];
                        allActions = nestedScope.choice[stack.index][ch_op];
                        break;
                    case 'if':
                        //if and else are their own only scope
                        var action = Object.keys(nestedScope)[0];
                        allActions = nestedScope[action];
                }
                var newActions = allActions.slice(stack.c);
                actions = newActions.concat(actions);
            }
        }
        return actions;
    };
    return ExecStack;
}());
exports.default = ExecStack;
//# sourceMappingURL=ExecStack.js.map