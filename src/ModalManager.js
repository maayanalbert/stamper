import "./App.scss";
import $ from "jquery";
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
  worlds,
  starter,
  stamperHeader
} from "./starterStamps.js";

const { detect } = require("detect-browser");
var deepEqual = require("deep-equal");
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
      modalButtons: [],
      modalVisible: !ipc && browser && browser.name != "chrome",
      modalHeader: "Use Chrome please!",
      modalContent:
        "Right now, the web version of Stamper is only supported in Google Chrome.",
      saveInterval: null,
      cdnLibs: false,
      askedAboutCdn: false,
      inputElem: null,
      imageInputElem: null,

    };

    this.checkFiles = this.checkFiles.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.sendSaveData = this.sendSaveData.bind(this);
    this.libs = {
      "p5.js": "https://cdn.jsdelivr.net/npm/p5",
      "p5.min.js": "https://cdn.jsdelivr.net/npm/p5",
      "p5.dom.js":
        "https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.dom.js",
      "p5.dom.min.js":
        "https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.dom.min.js",
      "p5.sound.js":
        "p5.sound.jshttps://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.sound.js",
      "p5.sound.min.js":
        "https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.sound.min.js",
      "p5.accessibility.js":
        "https://cdn.jsdelivr.net/gh/processing/p5.accessibility@0.2.0/dist/p5.accessibility.js",
      "p5.accessibility.min.js":
        "https://cdn.jsdelivr.net/gh/processing/p5.accessibility@0.2.0/dist/p5.accessibility.js"
    };
  }

  componentDidMount() {

    let saveInterval = setInterval(this.sendSaveData.bind(this), 180000);
    this.setState({ saveInterval: saveInterval });
    ipc &&
      ipc.on("requestUpload", event => {
        this.requestUpload();
      });

    ipc &&
      ipc.on("exteriorChanges", event => {
   
        var buttons = [];

        buttons.push({
          text: "re-open project",
          color: "outline-primary",
          callback: () => {
            this.requestUpload();
          }
        });

        this.setState({
          modalVisible: true,
          modalHeader: "The directory that your project was saved in has changed.",
          modalContent:
            "Please re-specify where you want your project to be saved.",
          modalButtons: buttons
        });
      });

    ipc &&
      ipc.on("requestSave", (event, rawCode) => {
        this.sendSaveData();
      });

    ipc && ipc.on("resetView", (event, data) => {
      for(var i = 0; i< worlds.length; i++){
        if(data.exampleName === worlds[i].name){
          this.props.loadStamperObject(worlds[i].data)
          return
        }
      }
      this.props.loadStamperObject(starter)
    })


    this.createInputElement();
    this.createImageInputElem();

    window.addEventListener("beforeunload", this.sendSaveData);
  }

  deleteInputElement() {
    this.state.inputElem.removeEventListener("change", this.checkFiles);
    document.getElementById("root").removeChild(this.state.inputElem);
  }



  createInputElement() {
    var inputElem = document.createElement("input", {
      id: "projectInput",
      type: "file",
      webkitdirectory: "true",
      multiple: "true"
    });
    var idAttr = document.createAttribute("id");
    idAttr.value = "projectInput";
    inputElem.setAttributeNode(idAttr);

    var typeAttr = document.createAttribute("type");
    typeAttr.value = "file";
    inputElem.setAttributeNode(typeAttr);

    var multipleAttr = document.createAttribute("multiple");
    multipleAttr.value = "true";
    inputElem.setAttributeNode(multipleAttr);

    var directoryAttr = document.createAttribute("webkitdirectory");
    directoryAttr.value = "true";
    inputElem.setAttributeNode(directoryAttr);

    var styleAttr = document.createAttribute("hidden");
    styleAttr.value = "true";
    inputElem.setAttributeNode(styleAttr);

    inputElem.addEventListener("change", this.checkFiles);

    document.getElementById("root").appendChild(inputElem);


    this.setState({ inputElem: inputElem });
  }

  createImageInputElem() {
    var imageInputElem = (
      <input
        type="file"
        hidden={true}
        id="imageInput"
        accept="image/*"
        onChange={e => this.uploadImage(e)}
      />
    );

    this.setState({ imageInputElem: null }, () =>
      this.setState({ imageInputElem: imageInputElem })
    );
  }



  componentWillUnmout() {
    window.removeEventListener("beforeunload", this.sendSaveData);
    this.state.inputElem.removeEventListener("change", this.checkFiles);
    clearInterval(this.state.saveInterval);
    this.setState({ saveInterval: null });
  }

  requestImageUpload() {
    document.getElementById("imageInput").click();
  }

  requestUpload() {
    document
      .getElementById("projectInput")
      .dispatchEvent(new MouseEvent("click"));
    document.body.onfocus = () => {
      document.body.onfocus = null
      this.hideModal()

    }

  }

  readFile(file, fileDict, callback) {
    var reader = new FileReader();
    var nameArr = file.webkitRelativePath.split("/");
    var fileName = "";
    if (nameArr.length > 0) {
      fileName = nameArr.slice(1, nameArr.length).join("/");
    }

    if (this.state.cdnLibs && file.name in this.libs) {
      fileDict[fileName] = {};
      return;
    }

    if (file.type.startsWith("text")) {
      var fileType = "text";
    } else if (file.type.startsWith("image")) {
      var fileType = "image";
    }

    reader.onload = function(e) {
      fileDict[fileName] = {
        content: e.target.result,
        type: fileType,
        path: file.path
      };
      callback();
    };

    try {
      if (file.type.startsWith("text")) {
        reader.readAsText(file);
      } else if (file.type.startsWith("image")) {
        reader.readAsDataURL(file);
      }
    } catch {
      fileDict[fileName] = {};
      this.setState({
        modalVisible: true,
        modalHeader:
          "Oh no! It looks like we had trouble reading one of your files.",
        modalContent:
          "Check that your index.html, sketch.js, and style.css are properly configured.",
        modalButtons: [
          { text: "ok", color: "outline-secondary", callback: this.hideModal }
        ]
      });
    }
  }

  uploadImage(e) {
    if (e.target.files.length === 0) {
      this.createImageInputElem();
      return;
    }
    var file = e.target.files[0];
    var reader = new FileReader();

    var callback = imgData =>
      this.props.addFnStamp(imgData, id => this.props.requestCompile(id));

    reader.onload = function(e) {
      var imgData = { code: e.target.result, name: file.name, isImg: true };
      callback(imgData);
    };

    reader.readAsDataURL(file);
    this.createImageInputElem();
  }

  readFiles(files) {
    var fileDict = {};
    var callback = () => {
      if (Object.keys(fileDict).length === files.length) {
        this.stampifyFiles(fileDict);
      }
    };
    for (var i = 0; i < files.length; i++) {
      this.readFile(files[i], fileDict, () => callback());
    }

    if (files.length === 0) {
      callback();
    }
  }

  checkFiles(e) {
    console.log(e)
    var askedAboutCdn = false;
    this.setState({ askedAboutCdn: askedAboutCdn });

    var files = [];
    var containsLib = false;
    for (var i = 0; i < e.target.files.length; i++) {
      if (e.target.files[i].name in this.libs) {
        containsLib = true;
      }
      if (e.target.files[i].name.startsWith(".") === false) {
        files.push(e.target.files[i]);
      }
    }

    this.deleteInputElement();
    this.createInputElement();

    if (containsLib && askedAboutCdn === false) {
      var buttons = [];
      buttons.push({
        text: "no",
        color: "outline-secondary",
        callback: () => {
          this.setState({ cdnLibs: false }, () => this.readFiles(files));
          this.hideModal();
        }
      });
      buttons.push({
        text: "yes",
        color: "outline-primary",
        callback: () => {
          this.setState({ cdnLibs: true }, () => this.readFiles(files));
          this.hideModal();
        }
      });

      this.setState({
        modalVisible: true,
        modalHeader: "Would you like to import p5's core libraries via CDN?",
        modalContent:
          "The libraries are currently stored in large files in your project. This may cause Stamper to run slowly. Importing them via CDN won't cause them to behave differently but will speed up Stamper.",
        modalButtons: buttons
      });
    } else {
      this.readFiles(files);
    }
  }

  curIsAWorld() {
    var curStamper = this.props.getStamperObject();

    for (var i = 0; i < worlds.length; i++) {
      var worldStamper = worlds[i].data;

      curStamper.scale = worldStamper.scale;
      curStamper.originX = worldStamper.originX;
      curStamper.originY = worldStamper.originY;
      curStamper.compressedJs = worldStamper.compressedJs;
      if (deepEqual(curStamper, worldStamper)) {
        return true;
      }
    }

    return false;
  }

  requestWorldLoad(newWorldStamper) {
    var buttons = [];
    buttons.push({
      text: "cancel",
      color: "outline-secondary",
      callback: this.hideModal
    });
    buttons.push({
      text: "yes",
      color: "outline-primary",
      callback: () => {
        this.props.loadStamperObject(newWorldStamper);
        this.hideModal();
      }
    });
    if (!ipc) {
      buttons.push({
        text: "yes, but download my current project first",
        color: "outline-primary",
        callback: () => {
          this.requestDownload();
          this.props.loadStamperObject(newWorldStamper);
          this.hideModal();
        }
      });
    }

    if (this.curIsAWorld()) {
      this.props.loadStamperObject(newWorldStamper);
    } else {
      this.setState({
        modalVisible: true,
        modalHeader: "This will overwrite your current work",
        modalContent: "Would you like to load the example anyways?",
        modalButtons: buttons
      });
    }
  }

  sendSaveData() {
    console.log("SAVING");

    var stamperObject = this.props.getStamperObject();
    var compressedStamperObj = LZUTF8.compress(JSON.stringify(stamperObject), {
      outputEncoding: "StorageBinaryString"
    });

    !ipc && localStorage.setItem("storedStamper", compressedStamperObj);

    ipc && ipc.send("save", this.props.getFileDict());
  }

  requestDownload() {
    var fileDict = this.props.getFileDict();

    var zip = new JSZip();
    Object.keys(fileDict).map(name => {
      if (fileDict[name].type === "image") {
        var uri = fileDict[name].content;

        var idx = uri.indexOf("base64,") + "base64,".length;
        var content = uri.substring(idx);

        zip.file(name, content, { base64: true });
      } else {
        zip.file(name, fileDict[name].content);
      }
    });

    zip.generateAsync({ type: "blob" }).then(function(content) {
      saveAs(content, "stamper_project.zip");
    });
  }

  updateStamperObject(js, stamperObject) {
    if (stamperObject === undefined) {
      var oldJs = undefined;
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

    newStamperObject.console = { hidden: true };
    newStamperObject.scale = 1;
    newStamperObject.originX = 0;
    newStamperObject.originY = 0;
    newStamperObject.imgs = [];

    return newStamperObject;
  }

  replaceFilesWithCDN(indexContent) {
    Object.keys(this.libs).map(libName => {
      indexContent = indexContent
        .replace(`"${libName}"`, `"${this.libs[libName]}"`)
        .replace(`'${libName}'`, `'${this.libs[libName]}'`)
        .replace("`" + libName + "`", "`" + this.libs[libName] + "`");
    });

    return indexContent;
  }

  stampifyFiles(fileDict, path) {
    if (
      "index.html" in fileDict === false ||
      "sketch.js" in fileDict === false
    ) {
      this.setState({
        modalVisible: true,
        modalHeader: "Oh no! It looks like you're missing some files.",
        modalContent:
          "Stamper projects must have an 'index.html' file and a 'sketch.js' file.",
        modalButtons: [
          { text: "ok", color: "outline-secondary", callback: this.hideModal }
        ]
      });
      return;
    }

    if (this.state.cdnLibs) {
      fileDict["index.html"].content = this.replaceFilesWithCDN(
        fileDict["index.html"].content
      );
    }

    var stamperObject = undefined;
    if ("stamper.js" in fileDict) {
      var stamperFileContent = fileDict["stamper.js"].content;
      stamperObject = JSON.parse(
        stamperFileContent.substring(
          stamperFileContent.indexOf("{"),
          stamperFileContent.length
        )
      );
    }

    try {
      stamperObject = this.updateStamperObject(
        fileDict["sketch.js"].content,
        stamperObject
      );
    } catch (e) {
      this.setState({
        modalVisible: true,
        modalHeader:
          "Oh no! It looks like your sketch file has a few syntax errors.",
        modalContent:
          "We can't parse javascript with syntax errors into Stamper land :(",
        modalButtons: [
          { text: "ok", color: "outline-secondary", callback: this.hideModal }
        ]
      });
      return;
    }

    var fnData = [];

    stamperObject.stamps.map(singleFnData => {
      if (!singleFnData.isFile && !singleFnData.isImg && !singleFnData.isHtml) {
        fnData.push(singleFnData);
      } else if (singleFnData.name in fileDict) {
        singleFnData.code = fileDict[singleFnData.name].content;
        fileDict[singleFnData.name].transferred = true;
        fnData.push(singleFnData);
      }
    });

    Object.keys(fileDict).map(name => {
      if (
        name === "sketch.js" ||
        name === "stamper.js" ||
        fileDict[name].transferred ||
        Object.keys(fileDict[name]) === 0
      ) {
        // pass
      } else if (name === "index.html") {
        fnData.push({
          name: name,
          args: " ",
          code: fileDict[name].content,
          isHtml: true,
          hidden: true
        });
      } else if (fileDict[name].type === "text") {
        fnData.push({
          name: name,
          args: " ",
          code: fileDict[name].content,
          isFile: true,
          hidden: true
        });
      } else if (fileDict[name].type === "image") {
        fnData.push({
          name: name,
          args: " ",
          code: fileDict[name].content,
          isImg: true,
          hidden: true
        });
      }
    });

    stamperObject.stamps = fnData;

    var projectPath = "";
    var projectName = "";
    if (ipc) {
      var projectPathArr = fileDict["index.html"].path.split("/");
      projectPathArr.pop();

      projectPath = projectPathArr.join("/") + "/";
      projectName = projectPathArr.pop();
    }

    this.props.loadStamperObject(stamperObject);
    ipc &&
      ipc.send("updatePath", {
        path: projectPath,
        name: projectName,
        fileDict: fileDict
      });
  }

  hideModal() {
    this.setState({ modalVisible: false });
  }

  render() {
    var buttonElems = this.state.modalButtons.map(btnData => (
      <Button variant={btnData.color} size="sm" onClick={btnData.callback}>
        {btnData.text}
      </Button>
    ));
    return (
      <div>
        {this.state.imageInputElem}
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
