export interface RJSGUI {
    getAssets();
    getFonts(argument?: any);
    init();
    getChoiceTextStyle();
    initHUD(hudConfig: any);
    showHUD();
    hideHUD();
    initMenu(name: string, menu);
    showMenu(menu);
    // hideMenu(menu);
    showChoices(choices, execId);
    hideChoice(choiceId);
    hideChoices();
    changeToLastInterrupt(choiceId);
    clear();
    showText(text, title, colour, callback);
    hideText();
    ignoreTap(pointer);
    sliderValueChanged: object;
    addThumbnail?(thumbnail, slot);
    getChosenOptionColor?(): number;
    textLoop?: any;
    ctc?: any;
    changeMenu?(menu): void;
    previousMenu?: any;
}
