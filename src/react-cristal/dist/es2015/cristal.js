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
  CloseIcon,
  Title,
  CopyIcon, minWidth, minHeight
} from "./styled";
import { isSmartPosition } from "./domain";
import {
  getCordsFromInitialPosition,
  getBoundaryCoords,
  isInView
} from "./utils";
import { Stacker } from "./stacker";
import CopyImg from "./../../../copy.png"; // @cameron update this to material icon
import CloseImg from "./../../../close.png"; // @cameron update this to material icon
import styled from "styled-components"; 



var userAgent = navigator.userAgent.toLowerCase();
if(userAgent.indexOf(' electron/') > -1){
  const electron = window.require("electron");
  var ipc = electron.ipcRenderer;
}else{
  var ipc = false
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
      isResizingXLeft:false,
      zIndex: Stacker.getNextIndex(),
      downKey: -1,
      isMoving: false,
      mouseIsDown: false,
      scale: 1,
      panDisabled:false,
      originalHeight:null,
      mouseWheelTimeout:null
    };

    _this.space = 32;
    _this.opt = 18;
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
        width = initialSize.width;
        height = initialSize.height;
      } else {
        var rect = _this.childrenElement.getBoundingClientRect();
            

        width = rect.width;

        height = rect.height;
      }
      if (_this.props.initialScale) {

        _this.setState({ scale: _this.props.initialScale });
      }
      _this.setState({ width: width, height: height,originalHeight:height });
      _this.setInitialPosition({ width: width, height: height});
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
      _this.setState({ downKey: e.keyCode });
      if (e.keyCode === _this.space) {
        document.body.style.cursor = "grab";
      }
    };
    _this.onKeyUp = function(e) {
      _this.setState({ downKey: -1 });
      document.body.style.cursor = "auto";
    };

    _this.onMouseDown = function() {

      var isDraggable = _this.props.isDraggable;
      if (!isDraggable) return;

      _this.setState({
        isDragging: true
      });
    };

    _this.disablePan = function(status){
        _this.setState({panDisabled:status})
    }

    _this.pan = function(changeX, changeY) {


      ipc && ipc.send("edited")
    if(_this.state.panDisabled){
        return
    }
      var _a = _this.state,
        currentX = _a.x,
        currentY = _a.y;
      var newX = currentX + changeX;
      var newY = currentY + changeY;
      _this.setState({ x: newX, y: newY }, () => _this.onStartMove(true));
    };

    _this.manualResize = function(widthDiff, heightDiff){

        var width = _this.state.width, height = _this.state.height, originalHeight = _this.state.originalHeight

        _this.setState({width:width+widthDiff})
    }

    _this.zoom = function(newScale, mouseX, mouseY, manual = false, center = false) {
      ipc && ipc.send("edited")

      var scale = _this.state.scale,
        x = _this.state.x,
        y = _this.state.y,
        width = _this.state.width,
        height = _this.state.height;

      if (newScale < 0.1) {
        return;
      }



      var curDistX = mouseX - x,
        curDistY = mouseY - y;

      var unScaledDistX = curDistX / scale,
        unScaledDistY = curDistY / scale;

      var scaledDistX = unScaledDistX * newScale,
        scaledDistY = unScaledDistY * newScale;


      if (center) {
        var newOriginX = window.innerWidth / 2,
          newOriginY = window.innerHeight / 2;
      } else {
        var newOriginX = mouseX,
          newOriginY = mouseY;
      }
      var newX = newOriginX - scaledDistX,
        newY = newOriginY - scaledDistY;

    if(manual){
      _this.setState({ scale: newScale }, () =>
        _this.setState({ x: newX, y: newY })
      );        
  }else{
      _this.setState({ scale: newScale }, () =>
        _this.setState({ x: newX, y: newY }, () => this.onStartMove(true))
      );
  }

    };

    _this.onWheel = function(e) {
  
      if(_this.state.mouseWheelTimeout){
        clearTimeout(_this.state.mouseWheelTimeout)
      }
      var newTimeOut = setTimeout(_this.onStoppedMove.bind(_this), 250)
      _this.setState({mouseWheelTimeout:newTimeOut})
      if (e.ctrlKey) {

        e.preventDefault();
        _this.zoom(_this.state.scale - e.deltaY * 0.01, e.clientX, e.clientY);
      } else {

        _this.pan(-e.deltaX, -e.deltaY);
      }
    };
    _this.onGlobalMouseDown = function(e) {
      _this.setState({ mouseIsDown: true });
    };
    _this.onMouseMove = function(e) {
           
      var isResizing = _this.isResizing;


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
      var newX = currentX + movementX;
      var newY = currentY + movementY;

      if (_this.state.downKey === _this.space && _this.state.mouseIsDown) {
        _this.pan(e.movementX, e.movementY);

        return;
      } else if (isDragging) {
        ipc && ipc.send("edited")
        var size =
          currentWidth && currentHeight
            ? { width: currentWidth, height: currentHeight }
            : undefined;
        var _b = getBoundaryCoords({ x: newX, y: newY }, size),
          x = _b.x,
          y = _b.y;
        _this.setState({ x: newX, y: newY }, _this.onStartMove);
        return;
      } else if(isResizing) {
        ipc && ipc.send("edited")
          _this.resizeCristal(e);
      }
    };

    _this.resizeCristal = function(e) {
      var isResizing = _this.isResizing;
      var scale = _this.state.scale
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

      var height = currentHeight
      var width = currentWidth
      var x = currentX


      if (isResizingX) {
   
        var newWidth = (currentWidth || 0) + movementX;
        var width = Math.max(newWidth, minWidth);

      }
      if(isResizingXLeft) {
      
        var newWidth = (currentWidth || 0) - movementX;
        var width = Math.max(newWidth, minWidth);
        var x = currentX + e.movementX
    
      }
      if (isResizingY) {
        var newHeight = (currentHeight || 0) + movementY;
        var height = Math.max(newHeight, minHeight);
      
      }


      _this.notifyResize(width, height, x)

    };



    _this.onStoppedMove = function() {
      if (this.state.isMoving) {
        _this.notifyStopMove();
      }

      _this.setState({ isMoving: false });
    };

    _this.onStartMove = function(panning = false) {
     
      _this.notifyMove();
      if (_this.state.isMoving === false) {

        _this.notifyStartMove();
        if (_this.state.downKey === _this.opt && panning === false) {
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
      var heightDiff = newHeight - _this.state.height
      var widthDiff = newWidth - _this.state.width
      var resizeBlocked = false
      if (onResize) {
        var resizeBlocked = onResize(widthDiff, heightDiff);
      }
      if(!resizeBlocked){
        _this.setState({height:newHeight, width:newWidth, x:newX})
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
      if(_this.state.isResizingY || _this.state.isResizingX ||_this.state.isResizingXLeft){
        _this.notifyStopResize();
      }
      _this.setState({
        isDragging: false,
        isResizingX: false,
        isResizingXLeft:false,
        isResizingY: false,
        mouseIsDown: false
      });
    };
    _this.startFullResize = function() {
      _this.notifyStartResize()
      _this.setState({
        isResizingX: true,
        isResizingY: true
      });
    };
    _this.startFullLeftResize = function() {
      _this.notifyStartResize()
      _this.setState({
        isResizingXLeft: true,
        isResizingY: true
      });
    };
    _this.startXResize = function() {
        _this.notifyStartResize()
      return _this.setState({ isResizingX: true });
    };
    _this.startXLeftResize = function() {
        _this.notifyStartResize()
      return _this.setState({ isResizingXLeft: true });
    };
    _this.startYResize = function() {

        _this.notifyStartResize()
      return _this.setState({ isResizingY: true });
    };
    _this.renderResizeHandles = function() {
      var isResizable = _this.props.isResizable;
      if (!isResizable) return;

      var scale = _this.state.scale
      var height = _this.state.height
      var width = _this.state.width
      return [
        React.createElement(RightResizeHandle, {
          key: "right-resize",
          onMouseDown: _this.startXResize, style:{ width:20/scale, bottom:20/scale, height:height - 30- 20/scale}
        }),
        React.createElement(LeftResizeHandle, {
          key: "left-resize",
          onMouseDown: _this.startXLeftResize, style:{ width:20/scale, bottom:20/scale, height:height - 30- 20/scale},
        }),
        React.createElement(BottomRightResizeHandle, {
          key: "bottom-right-resize",
          onMouseDown: _this.startFullResize, style:{ width:20/scale, height:20/scale}
        }),
        React.createElement(BottomLeftResizeHandle, {
          key: "bottom-left-resize",
          onMouseDown: _this.startFullLeftResize, style:{ width:20/scale, height:20/scale}
        }),
        React.createElement(BottomResizeHandle, {
          key: "bottom-resize",
          onMouseDown: _this.startYResize, style:{height:20/scale, left:20/scale, width:width - 2*20/scale}
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
  Object.defineProperty(Cristal.prototype, "header", {
    get: function() {
      var _a = this.props,
        title = _a.title,
        isDraggable = _a.isDraggable,
        onClose = _a.onClose,
        closeHidden = _a.closeHidden,
        onCopy = _a.onCopy,
        copyHidden = _a.copyHidden;

      var closeBtn = React.createElement(CloseIcon, {
        onClick: onClose,
        src: CloseImg
      });
      if (closeHidden) {
        closeBtn = null;
      }

      var copyBtn = React.createElement(CloseIcon, {
        onClick: onCopy,
        src: CopyImg
      });

      if (copyHidden) {
        copyBtn = null;
      }

      var sideButtons = (
        <div
          class="row"
          style={{ position: "absolute", cursor: "auto", right: 22, top: 8 }}
        >
          {copyBtn}
          {closeBtn}
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
        React.createElement(Title, null, title),
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
      zIndex = _a.zIndex,
      scale = _a.scale;
    var className = this.props.className;
    var isActive = isDragging || isResizing;
    var style = {
      left: x,
      top: y,
      width: width,
      height: height,
      zIndex: zIndex,
      transform: "scale(" + scale.toString() + ")",
      transformOrigin:"top left",
      border: this.props.border,
      outline: this.props.outline
    };

    var HeaderComponent = this.header;
    var ContentComponent = this.content;
    if(this.props.headerHidden){
      HeaderComponent = null
    }


    return ReactDOM.createPortal(
      React.createElement(
        Wrapper,
        {
          style: style,
          ref: this.saveWrapperRef,
          isActive: isActive,
          className: className + " rounded " + this.props.wrapperName,
          onMouseDown: this.changeZIndex,
        },
        <div>{HeaderComponent}</div>,
        ContentComponent,
        this.renderResizeHandles()
      ),
      document.body
    );
  };
  Cristal.defaultProps = {
    children: null,
    isResizable: true,
    isDraggable: true
  };
  return Cristal;
})(Component);
export { Cristal };
