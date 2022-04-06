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
    interpret(): void;
    startScene(name: string): Promise<void>;
    currentScene: any[];
    actorsIndex: {
        [key: string]: string;
    };
    interpreting: boolean;
    assetLoader?: RJSAssetLoader;
}
export default class StoryManager implements StoryManagerInterface<Group> {
    private game;
    behindCharactersSprites: Group;
    cgsSprites: Group;
    characterSprites: Group;
    actorsIndex: {
        [key: string]: string;
    };
    currentScene: any[];
    backgroundSprites: Group;
    interpreting: boolean;
    assetLoader?: RJSAssetLoader;
    reservedWords: string[];
    actionFactory: {
        [key: string]: typeof StoryAction;
    };
    constructor(game: RJS);
    show(): Promise<any>;
    hide(): Promise<any>;
    interpret(): void;
    clearScene(): void;
    startScene(name: string): Promise<void>;
    getActorType(actor: string): string | null;
    getManagerByActorType(type: string): RJSSpriteManagerInterface | null;
    parseAction(actionRaw: {
        [key: string]: any;
    }): StoryAction | null;
    interpretAction(actionRaw: {
        [key: string]: any;
    }): Promise<any>;
}
