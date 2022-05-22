import RJS from '../../core/RJS';
import { Text } from 'phaser-ce';
export default class Label extends Text {
    styleChanges: {
        [key: string]: any;
    };
    config: {
        x: number;
        y: number;
        text?: string;
        lineSpacing: number;
        style: any;
    };
    constructor(game: RJS, config: any, parent?: any);
    changeText(text: string): void;
    changeStyle(style: any): void;
    resetStyle(): void;
}
