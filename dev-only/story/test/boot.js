const globalConfig =  {
  'name': 'Quickstart',
  w: 800,
  h: 600,
  // resolution: 2,
  parent: "game-canvas",
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
  'guiConfig': 'story/NewGUI.yaml',
  'storyConfig': 'story/Config.yaml',
  storySetup: 'story/test/TestSetup.yaml',
  'storyText': [
    'story/test/TestStory.yaml'
  ],
  // debugMode:true
}

const RenJSGame = new RenJS.game(globalConfig)
RenJSGame.launch()
