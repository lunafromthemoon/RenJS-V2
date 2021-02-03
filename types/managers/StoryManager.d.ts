import RJSManager from './RJSManager';
import { Group } from 'phaser-ce';
import RJS from '../core/RJS';
import RJSAssetLoader from '../core/RJSAssetLoader';
import RJSManagerInterface from './RJSManager';
export interface StoryManagerInterface<T> extends RJSManagerInterface {
    behindCharactersSprites: T;
    characterSprites: T;
    cgsSprites: T;
    backgroundSprites: T;
    interpret(): any;
    startScene(name: string): any;
    currentScene: any[];
    actorsIndex: object;
    interpreting: boolean;
    assetLoader: RJSAssetLoader;
}
export default class StoryManager implements StoryManagerInterface<Group> {
    private game;
    behindCharactersSprites: Group;
    cgsSprites: Group;
    characterSprites: Group;
    actorsIndex: {};
    currentScene: any[];
    backgroundSprites: Group;
    interpreting: boolean;
    assetLoader: RJSAssetLoader;
    constructor(game: RJS);
    setupStory(): void;
    set(...args: any): void;
    interpret(): void;
    clearScene(): void;
    startScene(name: string): Promise<void>;
    getActorType(actor: any): string;
    getManagerByActorType(type: string): RJSManager;
    parseAction(action: any): any;
    interpretAction(actionRaw: any): void;
}
