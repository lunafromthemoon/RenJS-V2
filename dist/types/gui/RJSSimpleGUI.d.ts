import RJSGUI from './RJSGUI';
export default class RJSSimpleGUI extends RJSGUI {
    initAssets(gui: any): void;
    parseHud(hudConfig: any): any;
    parseMenu(name: any, menuConfig: any): any;
    parseButton(buttonKey: any, buttonConfig: any): {
        id: any;
        sfx: string;
        binding: any;
        height: number;
        width: number;
        slot: number;
        x: any;
        y: any;
    };
}
