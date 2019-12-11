import React, { Component } from "react";
import Cristal from "./react-cristal/dist/es2015/index.js";
import Copy from "./copy.png";
import $ from "jquery";
import "ace-builds/webpack-resolver";
import AceEditor from "react-ace";
import pf, { globals, p5Lib } from "./globals.js";

import "./theme-p5.js";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/javascript";
import { Resizable, ResizableBox } from "react-resizable";


var userAgent = navigator.userAgent.toLowerCase();
if(userAgent.indexOf(' electron/') > -1){
  const electron = window.require("electron");
  var ipc = electron.ipcRenderer;
}else{
  var ipc = false
}



export default class FunctionStamp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: this.props.starterCode,
      name: this.props.starterName,
      args: this.props.starterArgs,
      iframeDisabled: this.props.iframeDisabled,
      iframeWidth: this.props.starterIframeWidth,
      iframeHeight: this.props.starterIframeHeight,
      editorHeight: this.props.starterEditorHeight,
      editorWidth: this.props.starterEditorWidth,
      editorHidden: false,
      isSpecialFn: false,
      editorScrolling: false,
      errorLines:this.props.errorLines,
      iframeCode:"",
      editsMade:true
    };

    this.cristalRef = React.createRef();
    this.editorRef = React.createRef();
  }

  // updateFuns(fromComponentDidMount) {
  //   var name = this.state.name;

  //   var fullFun =
  //     "function " +
  //     name +
  //     "(" +
  //     this.state.args +
  //     "){\n" +
  //     this.state.code +
  //     "\n}";

  //   var drawableFun = name + "()";

  //   var isSpecialFn = name in globals.specialFns;
  //   if (this.props.isHtml || this.props.isCss) {
  //     fullFun = "";
  //     drawableFun = "";
  //   }

  //   var runnableInnerCode = this.state.code

  //   var editsMade = true
  //   if((fullFun === this.state.fullFun 
  //     && drawableFun === this.state.drawableFun 
  //     && runnableInnerCode === this.state.runnableInnerCode)){
  //     editsMade = false
  //   }

  //   this.setState(
  //     {
  //       fullFun: fullFun,
  //       drawableFun: drawableFun,
  //       runnableInnerCode: runnableInnerCode
  //     },
  //     () => this.props.compileCode(editsMade)
  //   );
  // }

  checkName() {
    var isSpecialFn = this.state.name in globals.specialFns;
    this.setState({ isSpecialFn: isSpecialFn });
  }



  componentDidMount() {

    this.props.requestCompile();
    this.checkName();
    this.loadp5Lib();
  }

  addErrorLine(lineNum){
    var errorLines = this.state.errorLines
    errorLines[lineNum] = ""
    this.setState({errorLines:errorLines})

  }

  clearErrorsAndUpdate(newErrors=[]){
    var newErrorLines = this.state.errorLines
      var newErrorLines = {}

    this.setState({errorLines:newErrorLines}, () => {
      this.setState({iframeCode:this.props.getHTML(this.props.id)})
      for(var i = 0; i < newErrors.length; i++){
        this.addErrorLine(newErrors[i])
      }
    })
  }

  loadp5Lib() {
    this.editorRef.current.editor.completers.push({
      getCompletions: function(editor, session, pos, prefix, callback) {
        var completions = [];
        p5Lib.forEach(function(w) {
          completions.push({
            value: w,
            meta: "p5.js"
          });
        });
        callback(null, completions);
      }
    });
  }

  updateIframeDimensions(
    movementX = 0,
    movementY = 0
  ) {


    ipc && ipc.send("edited");
    var scale = this.props.getScale()


    var width = this.state.iframeWidth + movementX/scale;
    var height = this.state.iframeHeight + movementY/scale;
    if (width < 30) {
      movementX = 0;
      width = 30;
    }
    if (height < 30) {
      movementY = 0;
      height = 30;
    }


    this.setState({ iframeWidth: width, iframeHeight: height });
    this.cristalRef.current.manualResize(movementX/scale, movementY/scale);
  }

  setEditorScrolling(isScrolling) {
    if (isScrolling && this.state.editorScrolling == false) {
      this.setState({ editorScrolling: true });
      this.props.disablePan(true);
    } else if (isScrolling === false && this.state.editorScrolling) {
      this.setState({ editorScrolling: false });
      this.props.disablePan(false);
    }
  }

  renderEditor() {
    var markers = []
    for(var i in this.state.errorLines){
      if(i != 0){
        markers.push({startRow:i-1, endRow:i, type:"background", className:"bg-warningOrange marker"});
      }
    }
      
    var theme = "p5"
    var mode = "javascript"
    if(this.props.isHtml || this.props.isCss){
      theme = "solarized_light"
    }

    if(this.props.isCss){
      mode = "css"
    }else if(this.props.isHtml){
      mode = "html"
    }

    return (
      <div
        onMouseOut={() => {
          this.mouseOutCallback()
          this.setEditorScrolling(false)
        }
        }
        hidden={this.state.editorHidden}
      >
        <br />
        <AceEditor
        markers={markers}
          style={{
            width: this.state.editorWidth,
            height: this.state.editorHeight,
            background:"transparent"

          }}
          mode={mode}
          theme={theme}
          onChange={value => {
            this.setState({ code: value, editsMade:true });
            ipc && ipc.send("edited");
          }}
          name= {"id" + this.props.id.toString()}
          fontSize={globals.codeSize}
          showPrintMargin={false}
          wrapEnabled={true}
          showGutter={false}
          highlightActiveLine={false}
          value={this.state.code}
          ref={this.editorRef}
          onScroll={() => this.setEditorScrolling(true)}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
            hasCssTransforms: true
          }}
        />
      </div>
    );
  }

  mouseOutCallback(){
    if(this.state.editsMade){
              this.props.requestCompile(this.props.id)
              this.setState({editsMade:false})
    }

  }

  renderFunctionName() {
    var displayName = "";
    if (this.state.name != this.props.starterName) {
      var displayName = this.state.Name;
    }

    var nameColor = "blue";
    if (this.state.isSpecialFn) {
      nameColor = "pink";
    }else if(this.props.isHtml || this.props.isCss){
      nameColor = "htmlCssName"
    }

    var argsColor = "greyText"
   

    return (
      <div>
        <input
          placeholder="function name..."
          disabled={this.props.isHtml || this.props.isCss}
          onChange={event => {
            this.setState({ name: event.target.value, editsMade:true }, () => this.checkName());

            ipc && ipc.send("edited");
          }}
          style={{background:"transparent"}}
          onMouseOut={() => this.mouseOutCallback()}

          value={this.state.name}
          class={"text-" + nameColor + " name"}
        />

        <br />

        <input
        // @cameron styling for arguments field
          placeholder="arguments..."
          disabled={this.props.isHtml || this.props.isCss}
          onChange={event => {
            this.setState({ args: event.target.value, editsMade:true });
            ipc && ipc.send("edited");
          }}
          style={{background:"transparent"}}
          onMouseOut={() => this.mouseOutCallback()}
          value={this.state.args}
          class={"text-" + argsColor + " args"}
        />
      </div>
    );
  }

  renderIframe() {
    return (
      <div hidden={this.props.isCss}>
        <Resizable
          className="ml-1 bg-white shadow"
          onResize={e => {
            this.updateIframeDimensions(
              e.movementX,
              e.movementY
            );
          }}
          onResizeStart={this.props.onStartMove}
          onResizeStop={(e) =>  this.props.onStopMove() }
          width={this.state.iframeHeight}
          height={this.state.iframeWidth}
          style={{
            overflow: "hidden",
            zIndex: 5
          }}
        >
          <div>
            <div
              style={{
                position: "absolute",
                width: this.state.iframeWidth,
                height: this.state.iframeHeight,
                color: "transparent",
                background: "transparent"
              }}
              hidden={!this.state.iframeDisabled}
            >
              {" "}
            </div>
            <iframe ref={(iframeElem) => {if(iframeElem){
              this.props.addNewIframeConsole(iframeElem.contentWindow.console)

            }}

              
            }
              scrolling="no"
              style={{
                border: "none",
                height: this.state.iframeHeight + globals.iframeMargin,
                width: this.state.iframeWidth + globals.iframeMargin,
                margin: "-" + globals.iframeMargin.toString() + "px"
                // pointerEvents:"none"
              }}
              srcdoc={this.state.iframeCode}
              sandbox="allow-forms allow-modals allow-pointer-lock allow-popups  allow-same-origin allow-scripts"
              allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media"
            />
          </div>
        </Resizable>
      </div>
    );
  }

  setIframeDisabled(status) {
    this.setState({ iframeDisabled: status });
  }

  copyAndOpt(isOpt = false) {
    if (this.props.isCss || this.props.isHtml) {
      return;
    }

    var data = this.getData();

    var updateName = false,
      updatePosition = false,
      setIframeDisabled = false;
    if (isOpt) {
      setIframeDisabled = true;
    } else {
      updateName = true;
      updatePosition = true;
    }

    var newName = this.props.addStamp(
      data,
      updateName,
      updatePosition,
      setIframeDisabled
    );
    if (isOpt) {
      this.setState({ name: newName }, () => this.checkName());
    }
  }

  getData() {
    var data = {
      name: this.state.name,
      code: this.state.code,
      args: this.state.args,
      x: this.cristalRef.current.state.x,
      y: this.cristalRef.current.state.y,
      editorWidth: this.state.editorWidth,
      editorHeight: this.state.editorHeight,
      iframeWidth: this.state.iframeWidth,
      iframeHeight: this.state.iframeHeight,
      isHtml: this.props.isHtml,
      isCss: this.props.isCss
    };

    return data;
  }

  resizeEditor(widthDiff, heightDiff) {
    var height = this.state.editorHeight + heightDiff
    var width = this.state.editorWidth + widthDiff

    if(height < 0 || width < 0){
      return true
    }

    this.setState({
      editorHeight: height,
      editorWidth: width
    });
    this.editorRef.current.editor.resize();
  }

  render() {

    var headerColor = "bg-white"
    if(0 in this.state.errorLines){
      headerColor = "bg-warningOrange"
    }


    var border = "border border-borderGrey"
    if(Object.keys(this.state.errorLines).length > 0){
      border = "border border-warningOrange"
    }


    // <!-- @cameron little white div thing --> scroll down to style

    var bgColor = "bg-jsArea"
    if(this.props.isHtml || this.props.isCss){
      bgColor = "bg-htmlCssArea"
    }

    return (
      <div>
        <Cristal
          ref={this.cristalRef}

          isResizable={true}
          onStartMove={this.props.onStartMove}
          onStopMove={this.props.onStopMove}
          onClose={() => this.props.onDelete(this.props.id)}
          onCopy={() => this.copyAndOpt()}
          onOptMove={() => this.copyAndOpt(true)}
          closeHidden={this.props.isHtml || this.props.isCss}
          copyHidden={this.props.isHtml || this.props.isCss}
          initialPosition={this.props.initialPosition}
          initialScale={this.props.initialScale}
          className={"shadow-sm " + bgColor + " " + border + " vertex" + this.props.id}
          onResize={this.resizeEditor.bind(this)}
          onStartResize={this.props.onStartMove}
          onStopResize={this.props.onStopMove}
        >

          <div

            class={headerColor}
            style={{
              position: "absolute",
              top: globals.headerHeight,
              left: 0,
              width: "100%",
              height: globals.fnTitleHeight,
              color: "transparent"
            }}
          >
            {" "}
          </div>

          <div class="p-2">
            {this.renderFunctionName()}

            <div class="row m-0 ">
              {this.renderEditor()}

              {this.renderIframe()}
            </div>
          </div>
        </Cristal>
      </div>
    );
  }
}
