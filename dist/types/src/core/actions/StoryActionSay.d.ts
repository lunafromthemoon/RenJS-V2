import StoryActionText from './StoryActionText';
import RJS from '../RJS';
export default class StoryActionSay extends StoryActionText {
    protected game: RJS;
    actionType: string;
    protected properties: {
        [key: string]: any;
    };
    actor: string;
    look: string;
    actorType: string;
    constructor(game: RJS, actionType: string, properties: {
        [key: string]: any;
    });
    execute(): void;
}
