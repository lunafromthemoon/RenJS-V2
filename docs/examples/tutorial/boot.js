const RenJSConfig =  {
  'name': 'Quickstart',
  'w': 800,
  'h': 600,
  'renderer': Phaser.AUTO, // become renderer
  'scaleMode': Phaser.ScaleManager.NO_SCALE,
  parent: "renjs-canvas",
  'loadingScreen': {
    'background': 'assets/gui/tutorialbg.png',
    'loadingBar': {
      'asset': 'assets/gui/loaderloading-bar.png',
      'position': {
        'x': 109,
        'y': 458
      },
      'size': {
        'w': 578,
        'h': 82
      }
    }
  },
  'fonts': 'assets/gui/fonts.css',
  'guiConfig': 'tutorial/GUI.yaml',
  storyConfig: 'Config.yaml',
  storySetup: 'tutorial/Setup.yaml',
  'storyText': [
    'tutorial/Story.yaml'
  ],
  'logChoices': true,
}

const RenJSGame = new RenJS.game(RenJSConfig)
RenJSGame.launch()
