import Manager from './RJSManager';
import {RenJS} from '../to-migrate/RenJS';
import {game} from '../to-migrate/RenJSBootstrap';

export default class BackgroundManager implements Manager {
    backgrounds = {};
    current = null;

    add(name,animated,framerate) {
        this.backgrounds[name] = RenJS.storyManager.backgroundSprites.create(game.world.centerX,game.world.centerY,name);
        this.backgrounds[name].name = name;
        this.backgrounds[name].anchor.set(0.5);
        this.backgrounds[name].alpha = 0;
        if (animated){
            this.backgrounds[name].animated = true;
            this.backgrounds[name].animations.add("run",null,framerate);
        }
    }

    this.set = function (name) {
        if (this.current){
            this.current.alpha = 0;
        }
        this.current = this.backgrounds[name];
        this.current.alpha = 1;
        if (this.current.animated){
            this.current.animations.play("run",null,true);
        }
    }

    this.show = function(name,transition){
        var oldBg = this.current;
        this.current = name ? this.backgrounds[name] : null;
        // console.log("showing bg "+name);
        // debugger;
        if (this.current.animated){
            this.current.animations.play("run",null,true);
        }
        return transition(oldBg,this.current,{x:game.world.centerX,y:game.world.centerY},1,RenJS.storyManager.backgroundSprites);
    }

    this.hide = function(bg,transition){
        return this.show(null,transition ? transition : RenJS.transitions.FADEOUT);
    }

    this.isBackground = function(actor){
        return _.has(this.backgrounds,actor);
    }
}
