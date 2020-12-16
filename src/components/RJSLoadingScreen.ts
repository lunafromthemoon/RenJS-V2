import {Sprite} from 'phaser-ce';
import RJS from '../core/RJS';

export default class RJSLoadingScreen {
    loadingBar: Sprite
    loadingBarBg: Sprite
    background: Sprite
    loadingDir: number

    constructor(private game: RJS) {
        const config = game.config.splash;
        if (config.loadingScreen){
            this.background = game.add.sprite(game.world.centerX, game.world.centerY, 'loadingScreenBg');
            this.background.anchor.set(0.5);
        }

        if (config.loadingBar) {
            const position = config.loadingBar.position;
            this.loadingBar = game.add.sprite( position.x,position.y , 'loadingScreenBar');
            if (this.loadingBar.animations.frameTotal > 1){
                this.loadingBarBg = this.loadingBar;
                this.loadingBar = game.add.sprite(position.x,position.y , 'loadingScreenBar',1);
            }
            
        }
    }

    setLoadingBar(game): void{
        if (!this.loadingBar) return;
        const dir = game.config.splash.loadingBar.direction ? game.config.splash.loadingBar.direction : 0;
        game.load.setPreloadSprite(this.loadingBar,dir);
    }

    waitingScreen(): void {
        if (this.loadingBar){
            this.game.add.tween(this.loadingBar).to({alpha:1}, 600, null,true,0,-1,true);
        }
    }

    destroy(): void {
    	if (this.background) this.background.destroy();
        if (this.loadingBar) this.loadingBar.destroy();
        if (this.loadingBarBg) this.loadingBarBg.destroy();
    }
}
