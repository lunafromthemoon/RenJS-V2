"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RJSLoadingScreen = /** @class */ (function () {
    function RJSLoadingScreen(game) {
        this.game = game;
        this.container = game.add.group();
        this.container.alpha = 0;
        var config = game.config.loadingScreen;
        if (config.background) {
            this.background = this.container.create(game.world.centerX, game.world.centerY, 'loadingScreenBg');
            this.background.anchor.set(0.5);
        }
        if (config.loadingBar) {
            var position = config.loadingBar.position;
            this.loadingBar = this.container.create(position.x, position.y, 'loadingScreenBar');
            if (this.loadingBar.animations.frameTotal > 1) {
                this.loadingBarBg = this.loadingBar;
                this.loadingBar = this.container.create(position.x, position.y, 'loadingScreenBar', 1);
            }
        }
        if (config.fade) {
            game.add.tween(this.container).to({ alpha: 1 }, 500).start();
        }
        else {
            this.container.alpha = 1;
        }
    }
    RJSLoadingScreen.prototype.setLoadingBar = function (game) {
        if (!this.loadingBar)
            return;
        var dir = game.config.loadingScreen.loadingBar.direction ? game.config.loadingScreen.loadingBar.direction : 0;
        game.load.setPreloadSprite(this.loadingBar, dir);
    };
    RJSLoadingScreen.prototype.waitingScreen = function () {
        if (this.loadingBar) {
            this.game.add.tween(this.loadingBar).to({ alpha: 1 }, 600, null, true, 0, -1, true);
        }
    };
    RJSLoadingScreen.prototype.destroy = function (game) {
        var _this = this;
        if (game.config.loadingScreen.fade) {
            var tween = game.add.tween(this.container).to({ alpha: 0 }, 500);
            tween.onComplete.addOnce(function () {
                _this.container.destroy();
            });
            tween.start();
        }
        else {
            this.container.destroy();
        }
    };
    return RJSLoadingScreen;
}());
exports.default = RJSLoadingScreen;
//# sourceMappingURL=RJSLoadingScreen.js.map