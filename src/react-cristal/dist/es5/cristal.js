"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var react_1 = require("react");
var styled_1 = require("./styled");
var domain_1 = require("./domain");
var utils_1 = require("./utils");
var stacker_1 = require("./stacker");
var Cristal = (function (_super) {
    __extends(Cristal, _super);
    function Cristal() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            x: styled_1.padding,
            y: styled_1.padding,
            isDragging: false,
            isResizingX: false,
            isResizingY: false,
            zIndex: stacker_1.Stacker.getNextIndex()
        };
        _this.onWindowResize = function () {
            var _a = _this.state, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
            var size = width && height ? { width: width, height: height } : undefined;
            var _b = utils_1.getBoundaryCoords({ x: x, y: y }, size), newX = _b.x, newY = _b.y;
            _this.setState({
                x: newX,
                y: newY
            });
        };
        _this.saveWrapperRef = function (el) {
            _this.childrenElement = el;
            if (!_this.childrenElement)
                return;
            var initialSize = _this.props.initialSize;
            var width, height;
            if (initialSize) {
                width = initialSize.width;
                height = initialSize.height;
            }
            else {
                var rect = _this.childrenElement.getBoundingClientRect();
                width = rect.width;
                height = rect.height;
            }
            _this.setState({ width: width, height: height });
            _this.setInitialPosition({ width: width, height: height });
        };
        _this.setInitialPosition = function (size) {
            var initialPosition = _this.props.initialPosition;
            if (!initialPosition)
                return;
            var cords;
            if (domain_1.isSmartPosition(initialPosition)) {
                cords = utils_1.getCordsFromInitialPosition(initialPosition, size);
            }
            else {
                cords = initialPosition;
            }
            var _a = utils_1.getBoundaryCoords(cords, size), x = _a.x, y = _a.y;
            _this.setState({ x: x, y: y });
        };
        _this.saveHeaderRef = function (el) {
            _this.headerElement = el;
        };
        _this.onMouseDown = function () {
            var isDraggable = _this.props.isDraggable;
            if (!isDraggable)
                return;
            _this.setState({
                isDragging: true
            });
        };
        _this.onMouseMove = function (e) {
            var isResizing = _this.isResizing;
            var _a = _this.state, isDragging = _a.isDragging, currentX = _a.x, currentY = _a.y, currentWidth = _a.width, currentHeight = _a.height;
            var movementX = e.movementX, movementY = e.movementY;
            var innerWidth = window.innerWidth, innerHeight = window.innerHeight;
            var newX = currentX + movementX;
            var newY = currentY + movementY;
            if (isDragging) {
                var size = currentWidth && currentHeight ? { width: currentWidth, height: currentHeight } : undefined;
                var _b = utils_1.getBoundaryCoords({ x: newX, y: newY }, size), x = _b.x, y = _b.y;
                _this.setState({ x: x, y: y }, _this.notifyMove);
                return;
            }
            if (isResizing) {
                var _c = _this.state, isResizingX = _c.isResizingX, isResizingY = _c.isResizingY;
                if (isResizingX) {
                    var maxWidth = innerWidth - newX - styled_1.padding;
                    var newWidth = (currentWidth || 0) + movementX;
                    var width = newWidth > maxWidth ? currentWidth : newWidth;
                    _this.setState({ width: width }, _this.notifyResize);
                }
                if (isResizingY) {
                    var newHeight = (currentHeight || 0) + movementY;
                    var maxHeight = innerHeight - newY - styled_1.padding;
                    var height = newHeight > maxHeight ? currentHeight : newHeight;
                    _this.setState({ height: height }, _this.notifyResize);
                }
            }
        };
        _this.notifyMove = function () {
            var onMove = _this.props.onMove;
            onMove && onMove(_this.state);
        };
        _this.notifyResize = function () {
            var onResize = _this.props.onResize;
            if (onResize) {
                onResize(_this.state);
            }
        };
        _this.onMouseUp = function () {
            _this.setState({
                isDragging: false,
                isResizingX: false,
                isResizingY: false,
            });
        };
        _this.startFullResize = function () {
            _this.setState({
                isResizingX: true,
                isResizingY: true
            });
        };
        _this.startXResize = function () { return _this.setState({ isResizingX: true }); };
        _this.startYResize = function () { return _this.setState({ isResizingY: true }); };
        _this.renderResizeHandles = function () {
            var isResizable = _this.props.isResizable;
            if (!isResizable)
                return;
            return [
                React.createElement(styled_1.RightResizeHandle, { key: "right-resize", onMouseDown: _this.startXResize }),
                React.createElement(styled_1.BottomRightResizeHandle, { key: "bottom-right-resize", onMouseDown: _this.startFullResize }),
                React.createElement(styled_1.BottomResizeHandle, { key: "bottom-resize", onMouseDown: _this.startYResize }),
            ];
        };
        _this.changeZIndex = function () {
            var zIndex = _this.state.zIndex;
            _this.setState({
                zIndex: stacker_1.Stacker.getNextIndex(zIndex)
            });
        };
        return _this;
    }
    Cristal.prototype.componentDidMount = function () {
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
        window.addEventListener('resize', this.onWindowResize);
    };
    Cristal.prototype.componentWillUnmount = function () {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('resize', this.onWindowResize);
    };
    Object.defineProperty(Cristal.prototype, "isResizing", {
        get: function () {
            var _a = this.state, isResizingX = _a.isResizingX, isResizingY = _a.isResizingY;
            return isResizingX || isResizingY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cristal.prototype, "header", {
        get: function () {
            var _a = this.props, onClose = _a.onClose, title = _a.title, isDraggable = _a.isDraggable;
            return (React.createElement(styled_1.Header, { isDraggable: isDraggable, innerRef: this.saveHeaderRef, onMouseDown: this.onMouseDown },
                React.createElement(styled_1.Title, null, title),
                React.createElement(styled_1.CloseIcon, { onClick: onClose })));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cristal.prototype, "content", {
        get: function () {
            var children = this.props.children;
            return (React.createElement(styled_1.ContentWrapper, null, children));
        },
        enumerable: true,
        configurable: true
    });
    Cristal.prototype.render = function () {
        var isResizing = this.isResizing;
        var _a = this.state, x = _a.x, y = _a.y, width = _a.width, height = _a.height, isDragging = _a.isDragging, zIndex = _a.zIndex;
        var className = this.props.className;
        var isActive = isDragging || isResizing;
        var style = {
            left: x,
            top: y,
            width: width,
            height: height,
            zIndex: zIndex
        };
        var HeaderComponent = this.header;
        var ContentComponent = this.content;
        return ReactDOM.createPortal(React.createElement(styled_1.Wrapper, { style: style, innerRef: this.saveWrapperRef, isActive: isActive, className: className, onMouseDown: this.changeZIndex },
            HeaderComponent,
            ContentComponent,
            this.renderResizeHandles()), document.body);
    };
    Cristal.defaultProps = {
        children: null,
        isResizable: true,
        isDraggable: true
    };
    return Cristal;
}(react_1.Component));
exports.Cristal = Cristal;
