import RJS from './RJS';
export interface PluginInterface {
}
export default class Plugin implements PluginInterface {
    protected game: RJS;
    protected name: string;
    constructor(name: any, game: any);
    onStart(): void;
    onLoad(): void;
    onSave(): void;
    onCall(params: any): void;
    onTeardown(): void;
}
