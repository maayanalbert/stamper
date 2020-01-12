import "./App.scss";
import $ from "jquery"
import React, { Component, useState } from "react";
import { saveAs } from "file-saver";
import parser from "./parser.js";
import LZUTF8 from "lzutf8";
import JSZip from "jszip";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";


import pf1, {
  normalFn,
  commentBlob,
  varBlob,
  listenerFns,
  builtInFns,
  worlds, stamperHeader
} from "./starterStamps.js";

const { detect } = require("detect-browser");
var deepEqual = require('deep-equal')
const browser = detect();

var userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(" electron/") > -1) {
  const electron = window.require("electron");
  var ipc = electron.ipcRenderer;
} else {
  var ipc = false;
}



export default class ModalManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalButtons:[],
      modalVisible: !ipc && browser && browser.name != "chrome",
      modalHeader: "Use Chrome please!",
      modalContent:
        "Right now, the web version of Stamper is only supported in Google Chrome.",
    };
    this.inputElem = null
    this.uploadProject = this.uploadProject.bind(this)
    this.hideModal = this.hideModal.bind(this)
  }

  componentDidMount() {
    ipc &&
      ipc.on("openFiles", (event, files) => {

        this.openFiles(
          files.html,
          files.js,
          files.css,
          files.stamper,
          files.path
        );
      });

    ipc &&
      ipc.on("requestSave", (event, rawCode) => {
        this.sendSaveData();
      });

      var inputElem = document.createElement('input', {id:"projectInput", type:"file", 
        webkitdirectory:"true", multiple:"true"} )

      var idAttr = document.createAttribute("id");
      idAttr.value = "projectInput"; 
      inputElem.setAttributeNode(idAttr)

      var typeAttr = document.createAttribute("type");
      typeAttr.value = "file"; 
      inputElem.setAttributeNode(typeAttr)

      var multipleAttr = document.createAttribute("multiple");
      multipleAttr.value = "true"; 
      inputElem.setAttributeNode(multipleAttr)

      var directoryAttr = document.createAttribute("webkitdirectory");
      directoryAttr.value = "true"; 
      inputElem.setAttributeNode(directoryAttr)

      var styleAttr = document.createAttribute("hidden");
      styleAttr.value = "true"; 
      inputElem.setAttributeNode(styleAttr)

      inputElem.addEventListener("change", this.uploadProject)
      document.getElementById("root").appendChild(inputElem)
            this.inputElem = inputElem

  }

  componentWillUnmout(){
    this.inputElem.removeEventListener("change", this.uploadProject)
  }

  requestUpload() {
    document.getElementById("projectInput").click()
  }

  attemptToReadFile(files, name, key, readDict, callback){

    for(var i = 0; i < files.length; i++){
      if(files[i].name === name){
        var reader = new FileReader()
        reader.onload = function(e){
          readDict[key] = e.target.result
          callback()
        }
        try{
        reader.readAsText(files[i])
        return 
        }catch{
          this.setState({modalVisible:true, modalHeader:"Oh no! It looks like we had trouble reading one of your files.",
            modalContent:"Check that your index.html, sketch.js, and style.css are properly configured.",
                          modalButtons:[{text:"ok", color:"outline-secondary", callback:this.hideModal}]})
        }  
      }
    }
        
        callback()

  }

  uploadProject(e){

    var files = e.target.files
    var readDict = {}
    this.attemptToReadFile(files, "sketch.js", "js", readDict, () => {
      this.attemptToReadFile(files, "index.html", "html", readDict, ()=>{
        this.attemptToReadFile(files, "style.css", "css", readDict, () =>{
          this.attemptToReadFile(files, "stamper.js", "stamper", readDict, () =>{
            this.openFiles(readDict.html, readDict.js, readDict.css, readDict.stamper)
          })
        })
      })
    })
  }

curIsAWorld(){
  var curStamper = this.props.getAllData()

  for(var i = 0; i < worlds.length; i++){
    var worldStamper = worlds[i].data
      console.log(curStamper)
      console.log(worldStamper)
    curStamper.scale = worldStamper.scale
    curStamper.originX = worldStamper.originX 
    curStamper.originY = worldStamper.originY
    curStamper.compressedJs = worldStamper.compressedJs
    if(deepEqual(curStamper, worldStamper)){
      return true
    }
  } 

  return false 
}

