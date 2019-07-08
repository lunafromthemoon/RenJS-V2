+++
title = "Cordova"
weight = 6
pre = "<b>5.2 </b>"
+++

For creating native mobile application we can use Cordova. Just like Electron, Cordova is a wrapper for HTML5 applications to run as native apps in mobile devices: Android, iOS and Windows Phones.

To make things easier, grab the [RenJS Quickstart with Cordova](https://gitlab.com/lunafromthemoon/RenJSQuickstartCordova), and let's see the main differences. The biggest one is that the game is now inside the folder www. Everything inside of it is the same, you write your story as always.

To test it in your computer, with a browswer, let's install the project. You will need:

* node
* npm
* cordova

Node and npm usually come together, when you install one, the other one is installed too. Node is the engine behind Electron that lets it run as a local server on a computer. This is how we "serve" our game web page to the window Electron creates. Npm is just a package manager that lets you install libraries and dependencies easily. Once you have npm, you can use it to install electron-packager like this:

```bash
npm install -g cordova
```

To test it we need to install the project, add browser support, and then run it:

```bash
# Go into the repository
cd RenJSQuickstartCordova
# Install it
npm install
# Go into your game folder
cd www
# Install it
npm install
# Go to root folder
cd ..
# Add browswer support
cordova platform add browser
cordova plugin add cordova-plugin-browsersync
# Run it
cordova run browser --live-reload
```

Once the game is finished and you're ready to package, we need to add first whatever platform you want to target:

```bash
# Add android platform
cordova platform add android
# Add ios platform
cordova platform add ios
# Add windows phone platform
cordova platform add windows
```

And then build it like this:

```bash
# Build it for android
cordova build --release android
```

There are more steps involved in the creation of a mobile app, like signing the application for publishing and so on. [Here is a good article about it](http://www.9bitstudios.com/2016/01/submit-apache-cordova-applications-for-ios-and-android-to-the-apple-app-store-google-play/). Once you have a signed app, you can then install it in a mobile device and play!