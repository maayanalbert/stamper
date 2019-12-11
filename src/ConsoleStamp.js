import React, { Component } from "react";
import Cristal from "./react-cristal/dist/es2015/index.js";
import Copy from "./copy.png";
import $ from "jquery";
import "ace-builds/webpack-resolver";
import AceEditor from "react-ace";
import pf, { globals, p5Lib } from "./globals.js";
import { Hook, Console, Decode } from "console-feed";
var _ = require("lodash");


var userAgent = navigator.userAgent.toLowerCase();
if(userAgent.indexOf(' electron/') > -1){
  const electron = window.require("electron");
  var ipc = electron.ipcRenderer;
}else{
  var ipc = false
}


export default class ConsoleStamp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: [],
      consoleHeight: this.props.starterConsoleHeight,
      consoleWidth: this.props.starterConsoleWidth,
      lastFreq: 0
    };

    this.cristalRef = React.createRef();
  }

  clearConsole() {
    // this.setState({logs:[], lastFreq:0})
  }

  setEditorScrolling(isScrolling) {
    this.props.disablePan(isScrolling);
  }

  addNewIframeConsole(newConsole) {

    Hook(newConsole, newLogs => {
      newLogs.map(log => {
        if (log.method === "log") {
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
      consoleContainer.scrollTop = consoleContainer.scrollHeight;
    } else {
      var lastLog = logs[logs.length - 1];

      if (_.isEqual(lastLog.data, log.data)) {
        this.setState({ lastFreq: this.state.lastFreq + 1 });
      } else {
        logs.push(log);
        this.setState({ logs: logs, lastFreq: 1 });
        var consoleContainer = document.getElementById("consoleContainer");
        consoleContainer.scrollTop = consoleContainer.scrollHeight;
      }
    }
  }

  reportError(message, method = "error"){

this.checkLastLog({ method: method, data: [message] });
  }

    getData() {
    var data = {

      x: this.cristalRef.current.state.x,
      y: this.cristalRef.current.state.y,
      consoleWidth: this.state.consoleWidth,
      consoleHeight: this.state.consoleHeight,
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
  }

  render() {
    var renderedLogs = _.cloneDeep(this.state.logs);
    if (this.state.lastFreq > 1) {
      renderedLogs.push({
        method: "log",
        data: ["(" + this.state.lastFreq.toString() + ")"]
      });
    }
    return (
      <Cristal
        ref={this.cristalRef}
        initialScale={this.props.initialScale}
        closeHidden={true}
        copyHidden={true}
        onResize={this.resizeConsole.bind(this)}
        initialPosition={this.props.initialPosition}
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
            "white-space": "nowrap",
            backgroundColor: "#242424"
          }}
        >
          <Console logs={renderedLogs} variant="dark" />
        </div>
      </Cristal>
    );
  }
}
