import StoryAction from './StoryAction';
import RJS from '../RJS';
export default class StoryActionAudio extends StoryAction {
    protected game: RJS;
    actionType: string;
    protected properties: {
        [key: string]: any;
    };
    actor: string;
    actorType: string;
    transition: string;
    looped: boolean;
    fromSeconds: number;
    force: boolean;
    channel: string;
    constructor(game: RJS, actionType: string, properties: {
        [key: string]: any;
    });
    execute(): void;
}
