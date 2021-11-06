"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preparePath = void 0;
function preparePath(path, i18n) {
    if (i18n) {
        return path.replace('LANG', i18n.current);
    }
    else {
        return path;
    }
}
exports.preparePath = preparePath;
//# sourceMappingURL=path.js.map