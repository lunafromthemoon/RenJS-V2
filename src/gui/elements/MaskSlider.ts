import { Group, Pointer, Sprite } from 'phaser-ce';
import RJS from '../../core/RJS';

export default class MaskedSlider extends Group {
    id: string;
    sliderBg: Sprite;
    sliderFull: Sprite;
    /** whether the slider can be interactively changed by holding the mouse button and dragging */
    draggable = true;

    constructor(
        public game: RJS,
        public config: {
            id?: string;
            x: number;
            y: number;
            asset: string;
            binding: string;
            sfx: string;
        },
        public currentValue: number
    ) {
        super(game);
        this.x = config.x;
        this.y = config.y;
        this.id = config.id;

        this.sliderBg = this.game.add.sprite(0, 0, config.asset, 0, this);
        this.sliderFull = this.game.add.sprite(0, 0, config.asset, 1, this);
        this.sliderFull.mask = this.game.add.graphics(this.config.x, this.config.y);
        this.sliderFull.mask.scale.y = this.sliderFull.height;

        this.sliderBg.inputEnabled = true;
        this.sliderBg.events.onInputDown.add(this.onStart, this);
        this.updateMask();
    }

    setValue(value: number): void {
        this.currentValue = Math.max(0, Math.min(value, 1));
        this.updateMask();
        this.game.gui.bindingActions[this.config.binding](this.config, this.currentValue);
    }

    private pointer?: Pointer;
    onStart(_: never, pointer: Pointer): void {
        this.pointer = pointer;
        this.setValue((pointer.x - this.x) / this.width);
        if (this.draggable) {
            this.game.input.addMoveCallback(this.onDrag, this);
            this.game.input.onUp.add(this.onEnd, this);
        }
    }
    onDrag(pointer: Pointer): void {
        if (pointer !== this.pointer) return;
        this.setValue((pointer.x - this.x) / this.width);
    }
    onEnd(_: never, event: PointerEvent): void {
        if (event.pointerId !== this.pointer.pointerId) return;
        this.game.input.deleteMoveCallback(this.onDrag, this);
        this.game.input.onUp.remove(this.onEnd, this);
        this.pointer = undefined;
        if (this.config.sfx && this.config.sfx !== 'none') {
            const volume = this.config.binding === 'changeUserPreference' ? this.currentValue : null;
            this.game.managers.audio.playSFX(this.config.sfx, volume);
        }
    }

    updateMask(): void {
        // left to right
        const mask = this.sliderFull.mask;
        mask.clear();
        mask.beginFill(0xffffff);
        const maskWidth = this.width * this.currentValue;
        mask.drawRect(0, 0, maskWidth, 1);
        mask.endFill();
    }
}
