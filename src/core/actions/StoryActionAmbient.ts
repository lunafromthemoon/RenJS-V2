import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionAmbient extends StoryAction {

	protected params: {actor:string}

    constructor(params, game) {
    	super(params,game)
    }

    execute(): void {
    	this.game.screenEffects.ambient[this.params.actor](this.params);
    	this.resolve();
    }
}