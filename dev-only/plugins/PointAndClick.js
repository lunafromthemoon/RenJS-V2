class PointAndClick extends RenJS.Plugin {

	objects = {
		tomatito: [
			{asset:"arrowRight",x:150,y:50,scene:"radio"},
			{asset:"arrowLeft",x:50,y:50,scene:"tomatitos"},
		]
	}

	execute(params) {
		if (params.body.includes("add")){
			const room = params.body.split(" ")[1];
			if (room in this.objects){
				this.objects[room].forEach(obj=>{
					const btn = this.game.add.button(obj.x,obj.y,obj.asset,() => {
						if(!this.game.managers.story.interpreting){
							// prevent scene interruption
							this.game.managers.story.startScene(obj.scene);
			            	this.game.resolveAction();
						}
			            
			        },this,1,0,1,0);
				})
			}
		}
		this.game.resolveAction();
	}
}

RenJSGame.addPlugin('pointAndClick',PointAndClick)
