import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionAnimate extends StoryAction {

	protected params: {actor:string, transition:string, contAfterTrans:boolean, time:number}

    constructor(params, game) {
    	super(params,game)
    }

    execute(): void {
    	let transitioning: Promise<any> = this.game.managers.cgs.animate(this.params.actor, this.params, this.params.time);
    	this.resolve(transitioning,this.params.contAfterTrans);
    }
}