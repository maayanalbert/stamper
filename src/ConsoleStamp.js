import React, { Component } from "react";
import Cristal from "./react-cristal/dist/es2015/index.js";
import Copy from "./copy.png";
import $ from "jquery";
import "ace-builds/webpack-resolver";
import AceEditor from "react-ace";
import pf, { globals, p5Lib } from "./globals.js";
import { Hook, Console, Decode } from 'console-feed'
var _ = require("lodash");


const electron = window.require('electron');
const ipc = electron.ipcRenderer;



export default class ConsoleStamp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: [],
      consoleHeight: this.props.starterConsoleHeight,
      consoleWidth: this.props.starterConsoleWidth,
      lastFreq:0
    };

    this.cristalRef = React.createRef();

  }

  clearConsole(){
    this.setState({logs:[], lastFreq:0})
  }

  setEditorScrolling(isScrolling) {
 
    this.props.disablePan(isScrolling);
  }

  addConsole(newConsole){

    Hook(newConsole, newLogs => {
 

      newLogs.map(log => {

      var logs = this.state.logs
      if(log.method === "log"){


        if(logs.length < 1){
          this.setState({logs:[log], lastFreq:0})
      var consoleContainer = document.getElementById("consoleContainer")
      consoleContainer.scrollTop = consoleContainer.scrollHeight;
        }else{
        var lastLog = logs[logs.length-1]

        if(_.isEqual(lastLog.data, log.data)){
          this.setState({lastFreq:this.state.lastFreq + 1})
        }else{
          logs.push(log)
          this.setState({logs:logs, lastFreq:1})
        var consoleContainer = document.getElementById("consoleContainer")
      consoleContainer.scrollTop = consoleContainer.scrollHeight;
        }

        }

      }



      })

    })
  }

  componentDidMount() {
window.addEventListener('message', (event) => {
    console.log(event);
});

// window.addEventListener('error', function(e) { 
//   console.log(e);
// }, false);
// window.onerror = function (errorMsg, url, lineNumber) { 
//   console.log(errorMsg)
// };

    // Hook(window.console, log => {
      
    //   this.setState(({ logs }) => ({ logs: [...logs, Decode(log)] }))
    //   var consoleContainer = document.getElementById("consoleContainer")
    //   consoleContainer.scrollTop = consoleContainer.scrollHeight;
    // })
 
 
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
    var renderedLogs = _.cloneDeep(this.state.logs)
    if(this.state.lastFreq > 1){
      renderedLogs.push({method:"log", data:["(" + this.state.lastFreq.toString() + ")"]})
    }

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
<Console logs={renderedLogs}  variant="dark"/>
      </div>
  

      </Cristal>
    
    )
  }
}
