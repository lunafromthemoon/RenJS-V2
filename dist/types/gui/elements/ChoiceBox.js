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
var ChoiceBox = /** @class */ (function (_super) {
    __extends(ChoiceBox, _super);
    function ChoiceBox(game, config, id, choiceText, previouslyChosen, callback) {
        var _this = _super.call(this, game, 0, 0, config.asset, callback, game, 1, 0, 2, 0) || this;
        _this.id = id;
        _this.visible = false;
        // this.id = this.config.id;
        // this.nameBox.visible = false;
        _this.text = _this.game.add.text(_this.config.text.x, config.text.y, '', _this.config.text.style);
        if (_this.config.text.lineSpacing) {
            _this.text.lineSpacing = _this.config.text.lineSpacing;
        }
        _this.text.text = utils_1.setTextStyles(choiceText, _this.text);
        _this.addChild(_this.text);
        // const chBox: ChoiceButton = this.game.add.button(pos[0], pos[1]+separation, choiceConfig.id, () => {
        //     if (choiceConfig.sfx && choiceConfig.sfx !== 'none') {
        //         this.game.managers.audio.playSFX(choiceConfig.sfx);
        //     }
        //     let transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.textChoices);
        //     transition(this.choices,null).then(()=>{
        //         this.choices.removeAll(true);
        //         this.game.managers.logic.choose(index,choice.choiceText,execId);
        //     })
        // },this,1,0,2,0,this.choices);
        if (_this.animations.frameTotal === 2 || _this.animations.frameTotal === 4) {
            _this.setFrames(1, 0, 1, 0);
        }
        // if (choice.interrupt && choice.remainingSteps===1 && chBox.animations.frameTotal > 3){
        //     if (chBox.animations.frameTotal === 4){
        //         chBox.setFrames(3,2,3,2);
        //     } else {
        //         chBox.setFrames(4,3,5,3);
        //     }
        // }
        // this.id = id;
        // chBox.name = choice.choiceId;
        // const textStyle = this.getTextStyle('choice');
        // const text = this.game.add.text(0, 0, "" , textStyle);
        // setTimeout(()=>{this.text.visible = true},20)
        if (previouslyChosen) {
            _this.tint = utils_1.toHexColor(_this.config.chosenColor);
        }
        return _this;
    }
    ChoiceBox.prototype.destroy = function () {
        this.text.destroy();
        _super.prototype.destroy.call(this);
    };
    return ChoiceBox;
}(phaser_ce_1.Button));
exports.default = ChoiceBox;
//# sourceMappingURL=ChoiceBox.js.map