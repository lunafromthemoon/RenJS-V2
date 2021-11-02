import StoryAction from './StoryAction';
import RJS from '../RJS';
export default class StoryActionText extends StoryAction {
    protected game: RJS;
    actionType: string;
    protected properties: {
        [key: string]: any;
    };
    protected boxId: string;
    dontHide: boolean;
    constructor(game: RJS, actionType: string, properties: {
        [key: string]: any;
    });
    execute(): void;
}
