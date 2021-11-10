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
    transition: Transition

    constructor(private game: RJS) {}

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
        let position = props.position
        const previousSprite = this.cgs[name];
        if (!previousSprite){
            if (!position){
                position = {x: this.game.world.centerX, y: this.game.world.centerY}
            }
            this.cgs[name] = this.game.managers.story[props.layer].create(position.x, position.y, name);
            this.cgs[name].anchor.set(0.5);
            this.cgs[name].updateTransform();
            this.cgs[name].alpha = 0;

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
        }

        if (!position){
            position = {x: this.cgs[name].x, y: this.cgs[name].y}
        }

        if (props.zoom) {
            this.cgs[name].scale.set(props.zoom);
        }
        let flipped = false;
        if (props.flipped !== undefined){
            const currentlyFlipped = this.cgs[name].scale.x < 0;
            if (props.flipped === 'flip'){
                this.cgs[name].scale.x *= -1;
                flipped = !currentlyFlipped
            } else {
                flipped = props.flipped;
                if (flipped != currentlyFlipped){
                    this.cgs[name].scale.x *= -1;
                }
            }
        }
        if (props.angle) {
            this.cgs[name].angle = props.angle;
        }
        this.current[name] = {name, position, zoom: props.zoom, angle: props.angle, layer:props.layer, flipped};
        return this.transition.get(transitionName)(previousSprite, this.cgs[name], position);
    }

    async animate (name, toAnimate): Promise<void> {
        const time = toAnimate.time;
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
            // Cases for animation and when to resolve
            // 1. Only tweenables: resolve with tween
            // 2. Only spritesheet, not looped: resolve when animation stops
            // 3. Only spritesheet, looped with timer: resolve when timer stops
            // 4. Only spritesheet, looped with no timer: resolve immediately
            // 5. Only spritesheet, STOP looped animation: resolve immediately
            // 6. Spritesheet + tweenables: resolve with tween

            let resolveFunction = resolve
            if (toAnimate.spritesheet) {
                const stopAnimation = (): void => {
                    this.cgs[name].animations.stop();
                    // this.cgs[name].frame = 0;
                    resolve()
                }
                if (toAnimate.spritesheet === 'STOP') {
                    // case 5, stop animation and resolve immediately
                    this.cgs[name].frame = 0;
                    stopAnimation()
                } else {
                    const str = toAnimate.spritesheet.split(' ');
                    const animName = str[0];
                    const looped = str.includes('LOOPED');

                    const animation = this.cgs[name].animations.getAnimation(animName);
                    if (str.includes('BACKWARDS')){
                        animation.reverseOnce()
                    }
                    animation.play(null, looped);
                    if (Object.keys(tweenables).length == 0){
                        // no tweenables, cases 2, 3 and 4
                        if (!looped){
                            // case 2,
                            if (this.game.control.skipping){
                                // if skipping game stop immediately
                                return stopAnimation()
                            } else {
                                return animation.onComplete.addOnce(stopAnimation.bind(this))
                            }
                        } else {
                            if (!time){
                                // case 4, resolve immediately, don't stop animation
                                return resolve()
                            } else {
                                // case 3, stop animation and resolve after timeout
                                return this.game.waitTimeout(time,stopAnimation.bind(this))
                            }
                        }
                    } else {
                        // case 6, will resolve after tween
                        resolveFunction = stopAnimation.bind(this);
                    }
                }
            }
            // case 1 or 6, will resolve after tween
            this.game.managers.tween.tween(this.cgs[name], tweenables, resolveFunction, time, true);
        })

    }

    async hide (name, transitionName): Promise<void> {
        await this.transition.get(transitionName)(this.cgs[name], null)
        this.cgs[name].destroy();
        delete this.cgs[name];
        delete this.current[name];
    }

    isCGS (actor): boolean {
        return this.game.setup.cgs && actor in this.game.setup.cgs;
    }
}
