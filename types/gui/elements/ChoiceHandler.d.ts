import RJS from '../../core/RJS';
import { Graphics, Button } from 'phaser-ce';
export default class ChoiceHandler extends Graphics {
    game: RJS;
    config: {
        asset: string;
        x: number;
        y: number;
        alignment: string;
        separation: number;
        chosenColor: string;
        sfx: string;
        text: {
            x: number;
            y: number;
            lineSpacing?: number;
            style: any;
        };
    };
    boxes: Button[];
    constructor(game: RJS, config: any);
    showChoices(choices: any): Promise<any>;
    hideChoices(): Promise<any>;
    createChoiceBox(choice: any, x: any, y: any, index: any, resolve: any): Button;
    destroy(): void;
}
