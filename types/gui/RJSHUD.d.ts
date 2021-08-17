import RJS from '../core/RJS';
import RJSMenu from './RJSMenu';
export default class RJSHUD extends RJSMenu {
    id: string;
    mBoxes: {
        MessageBox: any;
    };
    nBoxes: {
        NameBox: any;
    };
    cHandlers: {
        ChoiceHandler: any;
    };
    constructor(game: RJS, config: any);
    createMessageBox(element: any): any;
    createNameBox(element: any): any;
    createChoiceHandler(element: any): any;
    showName(boxId: any, name: any, color: any): void;
    showText(boxId: any, text: any, sfx: any): Promise<any>;
    showChoices(handlerId: any, choices: any): Promise<any>;
    destroy(): void;
}
