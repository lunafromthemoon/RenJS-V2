import RJSGUI from './RJSGUI';
import {Group} from 'phaser-ce';
import RJS from '../core/RJS';
import {GUIAssets} from './Assets';
import RJSSlider from '../components/RJSSlider';
import RJSSprite from '../components/RJSSprite';
import RJSButton from '../components/RJSButton';
import ChoiceButton from '../components/ChoiceButton';

export default class RJSGUIByBuilder extends RJSGUI {

    initAssets(gui: any){
        // convert specific gui config to general one
        const toAssetList = (list,type,path): GUIAssets[] => {
            return Object.keys(list).map(key => (
                {
                    key,
                    file:path+list[key].fileName,
                    type,
                    w:list[key].w,
                    h:list[key].h
                }
            ));
        }
        const imgs = toAssetList(gui.assets.images,'image',gui.assetsPath);
        const audio = toAssetList(gui.assets.audio,'audio',gui.assetsPath);
        const sprts = toAssetList(gui.assets.spritesheets,'spritesheet',gui.assetsPath);

        this.assets = imgs.concat(audio).concat(sprts);
        this.fonts = Object.keys(gui.assets.fonts);
        this.config = {
            hud: gui.config.hud, 
            menus: {
                main: gui.config.main,
                settings: gui.config.settings,
                saveload: gui.config.saveload
            }
        }
    }

}
