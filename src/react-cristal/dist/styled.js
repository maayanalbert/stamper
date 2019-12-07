import styled from 'styled-components';

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

export var minWidth = 10;
export var minHeight = 10;
export var padding = 10;
var wrapperStyles = function (_a) {
    var isActive = _a.isActive;
    if (isActive) {
        return "\n      \n    ";
    }
    return "opacity: 1;";
};
export var Wrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  ", "\n position: fixed;\n  display: inline-flex;\n  flex-direction: column;\n  background: white;\n  min-width: ", "px;\n  min-height: ", "px;\n  user-select: none;\n"], ["\n  ", "\n  position: fixed;\n  display: inline-flex;\n  flex-direction: column;\n  background: white;\n  min-width: ", "px;\n  min-height: ", "px;\n  user-select: none;\n"])), wrapperStyles, minWidth, minHeight);
export var Header = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  height: 30px;\n  border-bottom: 1px solid rgb(215,215,215);\n  cursor: ", ";\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding-left: ", "px;\n"], ["\n  height: 30px;\n  border-bottom: 1px solid #ccc;\n  cursor: ", ";\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding-left: ", "px;\n"])), function (_a) {
    var isDraggable = _a.isDraggable;
    return isDraggable ? "-webkit-grab" : "default";
}, padding);
export var BottomRightResizeHandle = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  width: 20px;\n  height: 20px;\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  cursor: nwse-resize;\n"], ["\n  width: 20px;\n  height: 20px;\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  cursor: nwse-resize;\n"])));
export var ContentWrapper = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject([" \n  padding: ", "px;\n"], ["\n  padding: ", "px;\n"])), padding);

export var CloseIcon = styled.img(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  position: relative;\n  width: 15px;\n  height: 15px;\n margin-left:12px;\n  opacity: 0.3;\n  cursor: auto;\n\n  &:hover {\n    opacity: 1;\n  }\n\n  &:before, &:after {\n    position: absolute;\n    right: 60px;\n    content: ' ';\n    height: 21px;\n    width: 2px;\n    background-color: #333;\n  }\n\n  &:before {\n    transform: rotate(45deg);\n  }\n\n  &:after {\n    transform: rotate(-45deg);\n  }\n"], ["\n  position: relative;\n  width: 20px;\n  height: 20px;\n  opacity: 0.3;\n  cursor: pointer;\n\n  &:hover {\n    opacity: 1;\n  }\n\n  &:before, &:after {\n    position: absolute;\n    right: 30px;\n    content: ' ';\n    height: 21px;\n    width: 2px;\n    background-color: #333;\n  }\n\n  &:before {\n    transform: rotate(45deg);\n  }\n\n  &:after {\n    transform: rotate(-45deg);\n  }\n"])));
export var CopyIcon = styled.img(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  position: relative;\n  width: 17px;\n  height: 17px;\n  opacity: 0.3;\n  cursor: auto;\n\n  &:hover {\n    opacity: 1;\n  }\n\n  &:before, &:after {\n    position: absolute;\n    right: 40px;\n    content: ' ';\n    height: 21px;\n    width: 2px;\n    background-color: #FF0000;\n  }\n\n  &:before {\n    transform: rotate(45deg);\n  }\n\n  &:after {\n    transform: rotate(-45deg);\n  }\n"], ["\n  position: relative;\n  width: 20px;\n  height: 20px;\n  opacity: 0.3;\n  cursor: pointer;\n\n  &:hover {\n    opacity: 1;\n  }\n\n  &:before, &:after {\n    position: absolute;\n    right: 40px;\n    content: ' ';\n    height: 21px;\n    width: 2px;\n    background-color: #333;\n  }\n\n  &:before {\n    transform: rotate(45deg);\n  }\n\n  &:after {\n    transform: rotate(-45deg);\n  }\n"])));

export var Title = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  white-space: nowrap;\n  max-width: calc(100% - 25px);\n  overflow: hidden;\n  text-overflow: ellipsis;\n"], ["\n  white-space: nowrap;\n  max-width: calc(100% - 25px);\n  overflow: hidden;\n  text-overflow: ellipsis;\n"])));
export var RightResizeHandle = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  width: 20px;\n  height: calc(100% - 50px);\n  position: absolute;\n  bottom: 20px;\n  right: 0;\n  cursor: ew-resize;\n"], ["\n  width: 20px;\n  height: calc(100% - 50px);\n  position: absolute;\n  bottom: 20px;\n  right: 0;\n  cursor: ew-resize;\n"])));
export var BottomResizeHandle = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  width: calc(100% - 40px);\n  height: 20px;\n  position: absolute;\n  bottom: 0;\n  left: 20px;\n  cursor: ns-resize;\n"], ["\n  width: calc(100% - 40px);\n  height: 20px;\n  position: absolute;\n  bottom: 0;\n  left: 20px;\n  cursor: ns-resize;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8,templateObject_9;
