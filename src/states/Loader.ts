import RJSState from './RJSState';
import TweenManager from '../managers/TweenManager';
import StoryManager from '../managers/StoryManager';
import AudioManager from '../managers/AudioManager';
import LogicManager from '../managers/LogicManager';
import TextManager from '../managers/TextManager';
import Ambient from '../screen-effects/Ambient';
import Effects from '../screen-effects/Effects';
import Transition from '../screen-effects/Transition';
import BackgroundManager from '../managers/BackgroundManager';
import CharacterManager from '../managers/CharacterManager';
import CGSManager from '../managers/CGSManager';
import RJS from '../core/RJS';

export default class Loader extends RJSState {
    constructor() {
        super();
    }

    init(): void {
        this.game.managers = {
            tween: new TweenManager(this.game),
            story: new StoryManager(this.game),
            audio: new AudioManager(this.game),
            logic: new LogicManager(this.game),
            text: new TextManager(this.game),
            background: null, // need transition
            character: null, // need transition
            cgs: null // need transition story tween
        }

        this.game.screenEffects = {
            ambient: new Ambient(this.game), // need audio et story
            effects: new Effects(this.game), // need audio et tween
            transition: new Transition(this.game) // need tween
        }
        this.game.managers.background = new BackgroundManager(this.game)
        this.game.managers.character = new CharacterManager(this.game)
        this.game.managers.cgs = new CGSManager(this.game)

        if (!(this.game.config.scaleMode === Phaser.ScaleManager.EXACT_FIT)){
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
        }
        this.game.scale.scaleMode = Phaser.ScaleManager[this.game.config.scaleMode];
        this.game.scale.refresh();
    }

    create(game: RJS) {
        if (game.config.i18n){
            this.state.start('chooseLang');
        } else {
            this.state.start('bootstrap');
        }
    }
}
