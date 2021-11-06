"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var StoryActionShow_1 = __importDefault(require("./StoryActionShow"));
var StoryActionHide_1 = __importDefault(require("./StoryActionHide"));
var StoryActionAnimate_1 = __importDefault(require("./StoryActionAnimate"));
var StoryActionText_1 = __importDefault(require("./StoryActionText"));
var StoryActionWait_1 = __importDefault(require("./StoryActionWait"));
var StoryActionChoice_1 = __importDefault(require("./StoryActionChoice"));
var StoryActionAudio_1 = __importDefault(require("./StoryActionAudio"));
var StoryActionScene_1 = __importDefault(require("./StoryActionScene"));
var StoryActionVar_1 = __importDefault(require("./StoryActionVar"));
var StoryActionEffect_1 = __importDefault(require("./StoryActionEffect"));
var StoryActionAmbient_1 = __importDefault(require("./StoryActionAmbient"));
var StoryActionIf_1 = __importDefault(require("./StoryActionIf"));
var StoryActionCall_1 = __importDefault(require("./StoryActionCall"));
var StoryActionEnd_1 = __importDefault(require("./StoryActionEnd"));
function StoryActionFactory(type, params, game) {
    switch (type) {
        case 'show': return new StoryActionShow_1.default(params, game);
        case 'hide': return new StoryActionHide_1.default(params, game);
        case 'animate': return new StoryActionAnimate_1.default(params, game);
        case 'say': return new StoryActionText_1.default(params, game);
        case 'text': return new StoryActionText_1.default(params, game);
        case 'wait': return new StoryActionWait_1.default(params, game);
        case 'choice': return new StoryActionChoice_1.default(params, game, false, false);
        case 'visualchoice': return new StoryActionChoice_1.default(params, game, true, false);
        case 'interrupt': return new StoryActionChoice_1.default(params, game, false, true);
        case 'play': return new StoryActionAudio_1.default(params, game, 'play');
        case 'stop': return new StoryActionAudio_1.default(params, game, 'stop');
        case 'scene': return new StoryActionScene_1.default(params, game);
        case 'var': return new StoryActionVar_1.default(params, game);
        case 'effect': return new StoryActionEffect_1.default(params, game);
        case 'ambient': return new StoryActionAmbient_1.default(params, game);
        case 'if': return new StoryActionIf_1.default(params, game);
        case 'call': return new StoryActionCall_1.default(params, game);
        case 'endgame': return new StoryActionEnd_1.default(game);
    }
    return null;
}
exports.default = StoryActionFactory;
//# sourceMappingURL=StoryActionFactory.js.map