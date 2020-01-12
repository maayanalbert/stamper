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
     Stacker.updateMaxIndex = function (index) {
        Stacker.maxIndex = Math.max(Stacker.maxIndex, index)
    };
    Stacker.maxIndex = 100;
    return Stacker;
}());
export { Stacker };
