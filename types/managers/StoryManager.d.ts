import RJSManager from './RJSManager';
import { Group } from 'phaser-ce';
import RJS from '../core/RJS';
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
}
export default class StoryManager implements StoryManagerInterface<Group> {
    behindCharactersSprites: Group;
    cgsSprites: Group;
    characterSprites: Group;
    actorsIndex: {};
    currentScene: any[];
    backgroundSprites: Group;
    private game;
    constructor(game: RJS);
    setupStory(): void;
    set(...args: any): void;
    interpret(): void;
    startScene(name: string): void;
    getActorType(actor: any): string;
    getManagerByActorType(type: string): RJSManager;
    interpretAction(action: any): void;
}
