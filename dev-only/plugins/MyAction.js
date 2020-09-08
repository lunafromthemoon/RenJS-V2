
class HelloWorld extends RenJS.Plugin {

	execute(params) {
		console.log("helloworld function");
		console.log(params.param1 + " " +params.param2);
		this.game.resolveAction();
	}
}

RenJSGame.addPlugin('helloWorld',HelloWorld)