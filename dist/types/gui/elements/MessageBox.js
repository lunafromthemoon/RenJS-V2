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
Object.defineProperty(exports, "__esModule", { value: true });
var phaser_ce_1 = require("phaser-ce");
var utils_1 = require("../../states/utils");
var MessageBox = /** @class */ (function (_super) {
    __extends(MessageBox, _super);
    function MessageBox(game, config) {
        var _this = _super.call(this, game, config.x, config.y, config.asset) || this;
        _this.punctuationMarks = [];
        _this.punctuationWait = 5;
        _this.config = config;
        _this.game = game;
        _this.visible = false;
        _this.id = _this.config.id;
        // create sound effects
        if (_this.config.sfx != 'none' && _this.game.cache.checkSoundKey(_this.config.sfx)) {
            _this.defaultSfx = _this.game.add.audio(_this.config.sfx);
            // play and stop to load the sound for real, it's a phaser thing
            _this.defaultSfx.play();
            _this.defaultSfx.stop();
        }
        // create text
        _this.text = _this.game.add.text(_this.config.text.x, _this.config.text.y, '', _this.config.text.style);
        if (_this.config.text.lineSpacing) {
            _this.text.lineSpacing = _this.config.text.lineSpacing;
        }
        _this.addChild(_this.text);
        // create ctc
        if (_this.config.ctc) {
            var x = _this.config.ctc.x - _this.config.x;
            var y = _this.config.ctc.y - _this.config.y;
            _this.ctc = _this.game.add.sprite(x, y, config.ctc.asset);
            if (_this.config.ctc.animationStyle === 'spritesheet') {
                _this.ctc.animations.add('do').play();
            }
            else {
                _this.ctc.alpha = 0;
                _this.game.add.tween(_this.ctc).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true, 0, -1, true);
            }
            _this.addChild(_this.ctc);
        }
        // punctuation
        if (_this.game.storyConfig.punctuationMarks) {
            _this.punctuationMarks = _this.game.storyConfig.punctuationMarks;
        }
        if (_this.game.storyConfig.punctuationWait) {
            _this.punctuationWait = _this.game.storyConfig.punctuationWait;
        }
        return _this;
    }
    MessageBox.prototype.destroy = function () {
        this.text.destroy();
        if (this.ctc)
            this.ctc.destroy();
        if (this.defaultSfx)
            this.defaultSfx.destroy();
        if (this.ctcSfx)
            this.ctcSfx.destroy();
        _super.prototype.destroy.call(this);
    };
    // display message box with transition
    // show text character per character, 
    // when whole text is displayed, show click to continue and wait for click
    // when player clicks, message box is hid with transition and action ends
    MessageBox.prototype.show = function (text, sfx) {
        var _this = this;
        if (sfx == 'none') {
            // if character voice configured as none, don't make any sound
            sfx = null;
        }
        else if (!sfx && this.defaultSfx) {
            sfx = this.defaultSfx;
        }
        var finalText = utils_1.setTextStyles(text, this.text);
        // let textSpeed = this.sliderLimits.textSpeed[1] - this.game.userPreferences.textSpeed
        if (this.game.control.skipping || this.textSpeed < 10) {
            this.text.text = finalText;
            this.visible = true;
            this.ctc.visible = true;
            // callback();
            return;
        }
        this.text.text = '';
        // add new line characters at the end of each line
        var lines = this.text.precalculateWordWrap(finalText);
        finalText = '';
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            finalText += line + '\n';
        }
        // split in characters to add one by one
        var characters = finalText.split('');
        var charIdx = 0;
        // punctuation waiting time
        var waitingFor = 0;
        // how many characters to add per sfx played
        var charPerSfx = this.game.storyConfig.charPerSfx ? this.game.storyConfig.charPerSfx : 1;
        if (sfx && charPerSfx == 'auto') {
            charPerSfx = Math.ceil(sfx.durationMS / this.textSpeed);
        }
        // sfx will only play when sfxCharCount == 0, and will reset when sfxCharCount == charPerSfx
        var sfxCharCount = 0;
        return new Promise(function (resolve) {
            var completeText = function () {
                // text finished showing, clear timeout
                clearTimeout(_this.textLoop);
                // complete text in case of skipping
                _this.text.text = finalText;
                // show ctc
                if (_this.ctc) {
                    _this.ctc.visible = true;
                    if (_this.ctcSfx) {
                        _this.ctcSfx.volume = _this.game.userPreferences.sfxv;
                        _this.ctcSfx.play();
                    }
                }
                // finish promise
                resolve(true);
            };
            _this.textLoop = window.setInterval(function () {
                if (waitingFor > 0) {
                    // waiting after punctuation mark, don't do anything
                    waitingFor--;
                    return;
                }
                // add next character
                _this.text.text += (characters[charIdx]);
                // play sfx
                if (sfx) {
                    if (characters[charIdx] == " " || _this.punctuationMarks.includes(characters[charIdx]) || sfxCharCount == charPerSfx) {
                        // reset count, but don't play
                        sfxCharCount = -1;
                    }
                    else if (sfxCharCount == 0) {
                        sfx.play();
                        sfx.volume = _this.game.userPreferences.sfxv;
                    }
                    sfxCharCount++;
                }
                // if it's punctuation mark, add waiting time
                if (_this.punctuationMarks.includes(characters[charIdx])) {
                    waitingFor = _this.punctuationWait;
                }
                // increment character index and check if it finished
                charIdx++;
                if (charIdx >= characters.length) {
                    completeText();
                }
            }, _this.textSpeed);
            _this.visible = true;
            // skip text animation on click
            if (!_this.game.control.auto) {
                _this.game.waitForClick(completeText);
            }
        });
    };
    MessageBox.prototype.clear = function () {
        if (!this.config.alwaysOn) {
            this.visible = false;
        }
        this.text.text = '';
        if (this.ctc) {
            this.ctc.visible = false;
        }
    };
    return MessageBox;
}(phaser_ce_1.Sprite));
exports.default = MessageBox;
//# sourceMappingURL=MessageBox.js.map