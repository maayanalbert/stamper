const log = require("electron-log");
const jetpack = require("fs-jetpack");

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
    this.name = "";
    this.html = "";
    this.css = "";
    this.js = "";
    this.stamper = undefined;
    this.pendingCallback = () => null
    this.edited = false

    ipcMain.on("save", (event, files) => {
      this.saveFiles(files);
    });


    ipcMain.on("updatePath", (event, data) => {
      this.path = data.path;
      this.name = data.name;
      this.mainWindow.setTitle(this.name);
    });

    ipcMain.on("edited", event => {
      this.edited = true

      this.mainWindow.setTitle(this.name + " - Edited");
    });
  }

  resetFiles() {
    this.path = undefined;
    this.name = "";
    this.html = "";
    this.css = "";
    this.js = "";
    this.stamper = undefined;
    this.edited = false
  }

  onNewProject() {

    this.protectUnsaved(this.openNewProject.bind(this))
  }

  protectUnsaved(yesCallBack = () => null){
    if(this.edited === false){
      yesCallBack()
   
    }else if(this.path){
      this.mainWindow.send("requestSave");
      this.pendingCallback = yesCallBack
   
    }else{
    const options = {
    type: 'question',
    buttons: ['Yes', "Cancel"],
    defaultId: 0,
    message: 'This is an unsaved project',
    detail: 'Are you sure you want to close it and lose your work?',
  };

  dialog.showMessageBox(null, options, (response) => {

    if(response === 0){
      yesCallBack()

    }else{

   
    }
  });
    }    
  }

  openNewProject(){
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
      this.mainWindow.webContents.send("requestUpload")
  }

  onSaveAsCommand() {
    dialog.showSaveDialog(this.mainWindow).then(result => {
      if (result.canceled === false) {
        this.name = result.filePath.replace(/^.*[\\\/]/, "");
        this.path = result.filePath;

        this.mainWindow.send("requestSave");
      }
    });
  }

 

  saveFiles(files) {
    if (this.path === undefined) {
      return;
    }

    if (
      this.html === files.html &&
      _.isEqual(this.stamper, files.stamper) &&
      this.js === files.js &&
      this.css === files.css
    ) {
      return;
    }

    this.html = files.html;
    this.stamper = files.stamper;
    this.js = files.js;
    this.css = files.css;
    this.mainWindow.setTitle(this.name);
    this.edited = false

    jetpack.writeAsync(this.path + "/sketch.js", this.js);
    jetpack.writeAsync(this.path + "/style.css", this.css);
    jetpack.writeAsync(this.path + "/index.html", this.html);
    jetpack.writeAsync(
      this.path + "/stamper.js", this.stamper
    );

    this.pendingCallback()
    this.pendingCallback = () => null
  }

  // writeToView() {
  //   this.mainWindow.webContents.send("writeToView", {
  //     stamper: this.stamper
  //   });
  // }
};
