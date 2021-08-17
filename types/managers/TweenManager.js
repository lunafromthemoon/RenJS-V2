"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TweenManager = /** @class */ (function () {
    function TweenManager(game) {
        this.current = [];
        this.game = game;
    }
    TweenManager.prototype.tween = function (sprite, tweenables, callback, time, start, delay, unskippable) {
        var _this = this;
        if (delay === void 0) { delay = 0; }
        if (unskippable === void 0) { unskippable = false; }
        var tween = this.game.add.tween(sprite);
        tween.to(tweenables, time, Phaser.Easing.Linear.None, false, delay);
        if (callback) {
            tween.onComplete.addOnce(callback, this);
            tween.callbackOnComplete = callback;
        }
        tween.tweenables = tweenables;
        if (start) {
            this.current = [];
            tween.start();
            if (this.canSkip() && !unskippable) {
                this.game.waitForClick(function () { return _this.skip(); });
            }
            else {
                // if tween is unskippable, lock the input
                this.game.input.enabled = false;
                tween.onComplete.addOnce(function () {
                    // enable input back when tween finishes
                    _this.game.input.enabled = true;
                }, this);
            }
        }
        this.current.push(tween);
        if (this.game.control.skipping) {
            this.skip();
        }
        return tween;
    };
    TweenManager.prototype.chain = function (tweens, unskippable, time) {
        var _this = this;
        if (unskippable === void 0) { unskippable = false; }
        this.current = [];
        var lastTween = null;
        tweens.forEach(function (tw) {
            var t = tw.time ? tw.time : time / tweens.length;
            var tween = _this.tween(tw.sprite, tw.tweenables, tw.callback, t, false, tw.delay);
            if (lastTween) {
                lastTween.chain(tween);
            }
            lastTween = tween;
        });
        if (!this.game.control.skipping) {
            this.current[0].start();
        }
        else if (this.canSkip() && !unskippable) {
            this.game.waitForClick(function () { return _this.skip(); });
        }
    };
    TweenManager.prototype.parallel = function (tweens, unskippable, time) {
        var _this = this;
        if (unskippable === void 0) { unskippable = false; }
        this.current = [];
        tweens.forEach(function (tw) {
            var tween = _this.tween(tw.sprite, tw.tweenables, tw.callback, time, true, tw.delay);
        });
        if (!this.canSkip() && !unskippable) {
            this.game.waitForClick(function () { return _this.skip(); });
        }
    };
    TweenManager.prototype.canSkip = function () {
        return this.game.storyConfig.transitions.skippable && !this.game.control.unskippable;
    };
    TweenManager.prototype.skip = function () {
        if (this.game.control.unskippable) {
            return;
        }
        this.current.forEach(function (tween) {
            tween.stop(false);
            for (var property in tween.tweenables) {
                tween.target[property] = tween.tweenables[property];
            }
            if (tween.callbackOnComplete) {
                tween.callbackOnComplete();
            }
        });
        this.current = [];
    };
    TweenManager.prototype.set = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        //
    };
    return TweenManager;
}());
exports.default = TweenManager;
//# sourceMappingURL=TweenManager.js.map