requestWorldLoad(newWorldStamper){

  var buttons = []
  buttons.push({text:"cancel", color:"outline-secondary", callback:this.hideModal})
  buttons.push(        {text:"yes", color:"outline-primary", callback:() => {
         this.props.loadStamperFile(newWorldStamper); this.hideModal()  
       }})
  if(!ipc){
    buttons.push({text:"download first", color:"outline-primary", callback:() => {
         this.requestDownload(); this.props.loadStamperFile(newWorldStamper); this.hideModal()  
       }})
  }


  if(this.curIsAWorld()){
    this.props.loadStamperFile(newWorldStamper)
  }else{
    this.setState({
      modalVisible:true, 
      modalHeader:"This will overwrite your current work",
      modalContent:"Would you like to load the example anyways?",
      modalButtons:buttons
      })
  }

}


  sendSaveData() {
    var fileData = this.props.getFileData();
    if (fileData) {
      ipc && ipc.send("save", fileData);
    }
  }

  requestDownload(){
    var data = this.props.getFileData();


var zip = new JSZip();
zip.file("sketch.js", data.js);
zip.file("index.html", data.html);
zip.file("style.css", data.css);
zip.file("stamper.js", data.stamper);
zip.generateAsync({type:"blob"})
.then(function(content) {
    // see FileSaver.js
    saveAs(content, "stamper_project.zip");
});

this.setState({lastDownloaded:data.stamper})
  }

  updateStamperJs(js, stamper) {
  
    if (stamper === undefined) {
      var oldJs = "";

    } else {
            console.log(stamper.compressedJs)

      var oldJs = LZUTF8.decompress(stamper.compressedJs, {
        inputEncoding: "StorageBinaryString"
      });
    }


    if (oldJs === js) {
      return stamper;
    }

    try {
      var newStamper = parser.jsToStamps(js);
    } catch (e) {
      throw "Syntax error in Javascript";
    }

    newStamper.fns.push({
      name: "style.css",
      args: " ",
      code: "",
      isCss: true
    });
    newStamper.fns.push({
      name: "index.html",
      args: " ",
      code: "",
      isHtml: true
    });
    newStamper.console = {};
    newStamper.scale = 1;
    newStamper.originX = 0
    newStamper.originY = 0

    return newStamper;
  }

  openFiles(html, js, css = "", stamper, path) {

    if(stamper){
    stamper = JSON.parse(stamper.substring(stamperHeader.length, stamper.length))
    }

   
    if (html === undefined || js === undefined) {

      this.setState({
        modalVisible: true,
        modalHeader: "Oh no! It looks like you're missing some files.",
        modalContent:
          "Stamper projects must have an 'index.html' file and a 'sketch.js' file.",
                modalButtons:[{text:"ok", color:"outline-secondary", callback:this.hideModal}],
      });
      return;
    }

    try {
      var newStamper = this.updateStamperJs(js, stamper);
    } catch (e) {
      this.setState({
        modalVisible: true,
        modalHeader:
          "Oh no! It looks like your sketch file has a few syntax errors.",
        modalContent:
          "We can't parse javascript with syntax errors into Stamper land :(",
                modalButtons:[{text:"ok", color:"outline-secondary", callback:this.hideModal}],
      });
      return;
    }

    newStamper.fns.map(stamp => {
      if (stamp.isHtml) {
        stamp.code = html;
      }
    });
    newStamper.fns.map(stamp => {
      if (stamp.isCss) {
        stamp.code = css;
      }
    });

    this.props.loadStamperFile(newStamper);
    ipc && ipc.send("updatePath", { path: path });
  }

  hideModal(){
    this.setState({modalVisible:false})
  }

  render() {



    var buttonElems = this.state.modalButtons.map((btnData) => (
      <Button variant={btnData.color} size="sm" onClick={btnData.callback}>{btnData.text}</Button>))
    return (
      <div>

        <Modal
          show={this.state.modalVisible}
          style={{ zIndex: 2000000000000000001 }}
          centered
          onHide={this.hideModal}
        >
          <Modal.Header closeButton>
            <Modal.Title className="name">{this.state.modalHeader}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="picker">{this.state.modalContent} </Modal.Body>
  <Modal.Footer hidden={buttonElems.length === 0}>
    {buttonElems}
  </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
