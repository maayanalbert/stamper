const log = require("electron-log");
const jetpack = require("fs-jetpack");
var chokidar = require("chokidar");

var _ = require("lodash");
const {
  app,
  BrowserWindow,
  Menu,
  protocol,
  ipcMain,
  electron,
  dialog
} = require("electron");
var parser = require("./parser.js");
var LZUTF8 = require("lzutf8");

module.exports = class FileManager {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.path = undefined;
    this.name = "Untitled";
    this.fileDict = {};
    this.stamper = undefined;
    this.pendingCallback = () => null;
    this.edited = false;
    this.watcher = null

    ipcMain.on("save", (event, files) => {
      this.saveFiles(files);
    });

    ipcMain.on("updatePath", (event, data) => {
  
      this.path = data.path;
      this.name = data.name;
      this.fileDict = data.fileDict;
      this.mainWindow.setTitle(this.name);
      this.watcher = chokidar.watch(this.path, {
          ignored: /[\/\\]\./,
          persistent: true
      });

      this.watcher
      .on("raw", this.fileChange.bind(this))

    });

    ipcMain.on("edited", event => {
      this.edited = true;

      this.mainWindow.setTitle(this.name + " - Edited");
    });
  }

  isExteriorChange(event, path){
     if(event === "root-changed"){
      return true
    }

    var fileName = path.substring(path.indexOf(this.path) + this.path.length)
    console.log(fileName)
    if(!this.fileDict[fileName]){
      return true
    }

    var existingContent = this.fileDict[fileName].content
    var newContent = jetpack.read(path)
    return newContent != existingContent


  }

  fileChange(event, path, detail){

    if(this.isExteriorChange(event, path)){
      this.mainWindow.send("exteriorChanges");
    }
  }

  resetFiles() {
    this.path = undefined;
    this.name = "Untitled";
    this.fileDict = {};
    this.stamper = undefined;
    this.edited = false;
    this.watcher = null
  }

  onNewProject() {
    this.protectUnsaved(this.openNewProject.bind(this));
  }

  protectUnsaved(yesCallBack = () => null) {
    if (this.edited === false) {
      yesCallBack();
    } else if (this.path) {
      this.mainWindow.send("requestSave");
      this.pendingCallback = yesCallBack;
    } else {
      const options = {
        type: "question",
        buttons: ["Yes", "Cancel"],
        defaultId: 0,
        message: "This is an unsaved project",
        detail: "Are you sure you want to close it and lose your work?"
      };

      dialog.showMessageBox(null, options).then(data => {
        if (data.response === 0) {
          yesCallBack();
        }
      });
    }
  }

  openNewProject() {
    this.resetFiles();

    this.name = "Untitled";
    this.mainWindow.setTitle(this.name);

    this.mainWindow.webContents.send("resetView");
  }

  onSaveCommand() {
    if (this.path === undefined) {
      this.onSaveAsCommand();
    } else {
      this.mainWindow.send("requestSave");
    }
  }

  onOpenCommand() {
    this.mainWindow.webContents.send("requestUpload");
  }

  onSaveAsCommand() {
    dialog.showSaveDialog(this.mainWindow).then(result => {
      if (result.canceled === false) {
        this.name = result.filePath.replace(/^.*[\\\/]/, "");
        this.path = result.filePath + "/";

        this.mainWindow.send("requestSave");
      }
    });
  }

  uriToText(uri){

          var idx = uri.indexOf("base64,") + "base64,".length;
          var headerlessUri = uri.substring(idx);

          var buf = new Buffer(headerlessUri, "base64");
          return buf

  }

  saveFiles(newFileDict) {
    console.log(this.path);

    if (this.path === undefined) {
      return;
    }

    Object.keys(newFileDict).map(name => {
      var newContent = newFileDict[name].content;
      var oldContent;
      if (this.fileDict[name]) {
        oldContent = this.fileDict[name].content;
        this.fileDict[name].updated = true;
      }

      if (oldContent != newContent) {
        if (newFileDict[name].type === "image") {
          var uri = newFileDict[name].content;

          jetpack.writeAsync(this.path + name, this.uriToText(uri));
        } else {
          jetpack.writeAsync(this.path + name, newContent);
        }
      }
    });

    Object.keys(this.fileDict).map(name => {
      if (!this.fileDict[name].updated) {
        jetpack.removeAsync(this.path + name);
      }
    });

    this.fileDict = newFileDict;

    // if (
    //   this.html === files.html &&
    //   _.isEqual(this.stamper, files.stamper) &&
    //   this.js === files.js &&
    //   this.css === files.css
    // ) {
    //   return;
    // }

    // this.html = files.html;
    // this.stamper = files.stamper;
    // this.js = files.js;
    // this.css = files.css;
    this.mainWindow.setTitle(this.name);
    this.edited = false;

    // jetpack.writeAsync(this.path + "/sketch.js", this.js);
    // jetpack.writeAsync(this.path + "/style.css", this.css);
    // jetpack.writeAsync(this.path + "/index.html", this.html);
    // jetpack.writeAsync(
    //   this.path + "/stamper.js", this.stamper
    // );

    this.pendingCallback();
    this.pendingCallback = () => null;
  }

  // writeToView() {
  //   this.mainWindow.webContents.send("writeToView", {
  //     stamper: this.stamper
  //   });
  // }
};
