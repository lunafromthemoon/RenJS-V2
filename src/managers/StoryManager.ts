import RJSManager from './RJSManager';
import {Group} from "phaser-ce";

export interface StoryManagerInterface extends RJSManager {
    behindCharactersSprites: Group
}

export default class StoryManager implements StoryManagerInterface {
    behindCharactersSprites: Phaser.Group;
}
