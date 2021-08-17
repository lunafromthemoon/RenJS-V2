import { Sprite, Text } from 'phaser-ce';
export default class NameBox extends Sprite {
    id: string;
    text: Text;
    config: {
        id: string;
        asset: string;
        x: number;
        y: number;
        tintStyle: string;
        text: {
            x: number;
            y: number;
            style: any;
            lineSpacing: number;
        };
    };
    constructor(game: Phaser.Game, config: any);
    show(text: any, color: any): void;
    hide(): void;
    destroy(): void;
}
