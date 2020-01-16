import React, { Component } from "react";
import Cristal from "./react-cristal/dist/es2015/index.js";
import $ from "jquery";
import { saveAs } from "file-saver";
import pf, { globals, p5Lib } from "./globals.js";
import FunctionStamp from "./FunctionStamp.js";
import ModalManager from "./ModalManager.js";
import ConsoleStamp from "./ConsoleStamp.js";
import ControlBar from "./ControlBar.js";
import BlobStamp from "./BlobStamp.js";
import { Mutex } from "async-mutex";
import { Line } from "react-lineto";
import cheerio from "cheerio";
import { SteppedLineTo } from "react-lineto";
import parser from "./parser.js";
import anim from "css-animation";
import { Resizable, ResizableBox } from "react-resizable";
import styled from "styled-components";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import LZUTF8 from "lzutf8";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/javascript";

import pf1, { starter, stamperHeader } from "./starterStamps.js";

var _ = require("lodash");

var esprima = require("esprima");

var userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(" electron/") > -1) {
  const electron = window.require("electron");
  var ipc = electron.ipcRenderer;
} else {
  var ipc = false;
}

export default class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      compiledBefore: false,
      fnStampRefs: {},
      fnStampElems:{},
      scale: 1,
      counter: 0,
      blobStampRefs: {},
      blobStampElems:{},
      htmlID: -1,
      consoleStamp: null,
      setupExists: true,
      htmlAsksForCss: true,
      htmlAsksForJs: true,
      lines: [],
      lineData: [],
      traversalGraph: {},
      consoleId: -1,
      numToggles: 0,
      originX: 0,
      originY: 0,
      scale: 1,
      pickerData: [],
      sideBarWidth: 0,
      topBarHeight: 0,
      zoomDisabled: false,
      mouseWheelTimeout: null,
      mouseIsDown: false,
      downKey: -1,
      panDisabled: false
    };
    this.counterMutex = new Mutex();
    this.modalManagerRef = React.createRef();
    this.onWheel = this.onWheel.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);

    this.newStampMarginVariance = 100;
    this.newStampMargin = 20;
    this.space = 32;
    this.cmd = 91;
    this.ctrl = 17;
    this.plus = 187;
    this.minus = 189;
    this.zero = 48;

    ipc &&
      ipc.on("writeToView", (event, data) =>
        this.loadStamperObject(data.stamperObject)
      );

    ipc && ipc.on("resetView", event => this.loadStamperObject(starter));
  }

  getInitialStamper(){
    if(ipc){
      return starter
    }

    var stored = localStorage.getItem('storedStamper')

    if(stored === null){
      return starter
    }

    try{
      var stamperObject = JSON.parse(LZUTF8.decompress(stored, {
        inputEncoding: "StorageBinaryString"
      }))
      return stamperObject
    }catch(error){
      return starter
    }
  }

  componentDidMount() {
    // localStorage.clear()
    this.loadStamperObject(this.getInitialStamper())

    document.addEventListener("wheel", this.onWheel);
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
    document.addEventListener("mousedown", this.onMouseDown);
    document.addEventListener("mouseup", this.onMouseUp);
    document.addEventListener("mousemove", this.onMouseMove);

    var centerX = window.innerWidth / 2 + this.state.topBarHeight;
    var centerY = window.innerHeight / 2 + this.state.sideBarWidth;

    ipc &&
      ipc.on("zoomIn", () => {
        this.zoom(centerX, window.innerHeight / 2, true);
      });

    ipc &&
      ipc.on("zoomOut", () => {
        this.zoom(this.state.scale * 0.5, centerX, centerY, true);
      });

    ipc &&
      ipc.on("zoomActual", () => {
        this.zoom(1, centerX, centerY, true);
      });
  }

  componentWillUnmount() {
    document.removeEventListener("wheel", this.onWheel);
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
    document.removeEventListener("mousedown", this.onMouseDown);
    document.removeEventListener("mouseup", this.onMouseUp);
    document.removeEventListener("mousemove", this.onMouseMove);
  }

  onKeyDown(e) {
    if (e.keyCode === this.space) {
      document.body.style.cursor = "grab";
    }

    var centerX = window.innerWidth / 2 + this.state.topBarHeight;
    var centerY = window.innerHeight / 2 + this.state.sideBarWidth;
    if (this.state.downKey === this.cmd || this.state.downKey === this.ctrl) {
      if (e.keyCode === this.zero) {
        e.preventDefault();
        this.zoom(1, centerX, centerY, true);
      } else if (e.keyCode === this.plus) {
        e.preventDefault();
        this.zoom(this.state.scale * 2, centerX, centerY, true);
      } else if (e.keyCode === this.minus) {
        e.preventDefault();
        this.zoom(this.state.scale * 0.5, centerX, centerY, true);
      }
    } else {
      this.setState({ downKey: e.keyCode });
    }
  }

  onKeyUp(e) {
    document.body.style.cursor = "auto";
    if (e.keyCode === this.state.downKey) {
      this.setState({ downKey: -1 });
    }
  }
  onMouseDown() {
    this.setState({ mouseIsDown: true });
  }

  onMouseUp() {
    this.setState({ mouseIsDown: false });
  }

  onMouseMove(e) {
    if (this.state.mouseIsDown && this.state.downKey == this.space) {
      this.pan(e.movementX, e.movementY);
    }
  }

  onWheel(e) {
    if (this.state.mouseWheelTimeout) {
      clearTimeout(this.state.mouseWheelTimeout);
    } else {
      this.onStartMove();
    }
    var newTimeOut = setTimeout(this.onStopMove.bind(this), 250);
    this.setState({ mouseWheelTimeout: newTimeOut });

    if (e.ctrlKey) {
      this.zoom(this.state.scale - e.deltaY * 0.01, e.clientX, e.clientY);
    } else {
      this.pan(-e.deltaX, -e.deltaY);
    }
  }

  pan(changeX, changeY) {
    if (this.state.panDisabled) {
      return;
    }
    ipc && ipc.send("edited");
    var a = this.state,
      currentX = a.originX,
      currentY = a.originY;
    var newX = currentX + changeX;
    var newY = currentY + changeY;
    this.setState({ originX: newX, originY: newY });
  }

  zoom(newScale, mouseX, mouseY) {
    if (this.state.zoomDisabled) {
      return;
    }

    ipc && ipc.send("edited");

    var scale = this.state.scale,
      x = this.state.originX,
      y = this.state.originY;

    if (newScale < 0.1) {
      return;
    }

    var curDistX = mouseX - x,
      curDistY = mouseY - y;

    var unScaledDistX = curDistX / scale,
      unScaledDistY = curDistY / scale;

    var scaledDistX = unScaledDistX * newScale,
      scaledDistY = unScaledDistY * newScale;

    var newOriginX = mouseX,
      newOriginY = mouseY;

    var newX = newOriginX - scaledDistX,
      newY = newOriginY - scaledDistY;

    this.setState({ scale: newScale }, () =>
      this.setState({ originX: newX, originY: newY })
    );
  }

  updateControlBarDimensions(sideBarWidth, topBarHeight) {
    this.setState({ sideBarWidth: sideBarWidth, topBarHeight: topBarHeight });
  }

  recompileIfEnoughStamps(numFns, numBlobs) {
    if (
      Object.keys(this.state.fnStampRefs).length === numFns &&
      Object.keys(this.state.blobStampRefs).length === numBlobs
    ) {
      this.requestCompile();
    }
  }

  loadStamperObject(stamperObject) {
    this.setState(
      {
        fnStampRefs: {},
        blobStampRefs: {},
        fnStampElems:{},
        blobStampElems:{},
        counter: 0,
        htmlID: -1,
        scale: 1,
        consoleStamp: null,
        consoleId: -1,
        originX: 0,
        originY: 0,
        compiledBefore: false
      },
      () => {
        this.setState(
          {
            scale: stamperObject.scale,
            originX: stamperObject.originX,
            originY: stamperObject.originY
          },
          () => {
            var callback = () =>
              this.recompileIfEnoughStamps(
                stamperObject.fns.length,
                stamperObject.blobs.length
              );
            this.addConsoleStamp(stamperObject.console);
            stamperObject.fns.map(data => this.addFnStamp(data, callback));
            stamperObject.blobs.map(data => this.addBlobStamp(data, callback));
          }
        );
      }
    );
  }

  getIframeErrorCallBack(ranges, offset = 0) {
    var strRanges = JSON.stringify(ranges);
    return `
  // window.addEventListener('error', function(e) { 
  //   console.log("addEventListener")
  //     logToConsole(e.message, e.lineno)
  //   }, false);

window.onerror = function (message, url, lineno, colno) {

  logToConsole(message, lineno)
}


// document.onwheel = function (e) {

//   console.log(document)


// }

function logToConsole(message, lineno){

      var adjLineNum = -1
      var stampId = -1
      var ranges = ${strRanges}

      ranges.map(range => {
        var start = range.start
        var end = range.end
        var id = range.id
        var isFN = range.isFN
        var isInRange = start + ${offset} < lineno + 1 && lineno -1 < end + ${offset}

        
        if(isInRange){
          adjLineNum = lineno - start - ${offset} + 1
          stampId = id
          if(range.isFn){
            adjLineNum -= 1
          }
        }
      })
      if(stampId > 0){
      window.parent.postMessage({type:"error", message:message, lineno:adjLineNum, id:stampId}, '*')
      }

    }`;
  }

  replaceFileStamps(parser) {
    Object.values(this.state.fnStampRefs).map(item => {
      if (item.current.props.isFile) {
        var name = item.current.state.name;
        var code = item.current.state.code;

        var srcNodes = parser(`[src="${name}"]`);
        for (var i = 0; i < srcNodes.length; i++) {
          var singleNode = srcNodes.eq(i);
          var tagName = srcNodes.get(i).tagName;
          singleNode.replaceWith(`<${tagName}>${code}</${tagName}>`);
        }

        if (name.endsWith(".js")) {
          parser(`[href="${name}"]`).replaceWith(`<script>${code}</script>`);
        } else if (name.endsWith(".css")) {
          parser(`[href="${name}"]`).replaceWith(`<style>${code}</style>`);
        }
      }
    });
  }

  loadAssets(runnableCode) {
    Object.values(this.state.fnStampRefs).map(item => {
      var name = item.current.state.name;
      var code = item.current.state.code;
      if (item.current.props.isFile || item.current.props.isImg) {
        runnableCode = runnableCode
          .replace(`'${name}'`, `"${code}"`)
          .replace("`" + name + "`", `"${code}"`)
          .replace(`"${name}"`, `"${code}"`);
      }
    });

    return runnableCode;
  }

  getHTML(id) {
    if (this.state.htmlID in this.state.fnStampRefs === false) {
      return "";
    }

    if (id === this.state.htmlID) {
      var runnableCode = "";
      var ranges = [];
    } else {
      var codeData = this.getRunnableCode(id);
      var runnableCode = this.loadAssets(codeData.runnableCode);
      var ranges = codeData.ranges;
    }

    var htmlStamp = this.state.fnStampRefs[this.state.htmlID];

    var html = htmlStamp.current.state.code;

    const parser = cheerio.load(html, { withStartIndices: true });
    this.replaceFileStamps(parser);

    var jsBlockStr =
      "<script type='text/javascript'>" + runnableCode + "</script>";

    var jsSelector = '[src="sketch.js"]';

    var jsBlock = parser(jsBlockStr);

    // const start = parser(jsSelector).get(0).startIndex;

    var htmlAsksForJs = parser(jsSelector).length > 0;
    if (htmlAsksForJs === false && this.state.htmlAsksForJs === true) {
      this.state.consoleStamp.ref.current.logToConsole(
        `Stamper Error: Your index.html is missing a div for sketch.js. Make sure you're linking to sketch.js and not another sketch file.`
      );
      this.state.fnStampRefs[this.state.htmlID].current.addErrorLine(-1);
      this.setState({ htmlAsksForJs: htmlAsksForJs });
    } else if (htmlAsksForJs === true && this.state.htmlAsksForJs === false) {
      this.setState({ htmlAsksForJs: htmlAsksForJs });
    }

    parser("head").prepend(
      "<script class='errorListener' >" +
        this.getIframeErrorCallBack(ranges) +
        "</script>"
    );

    var htmlStr = parser.html();
    var linesToJs = 0;
    for (var i = 0; i < htmlStr.length; i++) {
      if (htmlStr[i] === "\n") {
        linesToJs += 1;
      }
      if (htmlStr.substr(i, "sketch.js".length) === "sketch.js") {
        break;
      }
    }

    parser(".errorListener").replaceWith(
      `<script class='errorListener'>` +
        this.getIframeErrorCallBack(ranges, linesToJs) +
        "</script>"
    );
    parser(jsSelector).replaceWith(jsBlock);

    return parser.html();
  }

  addErrorLine(lineNum, id) {
    if (id in this.state.fnStampRefs) {
      this.state.fnStampRefs[id].current.addErrorLine(lineNum);
    } else if (id in this.state.blobStampRefs) {
      this.state.blobStampRefs[id].current.addErrorLine(lineNum);
    }
  }

  setInitialPosition(dimension) {
    if (dimension === "x") {
      return (
        (-this.state.originX + this.state.sideBarWidth) / this.state.scale +
        50 +
        Math.random() * this.newStampMarginVariance
      );
    } else if (dimension === "y") {
      // Math.random() * this.newStampMarginVariance ) * this.state.scale
      return (
        (-this.state.originY + this.state.topBarHeight) / this.state.scale +
        50 +
        Math.random() * this.newStampMarginVariance
      );
    }
  }

  addConsoleStamp(data) {
    var defaults = {
      x: this.setInitialPosition("x"),
      y: this.setInitialPosition("y"),
      consoleWidth: globals.defaultEditorWidth,
      consoleHeight: globals.defaultVarEditorHeight,
      hidden: false,
      zIndex: undefined
    };

    Object.keys(defaults).map(setting => {
      if (setting in data) {
        defaults[setting] = data[setting];
      }
    });
    data = defaults;

    this.createConsoleStamp(data);
  }

  async createConsoleStamp(data) {
    var x = data.x,
      y = data.y,
      consoleWidth = data.consoleWidth,
      consoleHeight = data.consoleHeight;
    const release = await this.counterMutex.acquire();
    var counter = this.state.counter;
    this.setState({ counter: counter + 1 }, release());

    var ref = React.createRef();

    var stampID = counter.toString();

    var elem = (
      <ConsoleStamp
        ref={ref}
        initialPosition={{ x: x, y: y }}
        id={stampID}
        onStartMove={this.onStartMove.bind(this)}
        onStopMove={this.onStopMove.bind(this)}
        disablePan={this.disablePan.bind(this)}
        starterConsoleWidth={consoleWidth}
        starterConsoleHeight={consoleHeight}
        addErrorLine={this.addErrorLine.bind(this)}
        initialHidden={data.hidden}
        getScale={this.getScale.bind(this)}
        starterZIndex={data.zIndex}
      />
    );

    var consoleStamp = { elem: elem, ref: ref };
    this.setState({ consoleStamp: consoleStamp, consoleId: stampID });
  }

  addFnStamp(
    data,
    callback,
    updateName = false,
    updatePosition = false,
    setIframeDisabled = false
  ) {
    var defaults = {
      name: "sketch",
      code: "rect(50, 50, 50, 50)",
      args: "x=mouseX, y=mouseY",
      x: this.setInitialPosition("x"),
      y: this.setInitialPosition("y"),
      iframeDisabled: false,
      editorWidth: globals.defaultEditorWidth,
      editorHeight: globals.defaultEditorHeight - globals.brHeight,
      iframeWidth: globals.defaultIframeWidth,
      iframeHeight: globals.defaultEditorHeight,
      isHtml: false,
      isFile: false,
      isImg: false,
      hidden: false,
      zIndex: undefined
    };

    Object.keys(defaults).map(setting => {
      if (setting in data) {
        defaults[setting] = data[setting];
      }
    });
    data = defaults;

    if (updatePosition) {
      data.x += globals.copyOffset * 2 * this.state.scale;
      data.y += globals.copyOffset * 2 * this.state.scale;
    }

    var newName = data.name + (this.state.counter + 1).toString();

    if (updateName) {
      data.name = newName;
    }

    data.iframeDisabled = setIframeDisabled;

    this.createFnStamp(data, callback);
    // this.refreshblobStampRefs(this.state.blobStampRefs);
    // this.createFnStamp(data, callback)
    return newName;
  }

  async createFnStamp(data, callback = () => null) {
    var name = data.name,
      code = data.code,
      args = data.args,
      args = data.args,
      x = data.x,
      y = data.y,
      iframeDisabled = data.iframeDisabled,
      editorWidth = data.editorWidth,
      editorHeight = data.editorHeight,
      iframeWidth = data.iframeWidth,
      iframeHeight = data.iframeHeight,
      isHtml = data.isHtml,
      isFile = data.isFile,
      isImg = data.isImg,
      hidden = data.hidden;

    const release = await this.counterMutex.acquire();
    var counter = this.state.counter;
    this.setState({ counter: counter + 1 }, () => release());

    var fnStampRefs = Object.assign({}, this.state.fnStampRefs);
    var fnStampElems = Object.assign({}, this.state.fnStampElems);
    var ref = React.createRef();

    var stampID = counter.toString();

    var elem = (
      <FunctionStamp
        ref={ref}
        isHtml={isHtml}
        isFile={isFile}
        isImg={isImg}
        starterZIndex={data.zIndex}
        starterCode={code}
        starterArgs={args}
        starterName={name}
        errorLines={{}}
        starterEditorWidth={editorWidth}
        starterEditorHeight={editorHeight}
        initialPosition={{ x: x, y: y }}
        id={stampID}
        deleteFrame={this.deleteFrame}
        initialHidden={hidden}
        onStartMove={this.onStartMove.bind(this)}
        onStopMove={this.onStopMove.bind(this)}
        addStamp={this.addFnStamp.bind(this)}
        onDelete={this.onDelete.bind(this)}
        starterIframeWidth={iframeWidth}
        starterIframeHeight={iframeHeight}
        checkAllNames={this.checkAllNames.bind(this)}
        disablePan={this.disablePan.bind(this)}
        iframeDisabled={iframeDisabled}
        requestCompile={this.requestCompile.bind(this)}
        getHTML={this.getHTML.bind(this)}
        addNewIframeConsole={this.addNewIframeConsole.bind(this)}
        getScale={this.getScale.bind(this)}
      />
    );

    fnStampRefs[stampID] = ref;
    fnStampElems[stampID] = elem

    this.setState(
      {
        fnStampRefs: fnStampRefs,
        fnStampElems:fnStampElems

      },
          counter => callback(stampID)
  
    );

    if (isHtml) {
      this.setState({ htmlID: stampID });
    }
  }

  addNewIframeConsole(newConsole) {
    if (this.state.consoleStamp === null) {
      return;
    }
    this.state.consoleStamp.ref.current.addNewIframeConsole(newConsole);
  }

  addBlobStamp(data, callback, updatePosition = false) {
    var defaults = {
      code: "var z = 10",
      x: this.setInitialPosition("x"),
      y: this.setInitialPosition("y"),
      editorWidth: globals.defaultEditorWidth,
      editorHeight: globals.defaultVarEditorHeight,
      hidden: false,
      codeSize: globals.codeSize,
      zIndex: undefined
    };

    Object.keys(defaults).map(setting => {
      if (setting in data) {
        defaults[setting] = data[setting];
      }
    });
    data = defaults;

    if (updatePosition) {
      data.x += globals.copyOffset * 2 * this.state.scale;
      data.y += globals.copyOffset * 2 * this.state.scale;
    }

    this.createBlobStamp(data, callback);
  }

  async createBlobStamp(data, callback = () => null) {
    const release = await this.counterMutex.acquire();

    var x = data.x,
      y = data.y,
      code = data.code,
      editorWidth = data.editorWidth,
      editorHeight = data.editorHeight,
      errorLines = data.errorLines,
      hidden = data.hidden;
    var counter = this.state.counter;
    this.setState({ counter: counter + 1 }, () => release());

    var blobStampRefs = Object.assign({}, this.state.blobStampRefs);
    var blobStampElems = Object.assign({}, this.state.blobStampElems);
    var ref = React.createRef();
    var stampID = counter.toString();

    var elem = (
      <BlobStamp
        ref={ref}
        starterCode={code}
        errorLines={{}}
        initialPosition={{ x: x, y: y }}
        id={stampID}
        starterCodeSize={data.codeSize}
        deleteFrame={this.deleteFrame}
        initialHidden={hidden}
        starterZIndex={data.zIndex}
        onStartMove={this.onStartMove.bind(this)}
        onStopMove={this.onStopMove.bind(this)}
        addStamp={this.addBlobStamp.bind(this)}
        onDelete={this.onDelete.bind(this)}
        disablePan={this.disablePan.bind(this)}
        starterEditorWidth={editorWidth}
        starterEditorHeight={editorHeight}
        requestCompile={this.requestCompile.bind(this)}
        getExportableCode={this.getExportableCode.bind(this)}
        getScale={this.getScale.bind(this)}
      />
    );

    blobStampRefs[stampID] = ref
    blobStampElems[stampID] = elem

    this.setState({ blobStampRefs: blobStampRefs ,
      blobStampElems:blobStampElems
    }, counter => {
      callback(stampID);
    });
  }

  checkForSetup() {
    var newSetupExists = false;
    var fnStampRefs = Object.values(this.state.fnStampRefs);
    for (var i = 0; i < fnStampRefs.length; i++) {
      var fnStampRef = fnStampRefs[i].current;

      if (fnStampRef.state.name === "setup") {
        newSetupExists = true;
      }
    }

    if (this.state.setupExists && newSetupExists === false) {
      this.state.consoleStamp.ref.current.logToConsole(
        `Stamper Error: You don't have a setup. This will constrain your canvas to a default width and height.`
      );
    }

    this.setState({ setupExists: newSetupExists });

    return newSetupExists;
  }

  getFileDict() {
    var fileDict = {}
    fileDict["sketch.js"] = {content:this.getExportableCode(), type:"text"}
    var stamperObject = this.getStamperObject()
    stamperObject.compressedJs = LZUTF8.compress(fileDict["sketch.js"].content, {
      outputEncoding: "StorageBinaryString"
    });

    fileDict["stamper.js"] = {content:stamperHeader + JSON.stringify(stamperObject), type:"text"}

    Object.values(this.state.fnStampRefs).map(item => {
      var code = item.current.state.code
      var name = item.current.state.name
      if(item.current.props.isFile || item.current.props.isHtml){
        fileDict[name] = {content:code, type:'text'}
      }else if(item.current.props.isImg){
        fileDict[name] = {content:code, type:"image"}
      }
    })
    return fileDict
  }

  requestCompile(id) {

    // var newTraversalGraph = this.setLineData()
    // var oldTravarsalGraph = this.state.traversalGraph
    // this.setState({traversalGraph:newTraversalGraph})
    this.state.consoleStamp.ref.current.logToConsole("Updated code", "debug");

    this.setLayerPicker();

    var duplicateNamedStamps = this.checkAllNames();

    this.checkForSetup();

    if (this.state.compiledBefore === false) {
      this.setState({ compiledBefore: true });
    } else {
      ipc && ipc.send("edited");
    }

    // this.recursiveCompileStamp(id, {}, newTraversalGraph, duplicateNamedStamps)

    // this.recursiveCompileStamp(id, {}, oldTravarsalGraph, duplicateNamedStamps)

    Object.values(this.state.fnStampRefs).map(stamp => {
      var stampRef = stamp.current;
      if (stampRef) {
        var newErrors = [];
        if (
          stampRef.props.id in duplicateNamedStamps &&
          stampRef.props.isHtml === false
        ) {
          newErrors.push(0);
        }

        stampRef.clearErrorsAndUpdate(newErrors);
      }
    });

    Object.values(this.state.blobStampRefs).map(stamp => {
      var stampRef = stamp.current;
      if (stampRef) {
        var newErrors = [];

        if (stampRef.props.id in duplicateNamedStamps) {
          newErrors.push(0);
        }

        stampRef.clearErrorsAndUpdate(newErrors);
      }
    });
  }

  recursiveCompileStamp(id, seen, traversalGraph, duplicateNamedStamps) {
    if (id in seen) {
      return;
    } else {
      seen[id] = "";
    }

    if (id in this.state.fnStampRefs) {
      var stampRef = this.state.fnStampRefs[id].current;
    } else if (id in this.state.blobStampRefs) {
      var stampRef = this.state.blobStampRefs[id].current;
    } else {
      return;
    }

    if (stampRef) {
      var newErrors = [];

      if (
        stampRef.props.id in duplicateNamedStamps &&
        stampRef.props.isHtml === false
      ) {
        newErrors.push(0);
      }

      stampRef.clearErrorsAndUpdate(newErrors);

      if (id in traversalGraph === false) {
        return;
      }
      traversalGraph[id].map(id =>
        this.recursiveCompileStamp(
          id,
          seen,
          traversalGraph,
          duplicateNamedStamps
        )
      );
    }
  }

  disablePan(status) {
    this.setState({ panDisabled: status });
  }

  disableZoom(status) {
    this.setState({ zoomDisabled: status });
  }

  checkAllNames() {
    var nameDict = {};
    Object.values(this.state.fnStampRefs).map(stamp => {
      if (stamp.current) {
        var name = stamp.current.state.name;
        if (!(name in nameDict)) {
          nameDict[name] = 0;
        }
        nameDict[name] += 1;
      }
    });
    var duplicateNamedStamps = {};
    Object.values(this.state.fnStampRefs).map(stamp => {
      if (stamp.current) {
        var stampRef = stamp.current;
        var name = stamp.current.state.name;
        if (nameDict[name] > 1) {
          duplicateNamedStamps[stamp.current.props.id] = "";

          this.state.consoleStamp.ref.current.logToConsole(
            `Stamper Error: Multiple Stamps shouldn't have the same name. Consider channging one of your ${name}s to something else.`
          );
        }
      }
    });

    return duplicateNamedStamps;
  }

  getExportableCode() {
    var runnableCode = [];
    var ranges = [];
    var curLine = 1;
    var code;

    Object.values(this.state.blobStampRefs).map(blobStamp => {
      code = blobStamp.current.state.code;
      curLine = this.addCodeBlock(
        code,
        blobStamp.current.props.id,
        runnableCode,
        ranges,
        curLine,
        false
      );
    });

    Object.values(this.state.fnStampRefs).map(stamp => {
      if (
        stamp.current.props.isFile === false &&
        stamp.current.props.isHtml === false &&
        stamp.current.props.isImg === false
      ) {
        var state = stamp.current.state;
        code = `function ${state.name}(${state.args}){\n${state.code}\n}`;
        curLine = this.addCodeBlock(
          code,
          stamp.current.props.id,
          runnableCode,
          ranges,
          curLine,
          true
        );
      }
    });

    return runnableCode.join("\n");
  }

  getNumLines(code) {
    var numLines = 0;
    for (var i = 0; i < code.length; i++) {
      if (code[i] === "\n") {
        numLines += 1;
      }
    }

    return numLines;
  }

  addCodeBlock(code, id, runnableCode, ranges, curLine, isFn) {
    code = code.trim() + "\n";
    var start = curLine;
    var end = curLine + this.getNumLines(code) - 1;
    runnableCode.push(code);
    ranges.push({ start: start, end: end, id: id, isFn: isFn });
    return end + 1;
  }

  setLines() {
    var lines = [];
    var borderColorInt = 205 + 15 - 15 * this.state.scale;
    var style = {
      borderColor: `rgb(${borderColorInt}, ${borderColorInt}, ${borderColorInt})`,
      borderWidth: 1
    };

    this.state.lineData.map(singleLineData => {
      lines.push(
        <SteppedLineTo
          {...style}
          from={"vertex" + singleLineData[0]}
          to={"vertex" + singleLineData[1]}
          orientation="v"
        />
      );
    });

    this.setState({ lines: lines });
  }

  setLineData() {
    var declaredDict = {};
    var undeclaredArr = [];
    var lineData = [];
    var setupID = -1;
    var traversalGraph = {};

    Object.keys(this.state.blobStampRefs).map(id => {
      var stampRef = this.state.blobStampRefs[id].current;
      var code = stampRef.state.code;
      var identifiers = parser.getIdentifiers(code);

      if (identifiers) {
        identifiers.declared.map(identifier => (declaredDict[identifier] = id));
        identifiers.undeclared.map(identifier =>
          undeclaredArr.push([identifier, id])
        );
      }
    });

    Object.keys(this.state.fnStampRefs).map(id => {
      var stampRef = this.state.fnStampRefs[id].current;

      if (stampRef.state.name === "setup") {
        setupID = id;
      }
      var state = stampRef.state;
      var code = `function ${state.name}(${state.args}){\n${state.code}\n}`;
      var identifiers = parser.getIdentifiers(code);
      if (identifiers) {
        identifiers.declared.map(identifier => (declaredDict[identifier] = id));
        identifiers.undeclared.map(identifier =>
          undeclaredArr.push([identifier, id])
        );
      }
    });

    undeclaredArr.map(undeclaredItem => {
      var identifier = undeclaredItem[0];
      var usingFn = undeclaredItem[1];
      var declaringFn = declaredDict[identifier];
      if (declaringFn && usingFn) {
        lineData.push([usingFn, declaringFn]);
        if (declaringFn in traversalGraph === false) {
          traversalGraph[declaringFn] = [];
        }
        traversalGraph[declaringFn].push(usingFn);
      }
    });

    // Object.keys(this.state.fnStampRefs).map(id => {
    //   if (id != this.state.htmlID && id != this.state.cssID && id != setupID) {
    //     lineData.push([id, setupID]);
    //     if (setupID in traversalGraph === false) {
    //       traversalGraph[setupID] = [];
    //     }
    //     traversalGraph[setupID].push(id);
    //   }
    // });

    this.setState({ lineData: lineData }, () => this.setLines());

    // Object.keys(this.state.fnStampRefs).map(id => {
    //   if (id != this.state.htmlID && id != this.state.cssID) {
    //     if (this.state.htmlID in traversalGraph === false) {
    //       traversalGraph[this.state.htmlID] = [];
    //     }
    //     traversalGraph[this.state.htmlID].push(id);
    //   }
    // });

    // traversalGraph[this.state.cssID] = [this.state.htmlID];

    return traversalGraph;
  }

  getRunnableCode(id) {
    var runnableCode = [];
    var ranges = [];
    var curLine = 1;
    var code;

    Object.values(this.state.blobStampRefs).map(blobStamp => {
      code = blobStamp.current.state.code;
      curLine = this.addCodeBlock(
        code,
        blobStamp.current.props.id,
        runnableCode,
        ranges,
        curLine,
        false
      );
    });

    Object.values(this.state.fnStampRefs).map(stamp => {
      if (
        stamp.current.state.name != "draw" &&
        stamp.current.props.isFile === false &&
        stamp.current.props.isImg === false &&
        stamp.current.props.isHtml === false &&
        (this.isListener(stamp.current.state.name) === false ||
          this.isListener(this.state.fnStampRefs[id].current.state.name) ===
            false)
      ) {
        var state = stamp.current.state;
        code = `function ${state.name}(${state.args}){\n${state.code}\n}`;
        curLine = this.addCodeBlock(
          code,
          stamp.current.props.id,
          runnableCode,
          ranges,
          curLine,
          true
        );
      }
    });

    if (
      id in this.state.fnStampRefs == false ||
      this.state.fnStampRefs[id].current === null
    ) {
      return runnableCode.join("");
    }

    var fnStampRef = this.state.fnStampRefs[id].current;
    var state = fnStampRef.state;
    if (state.name === "draw" || this.isListener(state.name)) {
      var fullFun = `function ${state.name}(${state.args}){\n${state.code}\n}`;
      curLine = this.addCodeBlock(
        fullFun,
        fnStampRef.props.id,
        runnableCode,
        ranges,
        curLine,
        true
      );
    } else if (state.name === "setup") {
      // do nothing
    } else {
      code = `function draw(){\n${state.name}()\n}`;
      curLine = this.addCodeBlock(
        code,
        -1,
        runnableCode,
        ranges,
        curLine,
        false
      );
    }

    runnableCode = this.setLoopingControl(
      id,
      runnableCode.join(""),
      state.name
    );

    return { ranges: ranges, runnableCode: runnableCode };
  }

  setLoopingControl(id, runnableCode) {
    var loopingVar = "_isLooping";

    var loopingCallbacks = `\n
var _isLooping = true\n
window.parent.postMessage({type:"loop", message:"stop", id:${id}}, '*')
var _userSetLoop = true
var _stopLooping = setTimeout(() => {
 noLoop() 
}, 1000)

document.addEventListener('mouseenter', () => {
clearTimeout(_stopLooping)
window.parent.postMessage({type:"loop", message:"start", id:${id}}, '*')
if(_isLooping){

loop()
}

});

document.addEventListener('mouseleave', () => {
  window.parent.postMessage({type:"loop", message:"stop", id:${id}}, '*')
_stopLooping =setTimeout(() => {
 noLoop() 
}, 1000)
});

`;

    runnableCode = runnableCode.replace(
      "noLoop()",
      `noLoop(); _isLooping = false`
    );
    runnableCode = runnableCode.replace("loop()", `loop(); _isLooping = true`);
    runnableCode = runnableCode + loopingCallbacks;

    return runnableCode;
  }

  isListener(name) {
    return name in globals.specialFns && globals.specialFns[name] === false;
  }

  onDelete(id) {
    ipc && ipc.send("edited");

    if(id in this.state.fnStampRefs){
      var fnStampRefs = Object.assign({}, this.state.fnStampRefs);
      var fnStampElems = Object.assign({}, this.state.fnStampElems);
      delete fnStampRefs[id]
      fnStampElems[id] = (<span hidden={true}/>)
      this.setState({fnStampRefs:fnStampRefs, fnStampElems:fnStampElems}, () => 
        this.requestCompile(id))
    }else if(id in this.state.blobStampRefs){
      var blobStampRefs = Object.assign({}, this.state.blobStampRefs);
      var blobStampElems = Object.assign({}, this.state.blobStampElems);
      delete blobStampRefs[id]
      blobStampElems[id] = (<span hidden={true}/>)
      this.setState({blobStampRefs:blobStampRefs, blobStampElems:blobStampElems}, () => 
        this.requestCompile(id))
    }


    // var allData = this.getStamperObject(id);
    // this.loadStamperObject(allData);
  }

  refreshConsoleStamp(consoleStamp) {
    var data = consoleStamp.ref.current.getData();
    this.setState({ consoleStamp: null }, () => this.addConsoleStamp(data));
  }

  getStamperObject(id) {
    var data = {
      fns: [],
      blobs: [],
      scale: this.state.scale,
      console: this.state.consoleStamp.ref.current.getData(),
      originX: this.state.originX,
      originY: this.state.originY
    };
    Object.keys(this.state.fnStampRefs).map(stampID => {
      if (stampID != id) {
        var stamp = this.state.fnStampRefs[stampID];
        data.fns.push(stamp.current.getData());
      }
    });

    Object.keys(this.state.blobStampRefs).map(stampID => {
      if (stampID != id) {
        var stamp = this.state.blobStampRefs[stampID];
        data.blobs.push(stamp.current.getData());
      }
    });

    return data;
  }

  refreshfnStampRefs(fnStampRefs, callback = () => null) {
    var data = [];
    Object.values(fnStampRefs).map(item => {
      data.push(item.current.getData());
    });

    this.setState({ fnStampRefs: {} }, () => {
      data.map(stampData => {
        this.addFnStamp(stampData, () => {
          if (Object.values(this.state.fnStampRefs).length === data.length) {
            callback();
          }
        });
      });
    });
  }

  refreshblobStampRefs(blobStampRefs, callback = () => null) {
    var data = [];
    Object.values(blobStampRefs).map(item => {
      data.push(item.current.getData());
    });

    this.setState({ blobStampRefs: {} }, () => {
      data.map(stampData => {
        this.addBlobStamp(stampData, () => {
          if (Object.values(this.state.blobStampRefs).length === data.length) {
            callback();
          }
        });
      });
    });
  }

  onStartMove() {
    var fnStampRefs = this.state.fnStampRefs;
    for (var i in fnStampRefs) {
      var fnStamp = fnStampRefs[i].current;

      fnStamp.setIframeDisabled(true);
    }

    this.setState({ lines: [] });
  }

  onStopMove(s) {
    this.setState({ mouseWheelTimeout: null });
    var fnStampRefs = this.state.fnStampRefs;
    for (var i in fnStampRefs) {
      var fnStamp = fnStampRefs[i].current;
      fnStamp.setIframeDisabled(false);
    }

    this.setLines();
  }

  centerOnStamp(id, xOff, yOff) {
    var stampRef;

    if (id in this.state.fnStampRefs) {
      stampRef = this.state.fnStampRefs[id].current;
    } else if (id in this.state.blobStampRefs) {
      stampRef = this.state.blobStampRefs[id].current;
    } else if (
      this.state.consoleStamp.ref.current &&
      id === this.state.consoleStamp.ref.current.props.id
    ) {
      stampRef = this.state.consoleStamp.ref.current;
    }

    if (stampRef) {
      var cristalRef = stampRef.cristalRef.current;
      if (cristalRef) {
        var x = this.state.originX + cristalRef.state.x * this.state.scale,
          y = this.state.originY + cristalRef.state.y * this.state.scale,
          width = cristalRef.state.width,
          height = cristalRef.state.height;

        var newX =
          (window.innerWidth - xOff) / 2 +
          xOff -
          (width / 2) * this.state.scale;
        var newY =
          (window.innerHeight - yOff) / 2 +
          yOff -
          (height / 2) * this.state.scale;

        this.manualPan(newX - x, newY - y);
        cristalRef.changeZIndex();
      }
    }
  }

  manualPan(xDiff, yDiff) {
    $(".allStamps").css({ transition: "all .5s ease" });
    setTimeout(() => $(".allStamps").css({ transition: "" }), 500);
    ipc && ipc.send("edited");
    this.setState({
      originX: this.state.originX + xDiff,
      originY: this.state.originY + yDiff
    });
  }

  toggleHide(stampRef) {
    stampRef.toggleHide(() => this.setLayerPicker());
  }

  getFirstLine(text) {
    var firstN = text.length;

    for (var i = 0; i < text.length; i++) {
      if (text[i] === "\n") {
        if (firstN === text.length) {
          firstN = i;
        }
      }
    }

    if (firstN === 0) {
      return " ";
    }

    return text.substr(0, Math.min(firstN, 15));
  }

  getScale() {
    return this.state.scale;
  }

  setLayerPicker() {

    var pickerData = [];

    if (this.state.consoleStamp && this.state.consoleStamp.ref.current) {
      var consoleRef = this.state.consoleStamp.ref.current;
      pickerData.push({
        name: "console",
        status: !consoleRef.state.hidden,
        icon: consoleRef.getIcon(),
        centerCallback: (xOff, yOff) =>
          this.centerOnStamp(consoleRef.props.id, xOff, yOff),
        hideCallback: () => this.toggleHide(consoleRef),
        id: consoleRef.props.id
      });
    }

    var fnIds = Object.keys(this.state.fnStampRefs);
    var blobIds = Object.keys(this.state.blobStampRefs);
    var allIds = fnIds.concat(blobIds);
    allIds.map(id => {
      if (id in this.state.fnStampRefs) {
        var stampRef = this.state.fnStampRefs[id].current;
        if (!stampRef) {
          return;
        }
        var name = stampRef.state.name;
      } else if (id in this.state.blobStampRefs) {
        var stampRef = this.state.blobStampRefs[id].current;
        if (!stampRef) {
          return;
        }
        var name = this.getFirstLine(stampRef.state.code);
      }

      pickerData.push({
        name: name,
        icon: stampRef.getIcon(),
        status: !stampRef.state.hidden,
        centerCallback: (xOff, yOff) =>
          this.centerOnStamp(stampRef.props.id, xOff, yOff),
        hideCallback: () => this.toggleHide(stampRef),
        id: stampRef.props.id
      });
    });

    this.setState({ pickerData: pickerData });
  }

  getNumStamps() {
    return {
      fns: Object.keys(this.state.fnStampRefs).length,
      blobs: Object.keys(this.state.blobStampRefs).length
    };
  }

  render() {
    if (this.state.consoleStamp) {
      var consoleElem = this.state.consoleStamp.elem;
    } else {
      var consoleElem = null;
    }

    // var fnElems = [];
    // var blobElems = []

    // Object.values(this.state.fnStampElems).map(stamp => fnElems.push(stamp.elem));
    // Object.values(this.state.fnStampElems).map(stamp => blobElems.push(stamp.elem));



    return (
      <div>
        <div class="row bg-grey" style={{ height: "100vh" }}>
          <div
            className="allStamps"
            style={{
              position: "absolute",
              left: this.state.originX,
              top: this.state.originY,
              transform: "scale(" + this.state.scale + ")"
            }}
          >
            {Object.values(this.state.fnStampElems)}
            {Object.values(this.state.blobStampElems)}
            {consoleElem}
          </div>
        </div>

        <ControlBar
          getNumStamps={this.getNumStamps.bind(this)}
          requestCompile={this.requestCompile.bind(this)}
          pickerData={this.state.pickerData}
          addBlobStamp={this.addBlobStamp.bind(this)}
          addFnStamp={this.addFnStamp.bind(this)}
          disablePan={this.disablePan.bind(this)}
          disableZoom={this.disableZoom.bind(this)}
          loadStamperObject={this.loadStamperObject.bind(this)}
          updateControlBarDimensions={this.updateControlBarDimensions.bind(
            this
          )}
          modalManagerRef={this.modalManagerRef}
          recompileIfEnoughStamps={this.recompileIfEnoughStamps.bind(this)}
        />

        <ModalManager
          loadStamperObject={this.loadStamperObject.bind(this)}
          ref={this.modalManagerRef}
          loadStamperObject={this.loadStamperObject.bind(this)}
          getStamperObject={this.getStamperObject.bind(this)}
          getFileDict={this.getFileDict.bind(this)}
          addFnStamp={this.addFnStamp.bind(this)}
          requestCompile={this.requestCompile.bind(this)}
        />
      </div>
    );
  }
}
