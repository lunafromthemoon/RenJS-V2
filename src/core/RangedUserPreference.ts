import UserPreference from './UserPreference';

export class RangedUserPreference extends UserPreference {
  constructor(
    value: number,
    public min: number,
    public max: number,
    private inverted: boolean = false
  ) {
    super(value);
  }

  set(value): void {
    // value between 0 and 1
    this.value = value * (this.max - this.min) + this.min;
  }

  get(): void {
    return this.inverted ? this.max - this.value : this.value;
  }
}
export default RangedUserPreference;
