import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionText extends StoryAction {

	protected params: {actor:string, look: string, body: string}

    constructor(params, game) {
    	super(params,game)
    }

    execute(): void {
    	if (this.params.actor){
    		this.game.managers.text.say(this.params.actor, this.params.look, this.params.body);
    	} else {
    		this.game.managers.text.show(this.params.body);
    	}
        // this action will resolve on its own
    }
}