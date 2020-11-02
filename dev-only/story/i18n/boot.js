const globalConfig =  {
  'name': 'Quickstart',
  'w': 800,
  'h': 600,
  'renderer': Phaser.AUTO, // become renderer
  'scaleMode': Phaser.ScaleManager.SHOW_ALL,
  'splash': {
    'loadingScreen': 'assets/gui/loaderloaderbackground.png',
    'loadingBar': {
      'asset': 'assets/gui/LANG/loaderloading-bar.png',
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
  'guiConfig': 'story/i18n/LANG/GUI.yaml',
  'storyConfig': 'story/Config.yaml',
  storySetup: 'story/i18n/Setup.yaml',
  'storyText': [
    'story/i18n/LANG/Story.yaml'
  ],
  i18n: {

    langs: {
      "en": {
        'asset': 'assets/gui/i18n/en.png',
        'position': {
          'x': 240,
          'y': 260
        },
        'size': {
          'w': 163,
          'h': 83
        }
      },
      "es":{
        'asset': 'assets/gui/i18n/es.png',
        'position': {
          'x': 410,
          'y': 260
        },
        'size': {
          'w': 163,
          'h': 83
        }
      }}
  },
}

const RenJSGame = new RenJS.game(globalConfig)
RenJSGame.launch()
