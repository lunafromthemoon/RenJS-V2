import RJS from '../../core/RJS';
export interface AccessibilityBounds {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface AccessibilityButton {
    label?: string;
    isActive: () => boolean;
    onclick: HTMLButtonElement['onclick'];
    onfocus?: HTMLButtonElement['onfocus'];
    onblur?: HTMLButtonElement['onblur'];
    getBounds: () => AccessibilityBounds;
}
export interface AccessibilitySlider {
    label?: string;
    isActive: () => boolean;
    min: number;
    max: number;
    step: number | 'any';
    set: (value: number) => void;
    get: () => number;
    getBounds: () => AccessibilityBounds;
}
export interface AccessibilityConfig {
    buttons?: {
        [key: string]: string;
    };
    sliders?: {
        [key: string]: string;
    };
    choices?: {
        [key: string]: string;
    };
}
/**
 * Adds an accessible DOM layer on top of the game canvas
 * in order to support keyboard navigation and screen-reading
 */
export default class Accessibility {
    game: RJS;
    /** if debug is true, accessibility elements will be visible */
    debug: boolean;
    elContainer: HTMLDivElement;
    elProgress: HTMLProgressElement;
    elText: HTMLDivElement;
    elChoices: HTMLOListElement;
    elButtons: HTMLUListElement;
    elSliders: HTMLUListElement;
    state: {
        name: string;
        text: string;
        choices: AccessibilityButton[];
        buttons: AccessibilityButton[];
        sliders: AccessibilitySlider[];
    };
    constructor(game: RJS);
    boot(): void;
    progress(progress: any): void;
    busy(): void;
    ready(): void;
    updateLayoutText(): void;
    updateLayoutContainer(): void;
    updateLayoutBounds(el: HTMLElement, rect: AccessibilityBounds): void;
    updateLayoutList(elList: HTMLUListElement | HTMLOListElement, list: Pick<AccessibilityButton, 'isActive' | 'getBounds'>[]): void;
    updateLayoutChoices(): void;
    updateLayoutButtons(): void;
    updateLayoutSliders(): void;
    rescueFocus(elContainer: HTMLElement): void;
    updateLayout: () => void;
    text(text?: string): void;
    name(name?: string): void;
    button(button: AccessibilityButton): void;
    slider(slider: AccessibilitySlider): void;
    choices(choices?: AccessibilityButton[]): void;
}
