import {Sprite} from 'phaser-ce';



export default class RJSSprite extends Sprite {
    constructor(game: Phaser.Game, x: number, y: number,) {
        super(game, x, y);
    }

    destroy() {
    	if (this.background){
    		this.background.destroy();
    	}
    	super.destroy();
    }

    background?: Sprite
}
