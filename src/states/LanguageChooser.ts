import RJSState from './RJSState';

export default class LanguageChooser extends RJSState {

    init(): void {
        this.game.setupScreen();
    }

    constructor() {
        super();
    }

    preload() {
        for (let lang in this.game.config.i18n.langs){
            const cfg:any = this.game.config.i18n.langs[lang]
            this.game.load.spritesheet(lang, cfg.asset, cfg.size.w, cfg.size.h);
        }
    }

    create() {
        for (let lang in this.game.config.i18n.langs){
            const cfg:any = this.game.config.i18n.langs[lang];
            this.game.add.button(cfg.position.x,cfg.position.y,lang, sprite => {
                this.game.config.i18n.current = lang;
                console.log(lang)
                this.game.state.start('bootstrap');
            },this,1,0,1,0);
        }
    }
}
