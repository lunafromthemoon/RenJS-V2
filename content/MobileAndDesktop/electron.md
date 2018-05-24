+++
title = "Electron"
date =  2018-05-16T14:41:12+02:00
weight = 5
pre = "<b>5.1 </b>"
+++

One way to port the game to a native desktop application easily is by using Electron. Electron is a framework for creating native applications with web technologies like JavaScript, HTML, and CSS. If you don't know anything about it, don't worry too much, here you can find the [RenJS Quickstart](https://gitlab.com/lunafromthemoon/RenJSQuickstartElectron) ported to it. 

The way to write your game will be the same, since the Engine doesn't actually change, we only add Electron as a wrapper over it. The way electron works, it creates a native windows for the target platform and calls a web page to load it on it. That page will be the one we use to show the game.

The only difference in the code lays in the config.js file, with this little part at the end of it:

```js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = globalConfig;
} 
```

This is a way for Electron to find this configuration, so it can get the right windows size for loading the game. Another difference you may notice is in the index.html file. We add a style to make the game fit the window without any extra margins. As always, your own game should be in the story folder, the assets in the assets folder and the engine in the RenJS folder. If you made any change to it (adding new functions, changing default values, etc), you should copy not only your story and assets over the Quickstart, but also your modified version of RenJS.

### Package the game

Now to the "hard" part: The terminal.

To run and package the game as a desktop application, you'll need to use the terminal. If you've never used it before, it may seem a bit scary, but it's really easy. To begin with, we need to install the dependencies for running and packaging Electron, these are:

* node
* npm
* electron-packager

Node and npm usually come together, when you install one, the other one is installed too. Node is the engine behind Electron that lets it run as a local server on a computer. This is how we "serve" our game web page to the window Electron creates. Npm is just a package manager that lets you install libraries and dependencies easily. Once you have npm, you can use it to install electron-packager like this:

```bash
npm install electron-packager -g
```

After you have all of the requirements, we need to install the rest of the project. To do this, we will use npm. In the root of the Quickstart project we'll find a file called package.json. This file has all the information npm needs to install and run the project.

```bash
# Go into the repository
cd RenJSQuickstartElectron
# Install project
npm install
# Run it
npm start
```

If you checked the package.json file, there's a section called _scripts_. Here there are some scripts ready to use, the main one is start, which simply runs the game with electron. The other ones are to package the whole project as an executable for each of the platforms.

Once the game is finished and you're ready to package you have to simply call the previously mentioned scripts:

```bash
# For linux
npm run package-linux
# For mac
npm run package-mac
# For windows
npm run package-win

```

And that's it!