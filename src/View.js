import React, { Component } from "react";
import Cristal from "./react-cristal/dist/es2015/index.js";
import $ from "jquery";
import { saveAs } from "file-saver";
import pf, { globals, p5Lib } from "./globals.js";
import FunctionStamp from "./FunctionStamp.js";
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

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/javascript";

var _ = require("lodash");

var esprima = require("esprima");

var userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(" electron/") > -1) {
  const electron = window.require("electron");
  var ipc = electron.ipcRenderer;
} else {
  var ipc = false;
}

const defaultSetup = require("./defaultSetup.js");

export default class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fnStamps: {},
      scale: 1,
      counter: 0,
      blobStamps: {},
      htmlID: -1,
      cssID: -1,
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
      originCristal: null,
      pickerData: [],
      sideBarWidth:0,
      topBarHeight:0

    };
    this.counterMutex = new Mutex();
    this.aceRef = React.createRef()
    this.newStampMarginVariance = 100;
        this.newStampMargin = 20;

    ipc &&
      ipc.on("writeToView", (event, files) => 

            this.loadStamperFile(files.stamper)
      );

    ipc &&
      ipc.on("resetView", (event) => 

           this.loadStamperFile(defaultSetup.getSetup())
      );

    ipc &&
      ipc.on("requestSave", (event, rawCode) => {
        this.sendSaveData();
      });
  }

  componentDidMount() {
    this.loadStamperFile(defaultSetup.getSetup());
    document.addEventListener("mousedown", this.onGlobalMouseDown);
  }

  updateControlBarDimensions(sideBarWidth, topBarHeight){
    console.log(sideBarWidth, topBarHeight)
    this.setState({sideBarWidth:sideBarWidth, topBarHeight:topBarHeight})
  }

  loadStamperFile(stamperFile) {
        this.setState(
          {
            fnStamps: {},
            blobStamps: {},
            counter: 0,
            htmlID: -1,
            cssID: -1,
            scale: 1,
            consoleStamp: null,
            consoleId: -1,
            originX: 0,
            originY: 0,
            originCristal: null
          },
          () => {


    this.setState(
      {
        scale: stamperFile.scale,
        originX: stamperFile.originX,
        originY: stamperFile.originY
      },
      () => {
        this.addConsoleStamp(stamperFile.console);
        stamperFile.fns.map(data => this.addFnStamp(data));
        stamperFile.blobs.map(data => this.addBlobStamp(data));

        this.setOriginCristal()
      }
    )

          }
)

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

  getHTML(id) {
    if (
      this.state.htmlID in this.state.fnStamps === false ||
      this.state.cssID in this.state.fnStamps === false
    ) {
      return "";
    }

    if (id === this.state.htmlID || id === this.state.cssID) {
      var runnableCode = "";
      var ranges = [];
    } else {
      var codeData = this.getRunnableCode(id);
      var runnableCode = codeData.runnableCode;
      var ranges = codeData.ranges;
    }

    var htmlStamp = this.state.fnStamps[this.state.htmlID];
    var cssStamp = this.state.fnStamps[this.state.cssID];

    var html = htmlStamp.ref.current.state.code;

    const parser = cheerio.load(html, { withStartIndices: true });
    var jsBlockStr =
      "<script type='text/javascript'>" + runnableCode + "</script>";
    var cssBlockStr =
      "<style>" + cssStamp.ref.current.state.runnableInnerCode + "</style>";
    var jsSelector = '[src="sketch.js"]';
    var cssSelector = '[href="style.css"]';

    var jsBlock = parser(jsBlockStr);
    var cssBlock = parser(cssBlockStr);

    // const start = parser(jsSelector).get(0).startIndex;

    var htmlAsksForCss = parser(cssSelector).length > 0;
    if (htmlAsksForCss === false && this.state.htmlAsksForCss === true) {
      this.state.consoleStamp.ref.current.logToConsole(
        `Stamper Error: Your index.html is missing a div for style.css. Make sure you're linking to style.css and not another stylesheet.`
      );
      this.state.fnStamps[this.state.htmlID].ref.current.addErrorLine(-1);
      this.setState({ htmlAsksForCss: htmlAsksForCss });
    } else if (htmlAsksForCss === true && this.state.htmlAsksForCss === false) {
      this.setState({ htmlAsksForCss: htmlAsksForCss });
    }

    var htmlAsksForJs = parser(jsSelector).length > 0;
    if (htmlAsksForJs === false && this.state.htmlAsksForJs === true) {
      this.state.consoleStamp.ref.current.logToConsole(
        `Stamper Error: Your index.html is missing a div for sketch.js. Make sure you're linking to sketch.js and not another sketch file.`
      );
      this.state.fnStamps[this.state.htmlID].ref.current.addErrorLine(-1);
      this.setState({ htmlAsksForJs: htmlAsksForJs });
    } else if (htmlAsksForJs === true && this.state.htmlAsksForJs === false) {
      this.setState({ htmlAsksForJs: htmlAsksForJs });
    }

    parser(cssSelector).replaceWith(cssBlock);

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
      "<script class='errorListener' >" +
        this.getIframeErrorCallBack(ranges, linesToJs) +
        "</script>"
    );
    parser(jsSelector).replaceWith(jsBlock);
    return parser.html();
  }

  addErrorLine(lineNum, id) {
    if (id in this.state.fnStamps) {
      this.state.fnStamps[id].ref.current.addErrorLine(lineNum);
    } else if (id in this.state.blobStamps) {
      this.state.blobStamps[id].ref.current.addErrorLine(lineNum);
    }
  }

  manualZoom(newScale, mouseX, mouseY) {
    if (this.state.scale === 1) {
      return;
    }

    Object.values(this.state.fnStamps).map(fnStamp =>
      fnStamp.ref.current.cristalRef.current.zoom(newScale, mouseX, mouseY)
    );
    Object.values(this.state.blobStamps).map(varStamp =>
      varStamp.ref.current.cristalRef.current.zoom(newScale, mouseX, mouseY)
    );

    this.state.console.ref.current.zoom(newScale, mouseX, mouseY);
    this.cristalRef.current.zoom(newScale, mouseX, mouseY);
    this.setState({ scale: newScale });
  }

  setInitialPosition(dimension) {
    if(dimension === "x"){
      return this.state.sideBarWidth +
      this.newStampMargin +
      Math.random() * this.newStampMarginVariance;
    }else if(dimension === "y"){
      return this.state.topBarHeight +
      this.newStampMargin +
      Math.random() * this.newStampMarginVariance;
    }
  }

  addConsoleStamp(data) {
    var defaults = {
      x: this.setInitialPosition("x"),
      y: this.setInitialPosition("y"),
      consoleWidth: globals.defaultEditorWidth,
      consoleHeight: globals.defaultVarEditorHeight,
      hidden: false,
      originX: 0,
      originY: 0
    };

    Object.keys(defaults).map(setting => {
      if ((setting in data)) {
        defaults[setting] = data[setting];
      }
    });
    data = defaults

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

    var elem = (
      <ConsoleStamp
        initialScale={this.state.scale}
        ref={ref}
        initialPosition={{ x: x, y: y }}
        id={counter}
        onStartMove={this.onStartMove.bind(this)}
        onStopMove={this.onStopMove.bind(this)}
        initialScale={this.state.scale}
        disablePan={this.disablePan.bind(this)}
        starterConsoleWidth={consoleWidth}
        starterConsoleHeight={consoleHeight}
        addErrorLine={this.addErrorLine.bind(this)}
        initialHidden={data.hidden}
        initialOriginX={data.originX}
        initialOriginY={data.originY}
      />
    );

    var consoleStamp = { elem: elem, ref: ref };
    this.setState({ consoleStamp: consoleStamp, consoleId: counter });
  }

  addFnStamp(
    data,
    updateName = false,
    updatePosition = false,
    setIframeDisabled = false,
    callback = () => null
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
      isCss: false,
      hidden: false,
      originX: 0,
      originY: 0
    };

    Object.keys(defaults).map(setting => {
      if ((setting in data)) {
        defaults[setting] = data[setting];
      }
    });
    data = defaults

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
    this.refreshBlobStamps(this.state.blobStamps);
    return newName;
  }

  async createFnStamp(data, callback) {
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
      isCss = data.isCss,
      hidden = data.hidden;

    const release = await this.counterMutex.acquire();
    var counter = this.state.counter;
    this.setState({ counter: counter + 1 }, release());

    var fnStamps = this.state.fnStamps;
    var ref = React.createRef();

    var elem = (
      <FunctionStamp
        ref={ref}
        isHtml={isHtml}
        isCss={isCss}
        starterCode={code}
        starterArgs={args}
        starterName={name}
        errorLines={{}}
        starterEditorWidth={editorWidth}
        starterEditorHeight={editorHeight}
        initialPosition={{ x: x, y: y }}
        id={counter}
        deleteFrame={this.deleteFrame}
        initialHidden={hidden}
        initialOriginX={data.originX}
        initialOriginY={data.originY}
        onStartMove={this.onStartMove.bind(this)}
        onStopMove={this.onStopMove.bind(this)}
        addStamp={this.addFnStamp.bind(this)}
        onDelete={this.onDelete.bind(this)}
        initialScale={this.state.scale}
        starterIframeWidth={iframeWidth}
        starterIframeHeight={iframeHeight}
        checkAllNames={this.checkAllNames.bind(this)}
        disablePan={this.disablePan.bind(this)}
        iframeDisabled={iframeDisabled}
        requestCompile={this.requestCompile.bind(this)}
        getHTML={this.getHTML.bind(this)}
        getScale={() => {
          return this.state.scale;
        }}
        addNewIframeConsole={this.addNewIframeConsole.bind(this)}
      />
    );

    fnStamps[counter] = { elem: elem, ref: ref };


    this.setState({ fnStamps: fnStamps }, callback);

    if (isHtml) {
      this.setState({ htmlID: counter });
    } else if (isCss) {
      this.setState({ cssID: counter });
    }
  }

  addNewIframeConsole(newConsole) {
    if (this.state.consoleStamp === null) {
      return;
    }
    this.state.consoleStamp.ref.current.addNewIframeConsole(newConsole);
  }

  addBlobStamp(data, updatePosition = false,
    callback = () => null) {
    var defaults = {
      code: "var z = 10",
      x: this.setInitialPosition("x"),
      y: this.setInitialPosition("y"),
      editorWidth: globals.defaultEditorWidth,
      editorHeight: globals.defaultVarEditorHeight,
      hidden: false,
      originX: 0,
      originY: 0,
      codeSize:globals.codeSize
    };

    Object.keys(defaults).map(setting => {
      if ((setting in data)) {
        defaults[setting] = data[setting];
      }
    });
    data = defaults
    
    if (updatePosition) {
      data.x += globals.copyOffset * 2 * this.state.scale;
      data.y += globals.copyOffset * 2 * this.state.scale;
    }

    this.createBlobStamp(data, callback);
  }

  async createBlobStamp(data, callback) {
    var x = data.x,
      y = data.y,
      code = data.code,
      editorWidth = data.editorWidth,
      editorHeight = data.editorHeight,
      errorLines = data.errorLines,
      hidden = data.hidden;
    const release = await this.counterMutex.acquire();
    var counter = this.state.counter;
    this.setState({ counter: counter + 1 }, release());

    var blobStamps = this.state.blobStamps;
    var ref = React.createRef();

    var elem = (
      <BlobStamp
        ref={ref}
        starterCode={code}
        errorLines={{}}
        initialPosition={{ x: x, y: y }}
        id={counter}
        starterCodeSize ={data.codeSize}
        deleteFrame={this.deleteFrame}
        initialHidden={hidden}
        initialOriginX={data.originX}
        initialOriginY={data.originY}
        onStartMove={this.onStartMove.bind(this)}
        onStopMove={this.onStopMove.bind(this)}
        addStamp={this.addBlobStamp.bind(this)}
        onDelete={this.onDelete.bind(this)}
        initialScale={this.state.scale}
        disablePan={this.disablePan.bind(this)}
        starterEditorWidth={editorWidth}
        starterEditorHeight={editorHeight}
        requestCompile={this.requestCompile.bind(this)}
        getExportableCode={this.getExportableCode.bind(this)}
      />
    );

    blobStamps[counter] = { elem: elem, ref: ref };
    this.setState({ blobStamps: blobStamps }, callback);
  }

  getFileData(){
    if (
      this.state.htmlID in this.state.fnStamps === false ||
      this.state.cssID in this.state.fnStamps === false
    ) {
      return;
    }
    var htmlStamp = this.state.fnStamps[this.state.htmlID];
    var cssStamp = this.state.fnStamps[this.state.cssID];

    var fileData = {
      html: htmlStamp.ref.current.state.code,
      stamper: this.getAllData(),
      css: cssStamp.ref.current.state.code,
      js: this.getExportableCode()
    };

    return fileData    
  }

  sendSaveData() {
    var fileData = this.getFileData()
    if(fileData){
    ipc && ipc.send("save", fileData);
    }

  }

  checkForSetup() {
    var newSetupExists = false;
    var fnStamps = Object.values(this.state.fnStamps);
    for (var i = 0; i < fnStamps.length; i++) {
      var fnStampRef = fnStamps[i].ref.current;

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

  requestCompile(id) {
    // var newTraversalGraph = this.setLineData()
    // var oldTravarsalGraph = this.state.traversalGraph
    // this.setState({traversalGraph:newTraversalGraph})
    this.state.consoleStamp.ref.current.logToConsole("Updated code", "debug");

    this.setLayerPicker();

    var duplicateNamedStamps = this.checkAllNames();

    this.checkForSetup();



    this.sendSaveData();

    // this.compileStamp(id, {}, newTraversalGraph, duplicateNamedStamps)

    // this.compileStamp(id, {}, oldTravarsalGraph, duplicateNamedStamps)

    Object.values(this.state.fnStamps).map(stamp => {
      var stampRef = stamp.ref.current;
      if (stampRef) {
        var newErrors = [];
        if (
          stampRef.props.id in duplicateNamedStamps &&
          stampRef.props.isCss === false &&
          stampRef.props.isHtml === false
        ) {
          newErrors.push(0);
        }

        stampRef.clearErrorsAndUpdate(newErrors);
      }
    });

    Object.values(this.state.blobStamps).map(stamp => {
      var stampRef = stamp.ref.current;
      if (stampRef) {
        var newErrors = [];

        if (
          stampRef.props.id in duplicateNamedStamps &&
          stampRef.props.isCss === false &&
          stampRef.props.isHtml === false
        ) {
          newErrors.push(0);
        }

        stampRef.clearErrorsAndUpdate(newErrors);
      }
    });
  }

  compileStamp(id, seen, traversalGraph, duplicateNamedStamps) {
    if (id in seen) {
      return;
    } else {
      seen[id] = "";
    }

    if (id in this.state.fnStamps) {
      var stampRef = this.state.fnStamps[id].ref.current;
    } else if (id in this.state.blobStamps) {
      var stampRef = this.state.blobStamps[id].ref.current;
    } else {
      return;
    }

    if (stampRef) {
      var newErrors = [];

      if (
        stampRef.props.id in duplicateNamedStamps &&
        stampRef.props.isCss === false &&
        stampRef.props.isHtml === false
      ) {
        newErrors.push(0);
      }

      stampRef.clearErrorsAndUpdate(newErrors);

      if (id in traversalGraph === false) {
        return;
      }
      traversalGraph[id].map(id =>
        this.compileStamp(id, seen, traversalGraph, duplicateNamedStamps)
      );
    }
  }

  setOriginCristal(panDisabled = false){
      var originCristal = (
        <Cristal
         parentID = {-1}
          panDisabled = {panDisabled}
          className=" bg-grey"
          closeHidden
          headerHidden
          copyHidden
          isResizable={false}
          initialPosition={{ x: this.state.originX, y: this.state.originY }}
          initialScale={this.state.scale}
          onStopMove={s =>
            this.setState({ originX: s.x, originY: s.y, scale: s.scale })
          }
        ></Cristal>
      );
      this.setState({ originCristal: originCristal });

  }

  disablePan(status) {
    this.setOriginCristal(status)

    Object.values(this.state.fnStamps).map(stamp => {
      var cristalRef = stamp.ref.current.cristalRef;
      cristalRef.current && cristalRef.current.disablePan(status);
    });

    Object.values(this.state.blobStamps).map(stamp => {
      var cristalRef = stamp.ref.current.cristalRef;
      cristalRef.current && cristalRef.current.disablePan(status);
    });

    var consoleCristalRef = this.state.consoleStamp.ref.current.cristalRef;
    consoleCristalRef.current && consoleCristalRef.current.disablePan(status);
  }

  disableZoom(status) {
    this.setOriginCristal(status)

    Object.values(this.state.fnStamps).map(stamp => {
      var cristalRef = stamp.ref.current.cristalRef;
      cristalRef.current && cristalRef.current.disableZoom(status);
    });

    Object.values(this.state.blobStamps).map(stamp => {
      var cristalRef = stamp.ref.current.cristalRef;
      cristalRef.current && cristalRef.current.disableZoom(status);
    });

    var consoleCristalRef = this.state.consoleStamp.ref.current.cristalRef;
    consoleCristalRef.current && consoleCristalRef.current.disableZoom(status);
  }

  checkAllNames() {
    var nameDict = {};
    Object.values(this.state.fnStamps).map(stamp => {
      if (stamp.ref.current) {
        var name = stamp.ref.current.state.name;
        if (!(name in nameDict)) {
          nameDict[name] = 0;
        }
        nameDict[name] += 1;
      }
    });

    var duplicateNamedStamps = {};
    Object.values(this.state.fnStamps).map(stamp => {
      if (stamp.ref.current) {
        var stampRef = stamp.ref.current;
        var name = stamp.ref.current.state.name;
        if (nameDict[name] > 1) {
          duplicateNamedStamps[stamp.ref.current.props.id] = "";

          this.state.consoleStamp.ref.current.logToConsole(
            `Stamper Error: Multiple functions shouldn't have the same name. Consider channging one of your ${name}s to something else.`
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

    Object.values(this.state.blobStamps).map(blobStamp => {
      code = blobStamp.ref.current.state.code;
      curLine = this.addCodeBlock(
        code,
        blobStamp.ref.current.props.id,
        runnableCode,
        ranges,
        curLine,
        false
      );
    });

    Object.values(this.state.fnStamps).map(stamp => {
      if (
        stamp.ref.current.props.isCss === false &&
        stamp.ref.current.props.isHtml === false 
      ) {
        var state = stamp.ref.current.state;
        code = `function ${state.name}(${state.args}){\n${state.code}\n}`;
        curLine = this.addCodeBlock(
          code,
          stamp.ref.current.props.id,
          runnableCode,
          ranges,
          curLine,
          true
          )
      }
    });

    return runnableCode.join("");
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

    Object.keys(this.state.blobStamps).map(id => {
      var stampRef = this.state.blobStamps[id].ref.current;
      var code = stampRef.state.code;
      var identifiers = parser.getIdentifiers(code);

      if (identifiers) {
        identifiers.declared.map(identifier => (declaredDict[identifier] = id));
        identifiers.undeclared.map(identifier =>
          undeclaredArr.push([identifier, id])
        );
      }
    });

    Object.keys(this.state.fnStamps).map(id => {
      var stampRef = this.state.fnStamps[id].ref.current;

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

    Object.keys(this.state.fnStamps).map(id => {
      if (id != this.state.htmlID && id != this.state.cssID && id != setupID) {
        lineData.push([id, setupID]);
        if (setupID in traversalGraph === false) {
          traversalGraph[setupID] = [];
        }
        traversalGraph[setupID].push(id);
      }
    });

    this.setState({ lineData: lineData }, () => this.setLines());

    Object.keys(this.state.fnStamps).map(id => {
      if (id != this.state.htmlID && id != this.state.cssID) {
        if (this.state.htmlID in traversalGraph === false) {
          traversalGraph[this.state.htmlID] = [];
        }
        traversalGraph[this.state.htmlID].push(id);
      }
    });

    traversalGraph[this.state.cssID] = [this.state.htmlID];

    return traversalGraph;
  }

  getRunnableCode(id) {
    var runnableCode = [];
    var ranges = [];
    var curLine = 1;
    var code;

    Object.values(this.state.blobStamps).map(blobStamp => {
      code = blobStamp.ref.current.state.code;
      curLine = this.addCodeBlock(
        code,
        blobStamp.ref.current.props.id,
        runnableCode,
        ranges,
        curLine,
        false
      );
    });

    Object.values(this.state.fnStamps).map(stamp => {
      if (
        stamp.ref.current.state.name != "draw" &&
        stamp.ref.current.props.isCss === false &&
        stamp.ref.current.props.isHtml === false  && 
        (this.isListener(stamp.ref.current.state.name) === false || this.isListener(this.state.fnStamps[id].ref.current.state.name)  === false)

      ) {
        var state = stamp.ref.current.state;
        code = `function ${state.name}(${state.args}){\n${state.code}\n}`;
        curLine = this.addCodeBlock(
          code,
          stamp.ref.current.props.id,
          runnableCode,
          ranges,
          curLine,
          true
        );
      }
    });

    if (
      id in this.state.fnStamps == false ||
      this.state.fnStamps[id].ref.current === null
    ) {
      return runnableCode.join("");
    }

    var fnStampRef = this.state.fnStamps[id].ref.current;
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
    }else {
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


      runnableCode = this.setLoopingControl(id, runnableCode.join(""), state.name)

    return { ranges: ranges, runnableCode: runnableCode };
  }

  setLoopingControl(id, runnableCode){



var loopingVar = "_isLooping"

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
stopLooping =setTimeout(() => {
 noLoop() 
}, 1000)
});

`

runnableCode = runnableCode.replace("noLoop()", `noLoop(); _isLooping = false`)
runnableCode = runnableCode.replace("loop()", `loop(); _isLooping = true`)
runnableCode =  runnableCode + loopingCallbacks

return runnableCode

  }

  isListener(name){
    return name in globals.specialFns && globals.specialFns[name] === false
  }

  onDelete(id) {
    var fnStamps = this.state.fnStamps;
    var blobStamps = this.state.blobStamps;

    if (id in fnStamps) {
      ipc && ipc.send("edited");
      delete fnStamps[id];
    } else if (id in blobStamps) {
      ipc && ipc.send("edited");
      delete blobStamps[id];
    }

    this.refreshFnStamps(fnStamps);
    this.refreshBlobStamps(blobStamps);
    // this.refreshConsoleStamp(this.state.consoleStamp)
  }

  refreshConsoleStamp(consoleStamp) {
    var data = consoleStamp.ref.current.getData();
    this.setState({ consoleStamp: null }, () => this.addConsoleStamp(data));
  }

  getAllData() {
    var data = {
      fns: [],
      blobs: [],
      scale: this.state.scale,
      console: this.state.consoleStamp.ref.current.getData(),
      originX: this.state.originX,
      originY: this.state.originY
    };
    Object.values(this.state.fnStamps).map(stamp =>
      data.fns.push(stamp.ref.current.getData())
    );

    Object.values(this.state.blobStamps).map(stamp =>
      data.blobs.push(stamp.ref.current.getData())
    );

    return data;
  }

  refreshFnStamps(fnStamps) {
    var fnStampData = [];
    for (var i in fnStamps) {
      var stamp = fnStamps[i];
      var data = stamp.ref.current.getData();

      fnStampData.push(data);
    }

    this.setState({ fnStamps: {} }, () =>
      fnStampData.map(data => this.addFnStamp(data))
    );
  }

  refreshBlobStamps(blobStamps) {
    var varStampData = [];
    for (var i in blobStamps) {
      var stamp = blobStamps[i];
      var data = stamp.ref.current.getData();

      varStampData.push(data);
    }

    this.setState({ blobStamps: {} }, () =>
      varStampData.map(data => this.createBlobStamp(data))
    );
  }

  onStartMove() {
    var fnStamps = this.state.fnStamps;
    for (var i in fnStamps) {
      var fnStamp = fnStamps[i].ref.current;

      fnStamp.setIframeDisabled(true);
    }

    this.setState({ lines: [] });
  }

  onStopMove(s) {
    var fnStamps = this.state.fnStamps;
    for (var i in fnStamps) {
      var fnStamp = fnStamps[i].ref.current;
      fnStamp.setIframeDisabled(false);
    }

    this.setLines();
  }

  centerOnStamp(id, xOff, yOff){

    var stampRef 

    if(id in this.state.fnStamps){
      stampRef = this.state.fnStamps[id].ref.current
    }else if(id in this.state.blobStamps){
      stampRef = this.state.blobStamps[id].ref.current
    }else if(this.state.consoleStamp.ref.current && id === this.state.consoleStamp.ref.current.props.id){
      stampRef = this.state.consoleStamp.ref.current
    }

    if(stampRef){
      var cristalRef = stampRef.cristalRef.current
      if(cristalRef){

        var x = cristalRef.state.x, y=cristalRef.state.y, width = cristalRef.state.width,
        height = cristalRef.state.height


        var newX = (window.innerWidth-xOff)/2 + xOff - width/2*this.state.scale
        var newY = (window.innerHeight-yOff)/2 + yOff - height/2*this.state.scale

        this.manualPan(newX - x, newY - y) 
        cristalRef.changeZIndex()

      }
    }
  }


  manualPan(xDiff, yDiff){

    var oldTransition = $(".stamp").css("transition")
    $(".stamp").css({transition: "all .5s ease"})
    setTimeout(() => $(".stamp").css({transition: oldTransition}), 500)

    this.setState({originX:this.state.originX + xDiff, 
      originY:this.state.originY + yDiff, originCristal:null},
      () => this.setOriginCristal())

    Object.values(this.state.fnStamps).map(stamp => {
      var cristalRef = stamp.ref.current.cristalRef;
      cristalRef.current && cristalRef.current.setPos(xDiff, yDiff);
    });

    Object.values(this.state.blobStamps).map(stamp => {
      var cristalRef = stamp.ref.current.cristalRef;
      cristalRef.current && cristalRef.current.setPos(xDiff, yDiff);
    });

    var consoleCristalRef = this.state.consoleStamp.ref.current.cristalRef;
    consoleCristalRef.current && consoleCristalRef.current.setPos(xDiff, yDiff);


  }

  toggleHide(stampRef) {
    stampRef.toggleHide(
      this.state.scale,
      this.state.originX,
      this.state.originY,
      () => this.setLayerPicker()
    );
  }

  getFirstLine(text) {
    for (var i = 0; i < text.length; i++) {
      if (text[i] === "\n") {
        if(i === 0){
          return " "
        }
        return text.substr(0, i);
      }
    }
    return text.substr(0, Math.min(text.length, 15));
  }

  setLayerPicker() {
    var pickerData = [];

    if (this.state.consoleStamp && this.state.consoleStamp.ref.current) {
      var consoleRef = this.state.consoleStamp.ref.current;
      pickerData.push({
        name: "console",
        status: !consoleRef.state.hidden,
        icon: consoleRef.getIcon(),
        centerCallback:(xOff, yOff) => this.centerOnStamp(consoleRef.props.id, xOff, yOff),
        hideCallback: () => this.toggleHide(consoleRef),
        id:consoleRef.props.id
      });
    }

    var fnIds = Object.keys(this.state.fnStamps)
    var blobIds = Object.keys(this.state.blobStamps)
    var allIds = fnIds.concat(blobIds)
    allIds.map(id => {
      if(id in this.state.fnStamps){
        var stampRef = this.state.fnStamps[id].ref.current;
        if(!stampRef){return}
        var name = stampRef.state.name

        
      }else if(id in this.state.blobStamps){
        var stampRef = this.state.blobStamps[id].ref.current
        if(!stampRef){return}
        var name = this.getFirstLine(stampRef.state.code)
      }

          pickerData.push({
          name: name,
          icon: stampRef.getIcon(),
          status: !stampRef.state.hidden,
        centerCallback:(xOff, yOff) => this.centerOnStamp(stampRef.props.id, xOff, yOff),
          hideCallback: () => this.toggleHide(stampRef),
        id:stampRef.props.id
        });
    })

    this.setState({ pickerData: pickerData });
  }

  
  render() {
    if (this.state.consoleStamp) {
      var consoleElem = this.state.consoleStamp.elem;
    } else {
      var consoleElem = null;
    }

    var elems = [];

    Object.values(this.state.fnStamps).map(stamp => elems.push(stamp.elem));
    Object.values(this.state.blobStamps).map(stamp => elems.push(stamp.elem));

    return (
      <div>
              {this.state.originCristal}
        <div class="row bg-grey" style={{ height: "100vh" }}>
          {elems}
          {consoleElem}
          {this.state.lines}
        </div>
            
  
        <ControlBar pickerData={this.state.pickerData} 
        addBlobStamp={this.addBlobStamp.bind(this)}
        addFnStamp={this.addFnStamp.bind(this)}
        disablePan={this.disablePan.bind(this)}
        disableZoom={this.disableZoom.bind(this)}
        loadStamperFile={this.loadStamperFile.bind(this)}
        getFileData = {this.getFileData.bind(this)}
        updateControlBarDimensions ={this.updateControlBarDimensions.bind(this)}/>

     
      </div>
    );
  }
}
