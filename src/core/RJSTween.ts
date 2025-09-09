import {Tween} from 'phaser-ce'
export class RJSTween extends Tween {

	tweenables?: {[key: string]: any}
	callbackOnComplete?: any
}
export default RJSTween