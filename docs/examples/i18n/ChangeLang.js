class ChangeLang extends RenJS.Plugin {

	onInit(params) {
		this.game.gui.bindingActions['changeLang'] = async ()=>{
            // remove saved lang setting and reload page
			localStorage.removeItem('RenJS_I18N' + this.game.config.name);
			location.reload(); 
        }
	}
}

RenJSGame.addPlugin('ChangeLang',ChangeLang)
