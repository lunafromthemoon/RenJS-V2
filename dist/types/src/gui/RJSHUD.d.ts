import RJS from '../core/RJS';
import { Graphics, Button } from 'phaser-ce';
import RJSMenu from './RJSMenu';
import MessageBox from './elements/MessageBox';
import BaseButton from './elements/BaseButton';
import NameBox from './elements/NameBox';
import ChoiceHandler from './elements/ChoiceHandler';
export default class RJSHUD extends RJSMenu {
    mBoxes: {
        [key: string]: MessageBox;
    };
    nBoxes: {
        [key: string]: NameBox;
    };
    cHandlers: {
        [key: string]: ChoiceHandler;
    };
    skipClickArea: Phaser.Rectangle[];
    visualChoices: Graphics;
    constructor(game: RJS, config: any);
    createMessageBox(element: any): MessageBox;
    createNameBox(element: any): NameBox;
    createChoiceHandler(element: any): ChoiceHandler;
    createButton(element: any): BaseButton;
    unsetSkipButtons(): void;
    showName(boxId: any, name: any, color: any): void;
    hideName(boxId: any): void;
    showText(boxId: any, text: any, sfx?: any): Promise<any>;
    hideText(boxId: any): Promise<any>;
    showChoices(handlerId: any, choices: any): Promise<any>;
    hideChoices(handlerId: any): void;
    showVisualChoices(choices: any): Promise<any>;
    createVisualChoice(choice: any, index: any, resolve: any): Button;
    hideVisualChoices(transitionName?: any): Promise<any>;
    ignoreTap(pointer: any): boolean;
    clear(transition?: any): Promise<any>;
    showHUD(): Promise<any>;
    hideHUD(): Promise<any>;
    show(): Promise<any>;
    hide(): Promise<any>;
    destroy(): void;
}
