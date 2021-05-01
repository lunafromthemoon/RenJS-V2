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

    constructor(private game: RJS,defaultPreferences){
        const data = localStorage.getItem('RenJSUserPreferences' + game.config.name);
        if (data) {
            this.setPreferences(JSON.parse(data));
        } else {
            this.setPreferences(defaultPreferences);
        }
    }

    setPreferences(preferences){
        if (preferences) {
            for (var prefence in preferences) {
                this[prefence] = preferences[prefence];
            }
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
