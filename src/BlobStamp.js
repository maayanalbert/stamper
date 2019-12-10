import React, { Component } from "react";
import Cristal from "./react-cristal/dist/es2015/index.js";
import Copy from "./copy.png";
import $ from "jquery";
import "ace-builds/webpack-resolver";
import AceEditor from "react-ace";
import pf, { globals, p5Lib } from "./globals.js";

// import "ace-builds/src-noconflict/mode-javascript";
// import "ace-builds/src-noconflict/theme-solarized_light";
// import "ace-builds/src-min-noconflict/ext-language_tools";
// import "ace-builds/src-noconflict/snippets/javascript";

const electron = window.require('electron');
const ipc = electron.ipcRenderer;

export default class BlobStamp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: this.props.starterCode,
      runnableCode: "",
      editorScrolling: false,
      editorHeight: this.props.starterEditorHeight,
      editorWidth: this.props.starterEditorWidth,
      errorLines:this.props.errorLines
    };

    this.cristalRef = React.createRef();
    this.editorRef = React.createRef();
  }
  updateCode() {

    this.setState({ runnableCode: this.state.code }, () =>
      this.props.forceUpdateStamps()
    );
  }

  componentDidMount() {
    this.updateCode();
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
          this.updateCode();
          this.setEditorScrolling(false);
        }}
      >
        <AceEditor
          style={{
            width: this.state.editorWidth,
            height: this.state.editorHeight,

          }}
          mode="javascript"
          theme="solarized_light"
          onChange={value => {
            this.setState({ code: value });ipc.send("edited") 
          }
          }
          fontSize={globals.globalVarCodeSize}
          showPrintMargin={false}
          wrapEnabled={true}
          showGutter={false}
          onScroll={() => this.setEditorScrolling(true)}
          highlightActiveLine={false}
          value={this.state.code}
          ref={this.editorRef}
          className="bg-jsArea"
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

  copyAndOpt(isOpt = false) {
    var data = this.getData();

    var updatePosition = false;
    if (isOpt === false) {
      updatePosition = true;
    }

    this.props.addStamp(data, updatePosition);
  }

  addErrorLine(lineNum){
    var errorLines = this.state.errorLines
    errorLines[lineNum] = ""
    this.setState({errorLines:errorLines})
  }

  clearErrorLines(){
    this.setState({errorLines:{}})
  }

  getData() {
    var data = {
      code: this.state.code,
      x: this.cristalRef.current.state.x,
      y: this.cristalRef.current.state.y,
      editorWidth: this.state.editorWidth,
      editorHeight: this.state.editorHeight,
      errorLines:this.state.errorLines
    };

    return data;
  }

  resizeEditor(widthDiff, heightDiff) {
    var height = this.state.editorHeight;
    var width = this.state.editorWidth;
    this.setState({
      editorHeight: height + heightDiff,
      editorWidth: width + widthDiff
    });
    this.editorRef.current.editor.resize();
  }

  render() {
    return (
      <div>
        <Cristal
          ref={this.cristalRef}
          onResize={this.resizeEditor.bind(this)}
          isResizable={true}
          onStartMove={this.props.onStartMove}
          onStopMove={this.props.onStopMove}
          onClose={() => this.props.onDelete(this.props.id)}
          onCopy={() => this.copyAndOpt()}
          onOptMove={() => this.copyAndOpt(true)}
          initialPosition={this.props.initialPosition}
          initialScale={this.props.initialScale}
          className="shadow-sm bg-jsArea"
        >
          <div class="row m-0">{this.renderEditor()}</div>
        </Cristal>
      </div>
    );
  }
}
