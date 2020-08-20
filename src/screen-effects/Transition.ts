import RJSScreenEffectInterface from "./RJSScreenEffect";
import RJSGame from "../RJSGame";
import {TweenManagerInterface} from "../managers/TweenManager";
import {Group} from "phaser-ce";


export default class Transition implements RJSScreenEffectInterface {

    static CUT = 'CUT'
    static FADE = 'FADE'
    static FADEOUT = 'FADEOUT'
    static FADEIN = 'FADEIN'
    static FUSION = 'FUSION'
    static MOVE = 'MOVE'
    static FADETOCOLOUR = 'FADETOCOLOUR'


    private game: RJSGame
    private tweenManager: TweenManagerInterface

    constructor(game: RJSGame) {
        this.game = game
        this.tweenManager = game.RJS.managers.tween
    }

    async CUT(from, to, position, scaleX?) {
        if (from) {
            from.alpha = 0;
        }
        if (to) {
            to.alpha = 1;
            setNewProperties(to, position, scaleX);
        }

    }

    async FADE(from, to, position, scaleX?) {
        if (!from) return this.FADEIN(to, position, scaleX);
        if (!to) return this.FADEOUT(from);

        this.tweenManager.chain([
            {
                sprite: from, tweenables: {alpha: 0}, callback: () => {
                    setNewProperties(to, position, scaleX);
                }
            },
            {sprite: to, tweenables: {alpha: 1}}
        ], this.game.defaultValues.fadetime);
    }

    async FADEOUT(from) {
        this.tweenManager.tween(from, {alpha: 0}, null, this.game.defaultValues.fadetime, true);
    }

    async FADEIN(to, position, scaleX) {
        setNewProperties(to, position, scaleX);
        this.tweenManager.tween(to, {alpha: 1}, null, this.game.defaultValues.fadetime, true);
    }

    async FUSION(from, to, position, scaleX, group: Group) {
        if (!from || !to) {
            return this.FADE(from, to, position);
        }

        if (group) {
            group.bringToTop(to);
        }
        setNewProperties(to, position, scaleX);

        this.tweenManager.tween(to, {alpha: 1}, () => {
            from.alpha = 0;
        }, this.game.defaultValues.fadetime, true);
    }

    async MOVE(from, to, position, scaleX) {
        if (!from || !to) {
            return this.CUT(from, to, position);
        }
        this.tweenManager.tween(from, {x: position.x, y: position.y}, () => {
            setNewProperties(to, position, scaleX);
            from.alpha = 0;
            to.alpha = 1;
        }, this.game.defaultValues.fadetime, true);
    }

    async FADETOCOLOUR(from, to, position, scaleX, colour) {
        const spr_bg = this.game.add.graphics(0, 0);
        // this.fadeColor = fadeColor ? fadeColor : 0x000000;
        spr_bg.beginFill(colour, 1);
        spr_bg.drawRect(0, 0, this.game.config.w, this.game.config.h);
        spr_bg.alpha = 0;
        spr_bg.endFill();
        this.tweenManager.chain([
            {
                sprite: spr_bg, tweenables: {alpha: 1}, callback: () => {
                    if (from) {
                        from.alpha = 0;
                    }
                    if (to) {
                        setNewProperties(to, position, scaleX);
                        to.alpha = 1;
                    }
                }
            },
            {
                sprite: spr_bg, tweenables: {alpha: 0}, callback: () => {
                    spr_bg.destroy();
                }
            }
        ], this.game.defaultValues.fadetime);
    }

    FADETOBLACK (from, to, position){
        return this.FADETOCOLOUR(from,to,position, null,0x000000)
    }

    FADETOWHITE (from, to, position){
        return this.FADETOCOLOUR(from, to, position, null, 0xFFFFFF)
    }
}

function setNewProperties(sprite, position, scaleX) {
    sprite.x = position.x;
    sprite.y = position.y;
    if (scaleX !== null && scaleX !== undefined) {
        sprite.scale.x = scaleX;
    }
}
