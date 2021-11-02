import { Group, Pointer, Sprite } from 'phaser-ce';
import RJS from '../../core/RJS';
export default class MaskedSlider extends Group {
    game: RJS;
    config: {
        id?: string;
        x: number;
        y: number;
        asset: string;
        binding: string;
        sfx: string;
    };
    currentValue: number;
    id: string;
    sliderBg: Sprite;
    sliderFull: Sprite;
    /** whether the slider can be interactively changed by holding the mouse button and dragging */
    draggable: boolean;
    constructor(game: RJS, config: {
        id?: string;
        x: number;
        y: number;
        asset: string;
        binding: string;
        sfx: string;
    }, currentValue: number);
    setValue(value: number): void;
    private pointer?;
    onStart(_: never, pointer: Pointer): void;
    onDrag(pointer: Pointer): void;
    onEnd(_: never, event: PointerEvent): void;
    updateMask(): void;
}
