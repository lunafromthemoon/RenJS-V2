import Phaser from "phaser-ce";
import {preload} from "./to-migrate/Preload";
import {GameConfig} from "./IGameConfig";
import {preparePath} from "./utils/path";

class Boot extends Phaser.State {
    constructor(private gameConfig: GameConfig) {
        super();
        this.gameConfig = gameConfig
    }

    init() {
        if (this.gameConfig.i18n){
            return;
        }
        if (!(this.gameConfig.scaleMode === Phaser.ScaleManager.EXACT_FIT)){
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
        }
        this.game.scale.scaleMode = Phaser.ScaleManager[this.gameConfig.scaleMode];
        this.game.scale.refresh();
    }

    preload() {
        this.game.load.image('splash',  preparePath(this.gameConfig.splash.loadingScreen, this.gameConfig.i18n));
        if (this.gameConfig.splash.loadingBar) {
            if (this.gameConfig.splash.loadingBar.fullBar){
                this.game.load.image('loading',  preparePath(this.gameConfig.splash.loadingBar.fullBar, this.gameConfig.i18n));
            }
            if (this.gameConfig.splash.loadingBar.asset){
                const w = this.gameConfig.splash.loadingBar.size.w;
                const h = this.gameConfig.splash.loadingBar.size.h;
                this.game.load.spritesheet('loading',  preparePath(this.gameConfig.splash.loadingBar.asset),w,h);
            }
        }
    }

    create () {
        // this.game.state.add('preload', preload);
        // this.game.state.start('preload');
    }
}



export default Boot
