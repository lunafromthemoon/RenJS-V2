import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionWait extends StoryAction {

	protected params: {wait:string}

    constructor(params, game) {
    	super(params,game)
    }

    execute(): void {
    	if (this.params.wait === 'click'){
            this.game.waitForClick();
        } else {
            this.game.waitTimeout(parseInt(this.params.wait, 10));
        }
        // this action is resolved on its own
    }
}
