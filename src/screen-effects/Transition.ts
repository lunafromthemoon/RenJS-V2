import RJSScreenEffectInterface from './RJSScreenEffect';
import {TweenManagerInterface} from '../managers/TweenManager';
import {Group} from 'phaser-ce';
import RJS from '../core/RJS';


export default class Transition implements RJSScreenEffectInterface {

    static CUT = 'CUT'
    static FADE = 'FADE'
    static FADEOUT = 'FADEOUT'
    static FADEIN = 'FADEIN'
    static FUSION = 'FUSION'
    static MOVE = 'MOVE'
    static FADETOCOLOUR = 'FADETOCOLOUR'


    private game: RJS
    private tweenManager: TweenManagerInterface

    constructor(game: RJS) {
        this.game = game
        this.tweenManager = game.managers.tween
    }

    get(name: string): any{
        if (this[name]){
            return this[name].bind(this)
        } else if (this.game.pluginsRJS[name]){
            return this.game.pluginsRJS[name].execute.bind(this)
        }
    }

    async CUT(from, to, position?, scaleX?): Promise<void> {
        if (from) {
            from.alpha = 0;
        }
        if (to) {
            to.alpha = 1;
            setNewProperties(to, position, scaleX);
        }
    }

    async FADE(from, to, position?, scaleX?): Promise<any> {
        if (!from) return this.FADEIN(to, position, scaleX);
        if (!to) return this.FADEOUT(from);

        return new Promise(resolve => {
            this.tweenManager.chain([
                {
                    sprite: from, tweenables: {alpha: 0}, callback: () => {
                        setNewProperties(to, position, scaleX);
                        resolve();
                    }
                },
                {sprite: to, tweenables: {alpha: 1}}
            ],false, this.game.storyConfig.fadetime);
        })
        
    }

    async FADEOUT(from): Promise<void> {
        return new Promise(resolve => {
            this.tweenManager.tween(from, {alpha: 0}, resolve, this.game.storyConfig.fadetime, true,0,false);
        })
    }

    async FADEIN(to, position?, scaleX?): Promise<void> {
        return new Promise(resolve => {
            setNewProperties(to, position, scaleX);
            this.tweenManager.tween(to, {alpha: 1}, resolve, this.game.storyConfig.fadetime, true,0,false);
        })
    }

    async FUSION(from, to, position?, scaleX?): Promise<void> {
        if (!from || !to) {
            return this.FADE(from, to, position);
        }
        return new Promise(resolve => {
            if (from.parent) {
                from.parent.bringToTop(from);
            } 
            setNewProperties(to, position, scaleX);
            to.alpha = 1;
            this.tweenManager.tween(from, {alpha: 0}, () => {
                resolve();
            }, this.game.storyConfig.fadetime, true,0,false);
        });
    }

    async MOVE(from, to, position, scaleX?): Promise<void> {
        if (!from || !to) {
            return this.CUT(from, to, position);
        }
        return new Promise(resolve => {
            this.tweenManager.tween(from, {x: position.x, y: position.y}, () => {
                setNewProperties(to, position, scaleX);
                from.alpha = 0;
                to.alpha = 1;
                resolve();
            }, this.game.storyConfig.fadetime, true,0,false);
        });
    }

    async FADETOCOLOUR(from, to, colour, position?, scaleX?): Promise<void> {
        const sprBg = this.game.add.graphics(0, 0);
        // this.fadeColor = fadeColor ? fadeColor : 0x000000;
        sprBg.beginFill(colour, 1);
        sprBg.drawRect(0, 0, this.game.config.w, this.game.config.h);
        sprBg.alpha = 0;
        sprBg.endFill();
        return new Promise(resolve => {
            this.tweenManager.chain([
                {
                    sprite: sprBg, tweenables: {alpha: 1}, callback: (): void => {
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
                    sprite: sprBg, tweenables: {alpha: 0}, callback: () => {
                        sprBg.destroy();
                        resolve();
                    }
                }
            ], false, this.game.storyConfig.fadetime);
        });
    }

    async FADETOBLACK (from, to, position?): Promise<void> {
        return this.FADETOCOLOUR(from,to,0x000000, position, null)
    }

    async FADETOWHITE (from, to, position?): Promise<void> {
        return this.FADETOCOLOUR(from, to, 0xFFFFFF, position, null)
    }
}

const setNewProperties = (sprite, position, scaleX): void => {
    if (position){
        sprite.x = position.x;
        sprite.y = position.y;
    }
    if (scaleX !== null && scaleX !== undefined) {
        sprite.scale.x = scaleX;
    }
}
