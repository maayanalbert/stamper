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
import DeleteStampIcon from "./../../../icons/trash.svg";
import CopyIcon from "./../../../icons/copy.svg";
import ClearConsoleIcon from "./../../../icons/slash.svg";
import CodeSizeIcon from "./../../../icons/type.svg";
import MinimzeIcon from "@material-ui/icons/MinimizeOutlined";
import "./../../../App.scss";
import $ from "jquery";
import pf, { globals, p5Lib } from "./../../../globals.js";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";


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
    _this.state = {
      x: padding,
      y: padding,
      isDragging: false,
      isResizingX: false,
      isResizingY: false,
      isResizingXLeft: false,
      zIndex: Stacker.getNextIndex(),
      downKey: -1,
      isMoving: false,
      originalHeight: null,
    };

    _this.opt = 18;
    _this.cmd = 91
    _this.ctrl = 17
    _this.plus = 187
    _this.minus = 189
    _this.zero = 48
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
        if(initialSize.width){
          width = initialSize.width
        }else{
          width = rect.width;
        }
        if(initialSize.height){
          height = initialSize.height
        }else{
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


      if(_this.state.downKey === _this.cmd || _this.state.downKey === _this.ctrl){
  
        if(e.keyCode === _this.zero){
           e.preventDefault()
        }else if(e.keyCode === _this.plus){
           e.preventDefault()
        }else if(e.keyCode === _this.minus){
           e.preventDefault()
        }
      }else{
        _this.setState({ downKey: e.keyCode });

      }
 
    };



    _this.onKeyUp = function(e) {
      if(e.keyCode === _this.state.downKey){
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

    _this.manualResize = function(widthDiff, heightDiff){

 
        var width = _this.state.width, height = _this.state.height, originalHeight = _this.state.originalHeight

        _this.setState({width:width+widthDiff})
    }

  _this.onWheel = function(e){
    if(e.ctrlKey){
      e.preventDefault()
    }
  }

    _this.onMouseMove = function(e) {
      var isResizing = _this.isResizing;
     var scale = _this.props.getScale()
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
      var newX = currentX + movementX/scale;
      var newY = currentY + movementY/scale;
 

      if (isDragging) {
        ipc && ipc.send("edited");
        var size =
          currentWidth && currentHeight
            ? { width: currentWidth, height: currentHeight }
            : undefined;
        var _b = getBoundaryCoords({ x: newX, y: newY }, size),
          x = _b.x,
          y = _b.y;
        _this.setState({ x: newX, y: newY }, _this.onStartMove);
        return;
      } else if (isResizing) {
        ipc && ipc.send("edited");
        _this.resizeCristal(e);
      }
    };

    _this.resizeCristal = function(e) {
      var isResizing = _this.isResizing;
        var scale = _this.props.getScale()
      var _a = _this.state,
        isDragging = _a.isDragging,
        currentX = _a.x,
        currentY = _a.y,
        currentWidth = _a.width,
        currentHeight = _a.height;
      var movementX = e.movementX/scale,
        movementY = e.movementY/scale;
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

      if (isResizingX) {
        var newWidth = (currentWidth || 0) + movementX;
        var width = Math.max(newWidth, minWidth);
      }
      if (isResizingXLeft) {
        var newWidth = (currentWidth || 0) - movementX;
        var width = Math.max(newWidth, minWidth);
        var x = currentX + e.movementX;
      }
      if (isResizingY) {
        var newHeight = (currentHeight || 0) + movementY;
        var height = Math.max(newHeight, minHeight);
      }

      _this.notifyResize(width, height, x);
    };

    _this.onStoppedMove = function() {
      if (this.state.isMoving) {
        _this.notifyStopMove();
      }

      _this.setState({ isMoving: false });
    };

    _this.onStartMove = function() {
      _this.notifyMove();
      if (_this.state.isMoving === false) {
        if (_this.state.downKey === _this.opt) {
        
          _this.notifyOptMove();
        }
      }
      _this.setState({ isMoving: true });
    };
    _this.notifyMove = function() {
      var onMove = _this.props.onMove;
      onMove && onMove(_this.state);
    };
    _this.notifyResize = function(newWidth, newHeight, newX) {
      var onResize = _this.props.onResize;
      var heightDiff = newHeight - _this.state.height;
      var widthDiff = newWidth - _this.state.width;
      var resizeBlocked = false;
      if (onResize) {
        var resizeBlocked = onResize(widthDiff, heightDiff);
      }
      if (!resizeBlocked) {
        _this.setState({ height: newHeight, width: newWidth, x: newX });
      }
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
      _this.notifyStartResize();
      _this.setState({
        isResizingX: true,
        isResizingY: true
      });
    };
    _this.startFullLeftResize = function() {
      _this.notifyStartResize();
      _this.setState({
        isResizingXLeft: true,
        isResizingY: true
      });
    };
    _this.startXResize = function() {
      _this.notifyStartResize();
      return _this.setState({ isResizingX: true });
    };
    _this.startXLeftResize = function() {
      _this.notifyStartResize();
      return _this.setState({ isResizingXLeft: true });
    };
    _this.startYResize = function() {
      _this.notifyStartResize();
      return _this.setState({ isResizingY: true });
    };
    _this.renderResizeHandles = function() {
      var isResizable = _this.props.isResizable;
      if (!isResizable) return;

      var scale = _this.props.getScale();
      var height = _this.state.height;
      var width = _this.state.width;
      return [
React.createElement(RightResizeHandle, {
          key: "right-resize",
          onMouseDown: _this.startXResize,
          style: {
            width: 20 / scale,
            bottom: 20 / scale,
            height: height - 30 - 20 / scale
          }
        }),
        React.createElement(LeftResizeHandle, {
          key: "left-resize",
          onMouseDown: _this.startXLeftResize,
          style: {
            width: 20 / scale,
            bottom: 20 / scale,
            height: height - 30 - 20 / scale
          }
        }),
        React.createElement(BottomRightResizeHandle, {
          key: "bottom-right-resize",
          onMouseDown: _this.startFullResize,
          style: { width: 20 / scale, height: 20 / scale }
        }),
        React.createElement(BottomLeftResizeHandle, {
          key: "bottom-left-resize",
          onMouseDown: _this.startFullLeftResize,
          style: { width: 20 / scale, height: 20 / scale }
        }),
        React.createElement(BottomResizeHandle, {
          key: "bottom-resize",
          onMouseDown: _this.startYResize,
          style: {
            height: 20 / scale,
            left: 20 / scale,
            width: width - (2 * 20) / scale
          }
        })
      ];
    };

    _this.changeZIndex = function() {
      var zIndex = _this.state.zIndex;
      _this.setState({
        zIndex: Stacker.getNextIndex(zIndex)
      });
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

    var uniqueClass = classVal +  _this.props.parentID.toString()
    var mouseOverCallback = () => {
      $("." + uniqueClass).css({opacity: "1"})
    };

    var mouseOutCallback = () => {
      $("." + uniqueClass).css({opacity: globals.iconOpacity})
    };
    var opacity = globals.iconOpacity
    if (!callBack) {
      mouseOverCallback = () => {};
      mouseOutCallback = () => {};
      opacity = globals.iconOpacity
    }


    var icon = React.createElement("img", {
      onClick: callBack,
      style: { opacity: opacity, height: globals.iconSize, width: globals.iconSize },
      className: "text-greyIcon m-1 " + uniqueClass ,
      onMouseOver: mouseOverCallback,
      onMouseOut: mouseOutCallback, 
      src:iconType
    });

    if(!tooltipText){
      return icon
    }
        return (
        <div     onMouseOver={mouseOverCallback} onMouseOut={mouseOutCallback}     >
        <OverlayTrigger 
          trigger="hover"
          placement="top"

          overlay={
            <Tooltip id="alert" className="picker" style={{fontSize:12}}
                     >
              {tooltipText}
            </Tooltip>
            
          }
        >
          {icon}
        </OverlayTrigger></div>)
   


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
        DeleteStampIcon,
        closeHidden,
        "mouseOnClose",
        onClose,
        "delete stamp"
      );
      var copyBtn = createIcon(
        this,
        CopyIcon,
        copyHidden,
        "mouseOnCopy",
        onCopy,
        "copy stamp"
      );
      var clearBtn = createIcon(
        this,
        ClearConsoleIcon,
        !_a.showClear,
        "mousOnClear",
        _a.onClear,
        "clear console"
      );

      if(_a.onMinimize){
      var minimizeBtn = createIcon(
        this,
        MinimzeIcon,
        _a.onMinimize === null,
        "mouseOnMinimize",
        _a.onMinimize
      );        
      }

      var titleIcon = null;
      if (this.props.icon) {
        var titleIcon = createIcon(this, this.props.icon);
      }

      var makeBigIcon = createIcon(this, 
        CodeSizeIcon, 
        !_a.showMakeBig, "mouseOnBig",
         _a.onMakeBig,
         "toggle text size" )

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
      zIndex = _a.zIndex
    var className = this.props.className;
    var isActive = isDragging || isResizing;
    var style = {
      left: x,
      top: y,
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

    return React.createElement(
        Wrapper,
        {
          style: style,
          ref: this.saveWrapperRef,
          isActive: isActive,
          className: className + " rounded " + this.props.wrapperName,
          onMouseDown: this.changeZIndex
        },
        <div>{HeaderComponent}</div>,
        ContentComponent,
        this.renderResizeHandles()
      )
  };
  Cristal.defaultProps = {
    children: null,
    isResizable: true,
    isDraggable: true
  };
  return Cristal;
})(Component);
export { Cristal };
