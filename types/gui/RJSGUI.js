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
Object.defineProperty(exports, "__esModule", { value: true });
var RJSGUI = /** @class */ (function () {
    function RJSGUI(game) {
        this.game = game;
        this.buttonsAction = {};
        this.config = { hud: null, menus: { main: null, settings: null, saveload: null } };
        this.assets = [];
        this.fonts = [];
        // gui graphical components
        this.menus = {};
        this.hud = null;
        this.saveSlots = {};
        // interval object to show text per letter 
        this.textLoop = null;
        this.sliderLimits = {
            textSpeed: [10, 150],
            autoSpeed: [50, 300],
            bgmv: [0, 1],
            sfxv: [0, 1]
        };
        this.skipClickArea = [];
        // menu navigation
        this.currentMenu = null;
        this.previousMenu = null;
        this.currentMusic = null;
        this.initAssets(game.guiSetup);
        this.initButtonsActions();
    }
    // ----------------------------------------------------------------
    // Init the gui, build the elements and menus
    // ----------------------------------------------------------------
    RJSGUI.prototype.initAssets = function (gui) {
        // convert specific gui config to general one
        // has to init this.assets, this.fonts and this.config
    };
    RJSGUI.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var audioList, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        audioList = [];
                        for (i = 0; i < this.assets.length; i++) {
                            if (this.assets[i].type == "audio") {
                                audioList.push(this.assets[i].key);
                            }
                        }
                        return [4 /*yield*/, this.game.managers.audio.decodeAudio(audioList)];
                    case 1:
                        _a.sent();
                        // create the GUI
                        this.initHUD(this.config.hud);
                        this.initMenu('main', this.config.menus.main);
                        this.initMenu('settings', this.config.menus.settings);
                        this.initMenu('saveload', this.config.menus.saveload);
                        return [2 /*return*/];
                }
            });
        });
    };
    RJSGUI.prototype.initMenu = function (name, menuConfig) {
        if (!menuConfig)
            return;
        this.menus[name] = this.game.add.group();
        this.menus[name].visible = false;
        // load bg
        if (menuConfig.background) {
            this.game.add.image(0, 0, menuConfig.background.id, 0, this.menus[name]);
        }
        this.loadGeneralComponents(menuConfig, this.menus[name]);
        if (menuConfig.backgroundMusic) {
            menuConfig.backgroundMusic = this.game.add.audio(menuConfig.backgroundMusic);
        }
    };
    RJSGUI.prototype.initHUD = function (hudConfig) {
        var _this = this;
        if (!hudConfig)
            return;
        this.hud = this.game.add.group();
        this.hud.visible = false;
        if (hudConfig.buttons) {
            hudConfig.buttons.forEach(function (btn) {
                var w = parseInt(btn.width, 10);
                var h = parseInt(btn.height, 10);
                _this.skipClickArea.push(new Phaser.Rectangle(btn.x, btn.y, w, h));
            }, this);
        }
        var mBox;
        if (hudConfig['message-box']) {
            mBox = hudConfig['message-box'];
            this.messageBox = this.game.add.sprite(mBox.x, mBox.y, mBox.id, 0, this.hud);
            this.messageBox.visible = false;
            var textStyle = this.getTextStyle('message-box');
            var text = this.game.add.text(mBox['offset-x'], mBox['offset-y'], '', textStyle);
            text.wordWrap = true;
            text.align = mBox.align;
            text.wordWrapWidth = mBox['text-width'];
            this.messageBox.message = text;
            this.messageBox.addChild(text);
            if (mBox['always-on']) {
                this.messageBox.alwaysOn = true;
            }
        }
        if (hudConfig['name-box']) {
            var x = hudConfig['name-box'].x - mBox.x;
            var y = hudConfig['name-box'].y - mBox.y;
            this.nameBox = this.game.add.sprite(x, y, hudConfig['name-box'].id, 0, this.hud);
            // this.nameBox.visible = false;
            var textStyle = this.getTextStyle('name-box');
            var text = this.game.add.text(0, 0, '', textStyle);
            this.setTextPosition(this.nameBox, text, hudConfig['name-box']);
            this.messageBox.addChild(this.nameBox);
        }
        if (hudConfig.ctc) {
            var x = hudConfig.ctc.x - mBox.x;
            var y = hudConfig.ctc.y - mBox.y;
            this.ctc = this.game.add.sprite(x, y, hudConfig.ctc.id);
            // this.ctc.visible = false;
            if (hudConfig.ctc.animationStyle === 'spritesheet') {
                this.ctc.animations.add('do').play();
            }
            else {
                this.ctc.alpha = 0;
                // this.ctc.tween =
                this.game.add.tween(this.ctc).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true, 0, -1);
            }
            this.messageBox.addChild(this.ctc);
        }
        if (hudConfig.choice) {
            this.choices = this.game.add.group();
        }
        if (hudConfig.interrupt && !hudConfig.interrupt.inlineWithChoice) {
            this.interrupts = this.game.add.group();
        }
        this.loadGeneralComponents(hudConfig, this.hud);
    };
    RJSGUI.prototype.getTextStyle = function (type) {
        var style = this.config.hud[type];
        return {
            font: style.size ? style.size + 'px ' + style.font : style.font,
            fill: style.color
        };
    };
    // ----------------------------------------------------------------
    // Load different GUI component: images, animations, buttons, etc
    // ----------------------------------------------------------------
    RJSGUI.prototype.loadGeneralComponents = function (menuConfig, menu) {
        var _this = this;
        var components = ['images', 'animations', 'labels', 'save-slots', 'buttons', 'sliders'];
        components.forEach(function (component) {
            if (component in menuConfig) {
                for (var i = menuConfig[component].length - 1; i >= 0; i--) {
                    _this.loadComponent(component, menuConfig[component][i], menu);
                }
            }
        });
    };
    RJSGUI.prototype.loadComponent = function (type, component, menu) {
        switch (type) {
            case 'images':
                this.game.add.image(component.x, component.y, component.id, 0, menu);
                break;
            case 'animations':
                var spr = this.game.add.sprite(component.x, component.y, component.id, 0, menu);
                spr.animations.add('do').play();
                break;
            case 'buttons':
                this.loadButton(component, menu);
                break;
            case 'labels':
                var color = component.color ? component.color : '#ffffff';
                this.game.add.text(component.x, component.y, component.text, { font: component.size + 'px ' + component.font, fill: color }, menu);
                break;
            case 'sliders':
                this.loadSlider(component, menu);
                break;
            case 'save-slots':
                this.loadSaveSlot(component, menu);
                break;
        }
    };
    RJSGUI.prototype.loadButton = function (component, menu) {
        var _this = this;
        var btn = this.game.add.button(component.x, component.y, component.id, function () {
            if (component.sfx && component.sfx !== 'none') {
                var sfx = _this.game.add.audio(component.sfx);
                sfx.onStop.addOnce(sfx.destroy);
                sfx.play();
            }
            _this.buttonsAction[component.binding](component);
        }, this, 1, 0, 2, 0, menu);
        btn.component = component;
        if (btn.animations.frameTotal === 2) {
            btn.setFrames(1, 0, 1, 0);
        }
    };
    RJSGUI.prototype.loadSaveSlot = function (component, menu) {
        var sprite = this.game.add.sprite(component.x, component.y, component.id, 0, menu);
        sprite.config = component;
        var thumbnail = this.game.getSlotThumbnail(component.slot);
        if (thumbnail) {
            this.loadThumbnail(thumbnail, sprite);
        }
        this.saveSlots[component.slot] = sprite;
    };
    RJSGUI.prototype.loadSlider = function (component, menu) {
        var _this = this;
        var sliderFull = this.game.add.sprite(component.x, component.y, component.id, 0, menu);
        if (sliderFull.animations.frameTotal === 2) {
            sliderFull = this.game.add.sprite(component.x, component.y, component.id, 0, menu);
            sliderFull.frame = 1;
        }
        var createMask = function (slider, currentVal) {
            var sliderMask = _this.game.add.graphics(slider.x, slider.y, menu);
            sliderMask.beginFill(0xffffff);
            var maskWidth = slider.width * (currentVal - slider.limits[0]) / (slider.limits[1] - slider.limits[0]);
            sliderMask.drawRect(0, 0, maskWidth, slider.height);
            sliderMask.endFill();
            return sliderMask;
        };
        var currentVal = this.game.userPreferences[component.binding];
        sliderFull.limits = this.sliderLimits[component.binding];
        sliderFull.binding = component.binding;
        sliderFull.mask = createMask(sliderFull, currentVal);
        sliderFull.inputEnabled = true;
        sliderFull.events.onInputDown.add(function (sprite, pointer) {
            var val = (pointer.x - sprite.x);
            var newVal = (val / sprite.width) * (sprite.limits[1] - sprite.limits[0]) + sprite.limits[0];
            sprite.mask.destroy();
            sprite.mask = createMask(sprite, newVal);
            _this.game.userPreferences.setPreference(sprite.binding, newVal);
            if (sprite.binding == "bgmv") {
                _this.game.managers.audio.changeVolume('bgm', newVal);
            }
        });
    };
    RJSGUI.prototype.loadThumbnail = function (thumbnail, parent) {
        var _this = this;
        var id = 'thumbnail' + Math.floor(Math.random() * 5000);
        this.game.load.image(id, thumbnail);
        this.game.load.onLoadComplete.addOnce(function () {
            var thmbSprite = _this.game.add.sprite(parent.config['thumbnail-x'], parent.config['thumbnail-y'], id);
            thmbSprite.width = parent.config['thumbnail-width'];
            thmbSprite.height = parent.config['thumbnail-height'];
            parent.addChild(thmbSprite);
        }, this);
        this.game.load.start();
    };
    // ----------------------------------------------------------------
    // GUI user interaction, buttons and sliders
    // ----------------------------------------------------------------
    RJSGUI.prototype.ignoreTap = function (pointer) {
        // If user clicks on buttons, the tap shouldn't count to continue the story
        return this.skipClickArea.find(function (area) { return area.contains(pointer.x, pointer.y); }) !== undefined;
    };
    RJSGUI.prototype.addThumbnail = function (thumbnail, slot) {
        if (this.saveSlots[slot]) {
            this.loadThumbnail(thumbnail, this.saveSlots[slot]);
        }
    };
    RJSGUI.prototype.showMenu = function (menu) {
        return __awaiter(this, void 0, void 0, function () {
            var music, transition;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.game.pause();
                        this.previousMenu = this.currentMenu;
                        this.currentMenu = menu;
                        this.menus[menu].alpha = 0;
                        this.menus[menu].visible = true;
                        this.game.control.unskippable = true;
                        music = this.config.menus[menu].backgroundMusic;
                        if (music && !music.isPlaying && !this.game.userPreferences.muted) {
                            if (this.currentMusic) {
                                this.currentMusic.fadeOut(1000);
                            }
                            this.currentMusic = music;
                            this.currentMusic.fadeIn(1000);
                        }
                        transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.menus);
                        return [4 /*yield*/, transition(null, this.menus[menu])];
                    case 1:
                        _a.sent();
                        this.game.control.unskippable = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    RJSGUI.prototype.hideMenu = function (menu, mute, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var transition;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!menu) {
                            menu = this.currentMenu;
                        }
                        if (mute && this.currentMusic && this.currentMusic.isPlaying) {
                            this.currentMusic.fadeOut(400);
                            this.currentMusic = null;
                        }
                        this.game.control.unskippable = true;
                        transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.menus);
                        return [4 /*yield*/, transition(this.menus[menu], null)];
                    case 1:
                        _a.sent();
                        this.game.control.unskippable = false;
                        this.menus[menu].visible = false;
                        this.currentMenu = null;
                        if (callback) {
                            callback();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    RJSGUI.prototype.showHUD = function () {
        this.hud.visible = true;
    };
    RJSGUI.prototype.hideHUD = function () {
        this.hud.visible = false;
    };
    RJSGUI.prototype.changeMenu = function (menu) {
        return __awaiter(this, void 0, void 0, function () {
            var previous;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        previous = this.currentMenu;
                        if (!previous) return [3 /*break*/, 5];
                        if (!menu) return [3 /*break*/, 3];
                        // hide previous menu and show this
                        return [4 /*yield*/, this.hideMenu(previous, this.config.menus[menu].backgroundMusic)];
                    case 1:
                        // hide previous menu and show this
                        _a.sent();
                        return [4 /*yield*/, this.showMenu(menu)];
                    case 2:
                        _a.sent();
                        this.previousMenu = previous;
                        return [2 /*return*/];
                    case 3: 
                    // just hide menu
                    return [4 /*yield*/, this.hideMenu(previous, true)];
                    case 4:
                        // just hide menu
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        if (!menu) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.showMenu(menu)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    RJSGUI.prototype.initButtonsActions = function () {
        var game = this.game;
        this.buttonsAction = {
            start: function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                game.gui.showHUD();
                                return [4 /*yield*/, game.gui.changeMenu(null)];
                            case 1:
                                _a.sent();
                                game.start();
                                return [2 /*return*/];
                        }
                    });
                });
            },
            load: function (component) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                game.gui.showHUD();
                                return [4 /*yield*/, game.gui.changeMenu(null)];
                            case 1:
                                _a.sent();
                                game.loadSlot(parseInt(component.slot, 10));
                                return [2 /*return*/];
                        }
                    });
                });
            },
            auto: game.auto.bind(game),
            skip: game.skip.bind(game),
            mute: game.mute.bind(game),
            save: function (component) {
                game.save(parseInt(component.slot, 10));
            },
            saveload: function (argument) {
                game.pause();
                game.gui.changeMenu('saveload');
            },
            settings: function () {
                game.pause();
                game.gui.changeMenu('settings');
            },
            return: function () {
                return __awaiter(this, void 0, void 0, function () {
                    var prev;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                prev = game.gui.previousMenu;
                                return [4 /*yield*/, game.gui.changeMenu(prev)];
                            case 1:
                                _a.sent();
                                if (!prev) {
                                    game.unpause();
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            },
        };
    };
    // ----------------------------------------------------------------
    // GUI story interaction
    // ----------------------------------------------------------------
    RJSGUI.prototype.clear = function () {
        this.hideChoices();
        this.hideText();
    };
    RJSGUI.prototype.hideText = function () {
        if (!this.messageBox.alwaysOn) {
            this.messageBox.visible = false;
        }
        this.messageBox.message.text = '';
        if (this.ctc) {
            this.ctc.visible = false;
        }
    };
    RJSGUI.prototype.hideChoice = function (choiceId) {
        var choice = this.choices.getByName(choiceId);
        if (choice) {
            this.choices.remove(choice, true);
        }
    };
    RJSGUI.prototype.changeToLastInterrupt = function (choiceId) {
        var choice = this.choices.getByName(choiceId);
        if (choice.animations.frameTotal === 4) {
            choice.setFrames(3, 2, 3, 2);
        }
        else {
            choice.setFrames(4, 3, 5, 3);
        }
    };
    RJSGUI.prototype.hideChoices = function () {
        this.choices.removeAll();
    };
    RJSGUI.prototype.setTextStyles = function (text, text_obj) {
        text_obj.clearFontValues();
        text_obj.clearColors();
        var styles = [];
        while (true) {
            var re = /\((color:((\w+|#(\d|\w)+))|italic|bold)\)/;
            var match = text.match(re);
            if (match) {
                var s = {
                    start: text.search(re),
                    style: match[1].includes("color") ? "color" : match[1],
                    end: -1,
                    color: null
                };
                if (s.style == "color") {
                    s.color = match[2];
                }
                text = text.replace(re, "");
                var endIdx = text.indexOf("(end)");
                if (endIdx != -1) {
                    text = text.replace("(end)", "");
                    s.end = endIdx;
                    styles.push(s);
                }
            }
            else
                break;
        }
        styles.forEach(function (s) {
            if (s.style == "italic") {
                text_obj.addFontStyle("italic", s.start);
                text_obj.addFontStyle("normal", s.end);
            }
            if (s.style == "bold") {
                text_obj.addFontWeight("bold", s.start);
                text_obj.addFontWeight("normal", s.end);
            }
            if (s.style == "color") {
                text_obj.addColor(s.color, s.start);
                text_obj.addColor(text_obj.fill, s.end);
            }
        });
        return text;
    };
    RJSGUI.prototype.showText = function (text, title, colour, callback) {
        var _this = this;
        if (this.nameBox) {
            this.nameBox.text.text = title != undefined ? title : "";
            this.nameBox.text.fill = colour;
            this.nameBox.visible = title != undefined;
        }
        var textSpeed = this.sliderLimits.textSpeed[1] - this.game.userPreferences.textSpeed;
        if (this.game.control.skipping || textSpeed < 10) {
            this.messageBox.message.text = text;
            this.messageBox.visible = true;
            this.ctc.visible = true;
            callback();
            return;
        }
        var textObj = this.messageBox.message;
        textObj.text = '';
        var finalText = this.setTextStyles(text, textObj);
        var words = finalText.split('');
        var count = 0;
        var completeText = function () {
            clearTimeout(_this.textLoop);
            textObj.text = finalText;
            _this.game.gui.ctc.visible = true;
            callback();
        };
        this.textLoop = setInterval(function () {
            textObj.text += (words[count]);
            count++;
            if (count >= words.length) {
                completeText();
            }
        }, textSpeed);
        this.messageBox.visible = true;
        if (!this.game.control.auto) {
            this.game.waitForClick(completeText);
        }
    };
    RJSGUI.prototype.showChoices = function (choices, execId) {
        var _this = this;
        this.choices.removeAll(true);
        this.choices.alpha = 0;
        var choiceConfig = this.config.hud.choice;
        var interruptConfig = this.config.hud.interrupt;
        if (interruptConfig && !interruptConfig.inlineWithChoice) {
            // separate choices from interrupts
            choiceConfig = interruptConfig;
        }
        var x = (choiceConfig.isBoxCentered) ?
            this.game.world.centerX - choiceConfig.width / 2 :
            choiceConfig.x;
        var y = (choiceConfig.isBoxCentered) ?
            this.game.world.centerY - (choiceConfig.height * choices.length + parseInt(choiceConfig.separation, 10) * (choices.length - 1)) / 2 :
            choiceConfig.y;
        choices.forEach(function (choice, index) {
            _this.createChoiceBox(choice, [x, y], index, choiceConfig, execId);
        });
        var transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.textChoices);
        transition(null, this.choices);
    };
    RJSGUI.prototype.createChoiceBox = function (choice, pos, index, choiceConfig, execId) {
        var _this = this;
        var separation = index * (parseInt(choiceConfig.height, 10) + parseInt(choiceConfig.separation, 10));
        var chBox = this.game.add.button(pos[0], pos[1] + separation, choiceConfig.id, function () {
            if (choiceConfig.sfx && choiceConfig.sfx !== 'none') {
                var sfx = _this.game.add.audio(choiceConfig.sfx);
                sfx.onStop.addOnce(sfx.destroy);
                sfx.play();
            }
            var transition = _this.game.screenEffects.transition.get(_this.game.storyConfig.transitions.textChoices);
            transition(_this.choices, null).then(function () {
                _this.choices.removeAll(true);
                _this.game.managers.logic.choose(index, choice.choiceText, execId);
            });
        }, this, 1, 0, 2, 0, this.choices);
        if (chBox.animations.frameTotal === 2 || chBox.animations.frameTotal === 4) {
            chBox.setFrames(1, 0, 1, 0);
        }
        if (choice.interrupt && choice.remainingSteps === 1 && chBox.animations.frameTotal > 3) {
            if (chBox.animations.frameTotal === 4) {
                chBox.setFrames(3, 2, 3, 2);
            }
            else {
                chBox.setFrames(4, 3, 5, 3);
            }
        }
        chBox.choiceId = choice.choiceId;
        chBox.name = choice.choiceId;
        var textStyle = this.getTextStyle('choice');
        var text = this.game.add.text(0, 0, choice.choiceText, textStyle);
        text.visible = false;
        this.setTextPosition(chBox, text, choiceConfig);
        setTimeout(function () { text.visible = true; }, 20);
        if (this.game.storyConfig.logChoices && this.game.managers.logic.choicesLog[execId].indexOf(choice.choiceText) !== -1) {
            chBox.tint = this.toHexColor(choiceConfig['chosen-color']);
        }
        return chBox;
    };
    // ----------------------------------------------------------------
    // Helper functions
    // ----------------------------------------------------------------
    RJSGUI.prototype.toHexColor = function (color) {
        // eslint-disable-next-line no-bitwise
        return (parseInt(color.substr(1), 16) << 8) / 256;
    };
    RJSGUI.prototype.setTextPosition = function (sprite, text, component) {
        if (component.isTextCentered) {
            text.setTextBounds(0, 0, sprite.width, sprite.height);
            text.boundsAlignH = 'center';
            text.boundsAlignV = 'middle';
        }
        else {
            var offsetX = parseInt(component['offset-x'], 10);
            var offsetY = parseInt(component['offset-y'], 10);
            text.setTextBounds(offsetX, offsetY, sprite.width, sprite.height);
            text.boundsAlignH = component.align;
            text.boundsAlignV = 'top';
        }
        sprite.addChild(text);
        sprite.text = text;
    };
    return RJSGUI;
}());
exports.default = RJSGUI;
//# sourceMappingURL=RJSGUI.js.map