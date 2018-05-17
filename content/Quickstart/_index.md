+++
title = "Quickstart"
date = 2017-09-25T23:27:00-03:00
weight = 1
chapter = true
pre = "<b>1. </b>"
+++

### Developer Guide

# Make your own game

If you're reading this, you're probably thinking about developing a Visual Novel. It doesn't matter if you've never made a game before, in this guide you'll find how to do it from scratch. You've probably heard about other game engines, like Unity or Game Maker. Those tools provide a whole environment for developing many kinds of games. 
RenJS is a bit different. First, RenJS is specially tailored to make games of the Visual Novel genre. You can use it for other kinds of games, but for that you'll need to extend the engine itself. If don't know programming though, you can still write classic VNs easily. 
The second difference is that RenJS refers only to the code that will be the core of your game. This means, unlike Unity or Game Maker, RenJS doesn't provide a development environment. There's no "program" you have to install or open to make your game. RenJS is just a bunch of files that know how to read a story and show it in a web browser. To write the story you only need a text processor, even something as simple as Gedit or Notepad. 

The quickstart is a package with all the necesary files to start creating a game. Besides the RenJS library and it's dependencies, it comes also with a basic GUI (the one used in the tutorial game), one background, one character, and one small "hello world" scene.

Once you [download the quickstart](https://gitlab.com/lunafromthemoon/RenJSQuickstart), you can play it by opening the "index.html" file with a web browser (Firefox recommended).

There's no text or image processor mandatory for the development, but my recomendations, and the ones I use for developing myself, are [Sublime Text](https://www.sublimetext.com/) and [Gimp](https://www.gimp.org/). They are both free, lightweight and multiplatform.

In the next section, we'll see the file structure that makes up the quickstart and which are the files that contain your story.