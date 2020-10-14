import Phaser from 'phaser-ce';
import {preparePath} from './utils';
import RJSState from './RJSState';

import Preload from './Preload';

class Boot extends RJSState {

    constructor() {
        super();
    }

    init(): void {
        if (this.game.config.i18n){
            return;
        }
        if (!(this.game.config.scaleMode === Phaser.ScaleManager.EXACT_FIT)){
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
        }
        this.game.scale.scaleMode = Phaser.ScaleManager[this.game.config.scaleMode];
        this.game.scale.refresh();
    }

    preload(): void {
        this.game.load.image('splash',  preparePath(this.game.config.splash.loadingScreen, this.game));
        if (this.game.config.splash.loadingBar) {
            if (this.game.config.splash.loadingBar.fullBar){
                this.game.load.image('loading',  preparePath(this.game.config.splash.loadingBar.fullBar, this.game));
            }
            if (this.game.config.splash.loadingBar.asset){
                const w = this.game.config.splash.loadingBar.size.w;
                const h = this.game.config.splash.loadingBar.size.h;
                this.game.load.spritesheet('loading',  preparePath(this.game.config.splash.loadingBar.asset, this.game),w,h);
            }
        }
    }

    create (): void {
        this.game.state.add('preload', Preload);
        this.game.state.start('preload');
        this.input.onDown.addOnce(()=> {
            
            if (this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }
        });

    }
}



export default Boot
