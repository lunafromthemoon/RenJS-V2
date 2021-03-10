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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var js_yaml_1 = __importDefault(require("js-yaml"));
var utils_1 = require("./utils");
var RJSState_1 = __importDefault(require("./RJSState"));
var PreloadStory_1 = __importDefault(require("./PreloadStory"));
var RJSGUIByBuilder_1 = __importDefault(require("../gui/RJSGUIByBuilder"));
var RJSSimpleGUI_1 = __importDefault(require("../gui/RJSSimpleGUI"));
var Boot = /** @class */ (function (_super) {
    __extends(Boot, _super);
    function Boot() {
        return _super.call(this) || this;
    }
    Boot.prototype.init = function () {
        var _this = this;
        if (!this.game.config.i18n)
            this.game.setupScreen();
        // create renjs splash screen and preload loading screen and story
        var b64Splash = 'data:image/png;base64,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';
        this.game.load.image("renJSSplashScreen", b64Splash);
        this.game.load.onLoadComplete.addOnce(function () {
            _this.splash = _this.game.add.sprite(_this.game.world.centerX, _this.game.world.centerY, 'renJSSplashScreen');
            _this.splash.alpha = 0;
            _this.splash.anchor.set(0.5);
            _this.game.add.tween(_this.splash).to({ alpha: 1 }, 1500, null, true, 0, -1, true);
        }, this);
        this.game.load.start();
    };
    Boot.prototype.preload = function () {
        if (this.game.config.splash.loadingScreen) {
            this.game.load.image('loadingScreenBg', utils_1.preparePath(this.game.config.splash.loadingScreen, this.game));
        }
        if (this.game.config.splash.loadingBar) {
            if (this.game.config.splash.loadingBar.fullBar) {
                this.game.load.image('loadingScreenBar', utils_1.preparePath(this.game.config.splash.loadingBar.fullBar, this.game));
            }
            if (this.game.config.splash.loadingBar.asset) {
                var w = this.game.config.splash.loadingBar.size.w;
                var h = this.game.config.splash.loadingBar.size.h;
                this.game.load.spritesheet('loadingScreenBar', utils_1.preparePath(this.game.config.splash.loadingBar.asset, this.game), w, h);
            }
        }
        utils_1.loadStyle(utils_1.preparePath(this.game.config.fonts, this.game));
        this.game.load.text('guiConfig', utils_1.preparePath(this.game.config.guiConfig, this.game));
        this.game.load.text('storySetup', utils_1.preparePath(this.game.config.storySetup, this.game));
        this.game.load.text('storyConfig', utils_1.preparePath(this.game.config.storyConfig, this.game));
        for (var i = this.game.config.storyText.length - 1; i >= 0; i--) {
            this.game.load.text('story' + i, utils_1.preparePath(this.game.config.storyText[i], this.game));
        }
    };
    Boot.prototype.create = function (game) {
        var _this = this;
        this.input.onDown.addOnce(function () {
            if (_this.sound.context.state === 'suspended') {
                _this.sound.context.resume();
            }
        });
        // load the setup
        game.setup = js_yaml_1.default.load(game.cache.getText('storySetup'));
        if (!game.setup)
            game.setup = {};
        game.storyConfig = js_yaml_1.default.load(game.cache.getText('storyConfig'));
        // load the story text
        var story = {};
        game.config.storyText.forEach(function (file, index) {
            var text = js_yaml_1.default.load(game.cache.getText('story' + index));
            Object.assign(story, __assign({}, text));
        });
        game.story = story;
        // load and create the GUI
        game.guiSetup = js_yaml_1.default.load(game.cache.getText('guiConfig'));
        if (game.guiSetup.madeWithRenJSBuilder) {
            game.gui = new RJSGUIByBuilder_1.default(game);
        }
        else {
            game.gui = new RJSSimpleGUI_1.default(game);
        }
        // preload the fonts by adding text, else they wont be fully loaded :\
        for (var _i = 0, _a = game.gui.fonts; _i < _a.length; _i++) {
            var font = _a[_i];
            game.add.text(20, -100, font, { font: '42px ' + font });
        }
        game.state.add('preloadStory', PreloadStory_1.default);
        game.state.start('preloadStory');
    };
    return Boot;
}(RJSState_1.default));
exports.default = Boot;
//# sourceMappingURL=Boot.js.map