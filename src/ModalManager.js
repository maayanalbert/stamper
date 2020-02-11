import "./App.scss";
import $ from "jquery";
import React, { Component, useState } from "react";
import { saveAs } from "file-saver";
import parser from "./parser.js";
import LZUTF8 from "lzutf8";
import JSZip from "jszip";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import PublishModal from "./PublishModal.js";

import FunctionStampIcon from "./icons/box.svg";
import BuiltInStampIcon from "./icons/tool.svg";
import ListenerStampIcon from "./icons/bell.svg";
import BlobStampIcon from "./icons/code.svg";
import ExpandMoreIcon from "./icons/chevron-down.svg";
import DownloadIcon from "./icons/download.svg";
import UploadIcon from "./icons/upload.svg";
import WorldsIcon from "./icons/archive.svg";
import GlobalVarIcon from "./icons/globe.svg";
import CommentIcon from "./icons/message-square.svg";
import FileStampIcon from "./icons/file.svg";
import ImageStampIcon from "./icons/image.svg";
import InfoIcon from "./icons/info.svg";
import PermanentWorldIcon from "./icons/star.svg";

import pf1, {
  normalFn,
  commentBlob,
  varBlob,
  listenerFns,
  builtInFns,
  worlds,
  starter,
  empty,
  stamperHeader
} from "./starterStamps.js";
var GitHub = require("github-api");
const { detect } = require("detect-browser");
var deepEqual = require("deep-equal");
const browser = detect();
var mime = require("mime-types");

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
      miniInputElem: null,
      publishInfoVisible: false,
      onlineWorldDict: null,
      lastWorldCheck: -1,
      publishModal: null
      // can be unsubmitted, success, failure, loading
    };
    this.protectAgainstClosed = this.protectAgainstClosed.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
    this.domain = "https://p5stamper.com";
    this.oauthToken = "65c5d1e11f91a9e1e565f0c2ca8248e9fc1d587c";
    this.githubUsername = "p5stamper";
    this.receiveFiles = this.receiveFiles.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.hidePublishInfoModal = this.hidePublishInfoModal.bind(this);
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

  getUrlWorldKey() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get("e");
  }

  loadInitialStamperObject() {
    if (ipc) {
      this.props.loadStamperObject(starter);
      return;
    } else {
      var urlWorldKey = this.getUrlWorldKey();

      if (urlWorldKey) {
        try {
          this.getWorldObject(urlWorldKey, true, stamperObject => {
            if (stamperObject) {
              this.props.loadStamperObject(stamperObject);
            } else {
              this.loadStoredStamperObject();
            }
          });
          return;
        } catch (error) {
          this.loadStoredStamperObject();
          return;
        }
      }
    }

    this.loadStoredStamperObject();
  }

  loadStoredStamperObject() {
    var stored = localStorage.getItem("storedStamper");

    if (stored === null) {
      this.props.loadStamperObject(starter);
      return;
    }

    try {
      var stamperObject = JSON.parse(
        LZUTF8.decompress(stored, {
          inputEncoding: "StorageBinaryString"
        })
      );
      this.props.loadStamperObject(stamperObject);
      return;
    } catch (error) {
      this.props.loadStamperObject(starter);
      return;
    }
  }

  receiveMessage(e) {
    if (e.data.type != "edited") {
      return;
    }
    this.props.setWorldData({ worldEdited: true });

    ipc && ipc.send("edited");
  }

  requestOnlineWorldCheck() {
    var gh = new GitHub({ token: this.oauthToken });
    var repo = gh.getRepo("p5stamper", "worlds");
    var date = new Date();

    repo.listCommits({}, (error, result, request) => {
      if (error) {
        window.postMessage({ type: "worlds" }, "*");
        this.setState({ lastWorldCheck: date.getTime() });
        return;
      }

      this.getWorldPublishTime("", time => {
        if (time >= this.state.lastWorldCheck) {
          console.log("UPDATING WORLDS");
          window.postMessage({ type: "worlds" }, "*");
        }
        this.setState({ lastWorldCheck: date.getTime() });
      });
    });
  }

  componentDidMount() {
    this.requestOnlineWorldCheck();

    window.addEventListener("message", this.receiveMessage);

    this.loadInitialStamperObject();
    let saveInterval = setInterval(this.sendSaveData.bind(this), 180000);
    this.setState({ saveInterval: saveInterval });
    // ipc &&
    //   ipc.on("requestUpload", event => {
    //     this.requestUpload();
    //     var buttons = [];
    //     buttons.push({
    //       text: "open",
    //       color: "outline-primary",
    //       callback: () => {
    //         this.requestUpload();
    //       }
    //     });

    //     this.setState({
    //       modalVisible: true,
    //       modalHeader: "Please select a p5.js sketch folder.",
    //       modalContent:
    //         "It must have an index.html and sketch.js in the root. It doesn't need to have been created in Stamper.",
    //       modalButtons: buttons
    //     });
    //   });

    ipc &&
      ipc.on("openDirectory", (event, data) => {
        var fileObjs = [];
        data.rawFileList.map(fileInfo => {
          var mimeType = mime.lookup(fileInfo.name);
          var fileObj = new File([fileInfo.buffer], fileInfo.name, {
            type: mimeType
          });
          fileObjs.push(fileObj);
        });
        console.log(fileObjs);
        this.checkAndOpenFiles(fileObjs);
      });
    ipc &&
      ipc.on("exteriorChanges", event => {
        var buttons = [];

        buttons.push({
          text: "re-open sketch",
          color: "outline-primary",
          callback: () => {
            this.requestUpload();
          }
        });

        this.setState({
          modalVisible: true,
          modalHeader:
            "The directory that your sketch was saved in has changed.",
          modalContent:
            "Please re-specify where you want your sketch to be saved.",
          modalButtons: buttons
        });
      });

    ipc &&
      ipc.on("requestSave", (event, rawCode) => {
        this.sendSaveData();
      });

    ipc &&
      ipc.on("resetView", (event, data) => {
        if (data.worldKey) {
          this.getWorldObject(
            data.worldKey,
            true,
            stamperObject =>
              stamperObject && this.props.loadStamperObject(stamperObject)
          );
        } else {
          this.props.loadStamperObject(starter);
        }
      });

    ipc &&
      ipc.on("getWorlds", (event, data) => {
        this.getWorldNamesAndKeys(
          allWorlds => ipc && ipc.send("sendWorlds", allWorlds)
        );
      });

    this.createInputElement();

    // window.addEventListener("beforeunload", function (e){
    //   this.sendSaveData()
    //   localStorage.setItem("e", JSON.stringify(e))
    // });

    //     window.addEventListener('beforeunload', function (e) {
    //   // Cancel the event
    //   // this.sendSaveData()
    //   // if(this.props.getWorldData().worldEdited){
    //   e.preventDefault();
    //   // Chrome requires returnValue to be set
    //   e.returnValue = '';
    //   // }

    // });

    // window.onbeforeunload = null;

    window.addEventListener("beforeunload", this.sendSaveData);

    // window.onbeforeunload = confirmExit;
    // function confirmExit() {
    //     return "You have attempted to leave this page. Are you sure?";
    // }
  }

  protectAgainstClosed(e) {
    console.log("PROTECTING");
    //     console.log(e)
    // e.preventDefault()

    //     var zip = new JSZip();
    //  zip.file("file", JSON.stringify(e), { base64: true });

    //     zip.generateAsync({ type: "blob" }).then(function(content) {
    //       saveAs(content, "stamper_sketch.zip");
    //     });

    var message = "You have not filled out the form yet";
    e.returnValue = message;

    return "You have not filled out the form yet";
  }

  getWorldNamesAndKeys(callback = () => null) {
    var allWorlds = [];
    worlds.map(item => allWorlds.push({ key: item.name, name: item.name }));

    this.getOnlineWorlds(onlineWorlds => {
      if (onlineWorlds.length > 0) {
        allWorlds.push({});
      }

      allWorlds = allWorlds.concat(onlineWorlds);
      callback(allWorlds);
    });
  }

  deleteInputElement() {
    this.state.inputElem.removeEventListener("change", this.receiveFiles);
    document.getElementById("root").removeChild(this.state.inputElem);
  }

  createInputElement() {
    var inputElem = document.createElement("input", {
      id: "sketchInput",
      type: "file",
      webkitdirectory: "true",
      multiple: "true"
    });
    var idAttr = document.createAttribute("id");
    idAttr.value = "sketchInput";
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

    inputElem.addEventListener("change", this.receiveFiles);

    document.getElementById("root").appendChild(inputElem);

    this.setState({ inputElem: inputElem });
  }

  createMiniImputElem(fileType, callback) {
    if (fileType === "text") {
      var accept = "text/*";
    } else {
      var accept = "";
    }

    var miniInputElem = (
      <input
        type="file"
        hidden={true}
        id="miniInput"
        accept={accept}
        multiple
        onChange={e => this.uploadMini(e, fileType)}
      />
    );

    this.setState({ miniInputElem: null }, () =>
      this.setState({ miniInputElem: miniInputElem }, () => callback())
    );
  }

  componentWillUnmout() {
    window.removeEventListener("message", this.receiveMessage);
    window.removeEventListener("beforeunload", this.sendSaveData);
    this.state.inputElem.removeEventListener("change", this.receiveFiles);
    clearInterval(this.state.saveInterval);
    this.setState({ saveInterval: null });
  }

  requestFileUpload(type) {
    this.createMiniImputElem(type, () =>
      document.getElementById("miniInput").click()
    );
  }

  requestUpload() {
    document
      .getElementById("sketchInput")
      .dispatchEvent(new MouseEvent("click"));
    document.body.onfocus = () => {
      document.body.onfocus = null;
      this.hideModal();
    };
  }

  readFile(file, fileDict, callback) {
    var reader = new FileReader();
    if (file.webkitRelativePath != "") {
      var nameArr = file.webkitRelativePath.split("/");
      var fileName = "";
      if (nameArr.length > 0) {
        fileName = nameArr.slice(1, nameArr.length).join("/");
      }
    } else {
      fileName = file.name;
    }

    if (this.state.cdnLibs && file.name in this.libs) {
      fileDict[fileName] = {};
      return;
    }

    if (file.type.startsWith("text") || file.type.startsWith("application")) {
      var fileType = "text";
    } else {
      var fileType = "media";
    }

    reader.onload = function(e) {
      console.log(e.target.result);
      fileDict[fileName] = {
        content: e.target.result,
        type: fileType,
        path: file.path
      };
      callback();
    };

    try {
      if (fileType === "text") {
        reader.readAsText(file);
      } else {
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

  uploadMini(e, fileType) {
    var files = Object.assign([], e.target.files);

    files.map(file => {
      var reader = new FileReader();

      var callback = imgData =>
        this.props.addStamp(imgData, id => {
          this.props.requestCompile(id);
          window.postMessage({ type: "edited" }, "*");
        });

      reader.onload = e => {
        var data = {
          code: e.target.result,
          name: file.name,
          isMediaFile: fileType != "text",
          isTxtFile: fileType === "text"
        };
        callback(data);
      };

      reader.onload.bind(this);

      if (file.type.startsWith("text")) {
        if (!fileType) {
          this.setState({
            modalVisible: true,
            modalHeader: `${file.name} failed to upload.`,
            modalContent: "You can't upload text files as a media asset",
            modalButtons: [
              {
                text: "ok",
                color: "outline-secondary",
                callback: this.hideModal
              }
            ]
          });
        } else {
          reader.readAsText(file);
        }
      } else {
        reader.readAsDataURL(file);
      }
    });
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

  receiveFiles(e) {
    this.checkAndOpenFiles(e.target.files);
  }
  checkAndOpenFiles(initialFiles) {
    var askedAboutCdn = false;
    this.setState({ askedAboutCdn: askedAboutCdn });

    var files = [];
    var containsLib = false;
    for (var i = 0; i < initialFiles.length; i++) {
      var usingName = initialFiles[i].name.split("/").pop();
      if (usingName in this.libs) {
        containsLib = true;
      }
      if (usingName.startsWith(".") === false) {
        files.push(initialFiles[i]);
      }
    }

    console.log(files);
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
          "The libraries are currently stored in large files in your sketch. This may cause Stamper to run slowly. Importing them via CDN won't cause them to behave differently but will speed up Stamper.",
        modalButtons: buttons
      });
    } else {
      this.readFiles(files);
    }
  }

  loadWithOverwriteProtection(newWorldStamper) {
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
        this.props.setWorldData({ worldEdited: false });
      }
    });
    if (!ipc) {
      buttons.push({
        text: "yes, but download my current sketch first",
        color: "outline-primary",
        callback: () => {
          this.requestDownload();
          this.props.loadStamperObject(newWorldStamper);
          this.hideModal();
          this.props.setWorldData({ worldEdited: false });
        }
      });
    }

    if (!this.props.getWorldData().worldEdited) {
      this.props.loadStamperObject(newWorldStamper);
      this.props.setWorldData({ worldEdited: false });
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
    this.requestOnlineWorldCheck();
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
      if (fileDict[name].type === "media") {
        var uri = fileDict[name].content;

        var idx = uri.indexOf("base64,") + "base64,".length;
        var content = uri.substring(idx);

        zip.file(name, content, { base64: true });
      } else {
        zip.file(name, fileDict[name].content);
      }
    });

    zip.generateAsync({ type: "blob" }).then(function(content) {
      saveAs(content, "stamper_sketch.zip");
    });
  }

  updateStamperObject(js, stamperObject) {
    if (stamperObject === undefined) {
      var oldJs = undefined;
    } else {
      var oldJs = stamperObject.js;
    }

    if (oldJs === js) {
      return stamperObject;
    }

    try {
      var newStamperObject = parser.jsToStamps(js);
      newStamperObject.js = js;
    } catch (e) {
      throw "Syntax error in Javascript";
    }

    newStamperObject.console = { hidden: true };
    newStamperObject.scale = 0.7;
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
          "Stamper sketchs must have an 'index.html' file and a 'sketch.js' file.",
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
      if (this.state.cdnLibs && singleFnData.name in this.libs) {
        // pass
      } else if (
        !singleFnData.isTxtFile &&
        !singleFnData.isMediaFile &&
        !singleFnData.isIndex
      ) {
        fnData.push(singleFnData);
      } else if (singleFnData.name in fileDict) {
        singleFnData.code = fileDict[singleFnData.name].content;
        fileDict[singleFnData.name].transferred = true;
        fnData.push(singleFnData);
      }
    });

    Object.keys(fileDict).map(name => {
      if (this.state.cdnLibs && name in this.libs) {
        // pass
      } else if (
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
          isIndex: true,
          hidden: true
        });
      } else if (fileDict[name].type === "media") {
        fnData.push({
          name: name,
          args: " ",
          code: fileDict[name].content,
          isMediaFile: true,
          hidden: true
        });
      } else {
        fnData.push({
          name: name,
          args: " ",
          code: fileDict[name].content,
          isTxtFile: true,
          hidden: true
        });
      }
    });

    stamperObject.stamps = fnData;
    this.props.loadStamperObject(stamperObject);
    ipc &&
      ipc.send("updatePath", {
        fileDict: fileDict
      });
  }

  worldKeyToUrl(key) {
    return this.domain + "/?e=" + key;
  }

  worldKeyToFileName(key) {
    return key + ".json";
  }

  worldFileNameToKey(fileName) {
    if (!fileName) {
      return "";
    }
    if (fileName.endsWith(".json")) {
      return fileName.substring(0, fileName.length - ".json".length);
    } else {
      throw "improperly configured filename";
    }
  }

  worldKeyToNameAuthor(key) {
    if (!key) {
      return { name: "", author: "" };
    }
    var keyArr = key
      .split("_")
      .join(" ")
      .split("~");

    if (keyArr.length === 2) {
      return { name: keyArr[0], author: keyArr[1] };
    } else if (keyArr.length === 1) {
      return { name: keyArr[0] };
    } else {
      throw "improperly configured key";
    }
  }

  worldNameAuthorToKey(name, author) {
    var key = name + "~" + author;

    return key.split(" ").join("_");
  }

  hideModal() {
    this.setState({ modalVisible: false });
  }

  requestPublish() {
    var worldData = this.props.getWorldData();
    var localWorldAuthor = localStorage.getItem("localWorldAuthor");

    var publishModalName = "";
    if (worldData.worldKey) {
      publishModalName = this.worldKeyToNameAuthor(worldData.worldKey).name;
    }

    var publishModalAuthor = "";
    if (localWorldAuthor) {
      publishModalAuthor = localWorldAuthor;
    }

    var publishModal = (
      <PublishModal
        publishModalName={publishModalName}
        publishModalAuthor={publishModalAuthor}
        checkPublishWorldName={this.checkPublishWorldName.bind(this)}
        renderLinkForm={this.renderLinkForm.bind(this)}
        publishWorld={this.publishWorld.bind(this)}
        hidePublishModal={this.hidePublishModal.bind(this)}
      />
    );

    this.setState({ publishModal: publishModal });
  }

  requestPublishInfo() {
    this.setState({ publishInfoVisible: true });
  }

  checkPublishWorldName(name, author) {
    var key = this.worldNameAuthorToKey(name, author);

    return key in this.state.onlineWorldDict;
  }

  publishWorld(name, author, callback) {
    var gh = new GitHub({ token: this.oauthToken });

    var repo = gh.getRepo("p5stamper", "worlds");

    var publishDate = new Date();

    var key = this.worldNameAuthorToKey(name, author);
    var fileName = this.worldKeyToFileName(key);
    this.props.setWorldData(
      { worldKey: key, worldPublishTime: publishDate.toString() },
      () => {
        repo.writeFile(
          "master",
          fileName,
          JSON.stringify(this.props.getStamperObject()),
          "commited new world",
          {},
          (error, result, request) => {
            if (error) {
              console.log(error);

              callback(error);
              return;
            }
            localStorage.setItem("localWorldAuthor", author);
            window.history.pushState({}, null, this.worldKeyToUrl(key));

            // window.location.search = $.param({ e: key });
            callback();
          }
        );
      }
    );
  }

  getOnlineWorlds(callback) {
    var gh = new GitHub({ token: this.oauthToken });

    var repo = gh.getRepo("p5stamper", "worlds");
    repo.getContents("master", "", false, (error, result, request) => {
      var onlineWorldTimeArr = [];
      var onlineWorldTimeDict = {};

      var timeCallback = (time, fileName) => {
        var key = this.worldFileNameToKey(fileName);
        onlineWorldTimeArr.push(time);
        onlineWorldTimeDict[time] = key;
        if (onlineWorldTimeArr.length === result.length) {
          onlineWorldTimeArr.sort().reverse();
          var onlineWorlds = [];
          var onlineWorldDict = {};
          onlineWorldTimeArr.map(time => {
            if (time >= 0 && time in onlineWorldTimeDict) {
              var key = onlineWorldTimeDict[time];
              var name =
                this.worldKeyToNameAuthor(key).name +
                " by " +
                this.worldKeyToNameAuthor(key).author;
              onlineWorlds.push({ name: name, key: key });
              onlineWorldDict[key] = "";
            }
          });
          this.setState({ onlineWorldDict: onlineWorldDict }, () =>
            callback(onlineWorlds)
          );
        }
      };

      if (result.length === 0) {
        this.setState({ onlineWorldDict: {} }, () => callback([]));
      }
      result.map(item => {
        this.getWorldPublishTime(item.name, time =>
          timeCallback(time, item.name)
        );
      });
    });
  }

  getWorldObject(key, modalizeErrors, callback) {
    console.log("GETTING WORLD OBJECT");
    if (!key) {
      callback(undefined);
    }

    for (var i = 0; i < worlds.length; i++) {
      if (key === worlds[i].name) {
        callback(worlds[i].data);
        return;
      }
    }
    this.getOnlineWorldObject(key, modalizeErrors, callback);
  }

  getWorldPublishTime(fileName, callback) {
    var gh = new GitHub({ token: this.oauthToken });
    var repo = gh.getRepo("p5stamper", "worlds");
    repo.listCommits({ path: fileName }, (error, result, request) => {
      if (error) {
        callback(-1, fileName);
      } else if (result.length === 0) {
        callback(-1, fileName);
      } else {
        var dateString = result[0].commit.committer.date;
        var dateObj = new Date(dateString);
        var timeNum = dateObj.getTime();
        callback(timeNum);
      }
    });
  }

  getOnlineWorldObject(key, modalizeErrors, callback) {
    var gh = new GitHub({ token: this.oauthToken });
    var repo = gh.getRepo("p5stamper", "worlds");

    repo.getContents(
      "master",
      this.worldKeyToFileName(key),
      false,
      (error, result, request) => {
        if (error) {
          modalizeErrors &&
            this.setState({
              modalVisible: true,
              modalHeader: `Oh no! It looks like '${
                this.worldKeyToNameAuthor(key).name
              } by ${
                this.worldKeyToNameAuthor(key).author
              }' doesn't exist in our example list yet.`,
              modalContent:
                "Our server may not be fully updated, try again in a few minutes.",
              modalButtons: [
                {
                  text: "ok",
                  color: "outline-secondary",
                  callback: this.hideModal
                }
              ]
            });
          callback(undefined);
          return;
        }

        var bufContent = new Buffer(result.content, "base64");
        var stringContent = new TextDecoder("utf-8").decode(bufContent);
        try {
          callback(JSON.parse(stringContent));
        } catch (error) {
          console.log(error);

          modalizeErrors &&
            this.setState({
              modalVisible: true,
              modalHeader: `Oh no! It looks like there were issues loading '${
                this.worldKeyToNameAuthor(key).name
              }'.`,
              modalContent: "The example may be corrupted.",
              modalButtons: [
                {
                  text: "ok",
                  color: "outline-secondary",
                  callback: this.hideModal
                }
              ]
            });
        }
      }
    );
  }

  hidePublishModal() {
    this.setState({ publishModal: null });
  }

  hidePublishInfoModal() {
    this.setState({ publishInfoVisible: false });
  }

  renderLinkForm() {
    return (
      <input
        class="picker picker form-control form-control-sm mt-1 mb-1"
        value={this.worldKeyToUrl(this.props.getWorldData().worldKey)}
      />
    );
  }

  renderPublishInfoModal() {
    var worldData = this.props.getWorldData();

    var title = "You aren't working in a published sketch.";

    if (worldData.worldKey) {
      var nameAuthorDict = this.worldKeyToNameAuthor(worldData.worldKey);
      if (nameAuthorDict.author) {
        title = `${nameAuthorDict.name} by ${nameAuthorDict.author}`;
      } else {
        title = `${nameAuthorDict.name}`;
      }
    }

    return (
      <Modal
        show={this.state.publishInfoVisible}
        style={{ zIndex: 2000000000000000001 }}
        centered
        onHide={this.hidePublishInfoModal}
      >
        <Modal.Header closeButton>
          <Modal.Title className="name">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div hidden={!worldData.worldKey}>
              {this.renderLinkForm()}
              <div
                class="ml-1 picker text-greyText"
                hidden={!worldData.worldPublishTime}
              >
                {"published " + worldData.worldPublishTime}
              </div>
              <div
                class="ml-1 picker text-primary"
                hidden={!this.props.getWorldData().worldEdited}
              >
                {
                  "the sketch you have now is an edited version of what's published"
                }
              </div>
            </div>
            <div hidden={worldData.worldKey} class="picker">
              {"Publish this sketch to see it's published info"}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant={"outline-secondary"}
            size="sm"
            onClick={this.hidePublishInfoModal}
          >
            {"ok"}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    var buttonElems = this.state.modalButtons.map(btnData => (
      <Button variant={btnData.color} size="sm" onClick={btnData.callback}>
        {btnData.text}
      </Button>
    ));
    return (
      <div>
        {this.state.miniInputElem}
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

        {this.state.publishModal}
        {this.renderPublishInfoModal()}
      </div>
    );
  }
}
