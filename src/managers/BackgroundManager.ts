import RJSManagerInterface from './RJSManager';
import RJSGame from '../RJSGame';
import {Group} from 'phaser-ce';
import Transition from '../screen-effects/Transition';

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

    constructor(private game: RJSGame, transition: Transition) {
        this.backgroundSprites = this.game.add.group()
        this.transition = transition
    }

    add(name, animated?, framerate?): void {
        this.backgrounds[name] = this.backgroundSprites.create(this.game.world.centerX, this.game.world.centerY, name);
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

    show (name, transition): any {
        const oldBg = this.current;
        this.current = name ? this.backgrounds[name] : null;
        if (this.current.animated){
            this.current.animations.play('run', null, true);
        }
        return transition(oldBg,this.current,{ x: this.game.world.centerX, y: this.game.world.centerY}, 1, this.backgroundSprites);
    }

    hide (bg,transition): any {
        return this.show(null,transition ? transition : this.transition.FADEOUT);
    }

    isBackground (actor): boolean {
        return actor in this.backgrounds;
    }
}

