import StoryAction from './StoryAction';
import RJS from '../RJS';
import {RJSSpriteManagerInterface} from '../../managers/RJSManager';

export default class StoryActionShow extends StoryAction {

	protected params: {actor:string, manager:RJSSpriteManagerInterface, transition:string, contAfterTrans:boolean}

    constructor(params, game) {
    	super(params,game)
    }

    execute(): void {
    	let transitioning: Promise<any> = this.params.manager.show(this.params.actor, this.params.transition, this.params);
        this.resolve(transitioning,this.params.contAfterTrans);
    }
}
