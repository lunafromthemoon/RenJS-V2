import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionScene extends StoryAction {

	protected params: {scene: string}

    constructor(params, game) {
    	super(params,game)
    }

    execute(): void {
    	const scene = this.game.managers.logic.parseVars(this.params.scene);
        this.resolve(this.game.managers.story.startScene(scene));        
    }
}