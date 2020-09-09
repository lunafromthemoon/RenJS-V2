import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionCall extends StoryAction {

	protected params: {actor: string}

    constructor(params, game) {
    	super(params,game)
    }

    execute(): void {
      const plugin = this.game.pluginsRJS[this.params.actor];
      plugin.execute(this.params);
      // custom action should know when it resolves
    }
}
