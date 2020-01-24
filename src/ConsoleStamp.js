import React, { Component } from "react";
import Cristal from "./react-cristal/dist/es2015/index.js";
import $ from "jquery";
import "ace-builds/webpack-resolver";
import AceEditor from "react-ace";
import pf, { globals, p5Lib } from "./globals.js";
import { Hook, Console, Decode } from "console-feed";
import ConsoleStampIcon from "./icons/message-circle.svg";

var _ = require("lodash");

var userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(" electron/") > -1) {
  const electron = window.require("electron");
  var ipc = electron.ipcRenderer;
} else {
  var ipc = false;
}

export default class ConsoleStamp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: [],
      consoleHeight: this.props.starterConsoleHeight,
      consoleWidth: this.props.starterConsoleWidth,
      lastFreq: 0,
      hidden: this.props.initialHidden,
      x: this.props.initialPosition.x,
      y: this.props.initialPosition.y,
      zIndex:-1
    };

    this.cristalRef = React.createRef();
    this.limit = 100
    this.receiveMessage = this.receiveMessage.bind(this)
  }

  receiveMessage(e){
     if(e.data.type != "error"){
        return
      }

      this.logToConsole(e.data.message);

      var lineNum = e.data.lineno;
      var message = e.data.message;
      var id = e.data.id;

      this.props.addErrorLine(lineNum, id);
  }

  componentDidMount() {
    window.addEventListener("message", this.receiveMessage);
  }

  componentWillUnmount(){
    window.removeEventListener("message", this.receiveMessage);
  }

  clearConsole() {
    this.setState({ logs: [], lastFreq: 0 });
  }

  getIcon() {
    return ConsoleStampIcon;
  }

  toggleHide(callback) {
    ipc && ipc.send("edited");
    if (this.state.hidden) {
      this.setState({ hidden: false, savedIframeHeight:this.state.iframeHeight, iframeHeight:0 }, 
        () => this.setState({iframeHeight:this.state.savedIframeHeight}, callback)

      )

    } else {
      this.setState(
        { hidden: true},
        callback
      );
    }
  }
  setEditorScrolling(isScrolling) {
    this.props.disablePan(isScrolling);
  }

  addNewIframeConsole(newConsole) {

    var p5LogError = `Did you just try to use p5.js's loop() function? If so, you may want to move it into your sketch's setup() function.

For more details, see: https://github.com/processing/p5.js/wiki/p5.js-overview#why-cant-i-assign-variables-using-p5-functions-and-variables-before-setup`

  var p5LogError2 = `Did you just try to use p5.js's noLoop() function? If so, you may want to move it into your sketch's setup() function.

For more details, see: https://github.com/processing/p5.js/wiki/p5.js-overview#why-cant-i-assign-variables-using-p5-functions-and-variables-before-setup`
    Hook(newConsole, newLogs => {
      newLogs.map(log => {
        if (log.method === "log" && log.data[0] != p5LogError && log.data[0] != p5LogError2) {
          this.checkLastLog(log);
        }
      });
    });
  }

  checkLastLog(log) {
 


    var logs = this.state.logs;
    if (logs.length < 1) {
      this.setState({ logs: [log], lastFreq: 0 });
      var consoleContainer = document.getElementById("consoleContainer");
      if(consoleContainer){
        consoleContainer.scrollTop = consoleContainer.scrollHeight;
      }
  
    } else {
      var lastLog = logs[logs.length - 1];

      if (_.isEqual(lastLog.data, log.data)) {
        if(this.state.lastFreq >= this.limit){
          return
        }
        this.setState({ lastFreq: this.state.lastFreq + 1 });
      } else {
        if (this.state.lastFreq > 1) {
                var freqString = this.state.lastFreq.toString() 
      if(this.state.lastFreq >= this.limit){
        freqString += "+"
      }
          logs.push({
            method: "command",
            data: ["(" + freqString + ")"]
          });
        }
        logs.push(log);
        this.setState({ logs: logs, lastFreq: 1 });
        var consoleContainer = document.getElementById("consoleContainer");
        if(consoleContainer){
          consoleContainer.scrollTop = consoleContainer.scrollHeight;
        }

      }
    }
  }

  logToConsole(message, method = "error") {

    this.checkLastLog({ method: method, data: [message] });
  }

  getData() {
    var data = {
      x: this.state.x,
      y: this.state.y,
      consoleWidth: this.state.consoleWidth,
      consoleHeight: this.state.consoleHeight,
      hidden: this.state.hidden,
      zIndex:this.state.zIndex
    };

    return data;
  }

  resizeConsole(widthDiff, heightDiff) {
    var height = this.state.consoleHeight;
    var width = this.state.consoleWidth;
    this.setState({
      consoleHeight: height + heightDiff,
      consoleWidth: width + widthDiff
    });
      var consoleContainer = document.getElementById("consoleContainer");
      if(consoleContainer){
        consoleContainer.scrollTop = consoleContainer.scrollHeight;
      }
  }

    resizeConsole(widthDiff, heightDiff, x) {
    var height = this.state.consoleHeight + heightDiff;
    var width = this.state.consoleWidth + widthDiff;

    if (height < 0 || width < 0) {
      return true;
    }

    this.setState({
      consoleHeight: height,
      consoleWidth: width, 
      x:x
    });
    // this.editorRef.current.editor.resize();
  }

  render() {
    var renderedLogs = _.cloneDeep(this.state.logs);
    if (this.state.lastFreq > 1) {
      var freqString = this.state.lastFreq.toString() 
      if(this.state.lastFreq >= this.limit){
        freqString += "+"
      }

      renderedLogs.push({
        method: "command",
        data: ["(" + freqString + ")"]
      });

        var consoleContainer = document.getElementById("consoleContainer");
        if(consoleContainer){
          consoleContainer.scrollTop = consoleContainer.scrollHeight;
        }      
    }

    if (this.state.hidden) {
      return <div></div>;
    }

    return (
      <Cristal
                getSnapMargin={this.props.getSnapMargin}
           zIndex={this.props.starterZIndex}
        getScale={this.props.getScale}
       parentID = {this.props.id}
        ref={this.cristalRef}
        closeHidden={true}
        copyHidden={true}
        onResize={this.resizeConsole.bind(this)}
        initialPosition={{ x: this.state.x, y: this.state.y }}
        onMove={s => this.setState({ x: s.x, y: s.y })}
                  onStartResize={this.props.onStartMove.bind(this)}
          onStopResize={this.props.onStopMove.bind(this)}
        className="stamp bg-lightGrey border border-borderGrey shadow-sm"
        icon={this.getIcon()}
        showClear
                  onZChange={s => this.setState({zIndex:s.zIndex})}
        onClear={this.clearConsole.bind(this)}
        onResize={this.resizeConsole.bind(this)}
                  initialSize={{width:this.state.consoleWidth + 22, height:this.state.consoleHeight + 50 }}
      >
        <div
          id="consoleContainer"
          onMouseOver={() => this.setEditorScrolling(true)}
          onMouseOut={() => this.setEditorScrolling(false)}
          style={{
            width: this.state.consoleWidth,
            height: this.state.consoleHeight,
            overflow: "hidden",
            "overflow-y": "scroll",
            "white-space": "nowrap"
          }}
        >
          <Console
            styles={{
              LOG_COLOR: "black",
              LOG_ERROR_BACKGROUND: "rgba(255, 184, 0, .5)",
              LOG_ERROR_BORDER: "transparent",
              LOG_ERROR_COLOR: "rgba(102,102,102)",
              BASE_FONT_FAMILY: "Inconsolata",
              BASE_FONT_SIZE: 10,
              LOG_COMMAND_COLOR: "rgba(150,150,150)",
              BASE_BACKGROUND_COLOR: "transparent",
              LOG_BORDER: "rgb(225,225,225)",
              LOG_COMMAND_ICON: ""
            }}
            logs={renderedLogs}
            variant="light"
          />
        </div>
      </Cristal>
    );
  }
}
