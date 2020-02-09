const log = require("electron-log");
const jetpack = require("fs-jetpack");
var chokidar = require("chokidar");
var mime = require("mime-types");
const fs = require("fs");
var recursive = require("recursive-readdir");

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
const DataURI = require("datauri").promise;

module.exports = class FileManager {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.path = undefined;
    this.name = "Untitled";
    this.fileDict = {};

    this.pendingCallback = () => null;
    this.edited = false;
    this.watcher = null;

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
        .on("error", error => log(`Watcher error: ${error}`));
    });

    ipcMain.on("edited", event => {
      this.edited = true;

      this.mainWindow.setTitle(this.name + " - Edited");
    });
  }

  isExteriorChange(event, path) {
    if (event === "root-changed") {
      return true;
    }

    var fileName = path.substring(path.indexOf(this.path) + this.path.length);
    var file = this.fileDict[fileName];
    if (file) {
      var existingContent = file.content;
      if (file.type === "media") {
        existingContent = this.uriToText(existingContent);
      }
    } else {
      var existingContent = undefined;
    }

    var newContent = jetpack.read(path);
    return newContent != existingContent;
  }

  fileChange(event, path, detail) {
    console.log("FILECHANGE");

    if (this.isExteriorChange(event, path)) {
      console.log("IS EXTERIOR CHANGE");
      this.mainWindow.send("exteriorChanges");
      this.resetFiles();
    }
  }

  actuallyResetFiles() {
    this.path = undefined;
    this.name = "Untitled";
    this.fileDict = {};
    this.edited = false;
    this.mainWindow.setTitle(this.name);
    this.watcher = null;
  }

  resetFiles() {
    this.watcher &&
      this.watcher.close().then(() => {
        this.actuallyResetFiles();
      });

    !this.watcher && this.actuallyResetFiles();
  }

  onNewProject(worldKey) {
    this.protectUnsaved(() => this.openNewProject(worldKey));
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

  openNewProject(worldKey) {
    this.resetFiles();

    this.mainWindow.webContents.send("resetView", { worldKey: worldKey });
  }

  onSaveCommand() {
    if (this.path === undefined) {
      this.onSaveAsCommand();
    } else {
      this.mainWindow.send("requestSave");
    }
  }

  onOpenCommand() {
    this.protectUnsaved(this.openProject.bind(this));
  }

  getFileDictFromPath(path) {
    recursive(path, function(err, files) {
      // `files` is an array of file paths
      files.map(singleFilePath => {
        DataURI(singleFilePath)
          .then(content => console.log(content))
          //=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
          .catch(err => {
            throw err;
          });

        // jetpack.readAsync(singleFilePath, "buffer").then(data => {
        //   var name = singleFilePath.substring(filePath.length);
        //   var mimeType = mime.lookup(name);
        //   if (mimeType.startsWith("text")) {
        //     var fileType = "text";
        //   } else {
        //     var fileType = "media";
        //   }

        //   if(fileType === "media"){
        //     // var content =
        //   }

        // });
      });
    });
  }

  openProject() {
    // this.mainWindow.webContents.send("requestUpload");

    dialog.showOpenDialog({ properties: ["openDirectory"] }).then(data => {
      if (data.filePaths.length < 1) {
        return;
      }

      var filePath = data.filePaths[0] + "/";
      this.getFileDictFromPath(filePath);
    });
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

  uriToText(uri) {
    var idx = uri.indexOf("base64,") + "base64,".length;
    var headerlessUri = uri.substring(idx);

    var buf = new Buffer(headerlessUri, "base64");
    return buf;
  }

  // bufferToURi(buffer){
  //     `data:${mimeType};base64,`
  // }

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
        if (newFileDict[name].type === "media") {
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
