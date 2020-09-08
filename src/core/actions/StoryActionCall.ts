import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionCall extends StoryAction {

	protected params: {actor: string, body: {}}

    constructor(params, game) {
    	super(params,game)
    }

    execute(): void {
    	// actor is name of function
   		// body is params of function
   		// TODO: plugin system for calling custom functions
    	this.resolve()
    }
}