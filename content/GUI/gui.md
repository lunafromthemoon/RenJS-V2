+++
title = "The GUI File"
weight = 5
pre = "<b>4.1 </b>"
+++

The GUI file (identified in the config.js file as "guiConfig") has three main sections:

* assets: The list of assets used to build the gui, with key and file name.
* hud: The head-up display, this is what the player will see during the game, and it includes the text box to show the dialogs, the name box to show the name of the character talking and any button the player can use during game like _autoplay_, _skip_ or _save_.
* menus: All the different menus of the game. You should at least have one main menu to start the game, and can have as many extra menus as you want. Some examples of what extra menus you could need are a _settings menu_, a _load game menu_, a _scenes menu_, etc.

## Assets

A list of all the assets, ordered by their types: images, spritesheets (for the buttons), audio, etc. The spritesheets take two extra parameters that indicate the width and height of each of its frames.

```yaml
assets:
  fonts:
    - audimat-mono
  images:
    mainBackground: assets/gui/menu.png
    settingsBackground: assets/gui/settings.png
    sliderFull: assets/gui/slider.png
    messageBox:  assets/gui/textbox.png
    nameBox:  assets/gui/namebox.png
    ctc: assets/gui/ctc.png
  spritesheets:
    startButton: assets/gui/startbutton.png 163 83
    loadButton: assets/gui/loadbutton.png 163 83
    saveButton: assets/gui/savebutton.png 163 83
    settingsButton: assets/gui/settingsbutton.png 163 83
    returnButton: assets/gui/returnbutton.png 163 83
    qmAutoButton: assets/gui/qmenuauto.png 47 45
    qmSkipButton: assets/gui/qmenuskip.png 47 45
    qmSettingsButton: assets/gui/qmenusettings.png 47 45
    qmMuteButton: assets/gui/Mute.png 50 50
    qmSaveButton: assets/gui/qmenusave.png 47 45
    choice: assets/gui/choice.png 716 65
    interrupt: assets/gui/interrupt.png 716 95
  audio:
    mainMusic: assets/audio/Evan_Schaeffer_-_01_-_Aqueduct.mp3
```

You can call each of this assets whatever you like, but it's a good practice to use descriptive names for each one.

### Fonts
The fonts are a special case, you need a list of the font names used declared in the assets section of the GUI file, like this:

```css
assets:
  fonts:
    - audimat-mono
    - old-standard
    - playfair

```
These fonts should also be declared in a css file, referenced in the config.js file (e.g. fonts.css). 

```css
@font-face {
  font-family: 'audimat-mono';
  src: url('assets/gui/audimat-mono.ttf');
  src: url('assets/gui/audimat-mono.ttf').format('truetype');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'old-standard';
  src: url('assets/gui/OldStandard-Regular.ttf');
  src: url('assets/gui/OldStandard-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'playfair';
  src: url('assets/gui/PlayfairDisplaySC-Regular.ttf');
  src: url('assets/gui/PlayfairDisplaySC-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

```

This css file will be loaded onto the browser along with the game, and will allow it to find the font files (in this case only one: audimat-mono.ttf) and making them available for RenJS to use them.

## HUD

The hud, as explained above, is the part of the user interface shown during the game. In a visual novel, we have a set of elements common to most of them, like:

* Text box: Where the text and dialogs of the game will be shown. If there is no text to show, this box will be hidden.
  * CTC: The click to continue symbol is usually an animated or blinking image that indicates the player they have to click to continue with the story.
* Name box: Where the name of the talking character is displayed. If no character is talking, this box will be hidden.
* Quick menu: A little menu the player can use during the game, the usual options are:
  * Autoplay: Instead of waiting for the player to click after each dialog, the game will wait for a moment and continue until it needs the player input to make a choice.
  * Skip: Like autoplay, but the game will be going _fast_. Used mostly to catch up and get quickly to the different ramifications of the game.
  * Save: The the current state of the game, to be able to continue later. It could also open a Save Menu and let the player choose a slot for saving.
  * Settings: Open the settings menu
* Choice button: Usually when the player has to make a choice, it will be by pressing a button with the desired option text. 
  * Interrupt button: Same as the choice button, but for an _interrupting_ option. It can be the same as the choice, or change slightly.

A usual Hud setup looks like this:

