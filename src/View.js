import React, { Component } from "react";
import Cristal from "react-cristal";
import $ from "jquery";
import { saveAs } from "file-saver";
import pf, { globals, p5Lib } from "./globals.js";
import FunctionStamp from "./FunctionStamp.js";
import BlobStamp from "./BlobStamp.js";
import { Mutex } from "async-mutex";
import { Line } from "react-lineto";
import cheerio from "cheerio"

import jsToStamps from "./parser.js"
const prettier = window.require("prettier");

const electron = window.require('electron');
const ipc = electron.ipcRenderer;



export default class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fnStamps: {},
      scale: 1,
      counter: 0,
      varStamps: {},
      html:"",
      css:"",
    };
    this.counterMutex = new Mutex();

      ipc.on('writeToView', (event, files) => {


      this.setState({html:files.html, css:files.css, fnStamps:{}, varStamps:{}, counter:0, scale:files.stamper.scale}, () => {
        files.stamper.fns.map(data => this.addFnStamp(data))
        files.stamper.vars.map(data => this.addBlobStamp(data))

      })

    });

    ipc.on('jsToStamps', (event, rawCode) => {

      jsToStamps(rawCode)

    });

    ipc.on('requestSave', (event, rawCode) => {

      this.sendSaveData()

    });

  }





  getHTML(id){
    const parser = cheerio.load(this.state.html);
    var jsBlockStr ="<script type='text/javascript'>"+this.getRunnableCode(id)+"</script>"
    var cssBlockStr = "<style>"+this.state.css+"</style>"
    var jsSelector = '[src="sketch.js"]'
    var cssSelector = '[href="style.css"]'

    var jsBlock = parser(jsBlockStr)
    var cssBlock = parser(cssBlockStr)

    parser(jsSelector).replaceWith(jsBlock)
    parser(cssSelector).replaceWith(cssBlock)

    return parser.html()
  }
  componentDidMount() {

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
  //   Object.values(this.state.varStamps).map(varStamp =>
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
      iframeWidth:globals.defaultIframeWidth,
      iframeHeight:globals.defaultEditorHeight
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
    this.refreshBlobStamps(this.state.varStamps);
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
      iframeHeight = data.iframeHeight;

    const release = await this.counterMutex.acquire();
    var counter = this.state.counter;
    this.setState({ counter: counter + 1 }, release());

    var fnStamps = this.state.fnStamps;
    var ref = React.createRef();

    var elem = (
      <FunctionStamp
        ref={ref}

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
      />
    );

    fnStamps[counter] = { elem: elem, ref: ref };
    this.setState({ fnStamps: fnStamps });
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

    var varStamps = this.state.varStamps;
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

    varStamps[counter] = { elem: elem, ref: ref };
    this.setState({ varStamps: varStamps });
  }

  sendSaveData(){
    var message = {
      html: this.state.html,
      stamper: this.getAllData(),
      css: this.state.css,
      js:this.getExportableCode()
    } 

    ipc.send("save", message) 

  }

  forceUpdateStamps(id = -1, fromEdit) {

    if(fromEdit){
      this.sendSaveData()
    }

    Object.values(this.state.fnStamps).map((stamp) => {
  
      var stampRef = stamp.ref.current;
      if (stampRef && stampRef.props.id != id) {
        stampRef.forceUpdate();
      }
    });

  }

  disablePan(status) {
    Object.values(this.state.fnStamps).map(stamp => {
      var cristalRef = stamp.ref.current.cristalRef;
      cristalRef.current.disablePan(status);
    });

    Object.values(this.state.varStamps).map(stamp => {
      var cristalRef = stamp.ref.current.cristalRef;
      cristalRef.current.disablePan(status);
    });
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

  getExportableCode(){
    var code = null
    Object.values(this.state.fnStamps).map( stamp => {
      if(stamp.ref.current.state.name === "draw"){
        code = this.getRunnableCode(stamp.ref.current.props.id)
      }
    })

    if(code === null){
      code = this.getRunnableCode(-1)
    }
    return code

  }

  getRunnableCode(id) {
    var runnableCode = [];

    Object.values(this.state.varStamps).map(varStamp => {
      if (varStamp.ref.current) {
        runnableCode.push(varStamp.ref.current.state.runnableCode);
      }
    });

    Object.values(this.state.fnStamps).map(stamp => {
      if (stamp.ref.current && stamp.ref.current.state.name != "draw") {
        runnableCode.push(stamp.ref.current.state.fullFun);
      }
    });

    if (
      id in this.state.fnStamps == false ||
      this.state.fnStamps[id].ref.current === null
    ) {
      return runnableCode.join("\n\n");
    }

    var fnStamp = this.state.fnStamps[id].ref.current;
    if(fnStamp.state.name === "draw"){
      runnableCode.push(fnStamp.state.fullFun) 
    }else if(fnStamp.state.name === "setup"){
      // do nothing
    }else{
      runnableCode.push(
        "function draw(){\n" + fnStamp.state.drawableFun + "\n}"
      );      
    }



    return runnableCode.join("\n\n");
  }

  onDelete(id) {
    var fnStamps = this.state.fnStamps;
    var varStamps = this.state.varStamps;

    if (id in fnStamps) {
      delete fnStamps[id];
    } else if (id in varStamps) {
      delete varStamps[id];
    }

    this.refreshFnStamps(fnStamps);
    this.refreshBlobStamps(varStamps);
  }

  getAllData(){
    var data = {fns:[], vars:[], scale:this.state.scale}
    Object.values(this.state.fnStamps).map(stamp => 
      data.fns.push(stamp.ref.current.getData()))

    Object.values(this.state.varStamps).map(stamp => 
      data.vars.push(stamp.ref.current.getData()))

    return data
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

  refreshBlobStamps(varStamps) {
    var varStampData = [];
    for (var i in varStamps) {
      var stamp = varStamps[i];
      var data = stamp.ref.current.getData();

      varStampData.push(data);
    }

    this.setState({ varStamps: {} }, () =>
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
    this.setState({ scale: s.scale });
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
    var elems = [];
    Object.values(this.state.fnStamps).map(stamp => elems.push(stamp.elem));
    Object.values(this.state.varStamps).map(stamp => elems.push(stamp.elem));
    return (
      <div>
        <div class="row bg-grey" style={{ height: "100vh" }}>
          {elems}
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
            add global vars
          </button>
          <button
            class="btn btn btn-lightGrey shadow m-1 text-white"
            onClick={() =>
              this.setState({ fnStamps: {}, varStamps: {} }, () =>
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
