+++
title = "File Structure"
date =  2018-05-16T14:41:12+02:00
weight = 5
pre = "<b>1.1 </b>"
+++

The quickstart is composed of a few files and folders, including the "executable" file index.html. Creating a game with RenJS means creating also a web page that runs said game. This allows you to ship your game to any platform that can run a web browser: Linux, Mac, Windows and even mobile devices, without needing to change your code. 

Let's take a look at these files:

* RenJS
* libs
* assets
* story
* index.html
* config.js

## Index and Config

The index.html file is what the web page where the game will be shown. It's contents are minimal. First, it loads the most important library, Phaser, and then the bootstrap for RenJS. In the body of the webpage, the only important element is a div with the id "RenJS", which will be used to load the game. 

```html
    <!DOCTYPE html>
	<html>
		<head>
			<meta charset="utf-8" />
			<title> RenJS </title>
			<script type="text/javascript" src="libs/phaser.min.js"></script>
			<script type="text/javascript" src="config.js"></script>     
			<script type="text/javascript" src="RenJS/RenJSBootstrap.js"></script>
		</head>
		<body>		
			<div id="RenJS"> </div>
		</body>
	</html>
```
The config file contains very important configuration parameters for starting the game. These are the minimal requirements to create the frame in the web page and start loading its contents.

```js
	var globalConfig = {
	  w:800,
	  h:600,
	  mode: "AUTO",
	  splash: { //The "Loading" page for your game
	    loadingScreen: "assets/gui/splash.png", //splash background
	    loadingBar: {
	      fullBar: "assets/gui/loadingbar.png",
	      position: {x:111,y:462}
	    }
	  },
	  fonts: "assets/gui/fonts.css",
	  guiConfig: "story/GUI.yaml",
	  storySetup: "story/Setup.yaml",
	  //as many story text files as you want
	  storyText: [
	        "story/YourStory.yaml"
	    ],
	}
```

First, width and height of the game. You can use any resolution you want, but you'll have to make sure your GUI, backgrounds and other images matchs with it.
The mode refers to Phaser's rendering mode. Unless you need to extend RenJS, you shouldn't touch this option.
Splash is an image that will be shown while the game is loading. Depending on the size of the assets, it might take a while, so you can also add a loading bar, that will fill up from left to right to show the loading progress. If you show a bar, you will also need to specify where to show it, with the option "position".
The fonts parameter specifies where to find the fonts.css file. This file is just to load your fonts onto the web page, and make it easier for Phaser to find it and use it to show all the texts in the game.
Finally, guiConfig, storySetup and storyText are the files that make up your story, and usually, the files that will change the most (along with the assets) from story to story.

## RenJS

The files on the RenJS folder constitute the core of the game engine, the code that interprets your story and shows it to the players. The only one you need to take into account for now is RenJSBootstrap.js. This file is in charge of loading all the other .js files, and also every asset (images, music, etc) used by your game. If you know javascript programming and want to learn more about how it works, the [Engine](../engine) section has comprehensive documentation of the library.

## Libs

The files on the libs folder are external libraries that RenJS needs to work properly, the most importan being PhaserJS, the "parent" engine, that provides the methods for showing images, playing music, etc. 

## Assets

The assets folder contains all the resources used by your game. This includes the character images, backgrounds, music, etc, and also everything that makes up the GUI, like the menus backgrounds, buttons and everything else. This folder is not mandatory for every game, and neither is the structure followed by this quickstart. Your assets can be anywhere inside the root folder, and organized however you like.

## Story

Inside this folder there should be at least three .yaml files. These are the file that contain your story. As with the assets, you don't really need to have them inside a folder, but it's a good practice. 