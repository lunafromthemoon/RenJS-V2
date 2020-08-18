import _ from 'underscore'
import {RenJS, config} from "./RenJS";
import {game} from "./RenJSBootstrap";
import {globalConfig} from "../dev-only/config";
export const effects = {
    SHAKE: function(){
        return new Promise(function(resolve, reject) {
            game.camera.shake(0.01, 200);
            resolve();
        });
    },
    ROLLINGCREDITS: function(params){
        return new Promise(function(resolve, reject) {
            var bg = game.add.graphics(0, 0);
            RenJS.audioManager.play("rollingCredits","bgm",true,"FADE");
            bg.beginFill(0x000000, 1);
            bg.drawRect(0, 0, globalConfig.w, globalConfig.h);
            bg.endFill();
            bg.alpha = 0;
            var style = _.clone(_.extend(config.defaultTextStyle,RenJS.gui.getChoiceTextStyle()));
            style.font = "25pt "+RenJS.gui.getFonts()[0];
            var credits = game.add.text(game.world.centerX,globalConfig.h+30,params.text[0],style);
            credits.anchor.set(0.5);
            var separation = 35;
            for (var i = 1; i < params.text.length; i++) {
                if (params.text[i]){
                    var nextLine = game.add.text(0,i*separation,params.text[i],style);
                    nextLine.anchor.set(0.5);
                    credits.addChild(nextLine);
                }
            }
            var tweenChain = [
                {sprite:bg,tweenables:{alpha:1},time:config.fadetime},
                {sprite:credits,tweenables:{y:-(separation*params.text.length+30)},time:700*params.text.length},

            ];
            if (!params.endGame){
                tweenChain.push({sprite:bg,tweenables:{alpha:0},time:config.fadetime,callback:function(){
                    bg.destroy();
                    credits.destroy();
                    resolve();
                }});
            } else {
                tweenChain[1].callback = resolve;
            }
            RenJS.tweenManager.unskippable = true;
            RenJS.tweenManager.chain(tweenChain);
        });
    },
    SHOWTITLE: function(param){
        return new Promise(function(resolve, reject) {
            var bg = game.add.sprite(game.world.centerX,game.world.centerY,"title");
            bg.anchor.set(0.5);
            var style = _.clone(_.extend(config.defaultTextStyle,RenJS.gui.getChoiceTextStyle()));
            style.font = "50pt "+RenJS.gui.getFonts()[0];
            var title = game.add.text(0,-20, param.title, style);
            style.font = "25pt "+RenJS.gui.getFonts()[0];
            var subtitle = game.add.text(0,40, param.subtitle, style);
            subtitle.anchor.set(0.5);
            title.anchor.set(0.5);
            bg.addChild(title);
            bg.addChild(subtitle);
            bg.alpha = 0;


            RenJS.tweenManager.chain([
                {sprite:bg,tweenables:{alpha:1}},
                {sprite:bg,tweenables:{alpha:0},callback:function(){
                    bg.destroy();
                    resolve();
                }, delay: RenJS.control.fadetime*2}
            ],config.fadetime*2);
        });
    },
    FLASHIMAGE: function(image){
        return new Promise(function(resolve, reject) {
            var image = game.add.sprite(game.world.centerX,game.world.centerY,image);
            image.anchor.set(0.5);
            setTimeout(function() {
                var tween = game.add.tween(image);
                tween.to({ alpha: 0 }, RenJS.control.fadetime/2, Phaser.Easing.Linear.None);
                tween.onComplete.add(function(){
                    image.destroy();
                    resolve();
                }, this);
                tween.start();
            }, RenJS.control.fadetime/3);

        });
    },
    EXPLOSION: function(){
        return new Promise(function(resolve, reject) {
            var explosion = game.add.sprite(game.world.centerX,game.world.centerY, 'explosion');
            explosion.anchor.set(0.5);
            // let added
            let anim = explosion.animations.add('explode');
            anim.onComplete.add(function(){
                resolve();
            }, this);
            anim.play(10, false,true);
            RenJS.audioManager.playSFX("explosionSound");
        });
    },
    THUNDER: function(){
        game.camera.shake(0.01, 200);
        RenJS.audioManager.playSFX("thunderSFX");
        return RenJS.effects.FLASHIMAGE("thunder");
    },
    ATTACK: function() {
        game.camera.shake(0.01, 200);
        return RenJS.effects.FLASHIMAGE("attack");
    },
    MULTIATTACK: function() {
        RenJS.audioManager.playSFX("magical");
        game.camera.shake(0.01, 600);
        return RenJS.effects.FLASHIMAGE("multiattack");
    },
    CHAINATTACK: function() {
        return new Promise(function(resolve, reject) {
            game.camera.shake(0.01, 200);
            RenJS.effects.FLASHIMAGE("chainattack1").then(function(){
                game.camera.shake(0.01, 200);
                RenJS.effects.FLASHIMAGE("chainattack2").then(function(){
                    game.camera.shake(0.01, 200);
                    RenJS.effects.FLASHIMAGE("chainattack3").then(resolve);
                })
            });
        });
    }
}
