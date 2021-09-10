const globalConfig =  {
  'name': 'Quickstart',
  'w': 800,
  'h': 600,
  'renderer': Phaser.AUTO, // become renderer
  'scaleMode': Phaser.ScaleManager.SHOW_ALL,
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
  'logChoices': true,
  'fonts': 'assets/gui/fonts.css',
  'guiConfig': 'story/GUI.yaml',
  'storyConfig': 'story/Config.yaml',
  storySetup: 'story/pac/Setup.yaml',
  'storyText': [
    'story/pac/Story.yaml'
  ],
  // debugMode:true
}

const RenJSGame = new RenJS.game(globalConfig)
RenJSGame.launch()
