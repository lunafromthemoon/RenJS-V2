import {Sprite,Group,Tween} from 'phaser-ce';
import RJS from '../core/RJS';

export default class RJSLoadingScreen {
    container: Group
    loadingBar: Sprite
    loadingBarBg: Sprite
    background: Sprite
    loadingDir: number

    constructor(private game: RJS) {
        this.container = game.add.group();
        this.container.alpha = 0;
        const config = game.config.splash;
        if (config.loadingScreen){
            this.background = this.container.create(game.world.centerX, game.world.centerY, 'loadingScreenBg');
            this.background.anchor.set(0.5);
        }

        if (config.loadingBar) {
            const position = config.loadingBar.position;
            this.loadingBar = this.container.create( position.x,position.y , 'loadingScreenBar');
            if (this.loadingBar.animations.frameTotal > 1){
                this.loadingBarBg = this.loadingBar;
                this.loadingBar = this.container.create(position.x,position.y , 'loadingScreenBar',1);
            }
        }
        if (config.fade){
            game.add.tween(this.container).to({alpha:1},500).start();
        } else {
            this.container.alpha = 1;
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

    destroy(game): void {
        if (game.config.splash.fade){
            const tween:Tween = game.add.tween(this.container).to({alpha:0},500);
            tween.onComplete.addOnce(()=>{
                this.container.destroy();
            })
            tween.start();
        } else {
            this.container.destroy();
        }
    }
}
