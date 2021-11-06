import RJS from '../../core/RJS';
import { Sprite } from 'phaser-ce';
export default class SaveSlot extends Sprite {
    thumbnail: Sprite;
    game: RJS;
    config: {
        x: number;
        y: number;
        asset: string;
        slot: number;
        thumbnail: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    };
    constructor(game: RJS, config: any);
    loadThumbnail(thumbnail: any): void;
    destroy(): void;
}
