import StoryAction from './StoryAction';

export class StoryActionEnd extends StoryAction {

    execute(): void {
    	// tear down everything and return to main menu
        this.game.endGame();
    }
}
export default StoryActionEnd