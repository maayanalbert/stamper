import React, { Component } from "react";
import Cristal from "./react-cristal/dist/es2015/index.js";
import $ from "jquery";
import "ace-builds/webpack-resolver";
import AceEditor from "react-ace";
import pf, { globals, p5Lib } from "./globals.js";
import { Hook, Console, Decode } from "console-feed";

var _ = require("lodash");

var userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(" electron/") > -1) {
  const electron = window.require("electron");
  var ipc = electron.ipcRenderer;
} else {
  var ipc = false;
}

export default class StampConsole extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logs: [],
      consoleHeight: 100,
      consoleWidth: 100,
      lastFreq: 0
    };

    this.limit = 100;
    this.receiveMessage = this.receiveMessage.bind(this);
  }

  receiveMessage(e) {
    if (e.data.id != this.props.parentId) {
      return;
    }

    if (e.data.type === "error") {
      this.props.addErrorLine(e.data.lineno, e.data.message);
    }

    if (e.data.type === "debug") {
      this.logToConsole(e.data.message, e.data.type);
    }
  }

  componentDidMount() {
    window.addEventListener("message", this.receiveMessage);
  }

  componentWillUnmount() {
    window.removeEventListener("message", this.receiveMessage);
  }

  // idk what will come of this
  clearConsole() {
    this.setState({ logs: [], lastFreq: 0 });
  }

  autoScollDown() {
    document.getElementById("bottomView") &&
      document.getElementById("bottomView").scrollIntoView();
    var consoleContainer = document.getElementById("consoleContainer");

    if (consoleContainer) {
      consoleContainer.scrollTop = consoleContainer.scrollHeight;
    }
  }

  checkLastLog(log) {
    var logs = this.state.logs;
    if (logs.length < 1) {
      this.setState({ logs: [log], lastFreq: 0 });
      this.autoScollDown();
    } else {
      var lastLog = logs[logs.length - 1];

      if (_.isEqual(lastLog.data, log.data)) {
        if (this.state.lastFreq >= this.limit) {
          return;
        }
        this.setState({ lastFreq: this.state.lastFreq + 1 });
      } else {
        if (this.state.lastFreq > 1) {
          var freqString = this.state.lastFreq.toString();
          if (this.state.lastFreq >= this.limit) {
            freqString += "+";
          }
          logs.push({
            method: "command",
            data: ["(" + freqString + ")"]
          });
        }
        logs.push(log);
        this.setState({ logs: logs, lastFreq: 1 });
        this.autoScollDown();
      }
    }
  }

  logToConsole(message, method = "error") {
    this.checkLastLog({ method: method, data: [message] });
  }

  render() {
    var renderedLogs = _.cloneDeep(this.state.logs);
    if (this.state.lastFreq > 1) {
      var freqString = this.state.lastFreq.toString();
      if (this.state.lastFreq >= this.limit) {
        freqString += "+";
      }

      renderedLogs.push({
        method: "command",
        data: ["(" + freqString + ")"]
      });

      var consoleContainer = document.getElementById("consoleContainer");
      if (consoleContainer) {
        consoleContainer.scrollTop = consoleContainer.scrollHeight;
      }
    }
    if (this.props.invisible) {
      return <span />;
    }

    return (
      <div
        className={"border border-borderGrey"}
        id="consoleContainer"
        onMouseOver={() => this.props.setEditorScrolling(true)}
        onMouseOut={() => this.props.setEditorScrolling(false)}
        style={{
          width: "100%",
          maxHeight: "100%",
          overflow: "hidden",
          "overflow-y": "scroll",
          "white-space": "nowrap",
          position: "absolute",
          bottom: 0,
          opacity: 0.7,
          userSelect: "text"
        }}
      >
        <Console
          styles={{
            LOG_COLOR: "black",
            LOG_ERROR_BACKGROUND: "rgba(255, 184, 0, .5)",
            LOG_ERROR_BORDER: "transparent",
            LOG_ERROR_COLOR: "rgb(0,0,0)",
            BASE_FONT_FAMILY: "Inconsolata !important",
            BASE_FONT_SIZE: 11,
            LOG_COMMAND_COLOR: "rgba(150,150,150)",
            BASE_BACKGROUND_COLOR: "transparent",
            LOG_BORDER: "rgb(225,225,225)",
            LOG_COMMAND_ICON: "",
            LOG_ERROR_ICON: "",
            LOG_DEBUG_ICON: "",
            LOG_DEBUG_COLOR: "rgb(70, 160, 206)"
          }}
          logs={renderedLogs}
          variant="light"
        />
      </div>
    );
  }
}
