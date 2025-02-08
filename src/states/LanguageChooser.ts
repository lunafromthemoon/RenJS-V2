import RJSState from '@/states/RJSState';

export default class LanguageChooser extends RJSState {

    init(): void {
        this.game.setupScreen();
    }

    constructor() {
        super();
    }

    preload(): void {
        if (this.game.config.i18n?.background){
            this.game.load.image('langChooserBg', this.game.config.i18n.background);
        }

        for (const lang in this.game.config.i18n?.langs){
            const cfg: any = this.game.config.i18n?.langs[lang]
            this.game.load.spritesheet('languageTag'+lang, cfg.asset, cfg.size.w, cfg.size.h);
        }
    }

    create(): void {
        if (this.game.config.i18n?.background){
            this.game.add.image(0,0,'langChooserBg');
        }
        for (const lang in this.game.config.i18n?.langs){
            const cfg: any = this.game.config.i18n?.langs[lang];
            this.game.add.button(cfg.position.x,cfg.position.y,'languageTag'+lang, () => {
                if (this.game.config.i18n) {
                    this.game.config.i18n.current = lang;
                }
                localStorage.setItem('RenJS_I18N' + this.game.config.name,lang);
                this.game.state.start('bootstrap');
            },this,1,0,1,0);
        }
    }
}
