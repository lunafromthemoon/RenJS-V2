import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionEffect extends StoryAction {

	protected params: {}

    constructor(params, game) {
    	super(params,game)
    }

    execute(): void {
    	function getKey(act): any {
            return Object.keys(act)[0];
        }
        const key = getKey(this.params)
    	const condition = key.substr(key.indexOf('('));
        const branches: {
            ISTRUE: boolean;
            ISFALSE?: boolean;
        } = {
            ISTRUE: this.params[key]
        }
        const next = this.game.managers.story.currentScene[0];
        if (next && getKey(next) === 'else'){
            branches.ISFALSE = next.else;
            this.game.managers.story.currentScene.shift();
        }
        this.game.managers.logic.branch(condition, branches);
    	this.resolve();
    }
}