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
import MediaAssetIcon from "./icons/layers-light.svg";
import { ArcherContainer, ArcherElement } from 'react-archer';

import "./theme-p5.js";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/javascript";


import { Resizable, ResizableBox } from "react-resizable";

var mime = require("mime-types");

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
    if (this.props.isMediaFile) {
      starterEditorWidth = 0;
    }
    var starterArgs = this.props.starterArgs;
    if (
      this.props.isIndex ||
      this.props.isTxtFile ||
      this.props.isMediaFile ||
      this.props.isBlob
    ) {
      starterArgs = " ";
    }

    var starterName = this.props.starterName;
    if (this.props.isBlob) {
      starterName = "";
    }

    var starterIframeWidth = this.props.starterIframeWidth;
    var starterIframeHeight = this.props.starterIframeHeight;
    if (this.props.isTxtFile || this.props.isBlob) {
      starterIframeWidth = 0;
      starterIframeHeight = 0;
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
      looping: true,
      loopingTransition: "",
      zIndex: this.props.starterZIndex,
      exportableCode: "",
      codeSize: this.props.starterCodeSize,
      dataUri: "",
      lineData:[]
    };

    this.cristalRef = React.createRef();
    this.editorRef = React.createRef();

    this.updateLooping = this.updateLooping.bind(this);
  }

  toggleHide(callback) {
    window.postMessage({type:"edited"}, '*');
    if (this.state.hidden) {
      this.setState(
        { hidden: false, iframeHeight: this.state.iframeHeight, zIndex:undefined },
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
      this.props.isIndex ||
      this.props.isMediaFile ||
      this.props.isBlob
    ) {
      return;
    }

    if (e.data.message === "start") {
      this.setState({ looping: true, loopingTransition: "" });
    } else if (e.data.message === "stop") {
      this.setState({
        looping: false,
        loopingTransition: "opacity 1s ease-in"
      });
    }
  }

  componentDidMount() {
    // this.loadp5Lib()

    this.checkName();
    this.setDataUri(() => this.props.requestCompile(this.props.id));
    window.addEventListener("message", this.updateLooping);
  }

  componentWillUnmount() {
    window.removeEventListener("message", this.updateLooping);
  }

  setDataUri(callback = () => null) {
    if (this.props.isTxtFile === false) {
      return;
    }
    var mimeType = mime.lookup(this.state.name);

    if (!mimeType || mimeType.split("/").length === 0) {
      // throw error
      return;
    }
    var mimeTypeArr = mimeType.split("/");
    mimeTypeArr[0] = "text";
    mimeType = mimeTypeArr.join("/");

    var fileObj = new File([this.state.code], this.state.name, {
      type: mimeType
    });

    var reader = new FileReader();

    reader.onload = function(e) {
      this.setState({ dataUri: e.target.result }, callback);
    };

    reader.onload = reader.onload.bind(this);

    reader.readAsDataURL(fileObj);
  }

  checkName() {
    var isSpecialFn = this.state.name in globals.specialFns;
    this.setState({ isSpecialFn: isSpecialFn });
  }

  addErrorLine(lineNum) {
    var errorLines = this.state.errorLines;
    errorLines[lineNum] = "";
    this.setState({ errorLines: errorLines }, () =>
      this.props.setLayerPicker()
    );
  }

  setLineData( lineData = []){
    this.setState({lineData:lineData})
  }

  clearErrorsAndUpdate(newErrors = []) {
 
    var newErrorLines = this.state.errorLines;
    var newErrorLines = {};

    this.setState({ errorLines: newErrorLines}, () => {
      var iframeCode = "";
      var exportableCode = "";

      if (this.props.isBlob) {
        exportableCode = this.props.getExportableCode();
      } else if (
        this.props.isTxtFile === false &&
        this.props.isMediaFile === false
      ) {
        iframeCode = this.props.getHTML(this.props.id);
      }

      this.setState({
        iframeCode: iframeCode,
        exportableCode: exportableCode,
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
    window.postMessage({type:"edited"}, '*')

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

    if (this.props.isMediaFile === false) {
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

    if (this.props.isIndex || this.props.isTxtFile || this.props.isMediaFile) {
      theme = "solarized_light";
    }

    if (this.props.isTxtFile || this.props.isIndex) {
      var mimeType = mime.lookup(this.state.name);
      if (!mimeType || mimeType.split("/").length === 0) {
        return;
      }
      var mimeTypeArr = mimeType.split("/");
      var mode = mimeTypeArr[mimeTypeArr.length - 1];
    } else {
      var mode = "javascript";
    }

    return (
      <div
        onMouseOut={() => {
          this.setEditorScrolling(false);
        }}
      >
        <br hidden={this.props.isBlob} />
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
            window.postMessage({type:"edited"}, '*');
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

  stripExtension(name){
    var nameArr = name.split(".")
    if(nameArr.length < 2){
      return name
    }else{
      nameArr.pop()
      return nameArr.join(".")
    }
  }

  getExtension(name){
    var nameArr = name.split(".")
    if(nameArr.length < 2){
      return ""
    }else{
      var ext = nameArr.pop()
      return ext
    }    
  }

  addExtension(name, nameWithExtension){
    var nameArr = nameWithExtension.split(".")
    if(nameArr.length < 2){
      return name
    }else{
      var ext = nameArr.pop()
      return name + "." + ext
    }
  }

  compileCallback() {
    if (this.state.editsMade) {
      var compileActions = () => {
        this.props.requestCompile(this.props.id);
        window.postMessage({type:"edited"}, '*');
        this.setState({ editsMade: false, runningBorder: true }, () =>
          setTimeout(() => {
            this.setState({ runningBorder: false });
          }, 300)
        );
      };

      if (this.props.isTxtFile) {
        this.setDataUri(compileActions);
      } else {
        compileActions();
      }
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
    } else if (
      this.props.isIndex ||
      this.props.isTxtFile ||
      this.props.isMediaFile
    ) {
      nameColor = "htmlCssName";
    }

    var argsColor = "greyText";
    var namePlaceholder = "function name...";
    if (this.props.isTxtFile) {
      namePlaceholder = "file name...";
    } else if (this.props.isMediaFile) {
      namePlaceholder = "";
    }

    var displayName = this.state.name
    if(this.props.isMediaFile){
      displayName = this.stripExtension(displayName)
    }
    return (
      <div>
         <p hidden={!this.props.isMediaFile}
         className={"text-lightGreyText name"} style={{position:"absolute", top:49, left:19}}>{this.state.name}</p>
        <input
          placeholder={namePlaceholder}
          disabled={this.props.isIndex}
          onChange={event => {
            var newName = event.target.value;

            if(this.props.isMediaFile){
              newName = this.addExtension(newName, this.state.name)
            }
            this.setState({name:newName})
            window.postMessage({type:"edited"}, '*');
          }}
          style={{ background: "transparent" }}
          value={displayName}
          class={"text-" + nameColor + " name"}
        />


        <br />

        <input
          // @cameron styling for arguments field
          placeholder="arguments..."
          disabled={
            this.props.isIndex || this.props.isTxtFile || this.props.isMediaFile
          }
          onChange={event => {
            this.setState({ args: event.target.value, editsMade: true });
            window.postMessage({type:"edited"}, '*');
          }}
          style={{ background: "transparent" }}
          value={this.state.args}
          class={"text-" + argsColor + " args"}
        />
      </div>
    );
  }

  renderMediaAsset() {
    if (!this.props.isMediaFile) {
      return null;
    }

    var mimeType = mime.lookup(this.state.name);
    if (!mimeType) {
      return;
    }
    if (mimeType.startsWith("image")) {
      return <img src={this.state.code} />;
    } else if (mimeType.startsWith("audio")) {
      return (
        <audio controls>
          <source src={this.state.code} type={mimeType} />
        </audio>
      );
    } else if (mimeType.startsWith("video")) {
      return (
        <video controls>
          <source src={this.state.code} type={mimeType} />
        </video>
      );
    }else{
      return (
        <div className={"bg-borderGrey pt-5 d-flex justify-content-center"} style={{width: this.state.iframeWidth, 
        height: this.state.iframeHeight}}>
      {React.createElement("img", {
      style:  {width: 100, 
        height: 100,
        opacity:.5 },
      src: MediaAssetIcon
    })}
      </div>
      )


    }
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
            top: globals.fnTitleHeight - 5,
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
            top: globals.fnTitleHeight - 5,
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
            var newSize = this.getSize()
            this.cristalRef.current.manualSetSize(newSize.width, newSize.height)
          }}
          onMouseOver={this.compileCallback.bind(this)}
          style={{
            overflow: "hidden",
            zIndex: 5,
            border: "none"
          }}
        >
          <div>
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
              {this.renderMediaAsset()}

              <iframe
                hidden={this.props.isMediaFile}
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
                  width: this.state.iframeWidth
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

  getCopyStampName(name, isFile) {
    if (!isFile) {
      return name + "Copy";
    } else {
      var nameArr = name.split(".");
      if (nameArr.length === 0) {
        return "";
      }
      nameArr[0] = nameArr[0] + "Copy";
      return nameArr.join(".");
    }
  }

  copyAndOpt(isOpt = false) {
    window.postMessage({type:"edited"}, '*')
    if (this.props.isIndex) {
      return;
    }

    var data = this.getData();
    data.zIndex = undefined;

    var newName = this.getCopyStampName(
      this.state.name,
      this.props.isTxtFile || this.props.isMediaFile
    );

    if (!this.props.isBlob) {
      if (isOpt) {
        this.setState({ name: newName }, () => this.checkName());
      } else {
        data.name = newName;
      }
    }

    if (isOpt) {
      data.iframeDisabled = true;
    } else {
      data.x += globals.copyOffset;
      data.y += globals.copyOffset;
    }

    var callback = id => this.props.requestCompile(id);
    if (isOpt) {
      callback = id => {
        this.props.requestCompile(id);
        this.cristalRef.current.changeZIndex();
      };
    }

    var newName = this.props.addStamp(data, callback);
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
      isIndex: this.props.isIndex,
      isTxtFile: this.props.isTxtFile,
      isMediaFile: this.props.isMediaFile,
      hidden: this.state.hidden,
      exported: true,
      zIndex: this.state.zIndex,
      isBlob: this.props.isBlob,
      codeSize: this.state.codeSize
    };

    return data;
  }

  resizeEditor(widthDiff, heightDiff, x, change = true) {
    var height = this.state.editorHeight + heightDiff;
    var width = this.state.editorWidth + widthDiff;

    if (height < 0 || width < 0) {
      return true;
    }

    if (change) {
      this.setState({
        editorHeight: height,
        editorWidth: width,
        x: x
      });
      this.editorRef.current.editor.resize();
    }
  }

  getIcon() {
    var icon = FunctionStampIcon;
    if (this.props.isIndex) {
      icon = HtmlStampIcon;
    } else if (this.props.isBlob) {
      icon = BlobStampIcon;
    } else if (this.props.isTxtFile) {
      icon = FileStampIcon;
    } else if (this.props.isMediaFile) {
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

  getSize(){
        var iframeWidth = this.state.iframeWidth;
    if (this.props.isTxtFile) {
      iframeWidth = 0;
    }

    var initialHeight = this.state.editorHeight + globals.fnTitleHeight + 60;
    if (this.props.isMediaFile) {
      initialHeight = this.state.iframeHeight + globals.fnTitleHeight + 35;
    } else if (this.props.isBlob) {
      initialHeight = this.state.editorHeight + 60;
    }

    return {width: iframeWidth + this.state.editorWidth + 42, height:initialHeight}

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
    if (this.props.isIndex || this.props.isTxtFile || this.props.isMediaFile) {
      bgColor = "bg-htmlCssArea";
    }

    if (this.state.hidden) {
      return <div></div>;
    }

    var iframeWidth = this.state.iframeWidth;
    if (this.props.isTxtFile) {
      iframeWidth = 0;
    }

    var initialHeight = this.state.editorHeight + globals.fnTitleHeight + 60;
    if (this.props.isMediaFile) {
      initialHeight = this.state.iframeHeight + globals.fnTitleHeight + 35;
    } else if (this.props.isBlob) {
      initialHeight = this.state.editorHeight + 60;
    }

    return (
      <div>
        <Cristal
          zIndex={this.state.zIndex}
          onZChange={s => 

            {
            this.setState({ zIndex: s.zIndex }, () =>   this.props.updateLineData())
          
            }}


          getScale={this.props.getScale}
          getSnapMargin={this.props.getSnapMargin}
          initialSize={this.getSize()}
          ref={this.cristalRef}
          isResizable={!this.props.isMediaFile}
          onStartResize={this.props.onStartMove.bind(this)}
          onStopResize={this.props.onStopMove.bind(this)}
          onStartMove={this.props.onStartMove}
          onStopMove={this.props.onStopMove}
          onClose={() => this.props.onDelete(this.props.id)}
          onCopy={() => this.copyAndOpt()}
          onOptMove={() => this.copyAndOpt(true)}
          closeHidden={this.props.isIndex}
          copyHidden={this.props.isIndex}
          initialPosition={{ x: this.state.x, y: this.state.y }}
          lineData={this.state.lineData}
          className={
            "stamp shadow-sm " +
            bgColor +
            " " +
            border +
            " vertex" +
            this.props.id
          }
          onResize={this.resizeEditor.bind(this)}

          onMove={s => this.setState({ x: s.x, y: s.y })}
          icon={this.getIcon()}
          parentID={this.props.id}
          showCodeSize={this.props.isBlob}
          onCodeSize={() => {
            window.postMessage({type:"edited"}, '*')
            if (this.state.codeSize === globals.codeSize) {
              this.setState({ codeSize: globals.bigCodeSize });
            } else {
              this.setState({ codeSize: globals.codeSize });
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
              <div hidden={this.props.isBlob}>{this.renderFunctionName()}</div>

              <div class="row m-0 mt-2">
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
