import React, { Component } from "react";
import Cristal from "./react-cristal/dist/es2015/index.js";
import $ from "jquery";
import { saveAs } from "file-saver";
import pf, { globals, p5Lib } from "./globals.js";
import FunctionStamp from "./FunctionStamp.js";
import ConsoleStamp from "./ConsoleStamp.js";
import BlobStamp from "./BlobStamp.js";
import { Mutex } from "async-mutex";
import { Line } from "react-lineto";
import cheerio from "cheerio";
import { SteppedLineTo } from 'react-lineto';
import parser from "./parser.js"
import anim from 'css-animation';
var _ = require("lodash");



var esprima = require("esprima");

var userAgent = navigator.userAgent.toLowerCase();
if(userAgent.indexOf(' electron/') > -1){
  const electron = window.require("electron");
  var ipc = electron.ipcRenderer;
}else{
  var ipc = false
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
      consoleStamp:null,
      setupExists:true,
      htmlAsksForCss:true,
      htmlAsksForJs:true,
      lines:[],
      lineData:[],
      traversalGraph:{},
      hiddenFns:{},
      hiddenBlobs: {},
      originX:0,
      originY:0,
      consoleId: -1
    };
    this.counterMutex = new Mutex();

    ipc && ipc.on("writeToView", (event, files) => {

    this.setState({
      fnStamps:{},
      scale:1,
      counter:0,
      blobStamps:{},
      htmlID:-1,
      cssID:-1,
      consoleStamp:null,
      setupExists:true,
      htmlAsksForCss:true,
      htmlAsksForJs:true,
      lines:[],
      lineData:[],
      traversalGraph:[],
      hiddenFns:{},
      hiddenBlobs:{},
      consoleId:-1
    }, () => {
 this.loadStamperFile(files.stamper)
    })

         

          
       

    });

    ipc && ipc.on("requestSave", (event, rawCode) => {
      this.sendSaveData();
    });
  

  }

    componentDidMount() {
      this.loadStamperFile(defaultSetup.getSetup())
      document.addEventListener("wheel", this.onWheel.bind(this), { passive: false });
    }

    componentWillUnmout(){
      document.removeEventListener("wheel", this.onWheel.bind(this));
    }

    onWheel(e){
      var originX = this.state.originX, originY = this.state.originY
      if (e.ctrlKey) {

        var newScale = this.state.scale - e.deltaY * 0.01, 
        mouseX = e.clientX, mouseY = e.clientY, scale = this.state.scale

      var curDistX = mouseX - originX,
        curDistY = mouseY - originY;

      var unScaledDistX = curDistX / scale,
        unScaledDistY = curDistY / scale;

      var scaledDistX = unScaledDistX * newScale,
        scaledDistY = unScaledDistY * newScale;

      var newX = mouseX - scaledDistX,
        newY = mouseY - scaledDistY;

      this.setState({originX:newX, originY:newY, scale:newScale})
    }else{
      this.setState({originX:originX - e.deltaX, originY:originY - e.deltaY})
    }
  }

  loadStamperFile(stamperFile){

    this.setState({hiddenFns:stamperFile.hiddenFns, counter:stamperFile.counter,
      hiddenBlobs:stamperFile.hiddenBlobs,
      scale:stamperFile.scale, originX:stamperFile.originX, originY:stamperFile.originY}, ()=> {
    this.addConsoleStamp(stamperFile.console,
      () => {

        stamperFile.fns.map(data => this.addFnStamp(data));
        stamperFile.blobs.map(data => this.addBlobStamp(data));

      }

      )



      })




  }

  getIframeErrorCallBack(ranges, offset =0){
    var strRanges = JSON.stringify(ranges)
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

      window.parent.postMessage({type:"error", message:message, lineno:adjLineNum, id:stampId}, '*')

    }`


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
      var ranges = []
    } else {

      var codeData = this.getRunnableCode(id);
          var runnableCode = codeData.runnableCode
          var ranges = codeData.ranges
    }


    var htmlStamp = this.state.fnStamps[this.state.htmlID];
    var cssStamp = this.state.fnStamps[this.state.cssID];

    var html = htmlStamp.ref.current.state.code


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



    var htmlAsksForCss = parser(cssSelector).length > 0
    if(htmlAsksForCss === false && this.state.htmlAsksForCss === true){

      this.state.consoleStamp.ref.current.logToConsole
        (`Stamper Error: Your index.html is missing a div for style.css. Make sure you're linking to style.css and not another stylesheet.`)
      this.state.fnStamps[this.state.htmlID].ref.current.addErrorLine(-1)
      this.setState({htmlAsksForCss:htmlAsksForCss})
    }else if(htmlAsksForCss === true && this.state.htmlAsksForCss === false){
      this.setState({htmlAsksForCss:htmlAsksForCss})
    }

    var htmlAsksForJs = parser(jsSelector).length > 0
    if(htmlAsksForJs === false && this.state.htmlAsksForJs === true){

      this.state.consoleStamp.ref.current.logToConsole
        (`Stamper Error: Your index.html is missing a div for sketch.js. Make sure you're linking to sketch.js and not another sketch file.`)
      this.state.fnStamps[this.state.htmlID].ref.current.addErrorLine(-1)
      this.setState({htmlAsksForJs:htmlAsksForJs})
    }else if(htmlAsksForJs === true && this.state.htmlAsksForJs === false){
      this.setState({htmlAsksForJs:htmlAsksForJs})
    }

    parser(cssSelector).replaceWith(cssBlock);



    parser("head").prepend("<script class='errorListener' >" + this.getIframeErrorCallBack(ranges) + "</script>")


   var htmlStr = parser.html()
   var linesToJs = 0
   for(var i = 0; i< htmlStr.length; i++){
 
    if(htmlStr[i] === "\n" ){
      linesToJs += 1
    }
    if(htmlStr.substr(i, "sketch.js".length) === "sketch.js"){
      break
    }
   }

  

   parser(".errorListener").replaceWith("<script class='errorListener' >" + this.getIframeErrorCallBack(ranges, linesToJs) + "</script>")
   parser(jsSelector).replaceWith(jsBlock);
    return parser.html();
  }



  addErrorLine(lineNum, id){
        if(id in this.state.fnStamps){
          this.state.fnStamps[id].ref.current.addErrorLine(lineNum)
        }else if(id in this.state.blobStamps){
          this.state.blobStamps[id].ref.current.addErrorLine(lineNum)
        }
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

    addConsoleStamp(data, callback ) {

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


    this.createConsoleStamp(data, callback);
  }

  async getNewId(){
    const release = await this.counterMutex.acquire();
    var id = this.state.counter;
    this.setState({ counter: id + 1 }, release());

    return id
  }

  async createConsoleStamp(data, callback) {
    var x = data.x,
      y = data.y,
      consoleWidth = data.consoleWidth,
      consoleHeight = data.consoleHeight;

        if(data.id){
        var id = data.id
      }else{
        var id = await this.getNewId()
      }

    var ref = React.createRef();

    var elem = (
      <ConsoleStamp
      initialScale={this.state.scale}
        ref={ref}
        initialPosition={{ x: x, y: y }}
        id={id}
        onStartMove={this.onStartMove.bind(this)}
        onStopMove={this.onStopMove.bind(this)}
        initialScale={this.state.scale}
        disablePan={this.disablePan.bind(this)}
        starterConsoleWidth={consoleWidth}
        starterConsoleHeight={consoleHeight}
        addErrorLine={this.addErrorLine.bind(this)}
      />
    );

    var consoleStamp = { elem: elem, ref: ref };
      this.setState({ consoleStamp: consoleStamp, consoleId:id }, callback);

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
      code: "rect(50, 50, 50, 50)",
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

      if(data.id){
        var id = data.id
      }else{
        var id = await this.getNewId()
      }

    var fnStamps = this.state.fnStamps;
    var ref = React.createRef();
    console.log(data)
    var elem = (
      <FunctionStamp
        ref={ref}
        isHtml={isHtml}
        isCss={isCss}
        starterCode={code}
        starterArgs={args}
        starterName={name}
        errorLines = {{}}
        starterEditorWidth={editorWidth}
        starterEditorHeight={editorHeight}
        initialPosition={{ x: x, y: y }}
        id={id}
        deleteFrame={this.deleteFrame}

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
        getScale={() => {return this.state.scale }}
        addNewIframeConsole={this.addNewIframeConsole.bind(this)}
      />
    );

    fnStamps[id] = { elem: elem, ref: ref };


    this.setState({ fnStamps: fnStamps }, () => {console.log(this.state.fnStamps); console.log(this.getAllData())});

    if (isHtml) {
      this.setState({ htmlID: id });
    } else if (isCss) {
      this.setState({ cssID: id });
    }


  }

  addNewIframeConsole(newConsole){
    if(this.state.consoleStamp === null){return}
      this.state.consoleStamp.ref.current.addNewIframeConsole(newConsole)


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
      editorHeight = data.editorHeight,
      errorLines = data.errorLines;

            if(data.id){
        var id = data.id
      }else{
        var id = await this.getNewId()
      }

    var blobStamps = this.state.blobStamps;
    var ref = React.createRef();

    var elem = (
      <BlobStamp
        ref={ref}
        starterCode={code}
        errorLines={{}}
        initialPosition={{ x: x, y: y }}
        id={id}
        deleteFrame={this.deleteFrame}
 
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

    blobStamps[id] = { elem: elem, ref: ref };
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
      html: htmlStamp.ref.current.state.code,
      stamper: this.getAllData(),
      css: cssStamp.ref.current.state.code,
      js: this.getExportableCode()
    };
    ipc && ipc.send("save", message);
  }


  checkForSetup(){

    var newSetupExists = false
    var fnStamps = Object.values(this.state.fnStamps)
    for(var i = 0; i< fnStamps.length; i++){
      var fnStampRef = fnStamps[i].ref.current
 
      if(fnStampRef.state.name === 'setup'){
        newSetupExists =  true
  
      }

    }

    if(this.state.setupExists && newSetupExists === false){


    this.state.consoleStamp.ref.current.logToConsole
    (`Stamper Error: You don't have a setup. This will constrain your canvas to a default width and hight.`)

    }

    this.setState({setupExists:newSetupExists})

    return newSetupExists
  }

  requestCompile(id){

    

    var newTraversalGraph = this.setLineData()
    var oldTravarsalGraph = this.state.traversalGraph
    this.setState({traversalGraph:newTraversalGraph})


    var duplicateNamedStamps = this.checkAllNames()

    this.checkForSetup()

    this.state.consoleStamp.ref.current.logToConsole("Updated code", "debug")
 
    this.sendSaveData();


 
    this.compileStamp(id, {}, newTraversalGraph, duplicateNamedStamps)
     
    this.compileStamp(id, {}, oldTravarsalGraph, duplicateNamedStamps)
   

  }
  compileStamp(id, seen, traversalGraph, duplicateNamedStamps) {
    
    if(id in seen){
      return
    }else{
      seen[id] = ""
    }



    if(id in this.state.fnStamps){
      var stampRef = this.state.fnStamps[id].ref.current
    }else if(id in this.state.blobStamps){
      var stampRef = this.state.blobStamps[id].ref.current
    }else{
      return
    }



   
    if(stampRef){
        var newErrors = []

        if(stampRef.props.id in duplicateNamedStamps && stampRef.props.isCss === false && stampRef.props.isHtml === false){
          newErrors.push(0)
        }
         
        stampRef.clearErrorsAndUpdate(newErrors);


      if(id in traversalGraph === false){
        return
      }
      traversalGraph[id].map(id => this.compileStamp(id, seen, traversalGraph, duplicateNamedStamps))

    }
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

    var duplicateNamedStamps = {}
    Object.values(this.state.fnStamps).map(stamp => {
      if (stamp.ref.current) {
        var stampRef = stamp.ref.current;
        var name = stamp.ref.current.state.name;
        if(nameDict[name] > 1){
          duplicateNamedStamps[stamp.ref.current.props.id] = ""

          this.state.consoleStamp.ref.current.logToConsole
          (`Stamper Error: Multiple functions shouldn't have the same name. Consider channging one of your ${name}s to something else.`)

        }
      }
    });

    return duplicateNamedStamps
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
    ranges.push({start:start, end:end, id:id, isFn:isFn})
    return end + 1
  }

  setLines(){

    var lines = []
    var borderColorInt = 205 + 15 - 15*this.state.scale
    var style = {borderColor:`rgb(${borderColorInt}, ${borderColorInt}, ${borderColorInt})`, borderWidth:1}


    this.state.lineData.map(singleLineData => {

      lines.push(<SteppedLineTo {...style} from={"vertex" + singleLineData[0]} to={'vertex' + singleLineData[1]} orientation="v" />)
    }); 

    this.setState({lines:lines}) 

  }

  setLineData(){
    var declaredDict = {}
    var undeclaredArr = []
    var lineData = []
    var setupID = -1
    var traversalGraph = {}

    Object.keys(this.state.blobStamps).map(id => {
      var stampRef = this.state.blobStamps[id].ref.current
        var code = stampRef.state.code
        var identifiers = parser.getIdentifiers(code)

        if(identifiers){
          identifiers.declared.map(identifier => declaredDict[identifier] = id)
          identifiers.undeclared.map(identifier => undeclaredArr.push([identifier, id]))
        } 

    });




    Object.keys(this.state.fnStamps).map(id => {


      var stampRef = this.state.fnStamps[id].ref.current


     
      if(stampRef.state.name === "setup"){
        setupID = id
      }
        var state = stampRef.state
        var code = `function ${state.name}(${state.args}){\n${state.code}\n}`
        var identifiers = parser.getIdentifiers(code)
        if(identifiers){
        identifiers.declared.map(identifier => declaredDict[identifier] = id)
        identifiers.undeclared.map(identifier => undeclaredArr.push([identifier, id]))
      }


  
    });

    undeclaredArr.map(undeclaredItem => {
      var identifier = undeclaredItem[0]
      var usingFn = undeclaredItem[1]
      var declaringFn = declaredDict[identifier]
      if(declaringFn   && usingFn ){
        lineData.push([usingFn, declaringFn])
        if(declaringFn in traversalGraph === false){
          traversalGraph[declaringFn] = []
        }
        traversalGraph[declaringFn].push(usingFn)
      }
      

    })

       

    Object.keys(this.state.fnStamps).map(id =>{
      if(id != this.state.htmlID && id != this.state.cssID && id != setupID){
        lineData.push([id, setupID])
            if(setupID in traversalGraph === false){
          traversalGraph[setupID] = []
        }
        traversalGraph[setupID].push(id)
      }
    })

    this.setState({lineData:lineData}, () => this.setLines())  

    Object.keys(this.state.fnStamps).map(id =>{
      if(id != this.state.htmlID && id != this.state.cssID){
        if(this.state.htmlID in traversalGraph === false){
          traversalGraph[this.state.htmlID] = []
        }
        traversalGraph[this.state.htmlID].push(id)
      }
    })

    traversalGraph[this.state.cssID] = [this.state.htmlID]

    return traversalGraph
  }

  getRunnableCode(id) {

    var runnableCode = [];
    var ranges = []
    var curLine = 1
    var code;

    Object.values(this.state.blobStamps).map(blobStamp => {

        code = blobStamp.ref.current.state.code
        curLine = this.addCodeBlock(code, blobStamp.ref.current.props.id, runnableCode, ranges, curLine, false)

    });



    Object.values(this.state.fnStamps).map(stamp => {
      if (stamp.ref.current.state.name != "draw" && stamp.ref.current.props.isCss === false
        && stamp.ref.current.props.isHtml === false) {
        var state =  stamp.ref.current.state
      code = `function ${state.name}(${state.args}){\n${state.code}\n}`
        curLine = this.addCodeBlock(code, stamp.ref.current.props.id, runnableCode, ranges, curLine, true)
      }
    });


    if (
      id in this.state.fnStamps == false ||
      this.state.fnStamps[id].ref.current === null
    ) {
      return runnableCode.join("");
    }

    var fnStampRef = this.state.fnStamps[id].ref.current;
    var state = fnStampRef.state
    if (state.name === "draw") {
      var fullFun = `function ${state.name}(${state.args}){\n${state.code}\n}`
      curLine = this.addCodeBlock(fullFun, fnStampRef.props.id, runnableCode, ranges, curLine, true)
    } else if (state.name === "setup") {
      // do nothing
    } else {
      
        code = `function draw(){\n${state.name}()\n}`
        curLine = this.addCodeBlock(code, -1, runnableCode, ranges, curLine, false)
        
  
    }
    return {ranges:ranges, runnableCode: runnableCode.join("")};
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

  refreshConsoleStamp(consoleStamp){
    var data = consoleStamp.ref.current.getData()
    this.setState({consoleStamp:null}, () => this.addConsoleStamp(data))
  }

  getAllData() {
    console.log(this.state.fnStamps)
    var data = { fns: [], blobs: [], 
      scale: this.state.scale, 
      console:this.state.consoleStamp.ref.current.getData(),
      counter:this.state.counter,
      hiddenFns:this.state.hiddenFns,
      hiddenBlobs:this.state.hiddenBlobs, originX:this.state.originX, 
      originY:this.state.originY };
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

    this.setState({lines:[]})
  }

  onStopMove(s) {


    var fnStamps = this.state.fnStamps;
    for (var i in fnStamps) {
      var fnStamp = fnStamps[i].ref.current;
      fnStamp.setIframeDisabled(false);
    }

    this.setLines()
  }

  // updateIframeDimensions(width, height) {
  //   Object.values(this.state.fnStamps).map(stamp =>
  //     stamp.ref.current.updateIframeDimensions(width, height)
  //   );

  //   this.setState({ iframeWidth: width, iframeHeight: height });
  // }

  getFirstLine(text){
    for(var i = 0; i < text.length; i++){
      if(text[i] === "\n"){
        return text.substr(0, i)
      }
    }
    return text.substr(0, Math.max(text.length, 50))
  }

  hideFnStamp(id){

    var stampRef = this.state.fnStamps[id].ref.current
    var data = stampRef.getData()
    data.originX = this.state.originX
    data.originY = this.state.originY
    var hiddenFns = this.state.hiddenFns
    hiddenFns[id] = data

    this.setState({hiddenFns:hiddenFns})
    this.onDelete(id)
  }

  hideBlobStamp(id){

    var stampRef = this.state.blobStamps[id].ref.current
    var data = stampRef.getData()
    data.originX = this.state.originX
    data.originY = this.state.originY
    var hiddenBlobs = this.state.hiddenBlobs

    hiddenBlobs[id] = data 

    this.setState({hiddenBlobs:hiddenBlobs})
    this.onDelete(id)
  }

  unHideFnStamp(id){
    var data = _.clone(this.state.hiddenFns[id])

    var distFromOriginX = data.originX - data.x
    var distFromOriginY = data.originY - data.y
    data.x = this.state.originX - distFromOriginX
    data.y = this.state.originY - distFromOriginY
    console.log(data)

    this.addFnStamp(data)
    var hiddenFns = this.state.hiddenFns
    delete hiddenFns[id]
    this.setState({hiddenFns:hiddenFns}, () => console.log(this.getAllData()))
  }

  unHideBlobStamp(id){
    var data = _.clone(this.state.hiddenBlobs[id])

    var distFromOriginX = data.originX - data.x
    var distFromOriginY = data.originY - data.y
    data.x = this.state.originX - distFromOriginX
    data.y = this.state.originY - distFromOriginY
    this.addBlobStamp(data)
    var hiddenBlobs = this.state.hiddenBlobs
    delete hiddenBlobs[id]
    this.setState({hiddenBlobs:hiddenBlobs})

  }

  renderLayerPicker(){
 
    var pickerData = [{name:"Console", id: this.state.consoleId, status:true}]
    var fnIds = Object.keys(this.state.fnStamps).concat(Object.keys(this.state.hiddenFns))
    fnIds.sort().map((id) =>{
      if(id in this.state.fnStamps){
        var stampRef = this.state.fnStamps[id].ref.current
        if(stampRef){
          pickerData.push({name:this.state.fnStamps[id].ref.current.state.name , 
            status: true, callback: this.hideFnStamp.bind(this, id)

          })     
        }
      }else{
        var stampData = this.state.hiddenFns[id]
        pickerData.push({
          name:stampData.name,
          status:false,
          callback:this.unHideFnStamp.bind(this, id)
        })

      }

    })

    pickerData.push({})

    var blobIds = Object.keys(this.state.blobStamps).concat(Object.keys(this.state.hiddenBlobs))
   
    blobIds.sort().map((id) =>{
      if(id in this.state.blobStamps){
        var stampRef = this.state.blobStamps[id].ref.current
        if(stampRef){
          var firstLine = this.getFirstLine(this.state.blobStamps[id].ref.current.state.code )
     
          pickerData.push({name:firstLine , status:true, callback:this.hideBlobStamp.bind(this,id)})     
        }
      }else{
        var stampData = this.state.hiddenBlobs[id]
        var firstLine = this.getFirstLine(stampData.code)
        pickerData.push({name:firstLine , status:false, callback:this.unHideBlobStamp.bind(this,id)})
      }

    })

    var pickers = []
    pickerData.map(item => {
      if(item.name){
      pickers.push(
          <div class= "row m-2 d-flex justify-content-between">
           
    <a class="text-greyText" 
    style={{fontSize:12 }}>{item.name}</a>
       <input type="checkbox" checked={item.status} onClick={item.callback}/>
        </div>
)
      }else{
        pickers.push(<br/>)
      }


    })


    return (
      <div class="bg-white border border-borderGrey p-2" style={{
            position: "absolute",
            top: 0,
            left: 0,
            width:200,
            height:"100vh",
            zIndex: 1000000000000000000,
          }}>
          {pickers}
  </div>

    )
  }

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
          {this.state.lines}

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
            class={"btn btn shadow m-1 text-white btn-grey"}
           
            
          >
            clear
          </button>
          <br />
        </div>
        {this.renderLayerPicker()}
      </div>
    );
  }
}
