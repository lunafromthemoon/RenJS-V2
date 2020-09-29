export interface RJSGUI {
    init(): any;
    getChoiceTextStyle(): any;
    initHUD(hudConfig: any): any;
    showHUD(): any;
    hideHUD(): any;
    initMenu(name: string, menu: any): any;
    showMenu(menu: any): any;
    showChoices(choices: any, execId: any): any;
    hideChoice(choiceId: any): any;
    hideChoices(): any;
    changeToLastInterrupt(choiceId: any): any;
    clear(): any;
    showText(text: any, title: any, colour: any, callback: any): any;
    hideText(): any;
    ignoreTap(pointer: any): any;
    sliderValueChanged: object;
    addThumbnail?(thumbnail: any, slot: any): any;
    getChosenOptionColor?(): number;
    textLoop?: any;
    ctc?: any;
    changeMenu?(menu: any): void;
    previousMenu?: any;
}
