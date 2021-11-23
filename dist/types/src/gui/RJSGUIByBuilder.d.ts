import RJSGUIByNewBuilder from './RJSGUIByNewBuilder';
export default class RJSGUIByBuilder extends RJSGUIByNewBuilder {
    initAssets(gui: any): void;
    convertText(config: any): {
        x: number;
        y: number;
        lineSpacing: number;
        style: any;
    };
    convertTextStyle(config: any): {
        font: string;
        fontSize: string;
        fill: string;
        align?: string;
        wordWrap?: boolean;
        wordWrapWidth?: number;
        boundsAlignV?: string;
        boundsAlignH?: string;
    };
}
