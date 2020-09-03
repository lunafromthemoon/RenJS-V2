import RJSManagerInterface from './RJSManager';
import {Group} from 'phaser-ce';
import Transition from '../screen-effects/Transition';
import RJS from '../core/RJS';

export interface BackgroundManagerInterface<T> extends RJSManagerInterface {
    backgroundSprites: T;
    backgrounds: object;
    current?: object;
    add(name, animated, framerate): void;
    show (name, transition): any;
    hide (bg,transition): any;
    isBackground (actor): boolean;
}

export default class BackgroundManager implements BackgroundManagerInterface<Group> {
    backgroundSprites: Group
    private transition: Transition
    backgrounds = {};
    current = null;

    constructor(private game: RJS) {
        this.backgroundSprites = game.add.group()
        this.transition = game.screenEffects.transition
    }

    add(name, animated?, framerate?): void {
        this.backgrounds[name] = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, name,this.backgroundSprites);
        this.backgrounds[name].name = name;
        this.backgrounds[name].anchor.set(0.5);
        this.backgrounds[name].alpha = 0;
        if (animated){
            this.backgrounds[name].animated = true;
            this.backgrounds[name].animations.add('run', null, framerate);
        }
    }

    set (name): void {
        if (this.current){
            this.current.alpha = 0;
        }
        this.current = this.backgrounds[name];
        this.current.alpha = 1;
        if (this.current.animated){
            this.current.animations.play('run', null, true);
        }
    }

    async show (name, transition): Promise<any> {
        const oldBg = this.current;
        this.current = name ? this.backgrounds[name] : null;
        if (this.current && this.current.animated){
            this.current.animations.play('run', null, true);
        }
        return transition(oldBg,this.current,{ x: this.game.world.centerX, y: this.game.world.centerY}, 1, this.backgroundSprites);
    }

    async hide (bg?, transition = this.transition.FADEOUT): Promise<any> {
        return this.show(null,() => transition);
    }

    isBackground (actor): boolean {
        return actor in this.backgrounds;
    }
}

