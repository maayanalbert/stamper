import React, { Component } from "react";
import Cristal from "./react-cristal/dist/es2015/index.js";
import Copy from "./copy.png";
import $ from "jquery";
import "ace-builds/webpack-resolver";
import AceEditor from "react-ace";
import pf, { globals, p5Lib } from "./globals.js";
import { Hook, Console, Decode } from "console-feed";
import PrintIcon from "@material-ui/icons/Print";

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
      originX: this.props.initialOriginX,
      originY: this.props.initialOriginY,
      scale: this.props.initialScale,
      hidden: this.props.initialHidden,
      x: this.props.initialPosition.x,
      y: this.props.initialPosition.y
    };

    this.cristalRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener("message", e => {
      this.logToConsole(e.data.message);

      var lineNum = e.data.lineno;
      var message = e.data.message;
      var id = e.data.id;

      this.props.addErrorLine(lineNum, id);
    });
  }

  clearConsole() {
    this.setState({ logs: [], lastFreq: 0 });
  }

  getIcon() {
    return PrintIcon;
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
    var consoleContainer = document.getElementById("consoleContainer");
    if (consoleContainer === null) {
      return;
    }

    var logs = this.state.logs;
    if (logs.length < 1) {
      this.setState({ logs: [log], lastFreq: 0 });
      consoleContainer = document.getElementById("consoleContainer");
      consoleContainer.scrollTop = consoleContainer.scrollHeight;
    } else {
      var lastLog = logs[logs.length - 1];

      if (_.isEqual(lastLog.data, log.data)) {
        this.setState({ lastFreq: this.state.lastFreq + 1 });
      } else {
        if (this.state.lastFreq > 1) {
          logs.push({
            method: "command",
            data: ["(" + this.state.lastFreq.toString() + ")"]
          });
        }
        logs.push(log);
        this.setState({ logs: logs, lastFreq: 1 });
        consoleContainer = document.getElementById("consoleContainer");
        consoleContainer.scrollTop = consoleContainer.scrollHeight;
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
      originX: this.state.originX,
      originY: this.state.originY,
      scale: this.state.scale,
      hidden: this.state.hidden
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
        method: "command",
        data: ["(" + this.state.lastFreq.toString() + ")"]
      });
    }

    if (this.state.hidden) {
      return <div></div>;
    }

    return (
      <Cristal
        ref={this.cristalRef}
        initialScale={this.state.scale}
        closeHidden={true}
        copyHidden={true}
        onResize={this.resizeConsole.bind(this)}
        initialPosition={{ x: this.state.x, y: this.state.y }}
        onMove={s => this.setState({ x: s.x, y: s.y })}
        className="bg-lightGrey border border-borderGrey shadow-sm"
        icon={this.getIcon()}
        showClear
        onClear={this.clearConsole.bind(this)}
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
              BASE_FONT_FAMILY: "menlo",
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
