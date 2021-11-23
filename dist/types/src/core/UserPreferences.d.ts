import RJS from '../core/RJS';
export declare class UserPreference {
    value: any;
    constructor(value: any);
    set(value: any): void;
    get(): any;
    toJSON(): any;
}
export declare class RangedUserPreference extends UserPreference {
    min: number;
    max: number;
    private inverted;
    constructor(value: number, min: number, max: number, inverted?: boolean);
    set(value: any): void;
    get(): void;
}
export default class UserPreferences {
    private game;
    preferences: {
        textSpeed: RangedUserPreference;
        autoSpeed: RangedUserPreference;
        bgmv: RangedUserPreference;
        sfxv: RangedUserPreference;
        muted: UserPreference;
    };
    constructor(game: RJS, defaultPreferences: any);
    setPreferences(preferences: any): void;
    set(type: any, value: any): void;
    get(type: any): any;
    addPreference(type: any, value: any, data: any): void;
    savePreferences(): void;
}
