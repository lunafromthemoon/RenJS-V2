import RJS from '../core/RJS';

export interface UserPreferencesInterface {
    textSpeed: number;
    autoSpeed: number;
    bgmv: number;
    sfxv: number;
    muted: boolean;
    setPreference: (type,value) => (void);
}

export default class UserPreferences implements UserPreferencesInterface {
    textSpeed = 20;
    autoSpeed = 150;
    bgmv = 0.5;
    sfxv = 0.5;
    muted = false;

    constructor(private game: RJS){
        const data = localStorage.getItem('RenJSUserPreferences' + game.config.name);
        let preferences = JSON.parse(data);
        this.setPreferences(preferences);
    }

    setPreferences(preferences){
        if (preferences) {
            this.textSpeed = preferences.textSpeed;
            this.autoSpeed = preferences.autoSpeed;
            this.bgmv = preferences.bgmv;
            this.sfxv = preferences.sfxv;
            this.muted = preferences.muted;
        }
    }

    setPreference(type,value){
        this[type] = value;
        this.savePreferences();
    }

    savePreferences(){
        var preferences = {textSpeed: this.textSpeed, autoSpeed: this.autoSpeed, bgmv: this.bgmv, sfxv: this.sfxv, muted: this.muted }
        localStorage.setItem('RenJSUserPreferences' + this.game.config.name,JSON.stringify(preferences));
    }
}
