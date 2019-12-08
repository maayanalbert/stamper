const log = require("electron-log");
const jetpack = require('fs-jetpack');
var _ = require('lodash');
const {
  app,
  BrowserWindow,
  Menu,
  protocol,
  ipcMain,
  electron,
  dialog
} = require("electron");
const defaultSetup = require("./defaultSetup.js");

module.exports = class FileManager {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.path = undefined;
    this.name = undefined;
    this.html = undefined;
    this.css = undefined;
    this.js = undefined;
    this.stamper = undefined;
    this.editedAndUnsaved = false;


    ipcMain.on('save', (event, files) => {
      this.saveFiles(files)
    })

  }

  onNewProject(){
    var setup = defaultSetup.getSetup()
    this.name = setup.name
    this.html = setup.html
    this.css = setup.css
    this.stamper = setup.stamper
    this.mainWindow.setTitle(this.name)
    this.writeToView()

  }

  onSaveCommand(){
    if(this.path === undefined){
      this.onSaveAsCommand()
    }else{
      this.mainWindow.send("requestSave")
    }
  }

  onOpenCommand(){
 
    dialog.showOpenDialog(this.mainWindow, { properties: ["openDirectory"] }).then(result =>
    {
      if(result.canceled === false){
        if(result.filePaths.length != 1){
          return
        }

        this.path = result.filePaths[0]
       
        this.name = this.path.replace(/^.*[\\\/]/, '')

        jetpack.readAsync(this.path + "/index.html").then(index =>{
          this.index = index
          jetpack.readAsync(this.path + "/sketch.js").then(js => {
            this.js = js
            jetpack.readAsync(this.path + "/style.css").then(css => {
              this.css = css
              jetpack.readAsync(this.path+ "/pls_dont_touch.stamper", "json").then(stamper => {
                this.stamper = stamper
      

                if(this.html === undefined || this.sketch === undefined){
                  dialog.showMessageBox(this.mainWindow, 
                    {message: "Oh no! It looks like you're missing some files. Stamper projects must have an index.html file and a sketch.js file.",
                    buttons:["Ok"]})
                    return
                }
                if(this.css === undefined){
                  this.css = ""
                }
                if(this.stamper === undefined){
                  /// agh write parser
                }

                this.writeToView()
                this.mainWindow.setTitle(this.name)
          
              })
            })
          })
        })


      }
    })

  }


  onSaveAsCommand(){
     dialog.showSaveDialog(this.mainWindow).then(result => {
      if(result.canceled === false){
        this.name = result.filePath.replace(/^.*[\\\/]/, '')
        this.mainWindow.setTitle(this.name)
        this.path = result.filePath
        this.editedAndUnsaved = false
        this.mainWindow.send("requestSave")
      }
    })
  }

  defaultEquals(stamps){
    var editableStamps = _.clone(stamps)
    Object.values(editableStamps.fns).map(stamp => 
    {
      var neededKeys = {code:"", name:"", args:""}
      Object.keys(stamp).map(key => {
        if(key in neededKeys === false){
          delete stamp[key]

        }
      })
    })

    Object.values(editableStamps.vars).map(stamp => 
    {
      var neededKeys = {code:""}
      Object.keys(stamp).map(key => {
        if(key in neededKeys === false){
          delete stamp[key]
        }
      })
    })

      return _.isEqual(this.stamper, editableStamps)
  }

  saveFiles(files){


    if(this.path === undefined){
        if(this.html === files.html && this.css === files.css && this.defaultEquals(files.stamper)){
          return
        }
        this.editedAndUnsaved = true
        this.mainWindow.setTitle(this.name + " - Edited")
        return       
    }

        if(this.html === files.html && _.isEqual(this.stamper, files.stamper)
      && this.js === files.js && this.css === files.css){return}


      this.html = files.html
      this.stamper = files.stamper
      this.js = files.js
      this.css = files.css

      jetpack.writeAsync(this.path + "/sketch.js", this.js)
      jetpack.writeAsync(this.path + "/style.css", this.css)
      jetpack.writeAsync(this.path + "/index.html", this.html)
      jetpack.writeAsync(this.path + "/pls_dont_touch.stamper", JSON.stringify(this.stamper))

  }



  writeToView() {
    this.mainWindow.webContents.send("writeToView", {
      html: this.html,
      stamper: this.stamper,
      css: this.css
    });
  }
};
