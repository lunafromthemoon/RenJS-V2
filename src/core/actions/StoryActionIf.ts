import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionEffect extends StoryAction {

    condition: string
    branches: {ISTRUE: any, ISFALSE?: any}

    constructor(protected game: RJS, protected actionType: string, protected properties:{[key: string]:any}){
        super(game,actionType,properties)
        this.condition = this.key.substr(this.key.indexOf('('));
        this.branches = {
            ISTRUE: this.body
        }
        if (this.game.managers.story.currentScene.length > 0){
            const next = this.game.managers.story.currentScene[0];
            if (next && 'else' in next){
                this.branches.ISFALSE = next.else;
                this.game.managers.story.currentScene.shift();
            }
        }
    }


    execute(): void {    	
        this.game.managers.logic.branch(this.condition, this.branches);
    	this.resolve();
    }
}