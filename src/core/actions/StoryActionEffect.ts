import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionEffect extends StoryAction {

	protected params: {actor:string, contAfterTrans:boolean}

    constructor(params, game) {
    	super(params,game)
    }

    execute(): void {
    	let transitioning: Promise<any> = null;
    	if (this.game.screenEffects.effects[this.params.actor]){
    		transitioning = this.game.screenEffects.effects[this.params.actor](this.params);
    	} else if (this.game.pluginsRJS[this.params.actor]){
    		transitioning = this.game.pluginsRJS[this.params.actor].execute(this.params);
    	}
    	this.resolve(transitioning,this.params.contAfterTrans);
    }
}