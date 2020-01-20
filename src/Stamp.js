import React, { Component } from "react";
import Cristal from "./react-cristal/dist/es2015/index.js";
import $ from "jquery";
import "ace-builds/webpack-resolver";
import AceEditor from "react-ace";
import pf, { globals, p5Lib } from "./globals.js";

import FunctionStampIcon from "./icons/box.svg";
import FileStampIcon from "./icons/file.svg";
import HtmlStampIcon from "./icons/layout.svg";
import BuiltInStampIcon from "./icons/tool.svg";
import ListenerStampIcon from "./icons/bell.svg";
import ImageStampIcon from "./icons/image.svg";
import BlobStampIcon from "./icons/code.svg";

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
    var starterEditorWidth = this.props.starterEditorWidth;
    if (this.props.isImg) {
      starterEditorWidth = 0;
    }
    var starterArgs = this.props.starterArgs;
    if (this.props.isHtml || this.props.isFile || this.props.isImg || this.props.isBlob) {
      starterArgs = " ";
    }

    var starterName = this.props.starterName
    if(this.props.isBlob){
      starterName = ""
    }

    var starterIframeWidth = this.props.starterIframeWidth
    var starterIframeHeight = this.props.starterIframeHeight
    if(this.props.isFile || this.props.isBlob){
      starterIframeWidth = 0
      starterIframeHeight = 0
    }

    this.state = {
      code: this.props.starterCode,
      name: starterName,
      args: starterArgs,
      iframeDisabled: this.props.iframeDisabled,
      iframeWidth: starterIframeWidth,
      iframeHeight: starterIframeHeight,
      editorHeight: this.props.starterEditorHeight,
      editorWidth: starterEditorWidth,
      isSpecialFn: false,
      editorScrolling: false,
      errorLines: this.props.errorLines,
      iframeCode: "",
      editsMade: false,
      runningBorder: false,
      resizingIframe: false,
      x: this.props.initialPosition.x,
      y: this.props.initialPosition.y,
      hidden: this.props.initialHidden,
      looping: false,
      loopingTransition: "",
      zIndex: -1,
      exportableCode:"",
      codeSize:this.props.starterCodeSize
    };

    this.cristalRef = React.createRef();
    this.editorRef = React.createRef();

    this.updateLooping = this.updateLooping.bind(this);
  }

  toggleHide(callback) {
    ipc && ipc.send("edited");
    if (this.state.hidden) {
      this.setState(
        { hidden: false, iframeHeight: this.state.iframeHeight },
        callback
      );
    } else {
      this.setState({ hidden: true }, callback);
    }
  }

  updateLooping(e) {
    if (
      e.data.type != "loop" ||
      e.data.id != this.props.id ||
      this.props.isHtml ||
      this.props.isImg || this.props.isBlob
    ) {
      return;
    }
    if (e.data.message === "start") {
      this.setState({ looping: true, loopingTransition: "" });
    } else if (e.data.message === "stop") {
      this.setState({ looping: false, loopingTransition: "all 1s ease-in" });
    }
  }

  componentDidMount() {
    // this.loadp5Lib()
    this.checkName();
    window.addEventListener("message", this.updateLooping);
  }

  componentWillUnmount() {
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
      var iframeCode = ""
      var exportableCode = ""


      if(this.props.isBlob){
        exportableCode = this.props.getExportableCode()
      }else if(this.props.isFile === false && this.props.isImg === false){
        iframeCode = this.props.getHTML(this.props.id);

      }

      this.setState({
        iframeCode: iframeCode,
        exportableCode:exportableCode,
        looping: true,
        loopingTransition: ""
      });
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

    var width = this.state.iframeWidth + movementX;
    var height = this.state.iframeHeight + movementY;
    if (width < 30) {
      movementX = 0;
      width = 30;
    }
    if (height < 30) {
      movementY = 0;
      height = 30;
    }

    this.setState({ iframeWidth: width, iframeHeight: height });

    if (this.props.isImg === false) {
      movementY = 0;
    }

    this.cristalRef.current.manualResize(movementX, movementY);
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
    if (this.props.isHtml || this.props.isFile || this.props.isImg) {
      theme = "solarized_light";
    }

    if (this.props.isFile) {
      var nameArr = this.state.name.split(".");
      if (nameArr.length > 0) {
        mode = nameArr[nameArr.length - 1];
      } else {
        mode = "";
      }
    } else if (this.props.isHtml) {
      mode = "html";
    }

    return (
      <div
        onMouseOut={() => {
          this.setEditorScrolling(false);
        }}
      >
        <br hidden={this.props.isBlob}/>
        <AceEditor
          markers={markers}
          style={{
            width: this.state.editorWidth,
            height: this.state.editorHeight,
            background: "transparent",
            fontFamily: "Inconsolata"
          }}
          mode={mode}
          theme={theme}
          onChange={value => {
            this.setState({ code: value, editsMade: true });
            ipc && ipc.send("edited");
          }}
          name={"name" + this.props.id.toString()}
          fontSize={this.state.codeSize}
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
          this.setState({ runningBorder: false });
        }, 300)
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
    } else if (this.props.isHtml || this.props.isFile || this.props.isImg) {
      nameColor = "htmlCssName";
    }

    var argsColor = "greyText";
    var namePlaceholder = "function name...";
    if (this.props.isFile) {
      namePlaceholder = "file name...";
    } else if (this.props.isImg) {
      namePlaceholder = "image name...";
    }
    return (
      <div>
        <input
          placeholder={namePlaceholder}
          disabled={this.props.isHtml}
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
          disabled={this.props.isHtml || this.props.isFile || this.props.isImg}
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
    var loopingOpacity = 0.0;
    if (this.state.looping === false) {
      loopingOpacity = 0.5;
    }

    return (
      <div>
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
          {"W:" +
            Math.floor(this.state.iframeWidth) +
            " H:" +
            Math.floor(this.state.iframeHeight)}
        </div>
        <div
          style={{
            transition: this.state.loopingTransition,
            position: "absolute",
            fontSize: globals.codeSize,
            opacity: loopingOpacity,
            top: 80,
            left: 25 + this.state.editorWidth
          }}
          class="text-greyText "
        >
          {"paused"}
        </div>
        <Resizable
          className="ml-1 bg-white shadow"
          onResize={e => {
            this.updateIframeDimensions(
              e.movementX / this.props.getScale(),
              e.movementY / this.props.getScale()
            );
          }}
          onResizeStart={() => {
            this.props.onStartMove();
            this.setState({ resizingIframe: true });
          }}
          onResizeStop={e => {
            this.props.onStopMove();
            this.setState({ resizingIframe: false });
          }}
onMouseOver={this.compileCallback.bind(this)}

   
          style={{
            overflow: "hidden",
            zIndex: 5,
            border:"none"
          }}
        >
          <div >
            <div
              style={{
                position: "absolute",
                width: this.state.iframeWidth,
                height: this.state.iframeHeight,
                background: "transparent"
              }}
              hidden={!this.state.iframeDisabled}
            >
              {" "}
            </div>
            <div
              style={{
                height: this.state.iframeHeight,
                width: this.state.iframeWidth
              }}
            >
              <img src={this.state.code} hidden={!this.props.isImg} />
          
            <iframe
              hidden={this.props.isImg}
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
             
                height: this.state.iframeHeight,
                width: this.state.iframeWidth,
                // pointerEvents:"none"
              }}
              srcdoc={this.state.iframeCode}
              sandbox="allow-forms allow-modals allow-pointer-lock allow-popups  allow-same-origin allow-scripts"
              allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media"
            />
              </div>
          </div>
        </Resizable>
      </div>
    );
  }

  setIframeDisabled(status) {
    this.setState({ iframeDisabled: status });
  }

  copyAndOpt(isOpt = false) {
    if (this.props.isHtml) {
      return;
    }

    var data = this.getData();
    data.zIndex = undefined;

    var updateName = false,
      updatePosition = false,
      setIframeDisabled = false;
    if (isOpt) {
      setIframeDisabled = true;
    } else {
      updateName = true;
      updatePosition = true;
    }

    var callback = id => this.props.requestCompile(id);
    if (isOpt) {
      callback = id => {
        this.props.requestCompile(id);

        this.cristalRef.current.changeZIndex();
      };
    }

    var newName = this.props.addStamp(
      data,
      callback,
      updateName,
      updatePosition,
      setIframeDisabled
    );
    if (isOpt) {
      this.setState({ name: this.state.name + "Copy" }, () => this.checkName());
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
      isFile: this.props.isFile,
      isImg: this.props.isImg,
      hidden: this.state.hidden,
      exported: true,
      zIndex: this.state.zIndex,
      isBlob:this.props.isBlob,
      codeSize:this.state.codeSize
    };

    return data;
  }

  resizeEditor(widthDiff, heightDiff, x) {
    var height = this.state.editorHeight + heightDiff;
    var width = this.state.editorWidth + widthDiff;

    if (height < 0 || width < 0) {
      return true;
    }

    this.setState({
      editorHeight: height,
      editorWidth: width,
      x: x
    });
    this.editorRef.current.editor.resize();
  }

  getIcon() {
    var icon = FunctionStampIcon;
    if (this.props.isHtml) {
      icon = HtmlStampIcon;
    } else if(this.props.isBlob){
      icon = BlobStampIcon
    } else if (this.props.isFile) {
      icon = FileStampIcon;
    } else if (this.props.isImg) {
      icon = ImageStampIcon;
    } else if (this.state.isSpecialFn) {
      if (globals.specialFns[this.state.name]) {
        icon = BuiltInStampIcon;
      } else {
        icon = ListenerStampIcon;
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
    if (this.props.isHtml || this.props.isFile || this.props.isImg) {
      bgColor = "bg-htmlCssArea";
    }

    if (this.state.hidden) {
      return <div></div>;
    }

    var iframeWidth = this.state.iframeWidth;
    if (this.props.isFile) {
      iframeWidth = 0;
    }

    var initialHeight = this.state.editorHeight + globals.fnTitleHeight + 60;
    if (this.props.isImg) {
      initialHeight = this.state.iframeHeight + globals.fnTitleHeight + 35;
    }else if(this.props.isBlob){
      initialHeight = this.state.editorHeight + 60
    }

    return (
      <div>
        <Cristal
          zIndex={this.props.starterZIndex}
          onZChange={s => this.setState({ zIndex: s.zIndex })}
          getScale={this.props.getScale}
          initialSize={{
            width: iframeWidth + this.state.editorWidth + 42,
            height: initialHeight
          }}
          ref={this.cristalRef}
          isResizable={!this.props.isImg}
          onStartResize={this.props.onStartMove.bind(this)}
          onStopResize={this.props.onStopMove.bind(this)}
          onStartMove={this.props.onStartMove}
          onStopMove={this.props.onStopMove}
          onClose={() => this.props.onDelete(this.props.id)}
          onCopy={() => this.copyAndOpt()}
          onOptMove={() => this.copyAndOpt(true)}
          closeHidden={this.props.isHtml}
          copyHidden={this.props.isHtml}
          initialPosition={{ x: this.state.x, y: this.state.y }}
          className={
            "stamp shadow-sm " +
            bgColor +
            " " +
            border +
            " vertex" +
            this.props.id
          }
          onResize={this.resizeEditor.bind(this)}
          onStartResize={this.props.onStartMove}
          onStopResize={this.props.onStopMove}
          onMove={s => this.setState({ x: s.x, y: s.y })}
          icon={this.getIcon()}
          parentID={this.props.id}
          showCodeSize={this.props.isBlob}
          onCodeSize ={() => {
            console.log(this.state.codeSize)
            console.log(globals.codeSize)
            if(this.state.codeSize === globals.codeSize){
              this.setState({codeSize:globals.bigCodeSize})
            }else{
              this.setState({codeSize:globals.codeSize})
            }
          }}
        >
          <div onMouseLeave={this.compileCallback.bind(this)}>
            <div
              class={headerColor}
              hidden={this.props.isBlob}
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
              <div hidden={this.props.isBlob}>
              {this.renderFunctionName()}
              </div>

              <div class="row m-0">
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
