"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var styled_1 = require("./styled");
var defaultSize = { width: styled_1.minWidth, height: styled_1.minHeight };
exports.getBoundaryCoords = function (coords, size) {
    if (size === void 0) { size = defaultSize; }
    var x = coords.x, y = coords.y;
    var width = size.width, height = size.height;
    var innerWidth = window.innerWidth, innerHeight = window.innerHeight;
    var maxX = innerWidth - (width || 0) - styled_1.padding;
    var maxY = innerHeight - (height || 0) - styled_1.padding;
    return {
        x: Math.min(Math.max(x, styled_1.padding), maxX),
        y: Math.min(Math.max(y, styled_1.padding), maxY)
    };
};
exports.getCordsFromInitialPosition = function (initialPosition, size) {
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
