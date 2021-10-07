import StoryAction from './StoryAction',
import StoryActionShow from './StoryActionShow',
import StoryActionHide from './StoryActionHide',
import StoryActionAnimate from './StoryActionAnimate',
import StoryActionText from './StoryActionText',
import StoryActionWait from './StoryActionWait',
import StoryActionChoice from './StoryActionChoice',
import StoryActionAudio from './StoryActionAudio',
import StoryActionScene from './StoryActionScene',
import StoryActionVar from './StoryActionVar',
import StoryActionEffect from './StoryActionEffect',
import StoryActionAmbient from './StoryActionAmbient',
import StoryActionIf from './StoryActionIf',
import StoryActionCall from './StoryActionCall',
import StoryActionEnd from './StoryActionEnd',
import RJS from '../RJS',



export default function StoryActionFactory (type: string, params: Object, game: RJS): StoryAction {
    const factory = {
        'show': StoryActionShow,
        'hide': StoryActionHide,
        'animate': StoryActionAnimate,
        'say': StoryActionText,
        'text': StoryActionText,
        'wait': StoryActionWait,
        'choice': StoryActionChoice,
        'visualchoice': StoryActionChoice,
        'interrupt': StoryActionChoice,
        'play': StoryActionAudio,
        'stop': StoryActionAudio,
        'scene': StoryActionScene,
        'var': StoryActionVar,
        'effect': StoryActionEffect,
        'ambient': StoryActionAmbient,
        'if': StoryActionIf,
        'call': StoryActionCall,
        'endgame': StoryActionEnd,
    }

    return null;
}
