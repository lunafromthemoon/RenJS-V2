import StoryAction from './StoryAction';
import RJS from '../RJS';
export default class StoryActionText extends StoryAction {
    protected game: RJS;
    actionType: string;
    protected properties: {
        [key: string]: any;
    };
    isVisualChoice: boolean;
    isInterrupt: boolean;
    handlerId: string;
    constructor(game: RJS, actionType: string, properties: {
        [key: string]: any;
    });
    execute(): Promise<any>;
}
