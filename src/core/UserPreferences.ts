export interface UserPreferencesInterface {
    textSpeed: number;
    autoSpeed: number;
    bgmv: number;
    sfxv: number;
    muted: boolean;
}

export default class UserPreferences implements UserPreferencesInterface {
    textSpeed = 50;
    autoSpeed = 150;
    bgmv = 0.5;
    sfxv = 0.5;
    muted = false;
}
