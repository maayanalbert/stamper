import React, { Component } from "react";
import Cristal from "./react-cristal/dist/es2015/index.js";
import $ from "jquery";
import "ace-builds/webpack-resolver";
import AceEditor from "react-ace";
import pf, { globals, p5Lib } from "./globals.js";
import CodeIcon from "@material-ui/icons/Code";
import TextIcon from "@material-ui/icons/TextFields";

// import "ace-builds/src-noconflict/mode-javascript";
// import "ace-builds/src-noconflict/theme-tomorrow";
// import "ace-builds/src-min-noconflict/ext-language_tools";
// import "ace-builds/src-noconflict/snippets/javascript";

var userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(" electron/") > -1) {
  const electron = window.require("electron");
  var ipc = electron.ipcRenderer;
} else {
  var ipc = false;
}

export default class BlobStamp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: this.props.starterCode,
      editorScrolling: false,
      editorHeight: this.props.starterEditorHeight,
      editorWidth: this.props.starterEditorWidth,
      errorLines: this.props.errorLines,
      exportableCode: "",
      editsMade: "",
      runningBorder: false,
      x: this.props.initialPosition.x,
      y: this.props.initialPosition.y,
      originX: this.props.initialOriginX,
      originY: this.props.initialOriginY,
      scale: this.props.initialScale,
      hidden: this.props.initialHidden,
      codeSize:this.props.starterCodeSize
    };

    this.cristalRef = React.createRef();
    this.editorRef = React.createRef();
  }

  componentDidMount() {
    this.loadp5Lib()
    this.setState({ exportableCode: "" }, () =>
      this.props.requestCompile(this.props.id)
    );
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

  mouseOutCallback() {
    if (this.state.editsMade) {
      this.props.requestCompile(this.props.id);
      this.setState({ editsMade: false, runningBorder: true }, () =>
        setTimeout(() => this.setState({ runningBorder: false }), 100)
      );
    }
  }

  toggleHide(scale, originX, originY, callback) {
    if (this.state.hidden) {
      var distFromOriginX =
        (this.state.originX - this.state.x) / this.state.scale;
      var distFromOriginY =
        (this.state.originY - this.state.y) / this.state.scale;
      var x = originX - distFromOriginX * scale;
      var y = originY - distFromOriginY * scale;
      this.setState({ hidden: false, scale: scale, x: x, y: y }, callback);
    } else {
      this.setState(
        { hidden: true, originX: originX, originY: originY, scale: scale },
        callback
      );
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

    return (
      <div
        onMouseOut={() => {
          this.setEditorScrolling(false);
        }}
      >
        <AceEditor
          style={{
            width: this.state.editorWidth,
            height: this.state.editorHeight
          }}
          mode="javascript"
          theme="p5"
          onChange={value => {
            this.setState({ code: value });
            ipc && ipc.send("edited");
            this.setState({ editsMade: true });
          }}
          markers={markers}
          name={"name" + this.props.id.toString()}
          fontSize={this.state.codeSize}
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

    var callback = () => null
    if(isOpt){
      callback = () => this.cristalRef.current.changeZIndex()
    }

    this.props.addStamp(data, updatePosition, callback);
  }

  addErrorLine(lineNum) {
    var errorLines = this.state.errorLines;
    errorLines[lineNum] = "";
    this.setState({ errorLines: errorLines });
  }

  clearErrorsAndUpdate(editsMade, newErrors = []) {
    var newErrorLines = this.state.errorLines;
    if (editsMade) {
      var newErrorLines = {};
    }
    this.setState({ errorLines: newErrorLines }, () => {
      this.setState({ exportableCode: this.props.getExportableCode() });
      for (var i = 0; i < newErrors.length; i++) {
        this.addErrorLine(newErrors[i]);
      }
    });
  }

  getData() {
    var data = {
      code: this.state.code,
      editorWidth: this.state.editorWidth,
      editorHeight: this.state.editorHeight,
      x: this.state.x,
      y: this.state.y,
      originX: this.state.originX,
      originY: this.state.originY,
      scale: this.state.scale,
      hidden: this.state.hidden,
      codeSize:this.state.codeSize
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

  getIcon() {
    return CodeIcon;
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

    compileCallback() {
    if (this.state.editsMade) {
      this.props.requestCompile(this.props.id);
      $(".vertex" + this.props.id).css({transition: "all .3s ease-out"})
      this.setState({ editsMade: false, runningBorder: true }, () =>
        setTimeout(() => {
          this.setState({ runningBorder: false }, () => {
            setTimeout(() => $(".vertex" + this.props.id).css({transition: "none"}), 300)
          })
        }
      , 300)
      );
    }
  }

  render() {
    var border = "border border-borderGrey";
    if (Object.keys(this.state.errorLines).length > 0) {
      border = "border border-warningOrange";
    }

    if (this.state.runningBorder) {
      border = "border border-blue";
    }

    if (this.state.hidden) {
      return <div></div>;
    }
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
          initialPosition={{ x: this.state.x, y: this.state.y }}
          onMove={s => this.setState({ x: s.x, y: s.y })}
          initialScale={this.state.scale}
          className={
            "shadow-sm bg-jsArea " + border + " vertex" + this.props.id
          }
          title="Anything"
          icon={this.getIcon()}
          makeBigIcon ={TextIcon}
          showMakeBig
          onMakeBig ={() => {
            if(this.state.codeSize === globals.codeSize){
              this.setState({codeSize:globals.bigCodeSize})
            }else{
              this.setState({codeSize:globals.codeSize})
            }
          }}

        >
          <div class="row m-0" onMouseLeave={this.compileCallback.bind(this)}>
            {this.renderEditor()}
          </div>
        </Cristal>
      </div>
    );
  }
}
