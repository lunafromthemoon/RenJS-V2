import { Text } from 'phaser-ce';
export declare function changeInputEnabled(displayObj: any, enabled: any): void;
export declare function setTextStyles(text: string, textObj: Text, findPauses?: false): string;
export declare function setTextStyles(text: string, textObj: Text, findPauses: true): readonly [string, {
    time: number;
    index: number;
}[]];
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
