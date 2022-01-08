import RJS from './RJS';
export interface PluginInterface {
}
export default class Plugin implements PluginInterface {
    protected game: RJS;
    protected name: string;
    constructor(name: any, game: any);
    onInit(): void;
    onStart(): void;
    onLoad(slot: any, data: any): void;
    onLoaded(): void;
    onSave(slot: any, data: any): void;
    onCall(params: any): void;
    onAction(action: any): void;
    onEndScene(params: any): void;
    onTeardown(): void;
}
