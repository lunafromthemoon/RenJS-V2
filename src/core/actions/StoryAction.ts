import RJS from '../RJS';

export interface StoryActionInterface {
    resolve(transitioning: Promise<any>, cont:boolean);
    execute();
}

export default class StoryAction implements StoryActionInterface {

	protected game: RJS;
	protected params: object

	constructor(params, game){
		this.game = game;
		this.params = params;
	}

	resolve(transitioning?: Promise<any>, cont?:boolean): void {
		if (transitioning && !cont){
            transitioning.then(()=> this.game.resolveAction())
        } else {
			this.game.resolveAction()
        }
	}

	execute(): void {

	}
}