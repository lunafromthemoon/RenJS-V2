import RJS from '../../core/RJS';
import { Button, Text } from 'phaser-ce';
export default class ChoiceBox extends Button {
    private id;
    text: Text;
    config: {
        chosenColor: string;
        text: {
            x: number;
            y: number;
            lineSpacing: number;
            style: any;
        };
    };
    constructor(game: RJS, config: any, id: string, choiceText: string, previouslyChosen: boolean, callback: any);
    destroy(): void;
}
