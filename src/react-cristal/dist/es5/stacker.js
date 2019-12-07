"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Stacker = (function () {
    function Stacker() {
    }
    Stacker.getNextIndex = function (index) {
        if (index === Stacker.maxIndex) {
            return index;
        }
        Stacker.maxIndex++;
        return Stacker.maxIndex;
    };
    Stacker.maxIndex = 100;
    return Stacker;
}());
exports.Stacker = Stacker;
