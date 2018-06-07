+++
title = "MultiLanguage Quickstart"
date =  2018-05-16T15:27:25+02:00
weight = 6
pre = "<b>6.1 </b>"
+++

First, you will need the multilanguage version of the engine, that you can download from [here](https://gitlab.com/lunafromthemoon/RenJSMultilanguage). There are a few differences with the normal version of RenJS. First, it adds a new file to load in the index, _LanguageChooser.js_. This file, as its name indicates, will display the language choosing screen, and then call the bootstrap for the game. It's a really small and simple file, and if you don't like how the language choosing screen looks like, here is where you should change things.

```html
<!DOCTYPE html>
<html>

  <head>
    <meta charset="utf-8" />
    <title> RenJS </title>
    <script type="text/javascript" src="libs/phaser.min.js"></script>
    <script type="text/javascript" src="config.js"></script>     
    <script type="text/javascript" src="RenJS/LanguageChooser.js"></script>     
    <script type="text/javascript" src="RenJS/RenJSBootstrap.js"></script>     
  </head>
  <body>    
  </body>

</html>
```

Next difference is in the config file:

```js
var globalConfig = {
  w:800,
  h:600,
  mode: "AUTO",
  scaleMode: "SHOW_ALL", //SHOW_ALL, EXACT_FIT
  i18n: {
    langs: ["en","es"],
    path: "assets/gui/i18n/",
    format: ".png",
    w: 163,
    h: 83
  },
  splash: { //The "Loading" page for your game
    loadingScreen: "assets/gui/LANG/splash.png", //splash background
    loadingBar: {
      fullBar: "assets/gui/LANG/loadingbar.png",
      position: {x:111,y:462}
    }
  },
  fonts: "assets/gui/fonts.css",
  guiConfig: "story/GUI.yaml",
  storySetup: "story/Setup.yaml",
  //as many story text files as you want
  storyText: [
        "story/LANG/YourStory.yaml"
    ],
}

```

There are a few differences here. First, there's a new tag called _i18n_. I18n is short for Internationalization, and it's where all your multi language information is kept. It has:

* Langs: A list of the available languages. In this case we have _en_ for english and _es_ for spanish.
* Path: Where to find the language buttons that will be shown in the language choosing screen. It's not a file, but a folder and should en in "/".
* Format: The image format of the buttons, as a file extension. In this case ".png".
* W and H: The width and height of the buttons. Each button has two states, normal and pressed, in the same file, this values help to see find where each frame lies.

But this is not the only difference, we can also see some files with the path "LANG" in it. If you check your story folder, for example, you will not find any folder called LANG. Insted this reserved word will be replaced by the language tag chosen by the player. So, if the player chooses spanish (tag _es_), everywhere where it says _LANG_ will be replaced by _es_. This means, for example, that the element _loadingScreen_ will be then loaded from "assets/gui/es/splash.png". Same thing with your story files.

If you check now the story folder, you will find the setup and gui files as always, but the story file is now twice, once for spanish and once for english, in their respective folders:

* Setup.yaml
* GUI.yaml
* en
  * YourStory.yaml
* es
  * YourStory.yaml

The same way you can change the loading bar for every language, you can do with every resource. For example, we need to change all of the menu's buttons. This buttons are defined in the GUI.yaml file, so let's inspect it's contents:

```yaml
assets:
  fonts:
    - audimat-mono
  images:
    mainBackground: assets/gui/menu.png
    settingsBackground: assets/gui/LANG/settings.png
    sliderFull: assets/gui/slider.png
    messageBox:  assets/gui/textbox.png
    nameBox:  assets/gui/namebox.png
    ctc: assets/gui/ctc.png
    languageSign: assets/gui/LANG/language-sign.png
  spritesheets:
    startButton: assets/gui/LANG/startbutton.png 163 83
    loadButton: assets/gui/LANG/loadbutton.png 163 83
    saveButton: assets/gui/LANG/savebutton.png 163 83
    settingsButton: assets/gui/LANG/settingsbutton.png 163 83
    returnButton: assets/gui/LANG/returnbutton.png 163 83
    qmAutoButton: assets/gui/qmenuauto.png 47 45
    qmSkipButton: assets/gui/qmenuskip.png 47 45
```

You don't need to have a separate GUI file for each language, though you may have them if you want, but you need to specify where to find the assets for the different languages, using the LANG reserved word in the path of these files. As with the story folder, you will find the new language folders under assets/gui, with all the assets that need to be changed.
GUI and story is usually the most important parts of your game to translate, but there might be other places where you need to make changes, maybe a character or object with some writing on it? Maybe a background? With this technique you should be able to make these changes without changing too much code.