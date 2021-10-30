# RenJS - V2

![alt text](http://renjs.net/assets/images/renjs-title.svg "RenJS Logo")

The new version of RenJS is in!

RenJS V2 is finally here! Coded from scratch in Typescript (thanks to RockDaFox!), RenJS V2 has better performance and a multitude of new features to make the Visual Novel of your dreams. There's also a new site where you can find the latest version of the library, as well as the new Quickstart and RenJS GUI Builder tool, and documentation for anything you want to do, including a gallery of playable examples with their scripts.

## But what's RenJS?

RenJS is a HTML5 Visual Novel creator made for writers. The stories are written in a script akin to a screenplay, without the need to do any programming. This script contains the scenes of the story, and each scene contains actions. These actions include everything you might want to do in a classical Visual Novel game, such as:
	* Showing and hiding characters and backgrounds
	* Showing and animating CGs
	* Playing music and sfx
	* Displaying messages and dialog
	* Special effects and ambients
	* Interactivity through choices and interruptions
	* Variables and branching

RenJS is also powered by PhaserJS, a powerful 2D video game engine for HTML5. Thanks to it, a whole suite of tools to create special effects, minigames and most complex behaviours is readily available.

![Screenshot of quickstart game next to script example for the scene](http://renjs.net/assets/images/codeexample.png "Script Example")

Finally, RenJS GUI Builder is a tool to automate the creation of the GUI configuration file. This tool allows you to create the GUI by adding components visually, moving them around easily and adjusting every little detail until you have exactly the GUI you want. 

## What's new?

The story scripts, setup and gui configurations are still compatible with the old version, since most of the changes are internal to the engine, but the bootstrapping of the library is slightly different, and you need a new **configuration** file, that lets you choose many important properties of the story, such as default transitions, special positions and more. Find [here in the Docs](http://renjs.net/docs-page.html#configuration-section) everything you need to know about this file.

Another big change is in how the extensions are handled. In the previous version there was a handy file called CustomContent.js, where you could add new functions to call from the script. But RenJS V2 is compiled from Typescript, so you won't be able to access the internals directly. 

So how to add new functionality? Easy, with the new Plugin System. The Plugins not only allow you to add new functions to call from the script, as the old CustomContent.js file did, but they can also be called from different key moments in the game. For example, add new menus or buttons at the start of the game with the onInit() handler, save to and from the cloud with the onSave() and onLoad() handlers, and much more.

Find all the documentation about the Plugins and the most important aspects of RenJS internals in [the Docs](http://renjs.net/docs-page.html#plugins-section).

Finally, some of the most interesting new features:

	* Text Styles
	* Show CGs behind characters
	* Display a message along with the choices
	* Loop music from a specific time
	* Point&Click plugin

# Dev

## First install:
1. Pull this branch
2. Go in project root
3. Install dependency :
```
npm i
```

## Run
### (only dev mode available)

Start the server with:

```
npm start
```

And open each example in the browser:

localhost:8080/test.html
localhost:8080/tutorial.html
localhost:8080/quickstart.html
localhost:8080/i18n.html