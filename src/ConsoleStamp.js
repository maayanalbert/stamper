import React, { Component } from "react";
import Cristal from "./react-cristal/dist/es2015/index.js";
import Copy from "./copy.png";
import $ from "jquery";
import "ace-builds/webpack-resolver";
import AceEditor from "react-ace";
import pf, { globals, p5Lib } from "./globals.js";
import { Hook, Console, Decode } from 'console-feed'

const electron = window.require('electron');
const ipc = electron.ipcRenderer;



export default class ConsoleStamp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: [],
      consoleHeight: this.props.starterConsoleHeight,
      consoleWidth: this.props.starterConsoleWidth
    };

    this.cristalRef = React.createRef();

  }
  setEditorScrolling(isScrolling) {
 
    this.props.disablePan(isScrolling);
  }

  componentDidMount() {
    Hook(window.console, log => {
      this.setState(({ logs }) => ({ logs: [...logs, Decode(log)] }))
      var consoleContainer = document.getElementById("consoleContainer")
      consoleContainer.scrollTop = consoleContainer.scrollHeight;
    })
 
 
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

    return (
      <Cristal ref={this.cristalRef} 



          closeHidden={true}
          copyHidden={true}
            onResize={this.resizeConsole.bind(this)}

      >
 
      <div id="consoleContainer"
      onMouseOver={() => this.setEditorScrolling(true)}
onMouseOut={() => this.setEditorScrolling(false)}
      style={{width:this.state.consoleWidth, height:this.state.consoleHeight,
      "overflow":"hidden", 
      "overflow-y":"scroll", "white-space": "nowrap", backgroundColor: '#242424' }}>
<Console logs={this.state.logs}  variant="dark"/>
      </div>
  

      </Cristal>
    
    )
  }
}
