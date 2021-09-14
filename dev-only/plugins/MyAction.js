class HelloWorld extends RenJS.Plugin {

	onCall(params) {
		console.log('helloworld function');
		setTimeout(() => {
			console.log(params.param1 + ' ' +params.param2);
			this.game.resolveAction();
		}, 1500);
	}

	onAction(action) {
		console.log("Hello")
		console.log(action)
	}
}

RenJSGame.addPlugin('helloWorld',HelloWorld)
