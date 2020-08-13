# RenJS Core

RenJS is a videogame library for making Visual Novels that run directly in the web browser. Powered by PhaserJS, it's easy to use and easy to extend.

The scripts of the game are written in YAML (a human friendly data serialization standard) files, allowing writers and developers with little to no programming knowledge to make games as deep and complex as they want.

As RenJS is purely web, it can also be exported for desktop and mobile environments.

## Main Features

- No code required!
- Easily extendable, custom javascript functions can be called directly from the script
- Easily configurable GUI (comming soon, RenJS GUI Builder)
- Runs in the browser
- It comes with and array of transitions (fade, cut, move) and effects (rain, snow, sakura blossoms) out of the box
- Allows for internationalization!
- The games can have a multitude of branches and endings

## How to Run

There are two main dependencies:

- Phaser 2: used for preloading assets, showing things on the canvas and interaction with the user. 
- js-yaml (with esprima): Used for parsing the YAML scripts into a more code friendly format.

The games made with RenJS run as a web page, so you will need a html file to load both the dependencies and RenJS. Since there are many file to RenJS and it can be confusing, only the RenJSBootstrap.js file has to be imported into the html file. The bootstrap will then take care of loading the rest of the files in the right way on its own.

The other files needed are:

- config.js: Most low level configuration file of the game itself, giving instructions to Phaser on how to create the game in the canvas. It contains things like what's the game screen resolution, the type of scaling (stretch to screen size, keep aspect ratio, etc) and where to find the files that make up the game story, gui configuration and setup.
- GUI.yaml: A yaml file containing the game GUI configuration, this includes the game menus and hud.
- Setup.yaml: A yaml file containing references to the assets to use during the game, like characters, backgrounds, cgs, etc.
- Story.yaml: One or more files with the script of the game. 

The quickstart project includes all of the dependencies and the configuration for a minimal game: 
[Download from here!](https://gitlab.com/lunafromthemoon/RenJSQuickstart)

Once you have all the files, you can upload the game to a webpage, or run it locally. To run it locally you will need to setup a local web server, to avoid CORS issues.

Some IDEs, like [Brackets](http://brackets.io/) come with and inbuilt server, and you can just press a button to see the game running. 

Another easy option is to just run a simple server on the directory containing the game:

```bash
cd RenJSQuickstart
python -m http.server 8000
```

This will create a server with your game in the port 8000, which means that to run the game you can go to your browser and open the address *localhost:8000*.

# How does it work?

## Loading the engine

### Bootstrap phase

To import RenJS on a webpage only the RenJSBootstrap.js file is needed. In this minimal file, the Phaser game object is created with the game's specific configuration. It loads also the loading page assets (background and loading bar) and the Preload.js file, going to the preload phase.

If the internationalization module is used, it shows the language choosing screen before anything else, and then only loads the right assets for the language.

### Preload phase

The preload is done in two parts: First, it loads the rest of RenJS (and deps) and the game configuration and story files, and then it load the assets belonging to the game (images, sounds, etc).

#### First load:

- Dependencies
  - esprima.js
  - js-yaml.min.js
  - underscore-min.js **Soon to disappear**
- RenJS
  - Defaults.js
  - RenJSBuilderMadeGUI.js
  - SimpleGUI.js
  - AudioManager.js
  - BackgroundManager.js
  - CGSManager.js
  - CharactersManager.js
  - LogicManager.js
  - TextManager.js
  - TweenManager.js
  - StoryManager.js
  - RenJS.js
  - Effects.js
  - Ambient.js
  - Transitions.js
  - CustomContent.js
- Game (*these files can have any name chosen by the developer*)
  - Gui config (yaml file)
  - Setup (yaml file)
  - Story (yaml files)

#### Second load:
- Gui assets
- Backgrounds
- Cgs
- Characters
- Music
- SFX
- Extra assets (images, spritesheets or audio)

![Bootstrap Process](imgs/renjsbootstrap.svg)

Once everything is loaded, the preload phase ends and the main menu of the game is shown.

## The Managers

Coming soon!