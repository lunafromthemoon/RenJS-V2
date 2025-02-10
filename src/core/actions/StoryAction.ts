import RJS from '../RJS';

export interface StoryActionInterface {
    resolve(transitioning: Promise<any>, cont: boolean);
    execute();
}

export class StoryAction implements StoryActionInterface {
	dontHide?: boolean;

	protected key: string
	protected body: any
	protected params: string[]
	protected keyParams: string[]


	constructor(protected game: RJS, public actionType: string, protected properties: {[key: string]: any}){
		this.key = Object.keys(properties)[0];
		this.keyParams = this.key.split(' ');
        this.body = properties[this.key]
	}

	resolve(transitioning?: Promise<any>, cont?: boolean): void {
		if (transitioning && !cont){
            transitioning.then(()=> this.game.resolveAction())
        } else {
			this.game.resolveAction()
        }
	}

	// execute action during story
	execute(): void {
		// base action does nothing
	}

	parseParams(keyParams): string[] {
		if (keyParams){
			return this.keyParams;
		}
		if (!this.params){
			this.params = this.body ? this.body.split(' ') : [];
		}
		return this.params;
	}

	parseActor(): string {
		return this.keyParams[1]
	}

	parseParameter(reservedWord: string, argType = 'boolean', inKeyParams = false): any {
		const params = this.parseParams(inKeyParams);
		const idx = params.indexOf(reservedWord);
		if (argType === 'boolean'){
			return idx !== -1;
		}
		if (idx === -1) return null;
		const value = params[idx+1];
		if (argType === 'coords'){
			// coords can be a special position
			if (value in this.game.storyConfig.positions){
				return this.game.storyConfig.positions[value]
			}
			// parse coords as two numbers separated by a comma
            const coords = value.split(',');
            return {x:parseInt(coords[0], 10),y:parseInt(coords[1], 10)};
		}
		return argType === 'number' ? parseFloat(value) : value
	}
}
export default StoryAction