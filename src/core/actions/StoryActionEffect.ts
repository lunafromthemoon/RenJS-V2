import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionEffect extends StoryAction {

	protected params: {actor:string, contAfterTrans:boolean}

    constructor(params, game) {
    	super(params,game)
    }

    execute(): void {
    	let transitioning: Promise<any> = this.game.screenEffects.effects[this.params.actor](this.params);
    	this.resolve(transitioning,this.params.contAfterTrans);
    }
}