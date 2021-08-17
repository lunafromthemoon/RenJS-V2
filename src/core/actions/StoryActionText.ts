import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionText extends StoryAction {

	protected params: {actor:string, look: string, boxId?: string, body: string}

    constructor(params, game) {
    	super(params,game)
    }

    execute(): void {
        let transitioning: Promise<any> = null;
    	if (this.params.actor){
    		transitioning = this.game.managers.text.characterSays(this.params.actor, this.params.look, this.params.body,this.params.boxId);
    	} else {
    		transitioning = this.game.managers.text.display(this.params.body,this.params.boxId);
    	}
        this.resolve(transitioning);
    }
}