import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionAmbient extends StoryAction {

	protected params: {actor:string}

    constructor(params, game) {
    	super(params,game)
    }

    execute(): void {
    	if (this.game.screenEffects.ambient[this.params.actor]){
    		this.game.screenEffects.ambient[this.params.actor](this.params);
            this.resolve();
    	} else if (this.game.pluginsRJS[this.params.actor]){
    		this.game.pluginsRJS[this.params.actor].execute(this.params);
            // plugins resolve themselves
    	} else {
            this.resolve();
        }
        
    }
}