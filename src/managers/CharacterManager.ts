import RJSManagerInterface from './RJSManager';
import Transition from '../screen-effects/Transition';

export interface CharacterManagerInterface extends RJSManagerInterface {
    characters: object
    showing: object
    hideAll(transition: string)
}

export default class CharacterManager implements CharacterManagerInterface {

    private transition: Transition

    constructor(transition: Transition) {
        this.transition = transition
    }

    set (showing) {
        this.hideAll(Transition.CUT);
        this.showing = showing;
        for (const name in this.showing) {

            const props = this.showing[name];
            const character = this.characters[name];
            character.currentLook = character.looks[props.look];
            character.currentLook.x = props.position.x;
            character.currentLook.y = props.position.y;
            character.currentLook.scaleX = props.flipped ? -1 : 1;
            character.currentLook.alpha = 1;
        }
    }

    characters: object;
    showing: object;

    hideAll(transition: string) {
    }

}
