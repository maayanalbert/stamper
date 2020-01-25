import React, { Component } from "react";
import Cristal from "./react-cristal/dist/es2015/index.js";
import $ from "jquery";
import { saveAs } from "file-saver";
import pf, { globals, p5Lib } from "./globals.js";
import Stamp from "./Stamp.js";
import ModalManager from "./ModalManager.js";
import ConsoleStamp from "./ConsoleStamp.js";
import ControlBar from "./ControlBar.js";


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
var mime = require('mime-types')

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
      stampRefs: {},
      stampElems:{},
      scale: 1,
      counter: 0,
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
      panDisabled: false,
      stampOrder:[],
      snapToGrid:false,
      worldName:null,
      worldAuthor:null,
      worldKey:null,
      worldPublishTime:null
    };
    this.counterMutex = new Mutex();
    this.modalManagerRef = React.createRef();

    this.onWheel = this.onWheel.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.gridSize = 50
    this.newStampMarginVariance = 100;
    this.newStampMargin = 20;
    this.space = 32;
    this.cmd = 91;
    this.ctrl = 17;
    this.plus = 187;
    this.minus = 189;
    this.zero = 48;
    this.g = 71
    this.shft = 16


  }


  componentDidMount() {


    

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
    } else if(this.state.downKey === this.shft){
      if(e.keyCode === this.g){

        var snapToGrid = this.state.snapToGrid
        this.setState({snapToGrid:!snapToGrid})
      }

    }else {
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

  recompileIfEnoughStamps(numFns) {

    if (
      this.state.stampOrder.length === numFns
    ) {
      this.requestCompile();
    }
  }

  loadStamperObject(stamperObject) {

    this.setState(
      {
        stampRefs: {},
    
        stampElems:{},
  
        counter: 0,
        htmlID: -1,
        scale: 1,
        consoleStamp: null,
        consoleId: -1,
        originX: 0,
        originY: 0,
        compiledBefore: false,
        stampOrder:[],      
        worldName:null,
      worldAuthor:null,
      worldKey:null,
      worldPublishTime:null
      },
      () => {

        this.setState(
          {
            scale: stamperObject.scale,
            originX: stamperObject.originX,
            originY: stamperObject.originY,
            worldName:stamperObject.worldName,
            worldAuthor:stamperObject.worldAuthor,
            worldKey:stamperObject.worldKey,
            worldPublishTime:stamperObject.worldPublishTime
          },
          () => {

           
            var callback = () => 
              this.recompileIfEnoughStamps(
                stamperObject.stamps.length
              );
            this.addConsoleStamp(stamperObject.console);
            this.addManyStamps(stamperObject.stamps, callback)

         
          }
        );
      }
    );
  }

  addManyStamps(datas, callback){
            var xPos = this.setInitialPosition("x")
            var yPos = this.setInitialPosition("y")
            var xPosBlob = xPos + 700
            var yPosBlob = yPos

            var xPosFile = xPos + 1200
            var yPosFile = yPos
datas.map(data => 
            {

              if(!data.x && !data.y){

                if(data.isBlob){
              data.x = xPosBlob
              data.y = yPosBlob
              xPosBlob += globals.copyOffset * 3
              yPosBlob += globals.copyOffset * 3
                }else if(data.isMediaFile || data.isIndex || data.isTxtFile){
              data.x = xPosFile
              data.y = yPosFile
              xPosFile += globals.copyOffset * 3
              yPosFile += globals.copyOffset * 3
                }else{
              data.x = xPos
              data.y = yPos
              xPos += globals.copyOffset * 3
              yPos += globals.copyOffset * 3
                }
              }

              this.addStamp(data, callback)
            })

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
      var stampId
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
      if(stampId){
      window.parent.postMessage({type:"error", message:message, lineno:adjLineNum, id:stampId}, '*')
      }

    }`;
  }

  // replaceFileStamps(parser) {
  //   this.state.stampOrder.map(id => {
  //     var item = this.state.stampRefs[id]
  //     if (item.current.props.isTxtFile) {
  //       var name = item.current.state.name;
  //       var code = item.current.state.code;

  //       var srcNodes = parser(`[src="${name}"]`);
  //       for (var i = 0; i < srcNodes.length; i++) {
  //         var singleNode = srcNodes.eq(i);
  //         var tagName = srcNodes.get(i).tagName;
  //         singleNode.replaceWith(`<${tagName}>${code}</${tagName}>`);
  //       }

  //       if (name.endsWith(".js")) {
  //         parser(`[href="${name}"]`).replaceWith(`<script>${code}</script>`);
  //       } else if (name.endsWith(".css")) {
  //         parser(`[href="${name}"]`).replaceWith(`<style>${code}</style>`);
  //       }
  //     }
  //   });
  // }

  loadAssets(htmlCode) {
    this.state.stampOrder.map(id => {
      var item = this.state.stampRefs[id]
      var name = item.current.state.name;
      var code = item.current.state.code;
      if(item.current.props.isTxtFile){
        code = item.current.state.dataUri

      }
      if (item.current.props.isTxtFile || item.current.props.isMediaFile) {
        htmlCode = htmlCode
          .split(`'${name}'`).join(`"${code}"`) 
          .split("`" + name + "`").join(`"${code}"`)
          .split(`"${name}"`).join(`"${code}"`)

      }
    });

    return htmlCode;
  }

  getHTML(id) {
    if (this.state.htmlID in this.state.stampRefs === false) {
      return "";
    }

    if (id === this.state.htmlID) {
      var runnableCode = "";
      var ranges = [];
    } else {
      var codeData = this.getRunnableCode(id);
      var runnableCode  = codeData.runnableCode

      var ranges = codeData.ranges;
    }

    var htmlStamp = this.state.stampRefs[this.state.htmlID];

    var html = htmlStamp.current.state.code;

    const parser = cheerio.load(html, { withStartIndices: true });

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
      this.state.stampRefs[this.state.htmlID].current.addErrorLine(-1);
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


    var html = parser.html()
    html = this.loadAssets(html)

    return html
  }

  addErrorLine(lineNum, id) {
    if (id in this.state.stampRefs) {
      this.state.stampRefs[id].current.addErrorLine(lineNum);
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
        getSnapMargin={this.getSnapMargin.bind(this)}

      />
    );

    var consoleStamp = { elem: elem, ref: ref };
    this.setState({ consoleStamp: consoleStamp, consoleId: stampID });
  }


  getUniqueID(){
    return   Math.random().toString(36).substr(2, 9)
  }

  addStamp(
    data,
    callback = () => null,
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
      isIndex: false,
      isTxtFile: false,
      isMediaFile: false,
      isBlob:false,
      hidden: false,
      zIndex: undefined,
      codeSize:globals.codeSize
    };

    Object.keys(defaults).map(setting => {
      if (setting in data) {
        defaults[setting] = data[setting];
      }
    });
    data = defaults;

    var ref = React.createRef();
    var stampID = this.getUniqueID()


    var elem = (
      <Stamp
        ref={ref}
        isIndex={data.isIndex}
        isTxtFile={data.isTxtFile}
        isMediaFile={data.isMediaFile}
        isBlob={data.isBlob}
        getExportableCode={this.getExportableCode.bind(this)}
        starterZIndex={data.zIndex}
        starterCode={data.code}
        starterArgs={data.args}
        starterName={data.name}
        errorLines={{}}
        starterEditorWidth={data.editorWidth}
        starterEditorHeight={data.editorHeight}
        initialPosition={{ x: data.x, y: data.y }}
        starterCodeSize={data.codeSize}
        id={stampID}
                setLayerPicker={this.setLayerPicker.bind(this)}
        deleteFrame={this.deleteFrame}
        initialHidden={data.hidden}
        onStartMove={this.onStartMove.bind(this)}
        onStopMove={this.onStopMove.bind(this)}
        addStamp={this.addStamp.bind(this)}
        onDelete={this.onDelete.bind(this)}
        starterIframeWidth={data.iframeWidth}
        starterIframeHeight={data.iframeHeight}
        checkAllNames={this.checkAllNames.bind(this)}
        disablePan={this.disablePan.bind(this)}
        iframeDisabled={data.iframeDisabled}
        requestCompile={this.requestCompile.bind(this)}
        getHTML={this.getHTML.bind(this)}
        addNewIframeConsole={this.addNewIframeConsole.bind(this)}
        getScale={this.getScale.bind(this)}
        getSnapMargin={this.getSnapMargin.bind(this)}
      />
    );

        if (data.isIndex) {
      this.setState({ htmlID: stampID });
    }

    this.addStampToState(ref, elem, stampID, callback)

}



  async addStampToState(ref, elem, id, callback){
     const release = await this.counterMutex.acquire();
    var stampRefs = Object.assign({}, this.state.stampRefs);
    var stampElems = Object.assign({}, this.state.stampElems);
    var stampOrder = Object.assign([], this.state.stampOrder)
    stampRefs[id] = ref;
    stampElems[id] = elem
    stampOrder.push(id)




    this.setState(
      {
        stampRefs: stampRefs,
        stampElems:stampElems, 

        stampOrder:stampOrder

      },
          () => {
            release()
callback(id)
          }

  )
  }


  addNewIframeConsole(newConsole) {
    if (this.state.consoleStamp === null) {
      return;
    }
    this.state.consoleStamp.ref.current.addNewIframeConsole(newConsole);
  }

  checkForSetup() {
    var newSetupExists = false;
    var stampRefs = Object.values(this.state.stampRefs);
    for (var i = 0; i < stampRefs.length; i++) {
      var stampRef = stampRefs[i].current;

      if (stampRef.state.name === "setup") {
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

    this.state.stampOrder.map(id => {
      var item = this.state.stampRefs[id]
      var code = item.current.state.code
      var name = item.current.state.name
      if(item.current.props.isTxtFile || item.current.props.isIndex){
        fileDict[name] = {content:code, type:'text'}
      }else if(item.current.props.isMediaFile){
        fileDict[name] = {content:code, type:"media"}
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

    // if (this.state.compiledBefore === false) {
    //   this.setState({ compiledBefore: true });
    // } else {
    //   ipc && ipc.send("edited");
    // }

    // this.recursiveCompileStamp(id, {}, newTraversalGraph, duplicateNamedStamps)

    // this.recursiveCompileStamp(id, {}, oldTravarsalGraph, duplicateNamedStamps)

    this.state.stampOrder.map(id => {
      var stamp = this.state.stampRefs[id]
      var stampRef = stamp.current;
      if (stampRef) {
        var newErrors = [];
        if (
          stampRef.props.id in duplicateNamedStamps &&
          stampRef.props.isIndex === false
        ) {
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

    if (id in this.state.stampRefs) {
      var stampRef = this.state.stampRefs[id].current;
    } else {
      return;
    }

    if (stampRef) {
      var newErrors = [];

      if (
        stampRef.props.id in duplicateNamedStamps &&
        stampRef.props.isIndex === false
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
    this.state.stampOrder.map(id => {
      var stamp = this.state.stampRefs[id]
      if(stamp.current.props.isBlob){return}
      if (stamp.current) {
        var name = stamp.current.state.name;
        if (!(name in nameDict)) {
          nameDict[name] = 0;
        }
        nameDict[name] += 1;
      }
    });
    var duplicateNamedStamps = {};
    this.state.stampOrder.map(id => {
      var stamp = this.state.stampRefs[id]
      if(stamp.current.props.isBlob){return}


      if(stamp.current.props.isTxtFile || stamp.current.props.isMediaFile){
        var mimeType = mime.lookup(stamp.current.state.name)
        if(!mimeType){
          duplicateNamedStamps[stamp.current.props.id] = ""
          this.state.consoleStamp.ref.current.logToConsole(
            `Stamper Error: The file extension '.${stamp.current.state.name.split(".")[stamp.current.state.name.split(".").length -1]}' is invalid.`
          );
        }
      }
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


    this.state.stampOrder.map(id => {
      var stamp = this.state.stampRefs[id]
      if(stamp.current.props.isTxtFile  ||
        stamp.current.props.isIndex ||
        stamp.current.props.isMediaFile ){
        return
      }


      if(stamp.current.props.isBlob){
        var code = "\n" + stamp.current.state.code + "\n";
            curLine = this.addCodeBlock(
          code,
          stamp.current.props.id,
          runnableCode,
          ranges,
          curLine,
          false
        );
      }else {
        var state = stamp.current.state;
        var contents = state.code.split("\n").join("\n  ")

        var code = `function ${state.name}(${state.args}){\n  ${contents}\n}`;
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
    code = code + "\n";
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

    // Object.keys(this.state.blobStampRefs).map(id => {
    //   var stampRef = this.state.blobStampRefs[id].current;
    //   var code = stampRef.state.code;
    //   var identifiers = parser.getIdentifiers(code);

    //   if (identifiers) {
    //     identifiers.declared.map(identifier => (declaredDict[identifier] = id));
    //     identifiers.undeclared.map(identifier =>
    //       undeclaredArr.push([identifier, id])
    //     );
    //   }
    // });

    this.state.stampOrder.map(id => {
      var stampRef = this.state.stampRefs[id].current;

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

    // this.state.stampOrder.map(id => {
    //   if (id != this.state.htmlID && id != this.state.cssID && id != setupID) {
    //     lineData.push([id, setupID]);
    //     if (setupID in traversalGraph === false) {
    //       traversalGraph[setupID] = [];
    //     }
    //     traversalGraph[setupID].push(id);
    //   }
    // });

    this.setState({ lineData: lineData }, () => this.setLines());

    // this.state.stampOrder.map(id => {
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


    this.state.stampOrder.map(id => {
      var stamp = this.state.stampRefs[id]
      if (
        stamp.current.state.name != "draw" &&
        stamp.current.props.isTxtFile === false &&
        stamp.current.props.isMediaFile === false &&
        stamp.current.props.isIndex === false &&
        (this.isListener(stamp.current.state.name) === false ||
          this.isListener(this.state.stampRefs[id].current.state.name) ===
            false)
      ) {
        var state = stamp.current.state;
        if(stamp.current.props.isBlob){

          var code = state.code

          curLine = this.addCodeBlock(
          code,
          stamp.current.props.id,
          runnableCode,
          ranges,
          curLine,
          false
        );
        }else{
          var code = `function ${state.name}(${state.args}){\n${state.code}\n}`;
          curLine = this.addCodeBlock(
          code,
          stamp.current.props.id,
          runnableCode,
          ranges,
          curLine,
          true
        );
        }
      }
    });

    if (
      id in this.state.stampRefs == false ||
      this.state.stampRefs[id].current === null
    ) {
      return runnableCode.join("");
    }

    var stampRef = this.state.stampRefs[id].current;
    var state = stampRef.state;
    if (state.name === "draw" || this.isListener(state.name)) {
      var fullFun = `function ${state.name}(${state.args}){\n${state.code}\n}`;
      curLine = this.addCodeBlock(
        fullFun,
        stampRef.props.id,
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
        stampRef.props.id,
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
window.parent.postMessage({type:"loop", message:"stop", id:"${id}"}, '*')
var _userSetLoop = true
var _stopLooping = setTimeout(() => {
 noLoop() 
}, 1000)

document.addEventListener('mouseenter', () => {
clearTimeout(_stopLooping)
window.parent.postMessage({type:"loop", message:"start", id:"${id}"}, '*')
if(_isLooping){

loop()
}

});

document.addEventListener('mouseleave', () => {
  window.parent.postMessage({type:"loop", message:"stop", id:"${id}"}, '*')
_stopLooping =setTimeout(() => {
 noLoop() 
}, 1000)
});

`;

    runnableCode = runnableCode.split("noLoop()").join(`noLoop(); _isLooping = false`)


    runnableCode = runnableCode.split("loop()").join(`loop(); _isLooping = true`)


    runnableCode = runnableCode + loopingCallbacks;


    return runnableCode;
  }

  isListener(name) {
    return name in globals.specialFns && globals.specialFns[name] === false;
  }

  onDelete(id) {
    ipc && ipc.send("edited");

    if(id in this.state.stampRefs){
      var stampRefs = Object.assign({}, this.state.stampRefs);
      var stampElems = Object.assign({}, this.state.stampElems);
      delete stampRefs[id]
      stampElems[id] = (<span hidden={true}/>)

      var stampOrder = Object.assign([], this.state.stampOrder)
      stampOrder.splice(stampOrder.indexOf(id), 1)
      this.setState({stampRefs:stampRefs, stampElems:stampElems, stampOrder:stampOrder}, () => 
        this.requestCompile(id))
    }

  }

  refreshConsoleStamp(consoleStamp) {
    var data = consoleStamp.ref.current.getData();
    this.setState({ consoleStamp: null }, () => this.addConsoleStamp(data));
  }

  getStamperObject(id) {
    var data = {
      stamps: [],
      scale: this.state.scale,
      console: this.state.consoleStamp.ref.current.getData(),
      originX: this.state.originX,
      originY: this.state.originY,
      worldName:this.state.worldName,
      worldAuthor:this.state.worldAuthor,
      worldKey:this.state.worldKey,
      worldPublishTime:this.state.worldPublishTime
    };
    this.state.stampOrder.map(stampID => {
      if (stampID != id) {
        var stamp = this.state.stampRefs[stampID];
        data.stamps.push(stamp.current.getData());
      }
    });



    return data;
  }


  onStartMove() {
    var stampRefs = this.state.stampRefs;
    for (var i in stampRefs) {
      var stamp = stampRefs[i].current;

      stamp.setIframeDisabled(true);
    }

    this.setState({ lines: [] });
  }

  onStopMove(s) {
    this.setState({ mouseWheelTimeout: null });
    var stampRefs = this.state.stampRefs;
    for (var i in stampRefs) {
      var stamp = stampRefs[i].current;
      stamp.setIframeDisabled(false);
    }

    this.setLines();
  }

  centerOnStamp(id, xOff, yOff) {
    var stampRef;

    if (id in this.state.stampRefs) {
      stampRef = this.state.stampRefs[id].current;
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

  getSnapMargin(){
    if(this.state.snapToGrid){
      return this.calcSnapMargin()
    }else{
      return 0
    }

  }

  onDragEnd(result){

    if(!result.destination){
      return
    }


    if(result.source.index === 0 || result.destination.index === 0){return}
    var stampOrder = Object.assign([], this.state.stampOrder)

    const [removed] = stampOrder.splice(result.source.index-1, 1);
    stampOrder.splice(result.destination.index-1, 0, removed);



    this.setState({stampOrder:[]}, 
      () => {
        this.setLayerPicker()
        this.setState({stampOrder:stampOrder}, () => this.setLayerPicker())
      }
    )

  }
  calcSnapMargin(){
    var snapMargin = Math.max(Math.round(1/this.state.scale) * 20, 5)
    return snapMargin
  }

  renderGridLines(){

    if(this.state.snapToGrid === false){
      return null
    }

    var gridLines = []

    var borderWidth = Math.max(Math.round(1/this.state.scale), .5)
    var snapMargin = this.calcSnapMargin()

    var roundedScale = Math.round(1/this.state.scale)

    var actualOriginX = -this.state.originX

    // var x0 = -Math.round(this.state.originX /snapMargin)*snapMargin
    // var y0 = -Math.round(this.state.originY/snapMargin)*snapMargin

    var x0 = -this.state.originX/this.state.scale
    var y0 = -this.state.originY/this.state.scale

    var roundedX0 = Math.round(x0/snapMargin)*snapMargin
    var roundedY0 = Math.round(y0/snapMargin)*snapMargin

    var width = window.innerWidth/this.state.scale
    var height = window.innerHeight/this.state.scale

    var x = roundedX0

    while(x < width + x0){
      gridLines.push(<span className="border-borderGrey"
        style={{position:"absolute", top:roundedY0, height:height, 
        width:10, left:x, background:"transparent",  borderLeft:borderWidth +"px solid" }} />)
      x += snapMargin
    }

    var y = roundedY0

    while(y < height+ y0){
   
      gridLines.push(<span className="border-borderGrey"
        style={{position:"absolute", top:y, height:10, 
        width:width, left:roundedX0, background:"transparent", 
        borderTop:borderWidth +"px solid"}} />)
      y += snapMargin
    }

    return gridLines
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
        id: consoleRef.props.id,
        isConsole:true
      });
    }

    this.state.stampOrder.map(id => {
      if (id in this.state.stampRefs) {
        var stampRef = this.state.stampRefs[id].current;
        if (!stampRef) {
          return;
        }
        if(stampRef.props.isBlob){
var name = this.getFirstLine(stampRef.state.code);
        }else{
        var name = stampRef.state.name;
        }

      }

      pickerData.push({
        name: name,
        icon: stampRef.getIcon(),
        status: !stampRef.state.hidden,
        centerCallback: (xOff, yOff) =>
          this.centerOnStamp(stampRef.props.id, xOff, yOff),
        hideCallback: () => this.toggleHide(stampRef),
        id: stampRef.props.id,
        isConsole:false,
        hasError:Object.keys(stampRef.state.errorLines).length > 0
      });
    });

    this.setState({ pickerData: pickerData });
  }

  getNumStamps() {
    return {
      stamps: this.state.stampOrder.length
    };
  }

  getWorldData(){
    return {worldName:this.state.worldName, worldAuthor:this.state.worldAuthor, 
            worldKey:this.state.worldKey, worldPublishTime:this.state.worldPublishTime}
  }


  render() {
    if (this.state.consoleStamp) {
      var consoleElem = this.state.consoleStamp.elem;
    } else {
      var consoleElem = null;
    }



    return (
      <div>
        <div class="row bg-grey" 
        style={{ height: "100vh" }}>
          <div
            className="allStamps"
            style={{
              position: "absolute",
              left: this.state.originX,
              top: this.state.originY,
              transform: "scale(" + this.state.scale + ")"
            }}
          >
            {this.renderGridLines()}
            {Object.values(this.state.stampElems)}
            {consoleElem}
          </div>
        </div>

        <ControlBar
        addManyStamps = {this.addManyStamps.bind(this)}
          getNumStamps={this.getNumStamps.bind(this)}
          requestCompile={this.requestCompile.bind(this)}
          pickerData={this.state.pickerData}
          addStamp={this.addStamp.bind(this)}
          disablePan={this.disablePan.bind(this)}
          disableZoom={this.disableZoom.bind(this)}
          loadStamperObject={this.loadStamperObject.bind(this)}
          updateControlBarDimensions={this.updateControlBarDimensions.bind(
            this
          )}
          ref={this.controlBarRef}
          modalManagerRef={this.modalManagerRef}
          onDragEnd={this.onDragEnd.bind(this)}
          recompileIfEnoughStamps={this.recompileIfEnoughStamps.bind(this)}
          getWorldData = {this.getWorldData.bind(this)}
        />

        <ModalManager
          loadStamperObject={this.loadStamperObject.bind(this)}
          ref={this.modalManagerRef}
          loadStamperObject={this.loadStamperObject.bind(this)}
          getStamperObject={this.getStamperObject.bind(this)}
          getFileDict={this.getFileDict.bind(this)}
          addStamp={this.addStamp.bind(this)}
          requestCompile={this.requestCompile.bind(this)}
          getWorldData={this.getWorldData.bind(this) }
          setWorldData={(data, callback) => this.setState(data, callback)}
        />
      </div>
    );
  }
}
