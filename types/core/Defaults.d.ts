export interface DefaultsInterface {
    name: string;
    defaultTextStyle: {
        font: string;
        fill: string;
        align: string;
    };
    settings: {
        textSpeed: number;
        autoSpeed: number;
        bgmv: number;
        sfxv: number;
        muted: boolean;
    };
    limits: {
        textSpeed: number[];
        autoSpeed: number[];
        bgmv: number[];
        sfxv: number[];
    };
    positions: {
        LEFT: {
            x: number;
            y: number;
        };
        OUTLEFT: {
            x: number;
            y: number;
        };
        CENTER: {
            x: number;
            y: number;
        };
        RIGHT: {
            x: number;
            y: number;
        };
        OUTRIGHT: {
            x: number;
            y: number;
        };
    };
    fadetime: number;
    skiptime: number;
    timeout: number;
    clickCooldown: number;
    transitions: {
        ch: string;
        bg: string;
        cgs: string;
        bgm: string;
    };
}
export declare const defaults: DefaultsInterface;
