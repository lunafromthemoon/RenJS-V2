import RJSManager from './RJSManager';
import {Group} from "phaser-ce";

export interface StoryManagerInterface<T> extends RJSManager {
    behindCharactersSprites: T
    cgsSprites: T
    interpret()
    startScene(name: string)
    currentScene: any[]
}

// todo to impl
export default class StoryManager implements StoryManagerInterface<Group> {
    behindCharactersSprites: Group;
    cgsSprites: Group


    set(...args: any) {
    }

    interpret() {
    }

    startScene(name: string) {
    }

    currentScene: any[];
}
