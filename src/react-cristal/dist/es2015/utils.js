import { minHeight, minWidth, padding } from "./styled";
var defaultSize = { width: minWidth, height: minHeight };
export var getBoundaryCoords = function (coords, size) {
    if (size === void 0) { size = defaultSize; }
    var x = coords.x, y = coords.y;
    var width = size.width, height = size.height;
    var innerWidth = window.innerWidth, innerHeight = window.innerHeight;
    var maxX = innerWidth - (width || 0) - padding;
    var maxY = innerHeight - (height || 0) - padding;
    return {
        x: Math.min(Math.max(x, padding), maxX),
        y: Math.min(Math.max(y, padding), maxY)
    };
};
export var getCordsFromInitialPosition = function (initialPosition, size) {
    if (size === void 0) { size = defaultSize; }
    var innerWidth = window.innerWidth, innerHeight = window.innerHeight;
    var width = size.width, height = size.height;
    var xCenter = (innerWidth / 2) - (width / 2);
    var yCenter = (innerHeight / 2) - (height / 2);
    switch (initialPosition) {
        case 'top-left':
        default:
            return { x: 10, y: 10 };
        case 'top-center':
            return { x: xCenter, y: 10 };
        case 'bottom-center':
            return { x: xCenter, y: Infinity };
        case 'top-right':
            return { x: Infinity, y: 10 };
        case 'bottom-left':
            return { x: 10, y: Infinity };
        case 'bottom-right':
            return { x: Infinity, y: Infinity };
        case 'center':
            return { x: xCenter, y: yCenter };
    }
};

export var isInView = function(coords, size){
    var x = coords.x, y = coords.y;
    var width = size.width, height = size.height;
    var innerWidth = window.innerWidth, innerHeight = window.innerHeight;
    var left = x, right = x + width, top = y, bottom = y + height;

    var result = left < innerWidth && right > 0 && bottom > 0 && top < innerHeight
    return result
}
