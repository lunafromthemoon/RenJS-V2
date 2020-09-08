import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionText extends StoryAction {

	protected params: {body:[], actor:string}

    constructor(params, game, private isVisualChoice, private isInterrupt) {
    	super(params,game)
    }

    execute(): void {
        // stop skipping in player choice
        this.game.control.skipping = false;
        if (this.isVisualChoice){
            this.game.managers.logic.showVisualChoices([...this.params.body]);
        } else if (this.isInterrupt){
            this.game.managers.logic.interrupt(this.params.actor,[...this.params.body]);
        } else {
            this.game.managers.logic.showChoices([...this.params.body]);
        }
        // this action is resolved on its own
    }
}