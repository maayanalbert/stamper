import React, { Component } from "react";
import Cristal from "react-cristal";
import $ from "jquery";
import { saveAs } from "file-saver";
import pf, { globals, p5Lib } from "./globals.js";
import FunctionStamp from "./FunctionStamp.js";
import ConsoleStamp from "./ConsoleStamp.js";
import BlobStamp from "./BlobStamp.js";
import { Mutex } from "async-mutex";
import { Line } from "react-lineto";
import cheerio from "cheerio";

var esprima = require("esprima");


const electron = window.require("electron");
const ipc = electron.ipcRenderer;

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
      consoleStamp:null
    };
    this.counterMutex = new Mutex();

    ipc.on("writeToView", (event, files) => {
      this.setState(
        {
          fnStamps: {},
          blobStamps: {},
          counter: 0,
          htmlID: -1,
          cssID: -1,
          scale: files.stamper.scale
        },
        () => {
          files.stamper.fns.map(data => this.addFnStamp(data));
          files.stamper.blobs.map(data => this.addBlobStamp(data));
        }
      );
    });

    ipc.on("requestSave", (event, rawCode) => {
      this.sendSaveData();
    });

    window.addEventListener("message", event => {
      if(this.consoleStamp){
        this.consoleStamp.ref.current.reportError(event.data.errorMsg)
      }
    });
  }

  // getIframeErrorCallBack(ranges){
  //   window.onerror = function (msg, url, lineNumber) {
  //     var adjLineNum = -1
  //     var stampId = -1
  //     for(var i = 0; i< ${ranges.length}; i++){
  //       var start = ${ranges[i][0]}
  //       var end = ${ranges[i][1]}
  //       var id = ${ranges[i][2]}
  //       var isFN = ${ranges[i][3]}
  //       if(start <= lineNumber && lineNumber <= end){
  //         var stampId = id
  //         var adjLineNum = (lineNumber) - start + 1
  //         if(isFN){
  //           adjLineNum -= 1
  //         }
  //       }
  //     }
  //     window.parent.postMessage({msg:msg, lineNumber:adjLineNum, id:stampId}, '*')

  //   }
  // }

  getHTML(id) {
    if (
      this.state.htmlID in this.state.fnStamps === false ||
      this.state.cssID in this.state.fnStamps === false
    ) {
      return "";
    }

    if (id === this.state.htmlID || id === this.state.cssID) {
      var getRunnableCode = "";
      var ranges = []
    } else {
      var codeData = this.getRunnableCode(id);
          var runnableCode = codeData.runnableCode
          var ranges = codeData.ranges
    }



    var htmlStamp = this.state.fnStamps[this.state.htmlID];
    var cssStamp = this.state.fnStamps[this.state.cssID];

    const parser = cheerio.load(htmlStamp.ref.current.state.runnableInnerCode);
    var jsBlockStr =
      "<script type='text/javascript'>" + runnableCode + "</script>";
    var cssBlockStr =
      "<style>" + cssStamp.ref.current.state.runnableInnerCode + "</style>";
    var jsSelector = '[src="sketch.js"]';
    var cssSelector = '[href="style.css"]';

    var jsBlock = parser(jsBlockStr);
    var cssBlock = parser(cssBlockStr);

    parser(jsSelector).replaceWith(jsBlock);
    parser(cssSelector).replaceWith(cssBlock);

    parser("head").prepend(

     `<script>
    window.addEventListener('error', function(e) { 
      window.parent.postMessage(e, '*')
    }, false);
window.onerror = function (errorMsg, url, lineNumber) {
      window.parent.postMessage({errorMsg, url, lineNumber}, '*')

}

      </script>`)




    return parser.html();
  }
  componentDidMount() {
    this.addConsoleStamp({})
    // this.addSetupFnStamp();
    // this.addFnStamp({ name: "draw" });
  }

  // resetScale(mouseX, mouseY) {
  //   if (this.state.scale === 1) {
  //     return;
  //   }

  //   Object.values(this.state.fnStamps).map(fnStamp =>
  //     fnStamp.ref.current.cristalRef.current.zoom(1, mouseX, mouseY, true)
  //   );
  //   Object.values(this.state.blobStamps).map(varStamp =>
  //     varStamp.ref.current.cristalRef.current.zoom(1, mouseX, mouseY, true)
  //   );

  //   this.setState({ scale: 1 });
  // }

  // getIframeDimensions() {
  //   return { width: this.state.iframeWidth, height: this.state.iframeHeight };
  // }

  // addSetupFnStamp() {
  //   var setupCode =
  //     "createCanvas(" +
  //     globals.defaultIframeWidth.toString() +
  //     ", " +
  //     globals.defaultEditorHeight.toString() +
  //     ")";
  //   var fnStampData = {
  //     code: setupCode,
  //     name: "setup",
  //     args: " ",
  //     isSetup: true
  //   };
  //   this.addFnStamp(fnStampData, false);
  // }

   addConsoleStamp(data) {
    var defaults = {
      x: this.defaultStarterPos(),
      y: this.defaultStarterPos(),
      consoleWidth: (globals.defaultEditorWidth * 2) / 3,
      consoleHeight: globals.defaultVarEditorHeight
    };

    Object.keys(defaults).map(setting => {
      if (!(setting in data)) {
        data[setting] = defaults[setting];
      }
    });


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
        ref={ref}
        initialPosition={{ x: x, y: y }}
        id={counter}
        onStartMove={this.onStartMove.bind(this)}
        onStopMove={this.onStopMove.bind(this)}
        initialScale={this.state.scale}
        disablePan={this.disablePan.bind(this)}
        starterConsoleWidth={consoleWidth}
        starterConsoleHeight={consoleHeight}
      />
    );

    var consoleStamp = { elem: elem, ref: ref };
    this.setState({ consoleStamp: consoleStamp });
  }

  defaultStarterPos(offset = 0) {
    return Math.random() * globals.marginVariance + globals.margin * 2 + offset;
  }

  addFnStamp(
    data,
    updateName = false,
    updatePosition = false,
    setIframeDisabled = false
  ) {
    var defaults = {
      name: "sketch",
      code: "ellipse(x, y, 50, 50)",
      args: "x=mouseX, y=mouseY",
      x: this.defaultStarterPos(),
      y: this.defaultStarterPos(),
      iframeDisabled: false,
      editorWidth: globals.defaultEditorWidth,
      editorHeight: globals.defaultEditorHeight - globals.brHeight,
      iframeWidth: globals.defaultIframeWidth,
      iframeHeight: globals.defaultEditorHeight,
      isHtml: false,
      isCss: false
    };

    Object.keys(defaults).map(setting => {
      if (!(setting in data)) {
        data[setting] = defaults[setting];
      }
    });

    if (updatePosition) {
      data.x += globals.copyOffset * 2;
      data.y += globals.copyOffset;
    }

    var newName = data.name + (this.state.counter + 1).toString();

    if (updateName) {
      data.name = newName;
    }

    data.iframeDisabled = setIframeDisabled;

    this.createFnStamp(data);
    this.refreshBlobStamps(this.state.blobStamps);
    return newName;
  }

  async createFnStamp(data) {
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
      isCss = data.isCss;

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
        starterEditorWidth={editorWidth}
        starterEditorHeight={editorHeight}
        initialPosition={{ x: x, y: y }}
        id={counter}
        deleteFrame={this.deleteFrame}
        getRunnableCode={this.getRunnableCode.bind(this)}
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
        forceUpdateStamps={this.forceUpdateStamps.bind(this)}
        getHTML={this.getHTML.bind(this)}
        getScale={() => {return this.state.scale }}
        provideConsole={this.provideConsole.bind(this)}
      />
    );

    fnStamps[counter] = { elem: elem, ref: ref };
    this.setState({ fnStamps: fnStamps });
    if (isHtml) {
      this.setState({ htmlID: counter });
    } else if (isCss) {
      this.setState({ cssID: counter });
    }
  }

  provideConsole(newConsole){
    if(this.state.consoleStamp){
      this.state.consoleStamp.ref.current.addConsole(newConsole)
    }
  }

  addBlobStamp(data, updatePosition = false) {
    var defaults = {
      code: "var z = 10",
      x: this.defaultStarterPos(),
      y: this.defaultStarterPos(400),
      editorWidth: (globals.defaultEditorWidth * 2) / 3,
      editorHeight: globals.defaultVarEditorHeight
    };

    Object.keys(defaults).map(setting => {
      if (!(setting in data)) {
        data[setting] = defaults[setting];
      }
    });

    if (updatePosition) {
      data.x += data.editorWidth + 50;
    }

    this.createBlobStamp(data);
  }

  async createBlobStamp(data) {
    var x = data.x,
      y = data.y,
      code = data.code,
      editorWidth = data.editorWidth,
      editorHeight = data.editorHeight;
    const release = await this.counterMutex.acquire();
    var counter = this.state.counter;
    this.setState({ counter: counter + 1 }, release());

    var blobStamps = this.state.blobStamps;
    var ref = React.createRef();

    var elem = (
      <BlobStamp
        ref={ref}
        starterCode={code}
        initialPosition={{ x: x, y: y }}
        id={counter}
        deleteFrame={this.deleteFrame}
        getRunnableCode={this.getRunnableCode.bind(this)}
        onStartMove={this.onStartMove.bind(this)}
        onStopMove={this.onStopMove.bind(this)}
        addStamp={this.addBlobStamp.bind(this)}
        onDelete={this.onDelete.bind(this)}
        initialScale={this.state.scale}
        disablePan={this.disablePan.bind(this)}
        starterEditorWidth={editorWidth}
        starterEditorHeight={editorHeight}
        forceUpdateStamps={this.forceUpdateStamps.bind(this)}
      />
    );

    blobStamps[counter] = { elem: elem, ref: ref };
    this.setState({ blobStamps: blobStamps });
  }

  sendSaveData() {
    if (
      this.state.htmlID in this.state.fnStamps === false ||
      this.state.cssID in this.state.fnStamps === false
    ) {
      return;
    }
    var htmlStamp = this.state.fnStamps[this.state.htmlID];
    var cssStamp = this.state.fnStamps[this.state.cssID];

    var message = {
      html: htmlStamp.ref.current.state.runnableInnerCode,
      stamper: this.getAllData(),
      css: cssStamp.ref.current.state.runnableInnerCode,
      js: this.getExportableCode()
    };

    ipc.send("save", message);
  }

  forceUpdateStamps(id = -1, fromEdit) {
    if (fromEdit) {
      this.sendSaveData();
    }

    Object.values(this.state.fnStamps).map(stamp => {
      var stampRef = stamp.ref.current;
      if (stampRef && stampRef.props.id != id) {
        stampRef.forceUpdate();
      }
    });

    this.state.consoleStamp.ref.current.clearConsole()
  }

  disablePan(status) {

    Object.values(this.state.fnStamps).map(stamp => {
      var cristalRef = stamp.ref.current.cristalRef;
      cristalRef.current.disablePan(status);
    });

    Object.values(this.state.blobStamps).map(stamp => {
      var cristalRef = stamp.ref.current.cristalRef;
      cristalRef.current.disablePan(status);
    });

    this.state.consoleStamp.ref.current.cristalRef.current.disablePan(status)
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

    Object.values(this.state.fnStamps).map(stamp => {
      if (stamp.ref.current) {
        var stampRef = stamp.ref.current;
        var name = stamp.ref.current.state.name;
        stampRef.setDuplicateStatus(nameDict[name] > 1);
      }
    });
  }

  getExportableCode() {
    var codeData = null;
    Object.values(this.state.fnStamps).map(stamp => {
      if (stamp.ref.current.state.name === "draw") {
        codeData = this.getRunnableCode(stamp.ref.current.props.id);
      }
    });

    if (codeData === null) {
      codeData = this.getRunnableCode(-1);
    }
    return codeData.runnableCode;
  }

  getNumLines(code){
    var numLines = 0
    for(var i = 0; i< code.length; i++){
      if(code[i] === "\n"){
        numLines += 1
      }
    }

    return numLines
  }

  addCodeBlock(code, id, runnableCode, ranges, curLine, isFn){
    code = code.trim() + "\n"
    var start = curLine
    var end = curLine + this.getNumLines(code) - 1
    runnableCode.push(code);
    ranges.push([start, end, id, isFn])
    return end + 1
  }

  getRunnableCode(id) {
    var runnableCode = [];
    var ranges = []
    var curLine = 1
    var code;

    Object.values(this.state.blobStamps).map(varStamp => {
      if (varStamp.ref.current) {
        code = varStamp.ref.current.state.runnableCode
        curLine = this.addCodeBlock(code, varStamp.ref.current.props.id, runnableCode, ranges, curLine, false)
      }
    });



    Object.values(this.state.fnStamps).map(stamp => {
      if (stamp.ref.current && stamp.ref.current.state.name != "draw" && stamp.ref.current.props.isCss === false
        && stamp.ref.current.props.isHtml === false) {
        code = stamp.ref.current.state.fullFun 
        curLine = this.addCodeBlock(code, stamp.ref.current.props.id, runnableCode, ranges, curLine, true)
      }
    });


    if (
      id in this.state.fnStamps == false ||
      this.state.fnStamps[id].ref.current === null
    ) {
      return runnableCode.join("");
    }

    var fnStamp = this.state.fnStamps[id].ref.current;
    if (fnStamp.state.name === "draw") {
      code = fnStamp.state.fullFun
      curLine = this.addCodeBlock(code, fnStamp.props.id, runnableCode, ranges, curLine, true)
    } else if (fnStamp.state.name === "setup") {
      // do nothing
    } else {
      
        code = "function draw(){\n" + fnStamp.state.drawableFun + "\n}"
        curLine = this.addCodeBlock(code, -1, runnableCode, ranges, curLine, false)
        
  
    }
    return {ranges:ranges, runnableCode: runnableCode.join("")};
  }

  onDelete(id) {
    var fnStamps = this.state.fnStamps;
    var blobStamps = this.state.blobStamps;

    if (id in fnStamps) {
      ipc.send("edited");
      delete fnStamps[id];
    } else if (id in blobStamps) {
      ipc.send("edited");
      delete blobStamps[id];
    }

    this.refreshFnStamps(fnStamps);
    this.refreshBlobStamps(blobStamps);
  }

  getAllData() {
    var data = { fns: [], blobs: [], scale: this.state.scale };
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
  }

  onStopMove(s) {
    if(s){
    this.setState({ scale: s.scale });
    }
    var fnStamps = this.state.fnStamps;
    for (var i in fnStamps) {
      var fnStamp = fnStamps[i].ref.current;
      fnStamp.setIframeDisabled(false);
    }
  }

  // updateIframeDimensions(width, height) {
  //   Object.values(this.state.fnStamps).map(stamp =>
  //     stamp.ref.current.updateIframeDimensions(width, height)
  //   );

  //   this.setState({ iframeWidth: width, iframeHeight: height });
  // }

  render() {
    if(this.state.consoleStamp){
      var consoleElem = this.state.consoleStamp.elem
    }else{
      var consoleElem = null
    }

    var elems = [];


    Object.values(this.state.fnStamps).map(stamp => elems.push(stamp.elem));
    Object.values(this.state.blobStamps).map(stamp => elems.push(stamp.elem));
    return (
      <div>
        <div class="row bg-grey" style={{ height: "100vh" }}>
          {elems}
          {consoleElem}
        </div>
        <div
          class="topButtons"
          style={{
            position: "absolute",
            top: globals.margin,
            right: globals.margin,
            zIndex: 1000000000000000000
          }}
        >
          <button
            class="btn btn btn-pink shadow m-1"
            onClick={() => this.addFnStamp({}, true)}
          >
            {" "}
            add sketch
          </button>
          <button
            class="btn btn btn-blue shadow m-1"
            onClick={() => this.addBlobStamp({})}
          >
            {" "}
            add global blobs
          </button>
          <button
            class="btn btn btn-lightGrey shadow m-1 text-white"
            onClick={() =>
              this.setState({ fnStamps: {}, blobStamps: {} }, () =>
                this.addSetupFnStamp()
              )
            }
          >
            clear
          </button>
          <br />
        </div>
      </div>
    );
  }
}
