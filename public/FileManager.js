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
                  // surface an error
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



  setDefault() {
    this.name = "Untitled"
    this.html = `
<html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/p5.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.dom.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.sound.min.js"></script>
    <link rel="stylesheet" type="text/css" href="style.css">
  </head>
  <body>
    <script src='sketch.js'></script>
  </body>
</html>
`;
    this.css = `
html, body {
  margin: 0;
  padding: 0;
}
`;
    this.stamper = {
      fns: [
        {
          name: "setup",
          args: "",
          code: "createCanvas(400, 400)"
        },
        { name: "draw", args: "", code: "background(220)" }
      ],
      vars: [], 
      scale:1
    };
  }
  writeToView() {
    this.mainWindow.webContents.send("writeToView", {
      html: this.html,
      stamper: this.stamper,
      css: this.css
    });
  }
};
