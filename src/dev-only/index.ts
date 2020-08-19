import RJSGame from "../RJSGame";
import {globalConfig} from "./config";
import Boot from "../states/Boot";
// import {chooseLang} from "../to-migrate/LanguageChooser";

const RenJSGame = new RJSGame(globalConfig)
RenJSGame.preserveDrawingBuffer = true;

RenJSGame.state.add('bootstrap', Boot)

// if (globalConfig.i18n){
//     RenJSGame.phaserGameInstance.state.add('chooseLang', chooseLang);
//     RenJSGame.phaserGameInstance.state.start('chooseLang');
// } else {
//     RenJSGame.phaserGameInstance.state.start('bootstrap');
// }
