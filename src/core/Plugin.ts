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

	onStart(): void {}

	onLoad(): void {}

	onSave(): void {}

	execute(params): void {}

	teardown(): void {

	}
}