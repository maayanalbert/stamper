const log = require("electron-log");
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
    this.editedAndUnsaved = false


    ipcMain.on('autosave', (event, files) => {

    })

  }

  save(){
      if(this.html === files.html && this.stamper === files.stamper
        && this.js === files.js && this.css === files.css){return}
      this.html = files.html
      this.stamper = files.stamper
      this.js = files.js
      this.css = files.css
      if(this.path){

      }else{
        this.editedAndUnsaved = true
        mainWindow.setTitle(this.name + "*")
      }    
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
      vars: []
    };
  }
  readFromDir() {}
  save() {}
  readFromView() {}
  writeToView() {
    this.mainWindow.webContents.send("writeToView", {
      html: this.html,
      stamper: this.stamper,
      css: this.css
    });
  }
};
