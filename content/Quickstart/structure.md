+++
title = "Engine Structure"
date =  2018-05-16T14:41:12+02:00
weight = 5
pre = "<b>1.1 </b>"
+++

The RenJS library, as it exists now, is composed of two folders and one file:

1. RenJS
2. libs
3. index.html

The two folders contain a bunch of .js files. That is, javascript code, that can run on a web browser. And the index file is just a web page that load the necesary .js files to run the game. Creating a game with RenJS then means creating also a web page that runs said game. This allows you to ship your game to any platform that can run a web browser: Linux, Mac, Windows and even mobile devices, without needing to change your code. 

## RenJS

The files on the RenJS folder constitute the core of the game, the code that interprets your story and shows it to the players. The only one you need to take into account for now is RenJSBootstrap.js. This file is in charge of loading all the other .js files, and also every asset (images, music, etc) used by your game.

## Libs

The files on the libs folder are external libraries that RenJS needs to work properly, the most importan being PhaserJS, the "parent" engine, that provides the methods for showing images, playing music, etc. 

## Index

The index.html file is what the web page where the game will be shown. It's contents are minimal. First, it loads the most important library, Phaser, and then the bootstrap for RenJS. In the body of the webpage, the only important element is a division with the id RenJS, which will be used to load the game. 

```html
    <!DOCTYPE html>
	<html>
		<head>
			<meta charset="utf-8" />
			<title> RenJS </title>
			<script type="text/javascript" src="libs/phaser.min.js"></script>
			<script type="text/javascript" src="RenJS/RenJSBootstrap.js"></script>
		</head>
		<body>		
			<div id="RenJS"> </div>
		</body>
	</html>
```

With just these files, you are now ready to start writing the story. In the next section we'll see what files are necessary for it.