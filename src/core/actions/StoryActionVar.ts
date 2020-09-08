import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionVar extends StoryAction {

	protected params: {actor: string, body: string}

    constructor(params, game) {
    	super(params,game)
    }

    execute(): void {
        this.game.managers.logic.setVar(this.params.actor,this.params.body);
        this.resolve()
    }
}