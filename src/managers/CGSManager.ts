import RJSManager from './RJSManager';
import Transition from '../screen-effects/Transition';
import {StoryManagerInterface} from './StoryManager';
import {range} from '../utils/array';
import {TweenManagerInterface} from './TweenManager';
import {Group} from 'phaser-ce';
import RJS from '../core/RJS';
import {RJSSpriteManagerInterface} from './RJSManager';

export interface CGSManagerInterface extends RJSSpriteManagerInterface {
    cgs: object;
    current: object;
    hideAll(transition: string);
    show(name: string, transition: () => any, props): any;
    hide(name, transition): Promise<any>;
}

export default class CGSManager implements CGSManagerInterface {

    cgs: object = {};
    current: object = {};
    private transition: Transition
    private game: RJS
    private storyManager: StoryManagerInterface<Group>
    private tweenManager: TweenManagerInterface

    constructor(game: RJS) {
        this.game = game
        this.transition = game.screenEffects.transition
        this.storyManager = game.managers.story
        this.tweenManager = game.managers.tween
    }

    async set(current): Promise<void> {
        await this.hideAll(Transition.CUT);
        this.current = current;
        for (const cg in this.current) {
            if (cg) {
                this.show(cg, Transition.CUT, this.current[cg])
            }
        }
    }

    async hideAll(transition = Transition.FADEOUT): Promise<any> {
        const promises = []
        for (const cg in this.cgs) {
            promises.push(this.hide(cg,transition));
        }
        return Promise.all(promises)
    }

    show (name, transitionName, props): Promise<any> {
        const position = props.position ? props.position : {x: this.game.world.centerX, y: this.game.world.centerY};
        this.cgs[name] = this.storyManager.cgsSprites.create(position.x, position.y, name);
        this.cgs[name].anchor.set(0.5);
        this.cgs[name].alpha = 0;
        if (props.zoom) {
            this.cgs[name].scale.set(props.zoom);
        }
        if (props.angle) {
            this.cgs[name].angle = props.angle;
        }
        if (this.game.setup.cgs[name].animations) {
            for (const key in this.game.setup.cgs[name].animations) {
                const str = this.game.setup.cgs[name].animations[key].split(' ');
                // range of animation
                const frames = range(parseInt(str[0], 10), parseInt(str[1], 10))
                let frameRate = 24;
                if (str.length > 2) {
                    frameRate = parseInt(str[2], 10)
                }
                this.cgs[name].animations.add(key, frames, frameRate)
            }
        }
        this.current[name] = {name, position, zoom: props.zoom, angle: props.angle};
        return this.transition.get(transitionName)(null, this.cgs[name], position);
    }

    async animate (name, toAnimate, time): Promise<void> {
        // TODO: make truly async
        const tweenables: {
            alpha?: number;
            angle?: number;
            x?: number;
            y?: number;
            height?: number;
            width?: number;
        } = {}

        if (toAnimate.alpha !== undefined && toAnimate.alpha !== null) {
            tweenables.alpha = toAnimate.alpha;
        }
        if (toAnimate.angle !== undefined && toAnimate.angle !== null) {
            tweenables.angle = toAnimate.angle;
        }
        if (toAnimate.position !== undefined && toAnimate.position !== null) {
            tweenables.x = toAnimate.position.x;
            tweenables.y = toAnimate.position.y;
        }
        if (toAnimate.zoom !== undefined && toAnimate.zoom !== null) {
            if (!this.cgs[name].originalScale) {
                this.cgs[name].originalScale = {width: this.cgs[name].width, height: this.cgs[name].height}
            }
            tweenables.height = this.cgs[name].originalScale.height * toAnimate.zoom;
            tweenables.width = this.cgs[name].originalScale.width * toAnimate.zoom;
        }
        this.current[name] = {...this.current[name], ...toAnimate};
        return new Promise(resolve => {
            let resolveFunction = resolve
            if (toAnimate.spritesheet) {
                if (toAnimate.spritesheet === 'stop') {
                    this.cgs[name].animations.stop();
                    this.cgs[name].frame = 0;
                    // TODO should it finish?
                } else {
                    const str = toAnimate.spritesheet.split(' ');
                    // let added
                    const animName = str[0];
                    // let added
                    const looped = str.length > 1 && str[1] === 'looped';
                    this.cgs[name].animations.play(animName, null, looped);
                    resolveFunction = (): void => {
                        this.cgs[name].animations.stop();
                        this.cgs[name].frame = 0;
                        resolve()
                    }
                }
            }
            if (!time) {
                // stopping animation or looped animation
                resolve()
                return;
            }

            this.tweenManager.tween(this.cgs[name], tweenables, resolveFunction, time, true);
        })
        
    }

    async hide (name, transitionName): Promise<void> {
        await this.transition.get(transitionName)(this.cgs[name], null)
        this.cgs[name].destroy();
        delete this.cgs[name];
        delete this.current[name];
    }

    isCGS (actor): boolean {
        return actor in this.cgs;
    }
}
