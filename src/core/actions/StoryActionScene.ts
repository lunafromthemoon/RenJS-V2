import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionScene extends StoryAction {

	protected params: {scene: string}

    constructor(params, game) {
    	super(params,game)
    }

    execute(): void {
        this.game.managers.story.startScene(this.params.scene);
        this.resolve()
    }
}