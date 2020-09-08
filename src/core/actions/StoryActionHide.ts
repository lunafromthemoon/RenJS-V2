import StoryAction from './StoryAction';
import RJS from '../RJS';
import {RJSSpriteManagerInterface} from '../../managers/RJSManager';

export default class StoryActionHide extends StoryAction {

	protected params: {actor:string, manager:RJSSpriteManagerInterface, transition:string, contAfterTrans:boolean}

    constructor(params, game) {
    	super(params,game)
    }

    execute(): void {
    	let transitioning: Promise<any> = null;
        if (this.params.actor === 'CHARS') {
            transitioning = this.game.managers.character.hideAll(this.params.transition)
        } else if (this.params.actor === 'ALL') {
            transitioning = Promise.all([
            	this.game.managers.background.hide(this.params.transition), 
            	this.game.managers.character.hideAll(this.params.transition), 
            	this.game.managers.cgs.hideAll(this.params.transition)
        	]);
        } else {
            transitioning = this.params.manager.hide(this.params.actor, this.params.transition);
        }
        this.resolve(transitioning,this.params.contAfterTrans);
    }
}
