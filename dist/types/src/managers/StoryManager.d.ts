import { Group } from 'phaser-ce';
import RJS from '../core/RJS';
import RJSAssetLoader from '../core/RJSAssetLoader';
import { RJSSpriteManagerInterface } from './RJSManager';
import StoryAction from '../core/actions/StoryAction';
export interface StoryManagerInterface<T> {
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
    reservedWords: string[];
    actionFactory: {
        [key: string]: typeof StoryAction;
    };
    constructor(game: RJS);
    setupStory(): void;
    show(): Promise<any>;
    hide(): Promise<any>;
    interpret(): void;
    clearScene(): void;
    startScene(name: string): Promise<any>;
    getActorType(actor: any): string;
    getManagerByActorType(type: string): RJSSpriteManagerInterface;
    parseAction(actionRaw: any): StoryAction;
    interpretAction(actionRaw: any): Promise<any>;
}
