import * as React from "react";
import * as ReactDOM from "react-dom";
import { Component } from "react";
import {
  Wrapper,
  Header,
  BottomRightResizeHandle,
  BottomLeftResizeHandle,
  RightResizeHandle,
  BottomResizeHandle,
  LeftResizeHandle,
  ContentWrapper,
  padding,
  Title,
  minWidth,
  minHeight
} from "./styled";
import { isSmartPosition } from "./domain";
import {
  getCordsFromInitialPosition,
  getBoundaryCoords,
  isInView
} from "./utils";
import { Stacker } from "./stacker";
import styled from "styled-components";


import "./../../../App.scss";
import $ from "jquery";
import pf, { globals, p5Lib } from "./../../../globals.js";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { ArcherContainer, ArcherElement } from "react-archer";


var userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(" electron/") > -1) {
  const electron = window.require("electron");
  var ipc = electron.ipcRenderer;
} else {
  var ipc = false;
}

var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function(d, b) {
          d.__proto__ = b;
        }) ||
      function(d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();

var Cristal = (function(_super) {
  __extends(Cristal, _super);
  function Cristal() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;

    if (_this.props.zIndex) {
      var zIndex = _this.props.zIndex;
      Stacker.updateMaxIndex(zIndex);
    } else {
      var zIndex = Stacker.getNextIndex();
    }

    _this.state = {
      x: padding,
      y: padding,
      isDragging: false,
      isResizingX: false,
      isResizingY: false,
      isResizingXLeft: false,
      zIndex: zIndex,
      downKey: -1,
      isMoving: false,
      originalHeight: null,
      ghostX: 0,
      ghostY: 0
    };

    _this.opt = 18;
    _this.cmd = 91;
    _this.ctrl = 17;
    _this.plus = 187;
    _this.minus = 189;
    _this.zero = 48;
    _this.space = 32;
    _this.onWindowResize = function() {
      var _a = _this.state,
        x = _a.x,
        y = _a.y,
        width = _a.width,
        height = _a.height;
      var size = width && height ? { width: width, height: height } : undefined;
      var _b = getBoundaryCoords({ x: x, y: y }, size),
        newX = _b.x,
        newY = _b.y;
      _this.setState({
        x: newX,
        y: newY
      });
    };
    _this.saveWrapperRef = function(el) {
      _this.childrenElement = el;
      if (!_this.childrenElement) return;
      var initialSize = _this.props.initialSize;
      var width, height;
      if (initialSize) {
        var rect = _this.childrenElement.getBoundingClientRect();
        if (initialSize.width) {
          width = initialSize.width;
        } else {
          width = rect.width;
        }
        if (initialSize.height) {
          height = initialSize.height;
        } else {
          height = rect.height;
        }
      } else {
        var rect = _this.childrenElement.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
      }

      _this.setState({ width: width, height: height, originalHeight: height });
      _this.setInitialPosition({ width: width, height: height });

    };
    _this.setInitialPosition = function(size) {
     
      var initialPosition = _this.props.initialPosition;

      if (!initialPosition) return;
      var cords;
      if (isSmartPosition(initialPosition)) {
        cords = getCordsFromInitialPosition(initialPosition, size);
      } else {
        cords = initialPosition;
      }
      // var _a = getBoundaryCoords(cords, size),
      //   x = _a.x,
      //   y = _a.y;
      _this.setState({ x: cords.x, y: cords.y });
    };
    _this.saveHeaderRef = function(el) {
      _this.headerElement = el;
    };

    _this.onKeyDown = function(e) {
      if (
        _this.state.downKey === _this.cmd ||
        _this.state.downKey === _this.ctrl
      ) {
        if (e.keyCode === _this.zero) {
          e.preventDefault();
        } else if (e.keyCode === _this.plus) {
          e.preventDefault();
        } else if (e.keyCode === _this.minus) {
          e.preventDefault();
        }
      } else {
        _this.setState({ downKey: e.keyCode });
      }
    };

    _this.onKeyUp = function(e) {
      if (e.keyCode === _this.state.downKey) {
        _this.setState({ downKey: -1 });
      }
    };

    _this.onMouseDown = function() {
      var isDraggable = _this.props.isDraggable;
      if (!isDraggable) return;

      _this.setState({
        isDragging: true
      });
    };

    _this.manualResize = function(widthDiff, heightDiff) {
      var width = _this.state.width,
        height = _this.state.height;

      _this.setState({ width: width + widthDiff, height: height + heightDiff });
    };

    _this.manualSetSize = function(width, height) {
      _this.setState({ width: width, height: height });
    };

    _this.onWheel = function(e) {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    _this.getPosition = function(movementX, movementY) {
      var scale = _this.props.getScale();
      var newX = _this.state.ghostX + movementX;
      var newY = _this.state.ghostY + movementY;

      this.setState({ ghostX: newX, ghostY: newY });
      var snapMargin = _this.props.getSnapMargin();
      if (snapMargin === 0) {
        return { x: newX, y: newY };
      } else {
        var roundX = Math.round(newX / snapMargin) * snapMargin;
        var roundY = Math.round(newY / snapMargin) * snapMargin;
        return { x: roundX, y: roundY };
      }
    };

    _this.getDimensions = function(widthDiff, heightDiff, changeX) {
      var newWidth = _this.state.ghostX + widthDiff;
      var newHeight = _this.state.ghostY + heightDiff;
      var oldAbsX = _this.state.x + _this.state.width;
      var oldAbsY = _this.state.y + _this.state.height;
      var newAbsX = _this.state.x + newWidth;
      var newAbsY = _this.state.y + newHeight;

      if (changeX) {
        oldAbsX = _this.state.x;
        newAbsX = _this.state.ghostX - widthDiff;
      }

      var ghostX = Math.max(newWidth, minWidth);
      if (changeX) {
        ghostX = _this.state.ghostX - widthDiff;
      }
      var ghostY = Math.max(newHeight, minHeight);
      var onResize = _this.props.onResize;

      var snapMargin = _this.props.getSnapMargin();
      if (snapMargin === 0) {
        var resizeBlocked = onResize(
          widthDiff,
          heightDiff,
          _this.state.x,
          false
        );
        if (!resizeBlocked) {
          this.setState({ ghostX: ghostX, ghostY: ghostY });
          return { widthDiff: widthDiff, heightDiff: heightDiff };
        }
      } else {
        var roundAbsX = Math.round(newAbsX / snapMargin) * snapMargin;
        var roundAbsY = Math.round(newAbsY / snapMargin) * snapMargin;

        var sendingWidthDiff = 0;
        var sendingHeightDiff = 0;
        if (widthDiff != 0) {
          sendingWidthDiff = roundAbsX - oldAbsX;
        }
        if (heightDiff != 0) {
          sendingHeightDiff = roundAbsY - oldAbsY;
        }

        if (changeX) {
          sendingWidthDiff = -sendingWidthDiff;
        }

        var resizeBlocked = onResize(
          sendingWidthDiff,
          sendingHeightDiff,
          _this.state.x,
          false
        );

        if (!resizeBlocked) {
          this.setState({ ghostX: ghostX, ghostY: ghostY });
          return { widthDiff: sendingWidthDiff, heightDiff: sendingHeightDiff };
        }
      }

      return { widthDiff: 0, heightDiff: 0 };
    };

    _this.onMouseMove = function(e) {
      var isResizing = _this.isResizing;
      var scale = _this.props.getScale();
      var _a = _this.state,
        isDragging = _a.isDragging,
        currentX = _a.x,
        currentY = _a.y,
        currentWidth = _a.width,
        currentHeight = _a.height;
      var movementX = e.movementX,
        movementY = e.movementY;
      var innerWidth = window.innerWidth,
        innerHeight = window.innerHeight;

      if (isDragging) {
        window.postMessage({ type: "edited" }, "*");
        var size =
          currentWidth && currentHeight
            ? { width: currentWidth, height: currentHeight }
            : undefined;

        _this.onStartMove(() => {
          if (_this.state.downKey === _this.space) {
            return;
          }
          var newPosition = _this.getPosition(
            movementX / scale,
            movementY / scale
          );
          var newX = newPosition.x;
          var newY = newPosition.y;

          _this.setState({ x: newX, y: newY });
        });

        // _this.setState({ x: newX, y: newY }, _this.onStartMove);
        return;
      } else if (isResizing) {
        window.postMessage({ type: "edited" }, "*");
        _this.resizeCristal(e);
      }
    };

    _this.resizeCristal = function(e) {
      var isResizing = _this.isResizing;
      var scale = _this.props.getScale();
      var _a = _this.state,
        isDragging = _a.isDragging,
        currentX = _a.x,
        currentY = _a.y,
        currentWidth = _a.width,
        currentHeight = _a.height;
      var movementX = e.movementX / scale,
        movementY = e.movementY / scale;
      var innerWidth = window.innerWidth,
        innerHeight = window.innerHeight;
      var newX = currentX + movementX;
      var newY = currentY + movementY;
      var _c = _this.state,
        isResizingX = _c.isResizingX,
        isResizingY = _c.isResizingY,
        isResizingXLeft = _c.isResizingXLeft;

      var height = currentHeight;
      var width = currentWidth;
      var x = currentX;

      var widthDiff = 0;
      var heightDiff = 0;
      var changeX = false;

      if (isResizingX) {
        widthDiff = movementX;
        // var width = Math.max(newWidth, minWidth);
      }
      if (isResizingXLeft) {
        widthDiff = -movementX;
        changeX = true;

        // var width = Math.max(newWidth, minWidth);
        // var x = currentX + movementX;
      }
      if (isResizingY) {
        heightDiff = movementY;
        // var height = Math.max(newHeight, minHeight);
      }

      _this.notifyResize(widthDiff, heightDiff, changeX);
    };

    _this.onStoppedMove = function() {
      if (this.state.isMoving) {
        _this.notifyStopMove();
      }

      _this.setState({ isMoving: false });
    };

    _this.onStartMove = function(callBack) {
      _this.notifyMove();
      if (_this.state.isMoving === false) {
        _this.setState({ ghostX: _this.state.x, ghostY: _this.state.y }, () => {
          _this.setState({ isMoving: true }, () => callBack());
        });
        _this.notifyStartMove();
        if (_this.state.downKey === _this.opt) {
          _this.notifyOptMove();
        }
      } else {
        callBack();
      }
    };
    _this.notifyMove = function() {
      var onMove = _this.props.onMove;
      onMove && onMove(_this.state);
    };
    _this.notifyZChange = function() {
      var onZChange = _this.props.onZChange;
      onZChange && onZChange(_this.state);
    };
    _this.notifyResize = function(widthDiff, heightDiff, changeX) {
      var onResize = _this.props.onResize;
      // var heightDiff = newHeight - _this.state.height;
      // var widthDiff = newWidth - _this.state.width;
      var resizeBlocked = false;

      var dimensions = this.getDimensions(widthDiff, heightDiff, changeX);

      widthDiff = dimensions.widthDiff;
      heightDiff = dimensions.heightDiff;
      var newHeight = Math.max(_this.state.height + heightDiff, minHeight);
      var newWidth = Math.max(_this.state.width + widthDiff, minWidth);
      var newX = _this.state.x;
      if (changeX) {
        newX -= widthDiff;
      }
      onResize(widthDiff, heightDiff, _this.state.x, true);
      _this.setState({ height: newHeight, width: newWidth, x: newX });
    };

    _this.notifyStartMove = function() {
      var onStartMove = _this.props.onStartMove;
      onStartMove && onStartMove(_this.state);
    };
    _this.notifyStopMove = function() {
      var onStopMove = _this.props.onStopMove;
      onStopMove && onStopMove(_this.state);
    };
    _this.notifyOptMove = function() {
      var onOptMove = _this.props.onOptMove;
      onOptMove && onOptMove(_this.state);
    };
    _this.notifyStartResize = function() {
      var onStartResize = _this.props.onStartResize;
      onStartResize && onStartResize(_this.state);
    };
    _this.notifyStopResize = function() {
      var onStopResize = _this.props.onStopResize;
      onStopResize && onStopResize(_this.state);
    };

    _this.onMouseUp = function() {
      _this.onStoppedMove();
      if (
        _this.state.isResizingY ||
        _this.state.isResizingX ||
        _this.state.isResizingXLeft
      ) {
        _this.notifyStopResize();
      }
      _this.setState({
        isDragging: false,
        isResizingX: false,
        isResizingXLeft: false,
        isResizingY: false,
        mouseIsDown: false
      });
    };
    _this.startFullResize = function() {
      _this.setState({ ghostX: _this.state.width, ghostY: _this.state.height });
      _this.notifyStartResize();
      _this.setState({
        isResizingX: true,
        isResizingY: true
      });
    };
    _this.startFullLeftResize = function() {
      _this.setState({ ghostX: _this.state.width, ghostY: _this.state.height });
      _this.notifyStartResize();
      _this.setState({
        isResizingXLeft: true,
        isResizingY: true
      });
    };
    _this.startXResize = function() {
      _this.setState({ ghostX: _this.state.width, ghostY: _this.state.height });
      _this.notifyStartResize();
      return _this.setState({ isResizingX: true });
    };
    _this.startXLeftResize = function() {
      _this.setState({ ghostX: _this.state.x, ghostY: _this.state.height });
      _this.notifyStartResize();
      return _this.setState({ isResizingXLeft: true });
    };
    _this.startYResize = function() {
      _this.setState({ ghostX: _this.state.width, ghostY: _this.state.height });
      _this.notifyStartResize();
      return _this.setState({ isResizingY: true });
    };
    _this.renderResizeHandles = function() {
      var isResizable = _this.props.isResizable;

      if (!isResizable) return;

      var scale = _this.props.getScale();
      var height = _this.state.height;
      var width = _this.state.width;
      var thickness = 5;
      var color = "transparent";
      return [
        React.createElement(RightResizeHandle, {
          key: "right-resize",
          onMouseDown: _this.startXResize,
          style: {
            background: color,
            right: -thickness / 2,
            width: thickness / scale,
            bottom: thickness / scale,
            height: height - 30 - thickness / scale
          }
        }),
        React.createElement(LeftResizeHandle, {
          key: "left-resize",
          onMouseDown: _this.startXLeftResize,
          style: {
            background: color,
            left: -thickness / 2,
            width: thickness / scale,
            bottom: thickness / scale,
            height: height - 30 - thickness / scale
          }
        }),
        React.createElement(BottomRightResizeHandle, {
          key: "bottom-right-resize",
          onMouseDown: _this.startFullResize,
          style: {
            background: color,
            right: -thickness / 2,
            bottom: -thickness / 2,
            width: thickness / scale,
            height: thickness / scale
          }
        }),
        React.createElement(BottomLeftResizeHandle, {
          key: "bottom-left-resize",
          onMouseDown: _this.startFullLeftResize,
          style: {
            background: color,
            left: -thickness / 2,
            bottom: -thickness / 2,
            width: thickness / scale,
            height: thickness / scale
          }
        }),
        React.createElement(BottomResizeHandle, {
          key: "bottom-resize",
          onMouseDown: _this.startYResize,
          style: {
            background: color,
            bottom: -thickness / 2,
            height: thickness / scale,
            left: thickness / scale,
            width: width - (2 * thickness) / scale
          }
        })
      ];
    };

    _this.changeZIndex = function() {
      var zIndex = _this.state.zIndex;
      _this.setState(
        {
          zIndex: Stacker.getNextIndex(zIndex)
        },
        _this.notifyZChange
      );
    };

    return _this;
  }
  Cristal.prototype.componentDidMount = function() {
    document.addEventListener("mousedown", this.onGlobalMouseDown);
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
    document.addEventListener("wheel", this.onWheel, { passive: false });
    var iframeElem = document.getElementById("iframe" + this.props.parentID);
    if (iframeElem) {
      iframeElem.addEventListener("wheel", e => console.log(e));
    }

    this.notifyZChange();
    // window.addEventListener('resize', this.onWindowResize);
  };
  Cristal.prototype.componentWillUnmount = function() {
    document.removeEventListener("mousedown", this.onGlobalMouseDown);
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
    document.removeEventListener("wheel", this.onWheel);

    // window.removeEventListener('resize', this.onWindowResize);
  };

  Object.defineProperty(Cristal.prototype, "isResizing", {
    get: function() {
      var _a = this.state,
        isResizingX = _a.isResizingX,
        isResizingY = _a.isResizingY,
        isResizingXLeft = _a.isResizingXLeft;
      return isResizingX || isResizingY || isResizingXLeft;
    },
    enumerable: true,
    configurable: true
  });

  function createIcon(
    _this,
    iconType,
    hiddenFlag = false,
    classVal = "",
    callBack = null,
    tooltipText
  ) {
    if (hiddenFlag) {
      return null;
    }

    var uniqueClass = classVal + _this.props.parentID.toString();
    var mouseOverCallback = () => {
      $("." + uniqueClass).css({ opacity: "1" });
    };

    var mouseOutCallback = () => {
      $("." + uniqueClass).css({ opacity: globals.iconOpacity });
    };
    var opacity = globals.iconOpacity;
    if (!callBack) {
      mouseOverCallback = () => {};
      mouseOutCallback = () => {};
      opacity = opacity * 0.5;
    }

    var icon = React.createElement("img", {
      onClick: callBack,
      style: {
        opacity: opacity,
        height: globals.iconSize,
        width: globals.iconSize
      },
      className: "text-greyIcon m-1 " + uniqueClass,
      onMouseOver: mouseOverCallback,
      onMouseOut: mouseOutCallback,
      src: iconType
    });

    if (!tooltipText) {
      return icon;
    }
    return (
      <div onMouseOver={mouseOverCallback} onMouseOut={mouseOutCallback}>
        <OverlayTrigger
          trigger="hover"
          placement="top"
          overlay={
            <Tooltip id="alert" className="picker" style={{ fontSize: 12,   "font-family": "Montserrat, sans-serif",
  "font-weight": 300}}>
              {tooltipText}
            </Tooltip>
          }
        >
          {icon}
        </OverlayTrigger>
      </div>
    );
  }

  Object.defineProperty(Cristal.prototype, "header", {
    get: function() {
      var _a = this.props,
        title = _a.title,
        isDraggable = _a.isDraggable,
        onClose = _a.onClose,
        closeHidden = _a.closeHidden,
        onCopy = _a.onCopy,
        copyHidden = _a.copyHidden;

      var closeBtn = createIcon(
        this,
        globals.DeleteStampIcon,
        closeHidden,
        "mouseOnClose",
        onClose,
        "delete stamp"
      );
      var copyBtn = createIcon(
        this,
        globals.CopyIcon,
        copyHidden,
        "mouseOnCopy",
        onCopy,
        "copy stamp"
      );
      var clearBtn = createIcon(
        this,
        globals.ClearConsoleIcon,
        !_a.showClear,
        "mousOnClear",
        _a.onClear,
        "clear console"
      );

      if (_a.onMinimize) {
        var minimizeBtn = createIcon(
          this,
          globals.MinimzeIcon,
          _a.onMinimize === null,
          "mouseOnMinimize",
          _a.onMinimize
        );
      }

      var titleIcon = null;
      if (this.props.icon) {
        var titleIcon = createIcon(this, this.props.icon);
      }

      var makeBigIcon = createIcon(
        this,
        globals.CodeSizeIcon,
        !_a.showCodeSize,
        "mouseOnBig",
        _a.onCodeSize,
        "toggle text size"
      );

      var sideButtons = (
        <div
          class="row mt-1"
          style={{ position: "absolute", cursor: "auto", right: 18, top: 0 }}
        >
          {makeBigIcon}
          {copyBtn}
          {closeBtn}
          {clearBtn}
          {minimizeBtn}
        </div>
      );

      return React.createElement(
        Header,
        {
          className: "bg-white rounded-top",
          isDraggable: isDraggable,
          ref: this.saveHeaderRef,
          onMouseDown: this.onMouseDown
        },
        titleIcon,
        sideButtons
      );
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Cristal.prototype, "content", {
    get: function() {
      var children = this.props.children;
      return React.createElement(ContentWrapper, {}, children);
    },
    enumerable: true,
    configurable: true
  });
  Cristal.prototype.render = function() {
    var isResizing = this.isResizing;
    var _a = this.state,
      x = _a.x,
      y = _a.y,
      width = _a.width,
      height = _a.height,
      isDragging = _a.isDragging,
      zIndex = _a.zIndex;
    var className = this.props.className;
    var isActive = isDragging || isResizing;
    var style = {
      left: x,
      top: y,
      margin:0,
      width: width,
      height: height,
      zIndex: zIndex,
      position: "absolute",
      border: this.props.border,
      outline: this.props.outline
    };

    var HeaderComponent = this.header;
    var ContentComponent = this.content;
    if (this.props.headerHidden) {
      HeaderComponent = null;
    }

    if(this.props.lineData){
      var lineData = this.props.lineData
    }else{
      var lineData = []
    }

    // var lineRelations = []
    // for(var i = 0; i < lineData.length; i++){
    //   var line = lineData[i]
    //   var targetAnchor;
    //   var sourceAnchor;
    //   var sourceX = x
    //   var sourceY = y
    //   var targetX = $("#vertex_" + line.end).css("left")
    //   var targetY = $("#vertex_" + line.end).css("top")

    //   // console.log(targetX)

    //   lineRelations.push( {
    //     targetId: "line_" + line.end,
    //     targetAnchor: "top",
    //     sourceAnchor: "bottom"
    //   })
    // }


    var lineRelations = lineData.map(line => {
      var targetAnchor;
      var sourceAnchor;
      var sourceX = x + width/2
      var sourceY = y + height/2
      var targetX = parseInt($("#vertex_" + line.end).css("left"), 10) + parseInt($("#vertex_" + line.end).css("width"), 10)/2 
      var targetY = parseInt($("#vertex_" + line.end).css("top"), 10)+ parseInt($("#vertex_" + line.end).css("height"), 10)/2 

      var xDiff = sourceX - targetX
      var yDiff = sourceY - targetY

      if(!targetX){
        return null
      }
  

      if(Math.abs(yDiff) > Math.abs(xDiff)){
        if(yDiff > 0){
          targetAnchor = "bottom"
          sourceAnchor = "top"
        }else{
          targetAnchor = "top"
          sourceAnchor = "bottom"
        }
      }else{
        if(xDiff < 0){
          targetAnchor = "left"
          sourceAnchor = "right"
        }else{
          targetAnchor = "right"
          sourceAnchor = "left"
        }
      }


      return {
        targetId: "line_" + line.end,
        targetAnchor: targetAnchor,
        sourceAnchor: sourceAnchor,
        label:line.label,
        style:line.style
      };
    });

    lineRelations = lineRelations.filter(line => line)

if(this.props.getLinesOn()){
    var allContent = (
          <ArcherElement
            id={"line_" + this.props.parentID}
            relations={lineRelations}
          >
      {HeaderComponent}
      {ContentComponent}
          </ArcherElement>

    )
}else{
  var allContent = (<div>      {HeaderComponent}
      {ContentComponent}</div>)
}


    var cristalComponent = React.createElement(
      Wrapper,
      {
        id:"vertex_" + this.props.parentID,
        style: style,
        ref: this.saveWrapperRef,
        isActive: isActive,
        className: className + " rounded " + this.props.wrapperName,
        onMouseDown: this.changeZIndex,
        overflow: "hidden"
      },
      allContent,
      this.renderResizeHandles()
    );



    return cristalComponent

  };
  Cristal.defaultProps = {
    children: null,
    isResizable: true,
    isDraggable: true
  };
  return Cristal;
})(Component);
export { Cristal };
