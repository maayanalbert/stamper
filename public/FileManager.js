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
  constructor(window, createWindow) {
    this.window = window;
    this.path = undefined;
    this.name = "Untitled";
    this.fileDict = {};
    this.exteriorChangeTimeout = null;

    this.pendingCallback = () => null;
    this.edited = false;
    this.watcher = null;

    this.createWindow = createWindow;

    ipcMain.on("save", (event, files) => {
      if (event.sender != this.window.webContents) {
        return;
      }
      // console.log("SAVING WINDOW");
      this.saveFiles(files);
    });

    ipcMain.on("updatePath", (event, data) => {
      if (event.sender != this.window.webContents) {
        return;
      }

      this.hookUpToDirectory(data.path, data.fileDict);
    });
    ipcMain.on("edited", event => {
      if (event.sender != this.window.webContents) {
        return;
      }
      console.log("EDITING WINDOW");

      this.edited = true;

      this.window.setTitle(this.name + " - Edited");
    });
  }

  hookUpToDirectory(path, fileDict = {}) {
    this.path = path;

    var pathArr = this.path.split("/");
    if (pathArr.length >= 2) {
      pathArr.pop();
      this.name = pathArr.pop();
    }

    this.fileDict = fileDict;
    this.window.setTitle(this.name);
    this.watcher = chokidar.watch(this.path, {
      ignored: /[\/\\]\./,
      persistent: true
    });
    console.log("PHATH HERE");
    console.log(this.path);
    this.watcher
      .on("raw", this.fileChange.bind(this))
      .on("error", error => log(`Watcher error: ${error}`));
  }

  isExteriorChange(event, path) {
    if (!path) {
      return;
    }
    console.log("IS EXTERIOR CHANGE");
    console.log(path);
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

    if (event === "root-changed") {
      this.window.send("exteriorChanges");
      this.resetFiles();
      clearTimeout(this.exteriorChangeTimeout);
      return;
    }
    if (this.exteriorChangeTimeout) {
      clearTimeout(this.exteriorChangeTimeout);
    }

    this.exteriorChangeTimeout = setTimeout(s => {
      if (this.isExteriorChange(event, path)) {
        this.importFilesFromPath(this.path, false);
      }
    }, 250);
  }

  actuallyResetFiles(callback) {
    this.path = undefined;
    this.name = "Untitled";
    this.fileDict = {};
    this.edited = false;
    this.window.setTitle(this.name);
    this.watcher = null;
    callback();
  }

  resetFiles(callback = () => null) {
    this.watcher &&
      this.watcher.close().then(() => {
        this.actuallyResetFiles(callback);
      });

    !this.watcher && this.actuallyResetFiles(callback);
  }

  onNewProject(worldKey) {
    this.openNewProject(worldKey);
  }

  protectUnsaved(yesCallBack = () => null) {
    if (this.edited === false) {
      yesCallBack();
    } else if (this.path) {
      this.window.send("requestSave");
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

    this.createWindow(window =>
      window.webContents.send("openWorld", { worldKey: worldKey })
    );
  }

  onSaveCommand() {
    if (this.path === undefined) {
      this.onSaveAsCommand();
    } else {
      this.window.send("requestSave");
    }
  }

  onOpenCommand() {
    this.openProject();
  }

  importFilesFromPath(path, openNewWindow = true) {
    recursive(path, (err, files) => {
      var rawFileList = [];
      var callback = () => {
        if (rawFileList.length === files.length) {
          console.log("NEW WINDOW");
          if (openNewWindow) {
            this.createWindow(window =>
              window.webContents.send("openDirectory", {
                rawFileList: rawFileList,
                path: path
              })
            );
          } else {
            this.window.webContents.send("openDirectory", {
              rawFileList: rawFileList,
              path: path
            });
          }
        }
      };

      files.map(singleFilePath => {
        jetpack.readAsync(singleFilePath, "buffer").then(buffer => {
          var name = singleFilePath.substring(path.length);
          rawFileList.push({ name: name, buffer: buffer });
          callback();
        });
      });
    });
  }

  openProject() {
    // this.window.webContents.send("requestUpload");

    dialog.showOpenDialog({ properties: ["openDirectory"] }).then(data => {
      if (data.filePaths.length < 1) {
        return;
      }

      var filePath = data.filePaths[0] + "/";
      this.importFilesFromPath(filePath);
    });
  }

  onSaveAsCommand() {
    dialog.showSaveDialog(this.window).then(result => {
      if (result.canceled === false) {
        this.resetFiles(() => {
          this.hookUpToDirectory(result.filePath + "/");
          this.window.send("requestSave");
        });
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
    this.window.setTitle(this.name);
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
  //   this.window.webContents.send("writeToView", {
  //     stamper: this.stamper
  //   });
  // }
};
