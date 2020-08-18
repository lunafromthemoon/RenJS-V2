import Game from "../Game";
import {globalConfig} from "./config";
import Boot from "../Boot";
// import {chooseLang} from "../to-migrate/LanguageChooser";

const RenJSGame = new Game(globalConfig)
RenJSGame.phaserGameInstance.preserveDrawingBuffer = true;
RenJSGame.phaserGameInstance.state.add('bootstrap', new Boot(globalConfig))

// if (globalConfig.i18n){
//     RenJSGame.phaserGameInstance.state.add('chooseLang', chooseLang);
//     RenJSGame.phaserGameInstance.state.start('chooseLang');
// } else {
//     RenJSGame.phaserGameInstance.state.start('bootstrap');
// }
