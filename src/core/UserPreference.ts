export class UserPreference {
    constructor(public value){}

    set(value): void { this.value = value;}

    get(): any { return this.value }

    toJSON(): any {return this.value}
}
export default UserPreference