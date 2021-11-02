import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionWait extends StoryAction {

	// protected params: {wait:string}

    execute(): void {
    	if (this.body === 'click'){
            this.game.waitForClick();
        } else {
            this.game.waitTimeout(parseInt(this.body, 10));
        }
        // this action is resolved on its own
    }
}
