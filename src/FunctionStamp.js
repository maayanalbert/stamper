import React, { Component } from "react";
import Cristal from "./react-cristal/dist/es2015/index.js";
import Copy from "./copy.png";
import $ from "jquery";
import "ace-builds/webpack-resolver";
import AceEditor from "react-ace";
import pf, { globals, p5Lib } from "./globals.js";

import "./theme-p5.js";

import "ace-builds/src-noconflict/mode-javascript";

// import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/javascript";
import { Resizable, ResizableBox } from "react-resizable";

const electron = window.require("electron");
const ipc = electron.ipcRenderer;

export default class FunctionStamp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: this.props.starterCode,
      name: this.props.starterName,
      args: this.props.starterArgs,
      fullFun: "",
      drawableFun: "",
      runnableInnerCode: "",
      iframeDisabled: this.props.iframeDisabled,
      iframeWidth: this.props.starterIframeWidth,
      iframeHeight: this.props.starterIframeHeight,
      editorHeight: this.props.starterEditorHeight,
      editorWidth: this.props.starterEditorWidth,
      editorHidden: false,
      duplicateName: false,
      isSpecialFn: false,
      editorScrolling: false,
    };

    this.cristalRef = React.createRef();
    this.editorRef = React.createRef();
  }
  updateFuns(fromEdit = false) {
    var name = this.state.name;

    var fullFun =
      "function " +
      name +
      "(" +
      this.state.args +
      "){\n" +
      this.state.code +
      "\n}";

    var drawableFun = name + "()";

    var isSpecialFn = name in globals.specialFns;
    if (this.props.isHtml || this.props.isCss) {
      fullFun = "";
      drawableFun = "";
    }

    this.setState(
      {
        fullFun: fullFun,
        drawableFun: drawableFun,
        runnableInnerCode: this.state.code
      },
      () => this.props.forceUpdateStamps(this.props.id, fromEdit)
    );
  }

  checkName() {
    var isSpecialFn = this.state.name in globals.specialFns;
    this.setState({ isSpecialFn: isSpecialFn });
    this.props.checkAllNames();
  }

  setDuplicateStatus(status) {
    this.setState({ duplicateName: status });
  }

  componentDidMount() {
    this.updateFuns();
    this.checkName();
    if (this.props.id === 0) {
      this.loadp5Lib();
    }
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


    ipc.send("edited");
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
    return (
      <div
        onMouseOut={() => {
          this.updateFuns(true);
          this.setEditorScrolling(false);
        }}
        hidden={this.state.editorHidden}
      >
        <br />
        <AceEditor
          style={{
            width: this.state.editorWidth,
            height: this.state.editorHeight,

          }}
          mode="javascript"
          theme="p5"
          onChange={value => {
            this.setState({ code: value });
            ipc.send("edited");
          }}
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

  renderFunctionName() {
    var displayName = "";
    if (this.state.name != this.props.starterName) {
      var displayName = this.state.Name;
    }

    var nameColor = "blue";
    if (this.state.duplicateName) {
      nameColor = "danger";
    } else if (this.state.isSpecialFn) {
      nameColor = "pink";
    }
    return (
      <div>
        <input
          placeholder="function name..."
          disabled={this.props.isHtml || this.props.isCss}
          onChange={event => {
            this.setState({ name: event.target.value }, () => this.checkName());
            ipc.send("edited");
          }}
          onMouseOut={() => this.updateFuns(true)}
          value={this.state.name}
          class={"text-" + nameColor + " name"}
        />

        <br />

        <input
        // @cameron styling for arguments field
          placeholder="arguments..."
          disabled={this.props.isHtml || this.props.isCss}
          onChange={event => {
            this.setState({ args: event.target.value });
            ipc.send("edited");
          }}
          onMouseOut={() => this.updateFuns(true)}
          value={this.state.args}
          class="text-lightGreyText args"
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
            zIndex: 1
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
            <iframe
              scrolling="no"
              style={{
                border: "none",
                height: this.state.iframeHeight + globals.iframeMargin,
                width: this.state.iframeWidth + globals.iframeMargin,
                margin: "-" + globals.iframeMargin.toString() + "px"
                // pointerEvents:"none"
              }}
              srcdoc={this.props.getHTML(this.props.id)}
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
    // <!-- @cameron little white div thing --> scroll down to style
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
          className={"shadow-sm bg-jsArea border border-borderGrey"}
          onResize={this.resizeEditor.bind(this)}
          onStartResize={this.props.onStartMove}
          onStopResize={this.props.onStopMove}
        >

          <div

            class="bg-white"
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
