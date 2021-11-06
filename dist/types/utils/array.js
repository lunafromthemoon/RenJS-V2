"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.range = void 0;
function range(start, stop, step) {
    if (step === void 0) { step = 1; }
    var a = [start];
    var b = start;
    while (b < stop) {
        a.push(b += step);
    }
    return a;
}
exports.range = range;
//# sourceMappingURL=array.js.map