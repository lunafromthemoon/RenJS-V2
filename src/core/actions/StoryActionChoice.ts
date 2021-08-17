import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionText extends StoryAction {

	protected params: {body:any, boxId:string}

    constructor(params, game, private isVisualChoice, private isInterrupt) {
    	super(params,game)
    }

    execute(): void {
        if (this.isInterrupt && this.params.body == 'hide'){
            this.game.managers.logic.clearChoices();
            this.resolve()
            return;
        }
        // stop skipping in player choice
        this.game.control.skipping = false;
        this.game.input.enabled = true;
        const boxId = this.isVisualChoice ? "visualChoices" : this.params.boxId;
        if (this.isInterrupt){
            this.game.managers.logic.interrupt(boxId,[...this.params.body]);
        } else {
            this.game.managers.logic.showChoices(boxId,[...this.params.body]);
        }
        // this action is resolved on its own
    }
}