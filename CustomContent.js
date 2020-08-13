RenJS.customContent = {
	//put here your own functions

	helloworld: function (params) {
		console.log("helloworld function");
		console.log(params.param1 + " " +params.param2);
		RenJS.resolve();
	}
}

