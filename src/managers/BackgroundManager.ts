import RJSManagerInterface from './RJSManager';
import RJSGame from "../RJSGame";
import {Group} from "phaser-ce";
import Transition from '../screen-effects/Transition';

export interface BackgroundManagerInterface extends RJSManagerInterface {}

export default class BackgroundManager implements BackgroundManagerInterface {
    backgroundSprites: Group
    private transition: Transition

    constructor(private game: RJSGame, transition: Transition) {
        this.backgroundSprites = this.game.add.group()
        this.transition = transition
    }

    backgrounds = {};
    current = null;

    add(name, animated, framerate) {
        this.backgrounds[name] = this.backgroundSprites.create(this.game.world.centerX, this.game.world.centerY, name);
        this.backgrounds[name].name = name;
        this.backgrounds[name].anchor.set(0.5);
        this.backgrounds[name].alpha = 0;
        if (animated){
            this.backgrounds[name].animated = true;
            this.backgrounds[name].animations.add("run", null, framerate);
        }
    }

    set (name) {
        if (this.current){
            this.current.alpha = 0;
        }
        this.current = this.backgrounds[name];
        this.current.alpha = 1;
        if (this.current.animated){
            this.current.animations.play("run", null, true);
        }
    }

    show (name,transition){
        const oldBg = this.current;
        this.current = name ? this.backgrounds[name] : null;
        // console.log("showing bg "+name);
        // debugger;
        if (this.current.animated){
            this.current.animations.play("run", null, true);
        }
        return transition(oldBg,this.current,{ x: this.game.world.centerX, y: this.game.world.centerY}, 1, this.backgroundSprites);
    }

    hide (bg,transition){
        return this.show(null,transition ? transition : this.transition.FADEOUT);
    }

    isBackground (actor){
        return actor in this.backgrounds;
    }
}

