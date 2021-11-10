import RJS from '../../core/RJS';
import {Sprite} from 'phaser-ce';

export default class SaveSlot extends Sprite {
    thumbnail: Sprite
    game: RJS

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
    }

    constructor(game: RJS, config) {
        super(game, config.x, config.y,config.asset);
        this.game = game;
        this.config = config;
        const thumbnailData = this.game.getSlotThumbnail(this.config.slot);
        if (thumbnailData) {
            this.loadThumbnail(thumbnailData);
        }
        // this.saveSlots[element.slot] = sprite;
    }

    loadThumbnail(thumbnail) {
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
