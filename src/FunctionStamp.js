import React, { Component } from "react";
import Cristal from "./react-cristal/dist/es2015/index.js";
import $ from "jquery";
import "ace-builds/webpack-resolver";
import AceEditor from "react-ace";
import pf, { globals, p5Lib } from "./globals.js";

import FunctionStampIcon from "./icons/box.svg";
import CssStampIcon from "./icons/pen-tool.svg";
import HtmlStampIcon from "./icons/layout.svg";
import BuiltInStampIcon from "./icons/tool.svg";
import ListenerStampIcon from "./icons/bell.svg";

import "./theme-p5.js";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/javascript";

import { Resizable, ResizableBox } from "react-resizable";

var userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(" electron/") > -1) {
  const electron = window.require("electron");
  var ipc = electron.ipcRenderer;
} else {
  var ipc = false;
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
      iframeHeight: 0,
      editorHeight: this.props.starterEditorHeight,
      editorWidth: this.props.starterEditorWidth,
      editorHidden: false,
      isSpecialFn: false,
      editorScrolling: false,
      errorLines: this.props.errorLines,
      iframeCode: "",
      editsMade: false,
      runningBorder: false,
      doubleClickActive: false,
      resizingIframe: false,
      x: this.props.initialPosition.x,
      y: this.props.initialPosition.y,
      originX: this.props.initialOriginX,
      originY: this.props.initialOriginY,
      scale: this.props.initialScale,
      hidden: this.props.initialHidden,
      looping:false,
      loopingTransition:""
    };

    this.cristalRef = React.createRef();
    this.editorRef = React.createRef();

  this.updateLooping = this.updateLooping.bind(this)
  }

  toggleHide(scale, originX, originY, callback) {
    ipc && ipc.send("edited");
    if (this.state.hidden) {
      var distFromOriginX =
        (this.state.originX - this.state.x) / this.state.scale;
      var distFromOriginY =
        (this.state.originY - this.state.y) / this.state.scale;
      var x = originX - distFromOriginX * scale;
      var y = originY - distFromOriginY * scale;
      var iframeHeight = this.state.iframeHeight
      this.setState({ hidden: false, scale: scale, x: x, y: y, savedIframeHeight:iframeHeight, iframeHeight:0 }, 
        () => this.setState({iframeHeight:this.state.savedIframeHeight}, callback)

      )

    } else {
      this.setState(
        { hidden: true, originX: originX, originY: originY, scale: scale},
        callback
      );
    }
  }

  updateLooping(e){


      if(e.data.type != "loop" || e.data.id != this.props.id){
        return
      }
      if(e.data.message === "start"){

  
        this.setState({looping : true, loopingTransition : ""})
      }else if (e.data.message === "stop"){

        this.setState({looping : false, loopingTransition:"all 1s ease-in"})
      }

  }

  componentDidMount() {
    // this.loadp5Lib()
    this.setState({ 
      iframeHeight: this.props.starterIframeHeight }, () =>
      this.props.requestCompile(this.props.id)
    );
    this.checkName();
    window.addEventListener("message", this.updateLooping);

  }

  componentWillUnmount(){

    window.removeEventListener("message", this.updateLooping);
  }

  checkName() {
    var isSpecialFn = this.state.name in globals.specialFns;
    this.setState({ isSpecialFn: isSpecialFn });
  }

  addErrorLine(lineNum) {
    var errorLines = this.state.errorLines;
    errorLines[lineNum] = "";
    this.setState({ errorLines: errorLines });
  }

  clearErrorsAndUpdate(newErrors = []) {
    var newErrorLines = this.state.errorLines;
    var newErrorLines = {};

    this.setState({ errorLines: newErrorLines }, () => {
      this.setState({ iframeCode: this.props.getHTML(this.props.id), looping:true, loopingTransition:"" });
      for (var i = 0; i < newErrors.length; i++) {
        this.addErrorLine(newErrors[i]);
      }
    });
  }

  loadp5Lib() {
    this.editorRef.current &&
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

  updateIframeDimensions(movementX = 0, movementY = 0) {
    ipc && ipc.send("edited");
    var scale = this.props.getScale();

    var width = this.state.iframeWidth + movementX / scale;
    var height = this.state.iframeHeight + movementY / scale;
    if (width < 30) {
      movementX = 0;
      width = 30;
    }
    if (height < 30) {
      movementY = 0;
      height = 30;
    }

    this.setState({ iframeWidth: width, iframeHeight: height });
    this.cristalRef.current.manualResize(movementX / scale, movementY / scale);
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
    var markers = [];
    for (var i in this.state.errorLines) {
      if (i != 0) {
        markers.push({
          startRow: i - 1,
          endRow: i,
          type: "background",
          className: "bg-warningOrange marker"
        });
      }
    }

    var theme = "p5";
    var mode = "javascript";
    if (this.props.isHtml || this.props.isCss) {
      theme = "solarized_light";
    }

    if (this.props.isCss) {
      mode = "css";
    } else if (this.props.isHtml) {
      mode = "html";
    }

    return (
      <div
        onMouseOut={() => {
          this.setEditorScrolling(false);
        }}
        hidden={this.state.editorHidden}
      >
        <br />
        <AceEditor
          markers={markers}
          style={{
            width: this.state.editorWidth,
            height: this.state.editorHeight,
            background: "transparent",
            fontFamily: 'Inconsolata',
          }}
          mode={mode}
          theme={theme}
          onChange={value => {
            this.setState({ code: value, editsMade: true });
            ipc && ipc.send("edited");
          }}
          name={"name" + this.props.id.toString()}
          fontSize={globals.codeSize}
          showPrintMargin={false}
          wrapEnabled={true}
          showGutter={false}
          highlightActiveLine={false}
          value={this.state.code}
          ref={this.editorRef}
          onScroll={() => this.setEditorScrolling(true)}
          setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: false,
            tabSize: 2,
            hasCssTransforms: true
          }}
        />
      </div>
    );
  }

  compileCallback() {
    if (this.state.editsMade) {
      this.props.requestCompile(this.props.id);
      this.setState({ editsMade: false, runningBorder: true }, () =>
        setTimeout(() => {
          this.setState({ runningBorder: false }, )
        }
      , 300)
      );
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
    } else if (this.props.isHtml || this.props.isCss) {
      nameColor = "htmlCssName";
    }

    var argsColor = "greyText";

    return (
      <div>
        <input
          placeholder="function name..."
          disabled={this.props.isHtml || this.props.isCss}
          onChange={event => {
            this.setState({ name: event.target.value, editsMade: true }, () =>
              this.checkName()
            );

            ipc && ipc.send("edited");
          }}
          style={{ background: "transparent" }}
          value={this.state.name}
          class={"text-" + nameColor + " name"}
        />

        <br />

        <input
          // @cameron styling for arguments field
          placeholder="arguments..."
          disabled={this.props.isHtml || this.props.isCss}
          onChange={event => {
            this.setState({ args: event.target.value, editsMade: true });
            ipc && ipc.send("edited");
          }}
          style={{ background: "transparent" }}
          value={this.state.args}
          class={"text-" + argsColor + " args"}
        />
      </div>
    );
  }

  renderIframe() {

    var loopingOpacity = .0
    if(this.state.looping){
      loopingOpacity = .5
    }

    return (
      <div hidden={this.props.isCss}>

        <div
          hidden={!this.state.resizingIframe}
          style={{
            position: "absolute",
            fontSize: globals.codeSize,
            opacity: 0.5,
            top: 80,
            right: 25
          }}
          class="text-greyText "
        >
         {"W:" + Math.floor(this.state.iframeWidth) +
            " H:" +
            Math.floor(this.state.iframeHeight)}
        </div>
<div

          style={{
            transition:this.state.loopingTransition,
            position: "absolute",
            fontSize: globals.codeSize,
            opacity: loopingOpacity,
            top: 80,
            left: 25 + this.state.editorWidth
          }}
          class="text-greyText "
        >
         {"active"}
        </div>
        <Resizable
          className="ml-1 bg-white shadow" 
          onResize={e => {

            this.updateIframeDimensions(e.movementX, e.movementY);
          }}
          onResizeStart={() => {
            this.props.onStartMove();
            this.setState({ resizingIframe: true });
          }}
          onResizeStop={e => {
            this.props.onStopMove();
            this.setState({ resizingIframe: false });
          }}
          width={this.state.iframeHeight}
          height={this.state.iframeWidth}
          style={{
            overflow: "hidden",
            zIndex: 5
          }}
        >
          <div onMouseOver={this.compileCallback.bind(this)}>
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
            <iframe
              ref={iframeElem => {
                if (iframeElem) {
                  this.props.addNewIframeConsole(
                    iframeElem.contentWindow.console
                  );
                }
              }}
              id={"iframe" + this.props.id}
              scrolling="no"
              style={{
                border: "none",
                height: this.state.iframeHeight + globals.iframeMargin,
                width: this.state.iframeWidth + 2*globals.iframeMargin,
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

    var callback = () => null
    if(isOpt){
      callback = () => this.cristalRef.current.changeZIndex()
    }

    var newName = this.props.addStamp(
      data,
      updateName,
      updatePosition,
      setIframeDisabled,
      callback
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
      x: this.state.x,
      y: this.state.y,
      editorWidth: this.state.editorWidth,
      editorHeight: this.state.editorHeight,
      iframeWidth: this.state.iframeWidth,
      iframeHeight: this.state.iframeHeight,
      isHtml: this.props.isHtml,
      isCss: this.props.isCss,
      originX: this.state.originX,
      originY: this.state.originY,
      scale: this.state.scale,
      hidden: this.state.hidden,
      exported:true
    };

    return data;
  }

  resizeEditor(widthDiff, heightDiff) {
    var height = this.state.editorHeight + heightDiff;
    var width = this.state.editorWidth + widthDiff;

    if (height < 0 || width < 0) {
      return true;
    }

    this.setState({
      editorHeight: height,
      editorWidth: width
    });
    this.editorRef.current.editor.resize();
  }

  getIcon() {
    var icon = FunctionStampIcon;
    if (this.props.isHtml) {
      icon = HtmlStampIcon;
    } else if (this.props.isCss) {
      icon = CssStampIcon;
    } else if (this.state.isSpecialFn) {
      if(globals.specialFns[this.state.name]){
      icon = BuiltInStampIcon;
      }else{
        icon = ListenerStampIcon
      }

    }

    return icon;
  }

  render() {
    var headerColor = "bg-white";
    if (0 in this.state.errorLines) {
      headerColor = "bg-warningOrange";
    }

    var border = "border border-borderGrey";

    if (Object.keys(this.state.errorLines).length > 0) {
      border = "border border-warningOrange";
    }
    if (this.state.runningBorder) {
      border = "border border-blue";
    }

    // <!-- @cameron little white div thing --> scroll down to style

    var bgColor = "bg-jsArea";
    if (this.props.isHtml || this.props.isCss) {
      bgColor = "bg-htmlCssArea";
    }

    if (this.state.hidden) {
      return <div></div>;
    }


    return (
      <div>
        <Cristal
          initialSize={{width:this.state.iframeWidth + this.state.editorWidth + 50}}
          ref={this.cristalRef}
          isResizable={true}
          onStartMove={this.props.onStartMove}
          onStopMove={this.props.onStopMove}
          onClose={() => this.props.onDelete(this.props.id)}
          onCopy={() => this.copyAndOpt()}
          onOptMove={() => this.copyAndOpt(true)}
          closeHidden={this.props.isHtml || this.props.isCss}
          copyHidden={this.props.isHtml || this.props.isCss}
          initialPosition={{ x: this.state.x, y: this.state.y }}
          initialScale={this.state.scale}
          className={
            "stamp shadow-sm " + bgColor + " " + border + " vertex" + this.props.id 
          }
          onResize={this.resizeEditor.bind(this)}
          onStartResize={this.props.onStartMove}
          onStopResize={this.props.onStopMove}
          onMove={s => this.setState({ x: s.x, y: s.y })}
          icon={this.getIcon()}
          parentID = {this.props.id}
        >
          <div onMouseLeave={this.compileCallback.bind(this)}>
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
          </div>
        </Cristal>
      </div>
    );
  }
}
