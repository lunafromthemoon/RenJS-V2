import RJS from './RJS';

export interface PluginInterface {
}

export default class Plugin implements PluginInterface {

	protected game: RJS;
	protected name: string

	constructor(name, game){
		this.game = game;
		this.name = name
	}

	onInit(): void {
		// called after everything is loaded (unless lazyloading), before showing any menu
		// base plugin does nothing
	}

	onStart(): void {
		// called when new game is started, just before interpreter is called
		// base plugin does nothing
	}

	onLoad(slot,data): void {
		// called when loading game data, before loading the game
		// "data" parameter can be modified here and change what will be loaded
		// base plugin does nothing
	}

	onLoaded(): void {
		// called after loaded data recreated the saved point, just before interpreter is called
		// base plugin does nothing
	}

	onSave(slot,data): void {
		// called just before saving game data to localstorage
		// "data" parameter can be modified here and that's what will be saved
		// base plugin does nothing
	}

	onCall(params): void {
		// called from the story, by using "call" action
		// base plugin does nothing
	}

	onAction(action): void {
		// called before executing every single action, with actual action object
		// base plugin does nothing
	}

	onEndScene(params): void {
		// called when the interpreter runs out of actions, normally when a scene ends without calling another scene
		// base plugin does nothing
	}

	onTeardown(): void {
		// called when game ends, before returning to the main menu
		// base plugin does nothing
	}
}
