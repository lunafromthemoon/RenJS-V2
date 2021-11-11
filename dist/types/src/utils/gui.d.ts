import { Text } from 'phaser-ce';
export declare function getButtonFrames(total: number, pushed?: boolean): any;
export declare function changeInputEnabled(displayObj: any, enabled: any): void;
export declare function setTextStyles(text: string, textObj: Text): string;
export declare function toHexColor(color: any): number;
/**
 * compareFn for hud config elements.
 * ensures that name box is on top of dialogue,
 * and that choices and buttons are on top of both
 */
export declare function hudSort(a: {
    type: string;
}, b: {
    type: string;
}): number;
