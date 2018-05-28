+++
title = "Engine documentation"
date =  2018-05-16T14:41:12+02:00
weight = 5
pre = "<b>6.4 </b>"
+++

### Page under construction

If you're a javascript developer and you're thinking about extending RenJS, this is the place to start. In this section we'll see how RenJS works, how to add new story actions, new functionality for the menus, etc. 

RenJS is separated into many files that each take care of a subsystem of it:

* RenJSBootstrap: The bootstrap, it creates the game instance, loads a splash screen and kicks off the preloading process for the whole game.
* Preload: The preloader in two stages, first it loads all of RenJS and the story/configuration files and then it loads the actual assets of the game. It also creates the GUI manager and initializes everything.
* SimpleGUI: A centralization of the GUI, with functions for creating it and displaying it. It also takes care of the visual aspects of showing dialogs and the buttons for player choices.
* RenJS: Creates the global object RenJS which contains all of the main control variables of the game. It also contains all the functions called from the GUI, like start the game, save, autoplay, etc. It initializes here all of the managers.
* Background Manager: It takes care of the backgrounds. How to show them, hide them, knowing the current background, etc.
* Character Manager: It takes care of the characters. It initialize all of the characters, allows for showing and hiding them with a particular look and position, and keeps track of the current characters being shown.
* Audio Manager: It takes care of the audio, both music and sfx. It can start and stop music, loop it, etc.
* Cgs Manager: Takes care of the cgs. How to show them, hide them, animate them and keeps tracks of all the current cgs being shown.
* Text Manager: Very little manager to encapsulate the calls to the gui text box.
* Tween Manager: Takes care of tweening all of the images, either backgrounds, characters or cgs. It adds support for sequential and parallel tweening.
* Logic Manager: Takes care of any logic and game branching. It helps with showing the possible choices to the player and adding the new actions to the story according to the outcome. It also takes care of setting and getting variable values used in the story and evaluating expressions.
* Story Manager: It takes care of the story flux, it interprets the story file line by line and calls the responsible manager for each action.
* Transitions: Map containing the functions to realise different image transitions, like fading an image.
* Effects: Map containing the functions to realise the different special effects, like flashing an image.
* Ambient: Map containing the functions to realise the different ambient effects, like a particle emmitter simulating rain.
* Defaults: Some of the default values for the game, for example, game name, text style, starting game settings like text speed, music volume, etc; the default positions like CENTER, LEFT and RIGHT, and the default transitions according to the element type.
* CustomContent: A map that should contain any additional functions to call with the _call_ action.



Additionally, it needs a few libraries:

* Phaser 2.6 as a base 2D videogame engine, to show images, reproduce sounds and manage input, 
* js-yaml (and esprima) to parse the yaml files.
* undercore for data manipulation
