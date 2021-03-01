import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionText extends StoryAction {

	protected params: {actor:string, look: string, body: string}

    constructor(params, game) {
    	super(params,game)
    }

    execute(): void {
        let transitioning: Promise<any> = null;
    	if (this.params.actor){
    		transitioning = this.game.managers.text.say(this.params.actor, this.params.look, this.params.body);
    	} else {
    		transitioning = this.game.managers.text.show(this.params.body);
    	}
        this.resolve(transitioning);
    }
}