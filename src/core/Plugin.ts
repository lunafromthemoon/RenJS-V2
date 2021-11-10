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
		// base plugin does nothing
	}

	onStart(): void {
		// base plugin does nothing
	}

	onLoad(slot,data): void {
		// base plugin does nothing
	}

	onSave(slot,data): void {
		// base plugin does nothing
	}

	onCall(params): void {
		// base plugin does nothing
	}

	onTeardown(): void {
		// base plugin does nothing
	}
}
