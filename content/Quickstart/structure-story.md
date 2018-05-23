+++
title = "Story Structure"
date =  2018-05-16T15:27:25+02:00
weight = 6
pre = "<b>1.2 </b>"
+++

Now that we know where our story is located, we'll take a look at how it's written down. The story .yaml files are what the writer will be, well, writing, for creating a game. So, let's recap what the story folder should contain:

* The story script: one or more files with the text of the story.
* The story setup: the link between the story and the assets. For example, it will list who are the characters (the name you will be using in the script to refer to it) and how the character will look (the files with the images for this character).
* The user interface configuration: Everything else "outside" of the story, like the game menus, buttons, the dialog text boxes, etc.

If you don't know the Yaml format, it's a very simple configuration format that let's you define properties with key and value. The key is a name, and the value could be any kind of data, including words, numbers, lists or more key-value pairs. The important thing to remember is that indentation is very important. Indentation is the amount of space we let from the start of the line. In Yaml, this space (it can be two spaces, four spaces or a tab character) determines the hierarchy of the properties. For example:

```yaml
parentProperty1:
  prop1: value1
  prop2: value2
parentProperty2:
  prop1: value3
  prop2: value4
```

### The User Interface

Before thinking about characters, backgrounds and music, we need to setup the look and feel of the game, that is, user interface. 
The user interface is just as important for the story, since it sets the mood for the player even before she starts playing it. There are many [resources](http://blog.cyanide-tea.net/2014/07/22/design-101-gui-design/) about how to choose the best interface for your game. There's also a rich community of visual novel developers who create and distribute their own art and designs, sometimes as free creative commons resources. 

RenJS allows you to set up a really simple user interface, that you can visually alter easily from a gui configuration file (GUI.yaml). In the quickstart, all the user interface assets are inside the asset/gui folder, and these are the minimal assets that you will be needing for any game to work properly. The configuration file then is used to tell the game how and where in the screen all of this assets should be put.

It might be hard at first, especially if you're not a graphical designer, to figure out how to make changes to the GUI, but this system allows for a very flexible user interface that will enrich the story you want to tell.

To learn more about how to modify the basic UI or create one completely from scratch, the [GUI section](../../gui) has all the details about it.

### Setting Up the Story

The next file is the story setup (Setup.yaml). In short, this file defines every character, background, etc, and links it with the pertinent asset. When you start writing your story you might not know every element of the story, or not have every asset. This file is not something you create wholly at the start and that's it, but it will evolve with the story. Need a new character? Before using it in the story, you should add it in the setup file.

The quickstart code's setup looks like this:

```yaml
backgrounds:
  room: assets/backgrounds/room_day.jpg
characters:
  deuzi:
    displayName: Deuzilene
    speechColour: "#ca90cf"
    looks:
      normal: assets/characters/Char3Normal.png
      happy: assets/characters/Char3Happy.png
music:
  rollingCredits: assets/audio/Evan_Schaeffer_-_01_-_Aqueduct.mp3
  morningBGM: assets/audio/Evan_Schaeffer_-_03_-_Glow.mp3

```
It's simple, small and straightforward. First we define our backgrounds, then our characters, and optionally cgs, music and sound effects. Every kind of object is listed under its key name. For example, under "backgrounds", indented by two spaces, we start listing all our different backgrounds. As we said before, in Yaml, indentation is very important. The indentation can be defined by either a "tab" character or two spaces, but you can not mix the two. So, if you start using tabs, you have to keep using them for the rest of the file. The most usual reason for your game to not load is bad format in one of the Yaml files. There are many online tools to check their syntax, and it's a good practice to verify your game files if your game doesn't load.

For most of the elements we only need to specify a name that will be used as a reference in the story file, and a path to an asset. So, in the story, when I want to show the image "room_day.jpg", located in the folder assets/backgrounds/, I will simply call it by the name we define here, "room". If I want to start playing the audio file "morning.mp3", located in the folder "assets/audio", I will call it by the name "morningBGM". 

You can use any name you want (without spaces, dashes nor symbols), but it's a good practice to use a meaningful name. I could have a background with the name "background1", but that wouldn't be easy to understand when I'm writing my story. In the same vein, you can locate your asset files anywhere you want inside the game folder, but it's better to organize them in a folder structure with meaningful names. For example, put all the audio files inside the subfolder audio.

For the characters we need more information. The display name will be the actual name of the character, it can have spaces, symbols, and anything you want. This name will be shown inside a little box (called the namebox in the UI) when they talk, so the player can identify when each character is talking during a dialog. The speech colour is a colour in [hexadecimal format](http://www.color-hex.com/), and can be use in many ways by the UI, the most usual way is to use it as the text color for either the name or the dialogs of a character. 

Finally, one of the most important aspects of Visual novels is that the characters can show emotions. This is achieved by changing the image for the character. The same thing will be used to change different visual aspects of a character, like their clothes. All the different "looks" of a character are then listed under the "looks" keyword, with key name and the file associated to it. You can have a character without any look, for example, if you need an invisible narrator or protagonist.

### The Story

The quickstarts story is really simple, basically:

1. We start playing the music "morningBGM"
2. We show the background "room"
3. We show some text, "Hello World"
4. Then the character "deuzi" fades in to the center of the screen
5. Deuzi says "Welcome to the Quickstart!"
6. The game ends with rolling credits like a film

And how do we write our script to do all of this? Just writing each order as something the engine can understad:

```yaml
start:
  - play morningBGM:
  - show room: WITH FADE
  - text: Hello World
  - show deuzi: happy AT CENTER WITH FADE
  - deuzi says: Welcome to the Quickstart!
  - effect ROLLINGCREDITS:
    endGame: true
    text:
      - RenJS developed by
      - lunafromthemoon
      - null
      - Inspired by Ren'Py
      - Powered by PhaserJS
      - null
      - null
      - background art and cgs by
      - konett
      - null
      - characters by
      - Shida
      - null
      - music by
      - Evan Schaeffer
```

The keyword "start" is the name of the scene. You can have as many scenes as you like and call them whatever you like, but you always need a scene called "start", that will be the starting scene of your game.
After the scene name, indented by two spaces, and sufixed by one dash, you can start listing all the actions of the scene. The actions are things that RenJS will execute one after the other. There should be an action for anything you want to do in your story. For example, "play" is an action that will play music, "show" is an action that will show an image.
One importan thing to remember is indentation, at level 0 there will be the names of the scenes, preceded by all of its actions, indented by two spaces. Every kind of action has it's own format, but usually it's something like this:
```yaml
  action actor: extra parameters
```
The "action" will be the name of the action, the "actor" the object over whom it will do the action, and the extra parameters can be anything. For example, the actions show, hide and play all follow this format. There are some exceptions, like the actions text, that doesn't require an actor, or say, that is inverted as "actor says" to be written more naturally. You can find a list with all the actions, their formats and parameters in the [actions section](../../actions).

All of the actions in a given scene are a written as a sorted list, that means the order is very important for it's execution. To let yaml know this, we have to prefix each action with a dash.

You're now ready to start your own game, if you still have doubts, play the [tutorial game](https://lunafromthemoon.itch.io/renjs) or check the [games archive](../../games)!
