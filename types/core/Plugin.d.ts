import RJS from './RJS';
export interface PluginInterface {
}
export default class Plugin implements PluginInterface {
    protected game: RJS;
    protected name: string;
    constructor(name: any, game: any);
    execute(params: any): void;
    teardown(): void;
}
