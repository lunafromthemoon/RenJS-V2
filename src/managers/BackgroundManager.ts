import {RJSSpriteManagerInterface} from './RJSManager';
import {Group} from 'phaser-ce';
import Transition from '../screen-effects/Transition';
import RJS from '../core/RJS';

export interface BackgroundManagerInterface<T> extends RJSSpriteManagerInterface {
    backgrounds: object;
    current?: object;
    createBackground(name): void;
    show (name, transitionName): any;
    hide (bg,transitionName): any;
    isBackground (actor): boolean;
}

export default class BackgroundManager implements BackgroundManagerInterface<Group> {
    backgrounds = {};
    current = null;

    constructor(private game: RJS) {
        if (game.setup.backgrounds){
            this.backgrounds = game.setup.backgrounds
        }
    }

    createBackground(name): void {
        const str = this.backgrounds[name].split(' ');
        const pos = this.game.storyConfig.positions.BACKGROUND ? 
                this.game.storyConfig.positions.BACKGROUND :
                {x:this.game.world.centerX, y:this.game.world.centerY};
        let bg = this.game.managers.story.backgroundSprites.create(pos.x,pos.y, name);
        bg.alpha = 0;
        bg.visible = false;
        bg.name = name;
        bg.anchor.set(0.5);
        if (str.length != 1){
            const framerate = str.length === 4 ? parseInt(str[3], 10) : 16;
            bg.animated = true;
            bg.animations.add('run', null, framerate);
        }
        return bg
    }

    set (name): void {
        if (this.current){
            this.current.destroy();
        }
        this.current = this.createBackground(name);
        this.current.alpha = 1;
        this.current.visible = true;
        if (this.current.animated){
            this.current.animations.play('run', null, true);
        }
    }

    async show (name, transitionName): Promise<any> {
        const oldBg = this.current;
        this.current = name ? this.createBackground(name) : null;
        if (this.current){
            this.current.visible=true;
            if (this.current.animated){
                this.current.animations.play('run', null, true);
            }
        }
        let transitioning: Promise<any> = this.game.screenEffects.transition.get(transitionName)(oldBg,this.current);
        transitioning.then(()=>{
            if (oldBg) oldBg.destroy();
        })
        return transitioning;
    }

    async hide (bg?, transitionName = 'FADEOUT'): Promise<any> {
        return this.show(null,transitionName);
    }

    isBackground (actor): boolean {
        return actor in this.backgrounds;
    }
}

