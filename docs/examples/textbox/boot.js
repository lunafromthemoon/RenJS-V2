const RenJSConfig =  {
  'name': 'Quickstart',
  'w': 800,
  'h': 600,
  'renderer': Phaser.AUTO, // become renderer
  'scaleMode': Phaser.ScaleManager.NO_SCALE,
  parent: "renjs-canvas",
  'loadingScreen': {
    'background': 'assets/gui/quickstartbg.png',
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
  'guiConfig': 'GUI.yaml',
  storyConfig: 'Config.yaml',
  storySetup: 'textbox/Setup.yaml',
  'storyText': [
    'textbox/Story.yaml'
  ],
  'logChoices': true,
}

const RenJSGame = new RenJS.game(RenJSConfig)
RenJSGame.launch()
