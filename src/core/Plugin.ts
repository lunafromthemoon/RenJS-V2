import RJS from './RJS'

export interface PluginInterface {
}

export default class Plugin implements PluginInterface {

	protected game: RJS;
	protected name: string

	constructor(name, game){
		this.game = game;
		this.name = name
	}

	onInit(): void {}

	onStart(): void {}

	onLoad(slot,data): void {}

	onSave(slot,data): void {}

	onCall(params): void {}

	onTeardown(): void {

	}
}