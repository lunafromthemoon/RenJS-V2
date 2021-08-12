import RJS from '../../core/RJS';
import {Sprite,Graphics} from 'phaser-ce';

export default class MaskedSlider extends Sprite {
    id: string
    game: RJS
    sliderFull: Sprite

    currentValue: number
    range: number

    config: {
        x: number,
        y: number,
        asset: string,
        binding: string,
        sfx: string
    }

    constructor(game: RJS, config, readonly min: number,readonly max: number, startValue: number) {
        super(game, config.x, config.y,config.asset);
        this.config = config;
        this.game = game;
        this.visible = false;
        this.id = config.id;
        this.range = this.max-this.min;

        this.currentValue = startValue;

        this.sliderFull = this.game.add.sprite(0,0,config.asset,1);
        this.addChild(this.sliderFull);

        this.sliderFull.inputEnabled = true;
        this.sliderFull.events.onInputDown.add((sprite,pointer) => {
            const val = (pointer.x-this.x);
            this.currentValue = (val/this.width)*this.range+this.min;
            this.updateMask();
            this.game.gui.buttonsAction[this.config.binding](this.config,this.currentValue)
            // this.game.userPreferences.setPreference(sprite.binding,newVal);
            // if (sprite.binding == "bgmv"){
            //     this.game.managers.audio.changeVolume('bgm',newVal);
            // }
            if (this.config.sfx && this.config.sfx !== 'none') {
                const volume = this.config.binding == "bgmv" ? this.currentValue : this.game.userPreferences.sfxv;
                this.game.managers.audio.playSFX(this.config.sfx,volume);
            }
        });
    }

    updateMask(){
        if (this.sliderFull.mask) this.sliderFull.mask.destroy();
        const sliderMask = this.game.add.graphics(this.config.x,this.config.y);
        sliderMask.beginFill(0xffffff);
        const maskWidth = this.width*(this.currentValue-this.min)/this.range;
        sliderMask.drawRect(0,0,maskWidth,this.height);
        sliderMask.endFill();
        this.sliderFull.mask = sliderMask;
    }

}
