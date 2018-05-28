+++
title = "Extending RenJS"
date = 2017-09-25T23:27:00-03:00
weight = 6
chapter = true
pre = "<b>6. </b>"
+++

### Extending RenJS

# Add your own code

Extending RenJS is not that hard. As it's based on PhaserJS creating new functionality is really easy. There's a lot of [documentation](https://phaser.io/docs/2.6.2/index) about Phaser, and there's also a great [examples gallery](https://phaser.io/examples) that can help you achieve whatever you want. 

To make it easier, here you'll find the most common ways to extend a RenJS game:

* Adding new transitions: FADE, CUT and MOVE are the most usual transitions for characters and background, but what if you want to do something else? You can add your own transition and use it just as the other ones.
* Adding new effects and ambients: The effects and ambients shipped with RenJS are just examples used in other games created with it, but this should not limit what you can do. You can have any kind of effect, any kind of ambient you can imagine, and just as with transitions, use them in your story in a normal way.
* Adding new general functions: With RenJS you can create more than just classical Visual Novels. You can add your own code and extend RenJS to add new game mechanics: RPG elements, fight scenes, hidden image puzzles, whatever you want!
* Extending the GUI: The simple GUI used by RenJS is that, simple. But you can do many things with a GUI, adding new buttons and information display to the HUD, add a save and load menu, or an CGSs gallery.

If you want to do even more, you can find here some [documentation of the engine architecture](/docs), that should help you understand the flow of the game and add the code exactly where you need to.
