import RJSState from '../RJSState';

export default class LanguageChooser extends RJSState {

    preload() {
        for (let i = this.game.config.i18n.langs.length - 1; i >= 0; i--) {
            const lang = this.game.config.i18n.langs[i];
            this.game.load.spritesheet(lang, this.game.config.i18n.path+lang+this.game.config.i18n.format, this.game.config.i18n.w, this.game.config.i18n.h);
        }
    }

    create() {
        const buttonSpace = (this.game.config.i18n.w+20);
        const offset = this.game.world.centerX-((this.game.config.i18n.langs.length*buttonSpace))/2;

        for (let i = this.game.config.i18n.langs.length - 1; i >= 0; i--) {
            const lang = this.game.config.i18n.langs[i];
            const x = offset + (i * buttonSpace);
            this.game.add.button(x,this.game.world.centerY,lang, sprite => {
                this.game.config.i18n.current = sprite.lang;
                this.game.state.start('bootstrap');
            },this,0,1,0,1);
            // button.lang = lang;
        }
    }
}
