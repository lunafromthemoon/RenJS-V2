class HelloWorld extends RenJS.Plugin {

	execute(params) {
		console.log('helloworld function');
		setTimeout(() => {
			console.log(params.param1 + ' ' +params.param2);
			this.game.resolveAction();
		}, 1500);
	}
}

RenJSGame.addPlugin('helloWorld',HelloWorld)
