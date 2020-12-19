import StoryAction from './StoryAction';
import StoryActionShow from './StoryActionShow';
import StoryActionHide from './StoryActionHide';
import StoryActionAnimate from './StoryActionAnimate';
import StoryActionText from './StoryActionText';
import StoryActionWait from './StoryActionWait';
import StoryActionChoice from './StoryActionChoice';
import StoryActionAudio from './StoryActionAudio';
import StoryActionScene from './StoryActionScene';
import StoryActionVar from './StoryActionVar';
import StoryActionEffect from './StoryActionEffect';
import StoryActionAmbient from './StoryActionAmbient';
import StoryActionIf from './StoryActionIf';
import StoryActionCall from './StoryActionCall';
import StoryActionEnd from './StoryActionEnd';
import RJS from '../RJS';



export default function StoryActionFactory (type: string, params: Object, game: RJS): StoryAction {
    switch (type) {
    	case 'show': return new StoryActionShow(params,game);
    	case 'hide': return new StoryActionHide(params,game);
    	case 'animate': return new StoryActionAnimate(params,game);
    	case 'say': return new StoryActionText(params,game);
    	case 'text': return new StoryActionText(params,game);
    	case 'wait': return new StoryActionWait(params,game);
    	case 'choice': return new StoryActionChoice(params,game,false,false);
    	case 'visualchoice': return new StoryActionChoice(params,game,true,false);
    	case 'interrupt': return new StoryActionChoice(params,game,false,true);
    	case 'play': return new StoryActionAudio(params,game,'play');
    	case 'stop': return new StoryActionAudio(params,game,'stop');
    	case 'scene': return new StoryActionScene(params,game);
    	case 'var': return new StoryActionVar(params,game);
    	case 'effect': return new StoryActionEffect(params,game);
    	case 'ambient': return new StoryActionAmbient(params,game);
    	case 'if': return new StoryActionIf(params,game);
    	case 'call': return new StoryActionCall(params,game);
        case 'endgame': return new StoryActionEnd(game);

    }
    return null;
}
