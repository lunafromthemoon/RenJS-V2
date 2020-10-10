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
    textSpeed = 50;
    autoSpeed = 150;
    bgmv = 0.5;
    sfxv = 0.5;
    muted = false;

    constructor(private game: RJS){
        let data = localStorage.getItem('RenJSUserPreferences' + game.config.name);
        if (data){
            const savedPreferences = JSON.parse(data);
            this.textSpeed = savedPreferences.textSpeed;
            this.autoSpeed = savedPreferences.autoSpeed;
            this.bgmv = savedPreferences.bgmv;
            this.sfxv = savedPreferences.sfxv;
            this.muted = savedPreferences.muted;
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
