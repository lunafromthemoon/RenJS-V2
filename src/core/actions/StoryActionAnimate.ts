import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionAnimate extends StoryAction {

    actor: string
    contAfterTrans: boolean
	// protected params: {actor:string, transition:string, contAfterTrans:boolean, time:number}

    constructor(protected game: RJS, public actionType: string, protected properties: {[key: string]: any}){
    	super(game,actionType,properties)
        this.actor = this.parseActor();
        this.contAfterTrans = this.parseParameter('CONTINUE')
    }

    execute(): void {
    	let transitioning: Promise<any> = this.game.managers.cgs.animate(this.actor, this.properties);
    	this.resolve(transitioning,this.contAfterTrans);
    }
}