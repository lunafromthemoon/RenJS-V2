import RJS from '@/core/RJS';

export class UserPreference {
    constructor(public value){}

    set(value): void { this.value = value;}

    get(): any { return this.value }

    toJSON(): any {return this.value}
}

export class RangedUserPreference extends UserPreference{

    constructor(value: number, public min: number, public max: number, private inverted: boolean = false){
        super(value)
    }

    set(value): void{
        // value between 0 and 1
        this.value = value*(this.max-this.min)+this.min
    }

    get(): void {
        return this.inverted ? this.max - this.value : this.value;
    }
}

export default class UserPreferences {
    preferences: {
        textSpeed: RangedUserPreference;
        autoSpeed: RangedUserPreference;
        bgmv: RangedUserPreference;
        sfxv: RangedUserPreference;
        muted: UserPreference;
    }


    constructor(private game: RJS,defaultPreferences){
        this.preferences = {
            textSpeed: new RangedUserPreference(20,10,100,true),
            autoSpeed: new RangedUserPreference(150,50,300),
            bgmv: new RangedUserPreference(0.5,0,1),
            sfxv: new RangedUserPreference(0.5,0,1),
            muted: new UserPreference(false)
        }

        const data = localStorage.getItem('RenJSUserPreferences' + game.config.name);
        if (data) {
            this.setPreferences(JSON.parse(data));
        } else {
            this.setPreferences(defaultPreferences);
        }
    }

    setPreferences(preferences): void {
        if (preferences) {
            for (const preference in this.preferences) {
                if (preferences[preference] !== undefined) {
                    // set the raw value
                    this.preferences[preference].value = preferences[preference];
                }
            }
        }
    }

    set(type,value): void {
        this.preferences[type].set(value);
        this.savePreferences();
    }

    get(type): any {
        return this.preferences[type].get();
    }

    addPreference(type,value,data): void {
        if (data === 'boolean'){
            this.preferences[type] = new UserPreference(value);
        } else {
            this.preferences[type] = new RangedUserPreference(value,data.min,data.max);
        }
    }

    savePreferences(): void {
        // save raw values
        const prefs = JSON.stringify(this.preferences);
        localStorage.setItem('RenJSUserPreferences' + this.game.config.name,prefs);
    }
}
