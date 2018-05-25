+++
title = "The Setup File"
date =  2018-05-16T14:41:12+02:00
weight = 5
pre = "<b>3.1 </b>"
+++

The setup file (usually something like Setup.yaml) has many sections, that can be written down in any order, and you might not need them all.

### Backgrounds

A simple list of all the backgrounds of the game, with key (the name called from the story text) and filename.

```yaml
backgrounds:
  room: assets/backgrounds/room_day.jpg
  room_night: assets/backgrounds/room_night.jpg
  room_night_light: assets/backgrounds/room_night_light.jpg
  school_morning: assets/backgrounds/school_corridor.jpg
  school_afternoon: assets/backgrounds/school_corridor_afternoon.jpg
```

### Characters

The characters have some extra properties. 

* displayName: The key will be used to reference the character in the story text, but the display name is the one that will be shown to the player, and it can contain spaces and special characters, it can also be changed during the game. 
* speechColour: The colour used for showing the name in the namebox.
* looks: A list with key and filename for every look of the character. The key can be anything you want, but it's better to make it as descriptive as possible, to make the story writting more easy and natural.

```yaml
characters:
  deuzi:
    displayName: Deuzilene
    speechColour: "#ca90cf"
    looks:
      normal_school: assets/characters/Char3NormalSchool.png
      happy_school: assets/characters/Char3HappySchool.png
      angry_school: assets/characters/Char3AngrySchool.png
      normal_casual: assets/characters/Char3Normal.png
      happy_casual: assets/characters/Char3Happy.png
      angry_casual: assets/characters/Char3Angry.png
  liz:
    displayName: Liz
    speechColour: "#d5e6e7"
    looks:
      normal_school: assets/characters/Char2NormalSchool.png
      happy_school: assets/characters/Char2HappySchool.png
      angry_school: assets/characters/Char2AngrySchool.png
      normal_casual: assets/characters/Char2Normal.png
      happy_casual: assets/characters/Char2Happy.png
      angry_casual: assets/characters/Char2Angry.png
```

### CGS

CGS stands for computer graphics, but in RenJS it just means any extra object you need to show in the game. It will probably be renamed in the future. As with the backgrounds, the only information we need is a key name and a file name.

```yaml
cgs:
  phone1: assets/objects/phone1.png
  phone2: assets/objects/phone2.png
```

### Music

The music tracks, with a key and file name. These files can be .mp3, .ogg or other sound files. The music declared here is meant to be played in a loop, that is, as background music. If you just need a one off sound effect, you need to declare is as an sfx.

```yaml
music:
  morningBGM: assets/audio/Evan_Schaeffer_-_03_-_Glow.mp3
  storeBGM: assets/audio/Evan_Schaeffer_-_18_-_Big_Tree.mp3
```

### SFX

Sound effects, meant to be played one time, declared with key and file name as always.

```yaml
sfx:
  ringtonePinkPhone: assets/audio/nokia6210-24-elise.mp3
  ringtoneGreenPhone: assets/audio/alcatel-top_secret.mp3
```

### Extra

You can load any extra image, sound or resource you need in this section. Why would you need extra resources? For the effects and ambients, for example, or for any extra game code you add. Each extra resource has to be listed under its resource type. So, images will be under _image_ and audio under _audio_. 

You can also load spritesheets, this is a normal image that contains the frames of an animation. Currently, RenJS doesn't have any action that suppports the use of spritesheets directly, but it's used in some of the effect examples. Besides the key and the file name, the spritesheet needs two numbers that indicate height and width of each of the frames it contains.

Another thing you could load is scripts, to load for example, a piece of code needed for an effect.

```yaml
  extra:
    image:
      title: assets/gui/titles.png
      rain: assets/ambient/rain.png
      thunder: assets/effects/Thunder_Effect.png
    audio:
      cicadas: assets/audio/Cicada.mp3
      rain: assets/audio/Rain.mp3
      thunder: assets/audio/thunder_strike_1.mp3
    spritesheets:
      explosion: assets/effects/explosion.png 450 274
      static: assets/ambient/static.png 320 256
    scripts:
      marble: assets/ambient/Marble.js
      lightbeam: assets/ambient/LightBeam.js
```