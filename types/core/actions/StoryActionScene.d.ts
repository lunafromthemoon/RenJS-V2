import StoryAction from './StoryAction';
import RJS from '../RJS';
export default class StoryActionScene extends StoryAction {
    protected game: RJS;
    actionType: string;
    protected properties: {
        [key: string]: any;
    };
    scene: string;
    constructor(game: RJS, actionType: string, properties: {
        [key: string]: any;
    });
    execute(): void;
}
