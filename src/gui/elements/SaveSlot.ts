import RJS from '../../core/RJS';
import {Sprite} from 'phaser-ce';

export type SaveSlotConfig = {
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
}
export default class SaveSlot extends Sprite {
    thumbnail: Sprite
    game: RJS

    config: SaveSlotConfig;

    constructor(game: RJS, config: SaveSlotConfig) {
        super(game, config.x, config.y,config.asset);
        this.game = game;
        this.config = config;
        const thumbnailData = this.game.getSlotThumbnail(this.config.slot);
        if (thumbnailData) {
            this.loadThumbnail(thumbnailData);
        }
    }

    loadThumbnail(thumbnail): void {
        const id = 'thumbnail'+Math.floor(Math.random() * 5000);
        this.game.load.image(id, thumbnail);
        this.game.load.onLoadComplete.addOnce(() => {
            const thmbSprite = this.game.add.sprite(this.config.thumbnail.x,this.config.thumbnail.y,id);
            thmbSprite.width = this.config.thumbnail.width
            thmbSprite.height = this.config.thumbnail.height
            this.addChild(thmbSprite);
        }, this);
        this.game.load.start();
    }

    destroy(): void {
    	this.thumbnail.destroy();
    	super.destroy();
    }


}
