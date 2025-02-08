import RJSGUI from '@/gui/RJSGUI';
import {GUIAsset} from '@/elements/GUIAsset';

export default class RJSGUIByNewBuilder extends RJSGUI {

    initAssets(gui: any): void{
        // convert specific gui config to general one
        const toAssetList = (list,type,path): GUIAsset[] => {
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
        this.config = gui.config;
    }

}
