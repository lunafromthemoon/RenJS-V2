+++
title = "Cocoon"
weight = 7
pre = "<b>5.3 </b>"
+++

The easiest way to package your game is by using Cocoon. Cocoon is a cloud service, that means you don't really need to install or do anything on your own computer, everything will be done on their servers. You just need to get an account in the [Cocoon Platform](cocoon.io), upload your code (based on this [RenJS Quickstart with Cocoon](https://gitlab.com/lunafromthemoon/RenJSQuickstartMobile)), press a button to compile, and press another to download the packaged results. Very easy!

But there's a catch: As almost every cloud service out there, if you really want to use it, you need to pay. There's a free version, of course, but limited to two projects of less than 50mb each. Unless your game is really small, you'll reach this limit really quickly. The RenJS Quickstart, as small as it is, weights around 25mb already.

Let's check the differences with the RenJS Quickstart. The most noticeable one is now the game code is inside the folder www. As with Cordova (as Cocoon uses Cordova internally), we are adding a wrapper to the game that will allow it to execute into a webview in a mobile phone, a desktop window, etc. 

Another difference is in the index: We add a style to the body, so it won't have any extra margins and the game adapts perfectly to the screen; and we add an event listener that tells us when the device is ready and we can start executing the game. That's it, the rest of the game code is exactly the same.

The wrapper contains a config.xml file with information like the App name, description, etc. You don't really need to change anything in this file, since you can do it more easily from the Cocoon platform. There's also a folder called res, containing the icons to use for each platform, that is, the icon you will use to open the game App.

To package the game you need to upload the code to Cocoon.io. If you still haven't got an account there, go and make one. Once you're logged in you'll find a Create project section, that will allow you to upload a zip file, that should contain all your code.

After it's uploaded, there are some important settings to check before compiling:

* In settings/default: The webview engine has to be _Webview_. Orientation should probably be landscape, unless your game is taller than longer. 
* Choose the targets: In the list there's a checkbox to choose what target you want to compile your game to. Android, iOS, Windows 10 (for both mobile and desktop), X OS or Ubuntu.
* Signing: In the signing section you should set your keystores for the chosen targets (except Ubuntu). 

After setting up everything, you have to compile it. To do this, you just need to press the _Compile_ button, at the header of the project page. This process may take a while depending on what and how many targets you chose. You will receive an email when it's ready, and you'll be able to download the package for each target from the same project page.

That's it! Install and play!