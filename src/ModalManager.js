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
      saveInterval:null
    };
    this.inputElem = null
    this.readFiles = this.readFiles.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.sendSaveData = this.sendSaveData.bind(this)
  }



  componentDidMount() {
    let saveInterval = setInterval(this.sendSaveData.bind(this), 180000);
    this.setState({saveInterval:saveInterval})
    ipc &&
      ipc.on("requestUpload", (event) => {

        this.requestUpload()
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

      inputElem.addEventListener("change", this.readFiles)
      document.getElementById("root").appendChild(inputElem)
            this.inputElem = inputElem

      window.addEventListener("beforeunload", this.sendSaveData)

  }

  componentWillUnmout(){
    this.inputElem.removeEventListener("change", this.readFiles)
    clearInterval(this.state.saveInterval)
    this.setState({saveInterval:null})
  }

  requestUpload() {
    document.getElementById("projectInput").click()
  }



  readFile(file, readDict, callback){
    var reader = new FileReader()
    var nameArr = file.webkitRelativePath.split("/")
    var fileName = ""
    if(nameArr.length > 0){
      fileName = nameArr.slice(1, nameArr.length).join("/")
    }

    if(file.type.startsWith("text")){
      var fileType = "text"
    }else if(file.type.startsWith("image")){
      var fileType = "image"
    }

    reader.onload = function(e){
      readDict[fileName] = {content:e.target.result, type:fileType, path:file.path}
        callback()
  
    }




    try{
    if(file.type.startsWith("text")){
      reader.readAsText(file)
    }else if(file.type.startsWith("image")){
      reader.readAsDataURL(file)
    }
    }catch{
      readDict[fileName] = {}
          this.setState({modalVisible:true, modalHeader:"Oh no! It looks like we had trouble reading one of your files.",
            modalContent:"Check that your index.html, sketch.js, and style.css are properly configured.",
                          modalButtons:[{text:"ok", color:"outline-secondary", callback:this.hideModal}]})      
    }

  }

  readFiles(e){
    console.log(e.target.files)

    var files = []
    for(var i = 0; i< e.target.files.length; i++){
      if(e.target.files[i].name.startsWith(".") === false){
        files.push(e.target.files[i])
      }
    }

    var readDict = {}
    var callback = () => {
      if(Object.keys(readDict).length === files.length){
        this.stampifyFiles(readDict)
      }
    }
    for(var i = 0; i < files.length; i++){

      this.readFile(files[i], readDict, () => callback() )
    }

  }

curIsAWorld(){
  var curStamper = this.props.getStamperObject()

  for(var i = 0; i < worlds.length; i++){
    var worldStamper = worlds[i].data

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
         this.props.loadStamperObject(newWorldStamper); this.hideModal()  
       }})
  if(!ipc){
    buttons.push({text:"yes, but download my current project first", color:"outline-primary", callback:() => {
         this.requestDownload(); this.props.loadStamperObject(newWorldStamper); this.hideModal()  
       }})
  }


  if(this.curIsAWorld()){
    this.props.loadStamperObject(newWorldStamper)
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
    console.log("SAVING")
    var fileData = this.props.getFileData();
    var stamperObject = this.props.getStamperObject()

    // !ipc && localStorage.setItem('storedStamper', JSON.stringify(stamperObject));
    if (fileData) {
      ipc && ipc.send("save", fileData);
    }
  }

  requestDownload(){
//     var data = this.props.getFileData();


// var zip = new JSZip();
// zip.file("sketch.js", data.js);
// zip.file("index.html", data.html);
// zip.file("style.css", data.css);
// zip.file("stamper.js", data.stamper);
// zip.generateAsync({type:"blob"})
// .then(function(content) {
//     // see FileSaver.js
//     saveAs(content, "stamper_project.zip");
// });

// this.setState({lastDownloaded:data.stamper})
  }

  updateStamperObject(js, stamperObject) {
  
    if (stamperObject === undefined) {
      var oldJs = "";

    } else {
      var oldJs = LZUTF8.decompress(stamperObject.compressedJs, {
        inputEncoding: "StorageBinaryString"
      });
    }


    if (oldJs === js) {
      return stamperObject;
    }

    try {
      var newStamperObject = parser.jsToStamps(js);
    } catch (e) {
      throw "Syntax error in Javascript";
    }

    newStamperObject.console = {hidden:true};
    newStamperObject.scale = 1;
    newStamperObject.originX = 0
    newStamperObject.originY = 0
    newStamperObject.imgs = []

    return newStamperObject;
  }

   stampifyFiles(readDict, path){

    if("index.html" in readDict === false || "sketch.js" in readDict === false){
       this.setState({
        modalVisible: true,
        modalHeader: "Oh no! It looks like you're missing some files.",
        modalContent:
          "Stamper projects must have an 'index.html' file and a 'sketch.js' file.",
                modalButtons:[{text:"ok", color:"outline-secondary", callback:this.hideModal}],
      });
      return;     
    }

    var stamperObject = undefined
    if("stamper.js" in readDict){
      var stamperFileContent = readDict["stamper.js"].content
      stamperObject = JSON.parse(stamperFileContent.substring(stamperHeader.length, stamperFileContent.length))
    }

    try{
      stamperObject = this.updateStamperObject(readDict["sketch.js"].content, stamperObject)
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

    var fnData = []



    stamperObject.fns.map(singleFnData => {
      if(!singleFnData.isFile && !singleFnData.isImg){
        fnData.push(singleFnData)
      }else if(singleFnData.name in readDict){
        singleFnData.code = readDict[singleFnData.name].content
        readDict[singleFnData.name].transferred = true
        fnData.push(singleFnData)
      }
    })

    Object.keys(readDict).map(name => {
      if(name === "sketch.js" || name === "stamper.js" || readDict[name].transferred){
        return
      }else if(name === "index.html"){
        fnData.push({
          name: name,
          args: " ",
          code: readDict[name].content,
          isHtml: true,
          hidden:true
        });
      }else if(readDict[name].type === "text"){
        fnData.push({
          name: name,
          args: " ",
          code: readDict[name].content,
          isFile: true,
          hidden:true
        });
      }else if(readDict[name].type === "image"){
        fnData.push({
          name: name,
          args: " ",
          code: readDict[name].content,
          isImg: true,
          hidden:true
        });        
      }
    })


    stamperObject.fns = fnData

    var projectPathArr = readDict["index.html"].path.split("/")
    projectPathArr.pop()

    console.log(projectPathArr)
    var projectPath = projectPathArr.join("/") + "/"
    var projectName = projectPathArr.pop()

    this.props.loadStamperObject(stamperObject);
    ipc && ipc.send("updatePath", { path: projectPath, name:projectName});

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
