import RJS from '../core/RJS';
export interface UserPreferencesInterface {
    textSpeed: number;
    autoSpeed: number;
    bgmv: number;
    sfxv: number;
    muted: boolean;
    setPreference: (type: any, value: any) => (void);
}
export default class UserPreferences implements UserPreferencesInterface {
    private game;
    textSpeed: number;
    autoSpeed: number;
    bgmv: number;
    sfxv: number;
    muted: boolean;
    constructor(game: RJS, defaultPreferences: any);
    setPreferences(preferences: any): void;
    setPreference(type: any, value: any): void;
    savePreferences(): void;
}
