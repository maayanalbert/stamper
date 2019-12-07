import * as React from 'react';
import { Component } from 'react';

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var CristalHeader = (function (_super) {
    __extends(CristalHeader, _super);
    function CristalHeader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CristalHeader.prototype.render = function () {
        return React.createElement("div", null, "Custom header");
    };
    return CristalHeader;
}(Component));
export { CristalHeader };
