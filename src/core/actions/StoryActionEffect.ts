import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionEffect extends StoryAction {

	protected params: {actor:string, contAfterTrans:boolean}

    constructor(params, game) {
    	super(params,game)
    }

    execute(): void {
    	if (this.game.screenEffects.effects[this.params.actor]){
    		let transitioning: Promise<any> = this.game.screenEffects.effects[this.params.actor](this.params);
            this.resolve(transitioning,this.params.contAfterTrans);
    	} else if (this.game.pluginsRJS[this.params.actor]){
    		this.game.pluginsRJS[this.params.actor].execute(this.params);
            // plugins resolve themselves
    	} else {
            this.resolve();
        }
    	
    }
}