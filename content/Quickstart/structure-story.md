+++
title = "Story Structure"
date =  2018-05-16T15:27:25+02:00
weight = 6
pre = "<b>1.2 </b>"
+++

With the engine and libraries set up, it's time to start adding the actual content of your game. Your story will be composed of two very different things: 

* The story script and setup files
* The story assets (mostly images and sounds)

To organize all your files, the first big division will be two folders, one called "story" and one called "assets". 
The story folder should contain:

* The story script: one or more files with the text of the story.
* The story setup: the link between the story and the assets. For example, it will list who are the characters (the name you will be using in the script to refer to it) and how the character will look (the files with the images for this character).
* The user interface configuration: Everything else "outside" of the story, like the game menus, buttons, the dialog text boxes, etc.
All this files are in a special format called yaml, so, for example, you will have the files: Setup.yaml, GUI.yaml and Story.yaml.

The assets folder should contain all the assets, from the images for the characters and backgrounds to the menus, sounds and music. You can organize this folder as you like, but it's a good practice to separate first by asset type (static image, spritesheet, sounds or music), and then by asset meaning. For example, all the images for one character should be in the same folder, named after the character.

### The User Interface

Before thinking about characters, background and music, we need to setup the look and feel of the game, that is, user interface. 
The user interface is just as important for the story, since it sets the mood for the player even before starting it. There are many [resources](http://blog.cyanide-tea.net/2014/07/22/design-101-gui-design/) about how to choose the best interface for your game. There's also a rich community of visual novel developers who create and distribute their own art and designs. 
All the assets for the user interface will be inside the assets folder. And then you need to specify how to use these assets to create the user interface. It might be hard at first, especially if you're not a graphical designer, but in this system allows for a very flexible user interface that will enrich the story you want to tell.

To make things easier to start writing, and the learn how to setup the user interface, there's a basic UI available to [download](https://gitlab.com/lunafromthemoon/RenJSTutorial), which includes the assets and the configuration file. This UI is the one used in the tutorial game, you can use it as is, or modify it to better suit your needs.

To learn more about how to modify the basic UI or create one completely from scratch, the [GUI](../../gui) section has all the details about it.

### Setting up the story

Now that we have a working interface, we need to define what components make up our story. In short, the characters, the backgrounds, etc. You don't need the final assets yet, you can use placeholders for everything, but we need to know what things we'll be using in our story. 

The setup goes in a file called Setup.yaml. Here's a basic example of how it should look:

```yaml
  backgrounds:
    bus_station: assets/backgrounds/bus_station_afternoon.jpg
    room: assets/backgrounds/room_day.jpg
  characters:
    deuzi:
      displayName: Deuzilene
      speechColour: #ca90cf
      looks:
        normal: assets/characters/deuziNormal.png
        happy: assets/characters/deuziHappy.png
        angry: assets/characters/deuziAngry.png
    jair:
      displayName: Jaïr
      speechColour: #d5e6e7
      looks:
        normal: assets/characters/jairNormal.png
        happy: assets/characters/jairHappy.png
        angry: assets/characters/jairAngry.png
  cgs:
    phone1: assets/objects/phone1.png
    phone2: assets/objects/phone2.png
  music:
    morningBGM: assets/audio/morning.mp3
  sfx:
    ringtoneSFX: assets/audio/nokia6210-24-elise.mp3
```

In the previous example we define some of our story objects. First we define our backgrounds, then our characters, cgs, music and sound effects. Every kind of object is listed under its key name. For example, under "backgrounds", indented by two spaces, we start listing all our different backgrounds. In the yaml files, indentation is very important. The indentation can be defined by either a "tab" character or simply two spaces, but you can not mix the two. So, if you start using tabs, you have to keep using them for the rest of the file. There are many online tools to check the syntax of a yaml file, it's a good practice to check your yaml files with one of those tools if your game doesn't load.

For most of this things we only need to specify a name, the name that will be used as a reference in the story file, and a path to an asset. So, in the story, when I want to show the image "bus_station_afternoon.jpg", located in the folder assets/backgrounds/, I will simply call it by the name we define here, "bus_station". If I want to start playing the audio file "morning.mp3", located in the folder "assets/audio", I will call it by the name "morningBGM". 

You can use any name you want (without spaces, dashes nor symbols), but it's a good practice to use a meaningful name. I could have a background with the name "background1", but that wouldn't be easy to understand when I'm writing my story. In the same vein, you can locate your asset files anywhere you want inside the game folder, but it's better to organize them in a folder structure with meaningful names. For example, put all the audio files inside the subfolder audio.

For the characters we need more information. The display name will be the actual name of the character, it can have spaces, symbols, and anything you want. This name will be shown inside a little box (called the namebox in the UI) when they talk, so the player can identify when each character is talking during a dialog. The speech colour is a colour in [hexadecimal format](http://www.color-hex.com/), and can be use in many ways by the UI, the most usual use is to use as the text color for either the name or the dialogs of a character. 

Finally, one of the most important aspects of Visual novels is that the characters can show emotions. This is achieved by changin the image for the character. The same thing will be used to change different visual aspects of a character, like their clothes. All the different "looks" of a character are then listed under the "looks" keyword, with key name and the file associated to it. You can have a character without any look, for example, if you need an invisible narrator or protagonist.

You could also need to load extra images, spritesheets and even scripts. To load them you 