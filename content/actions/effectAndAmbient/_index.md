+++
title = "Effects and Ambients"
weight = 11
pre = "<b>2.11 </b>"
+++

These actions allow you to show visual and sound effects. The difference between them is that _effect_ is a nuclear action that ends after its execution, while _ambient_ effects perdure over time. For example, an _effect_ can be a thunder, while an _ambient_ can be rain.


```yaml
    - ambient ambient_id:
      param1: value1
      param2: value2
    - effect effect_id:
      param3: value3
      param4: value4
    - ambient CLEAR:

```

There are a few ambients and effects already coded, but these depend almost entirely on the kind of game you're making. You can check the defined ambients and effects and tailor them to your needs.
The effects and ambients usually use extra assets, either images, spritesheets, music and even code. All of this should be loaded in the _extra_ section of the setup file. Check the [Setup Guide](/../../setup) for more info about this file.

### Ambients

The ambients are defined inside the file _RenJS/Ambient.js_, inside the map called RenJS.ambient. A special ambient called CLEAR takes care of stopping any ambient set before. Other ambients are:

* **BGS**: Adds a looped background sound and nothing more. The sound id should be specified with the param _sfx_.
* **RAIN**: Starts a particle emitter and background sound for a rain mood. Additional assets:
  - image:
      + **rain**: A sprite of the [raindrop](/RenJS/img/rain.png).
  - music:
      + **rain**: A loopable [audio](/RenJS/audio/Rain.mp3). 
* **SAKURA**: Starts two particle emitters for a cherry blossoms falling ambient. Additional assets:
  - spritesheet:
      + **sakura**: A sprite of the [cherry blossom](/RenJS/img/sakura-petals.png), with 5 frames (17x17 px).
* **SNOW**: Starts three particles emitters for a snowy mood. Additional assets:
  - spritesheet:
      + **snowflakes**: A sprite of the [small snowflakes](/RenJS/img/snowflakes.png), with 5 frames (17x17 px).
      + **snowflakes_large**: A sprite of the [large snowflakes](/RenJS/img/snowflakes_large.png), with 5 frames (64x64 px).
* **DRUGS**: A strange hallucinogenic effect. No additional assets required. For this effect to work the game mode should be WEBGL (set the game mode on the file _RenJSBootstrap.js_).
* **BADTRIP**: An extra effect to call after the DRUGS effect.

To make your own effect you can either modify the ones already coded, or make a completely different thing taking advantage of the visual effects and sprite manipulation capabilities of Phaser. The only thing you should remember is to call the funtion _RenJS.resolve()_ when you finish. This function tells the automat that controls the story that it can continue with the next action. Another usefull thing is to add a function to call when the ambient is cleared. You can push a function to _RenJS.ambient.clearFunctions_ and it will be called when the ambient CLEAR is set. This way you can destroy any sprite, stop any music, etc, that your ambient uses.

### Effects

Very similar to ambients, the effects are defined inside the _RenJS/Effects.js_ file. Some of the effects available are:

* **SHAKE**: Screen shake!
* **SOUND**: It takes a param with the name _sfx_ and reproduces it. It's the same as the _play_ action.
* **ROLLINGCREDITS**: Sets a black screen and shows a list of text defined on the param _text_. It also takes the param _endGame_ to directly end the game after the effect is over. The text list can have _null_ lines that will be empty lines.

```yaml
  - effect ROLLINGCREDITS:
    endGame: true
    text:
      - Thank you for playing
      - Game Name
      - null
      - made by
      - lunafromthemoon
      - null
      - with
      - RenJS
      - null
      - whatever else you want to say

```

* **SHOWTITLE**: Shows an image with a title and subtitle overimposed. The image should be loaded with the name _title_. The params _title_ and _subtitle_ will be shown in the middle of the image, with the first font defined in the Setup file. You can play with this effect and make up the titles however you like.
* **THUNDER**: Quickly shows and hides a thunder image, accompanied by a thunder sound effect. Needs extra parameters:
  + image:
      - **thunder**: The [thunder image](/RenJS/img/Thunder_Effect.png).
  + sfx:
      - **thunderSFX**: The [thunder sound](/RenJS/audio/thunder_strike_1.mp3).
* **EXPLOSION**: Shows an explosion animation, with an explosion sound. Needs extra parameters:
  + spritesheet:
      - **explosion**: The [explosion](/RenJS/img/explosion.png) animation (274x300px).
  + sfx:
      - **explosionSound**: The explosion sound.