```yaml
hud:
  area:
    - 640 450 748 554
  message:
    position: 
      x: 46 
      y: 435
    textPosition: 
      x: 36 
      y: 36
    textStyle:
      font: 16pt audimat-mono
      wordWrap: true
      wordWrapWidth: 545
      fill: "#ac9393"
  name:
    position: 
      x: 36 
      y: -40
    textStyle:
      font: 20pt audimat-mono
      boundsAlignH: center
      boundsAlignV: middle
  ctc: 
    position:
      x: 570 
      y: 90
    animated: false
  choice:
    separation: 95
    textStyle:
      font: 20pt audimat-mono
      boundsAlignH: center
      boundsAlignV: middle
      fill: "#666666"
  interrupt:
    textStyle:
      font: 20pt audimat-mono
      boundsAlignH: center
      boundsAlignV: middle
      fill: "#664b4b"        
  buttons:
    auto: 
      position:
        x: 647
        y: 502
      sprite: qmAutoButton
    skip: 
      position:
        x: 694
        y: 502
      sprite: qmSkipButton
    save: 
      position:
        x: 694
        y: 457
      sprite: qmSaveButton
    settings: 
      position:
        x: 647
        y: 457
      sprite: qmSettingsButton
```

The _area_ refers to a space defined by two points in the screen (x1 y1 x2 y2) inside of which the clicks of the player don't count as "game clicks". So, if the game is waiting for the player to click, to continue with the story, but the player clicks inside this area, the game will not continue. We need this area to manage the interaction with the quick menu in the Hud. If the player clicks in the save button, it just means it wants to save, not continue with the story. This area doesn't have to be exactly the size of the menu, and it can actually cover more parts of the screen. You can define as many "non clickable areas" as you like.

The _message_ is the text box, or message box, definition. It takes a position in the screen to show the image (from it's left up corner), a text position to define where to start writing the text, relative to the message position; and the text style defined by font, if it should wordwrap and the width and the text color. You can add more text style options as long as they are valid for a Phaser text object. 

The _name_ tag defines the namebox. It's position should be relative to the text box, and you also need to define a text style for it.

The _ctc_ is the click to continue, you just need to define a position relative to the text box, and say if it's animated or not. If not animated (not a spritesheet) it will blink.

The _choice_ is the choice button. Unless you specify a position, it will be centered in the screen. You also need to define a text style and a separation, in pixels, to show all of the choices as a list.

In _interrupt_ you can only define a different text style, since it will take the same parameters defined for the choice.

The _buttons_ tag refers to the quick menu. For each button you need to declare a key. This key is important, because it will be used to determine what the button will do. For example, the button save will call the save action, the button skip will call the skip action, and so on. If you have an extra button in your GUI that needs to do something different, you can add it with a specific key here, and then make sure you have a function to pair it with. The button has also a position and a sprite.

You proably noticed that there's no sprites declared for _message_, _name_, etc. This is because the names of the assets are the default ones. If you change the asset name, then you would need to define also a sprite name in each of these elements.

## Menus

The menus section is a list with the different available menus of the game. The only mandatory one has to be called main, and it's the menu that will be called when the game loads. Each menu has a background (if not declared, it will take the default asset _menuname_Background), optionally music, and a list of buttons. To make it easier for making a settings menu, you can define also sliders, for things like volume or game speed.

```yaml
menus:
  main: 
    music: mainMusic
    buttons: 
      start: 
        position:
          x: 112
          y: 462
        sprite: startButton
      load:  
        position:
          x: 320
          y: 462
        sprite: loadButton
      settings:
        position:
          x: 528
          y: 462
        sprite: settingsButton
  settings:
    buttons:
      return: 
        position:
          x: 112
          y: 500
        sprite: returnButton
      start:  
        position:
          x: 320
          y: 500
        sprite: startButton
      load:
        position:
          x: 528
          y: 500
        sprite: loadButton
    sliders:
      textSpeed: 
        position:
          x: 436
          y: 235
        sprite: sliderFull
      autoSpeed:
        position:
          x: 436
          y: 364
        sprite: sliderFull
      bgmv:
        position:
          x: 147
          y: 235
        sprite: sliderFull
      sfxv:
        position:
          x: 147
          y: 364
        sprite: sliderFull
```

As with the quick menu, the actions of the buttons and properties of the slider will be defined by its key name.

This kind of GUI is called a simple GUI because it lets you create a very simple but highly personalized GUI. You can check in the [games section](../../games) some of what you can achieve with this simple system.

If you want, you can also replace the simple gui entirely and code your own. For that, chech the [engine section](../../engine) to see more details on how the gui interacts with the game.