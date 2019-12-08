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
var parser = require('./parser');
var LZUTF8 = require('lzutf8');

module.exports = class FileManager {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.path = undefined;
    this.name = undefined;
    this.html = undefined;
    this.css = undefined;
    this.js = undefined;
    this.stamper = undefined;



    ipcMain.on('save', (event, files) => {
      this.saveFiles(files)
    })

    ipcMain.on('edited', (event) => {
      this.mainWindow.setTitle(this.name + " - Edited")
    })

  }

  resetFiles(){
    this.path = undefined;
    this.name = undefined;
    this.html = undefined;
    this.css = undefined;
    this.js = undefined;
    this.stamper = undefined;    
  }

  onNewProject(){

    this.resetFiles()

    var setup = defaultSetup.getSetup()
    this.name = setup.name
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

stamperMatches(html, js, css, stamper){
  var stamperHtml = LZUTF8.decompress(stamper.compressedHtml,{inputEncoding:"StorageBinaryString"});
  var stamperCss = LZUTF8.decompress(stamper.compressedCss,{inputEncoding:"StorageBinaryString"});
  var stamperJs = LZUTF8.decompress(stamper.compressedJs,{inputEncoding:"StorageBinaryString"});
  return html === stamperHtml && stamperCss === css && stamperJs === js
}
  openFile(html, js, css, stamper = {}){
                if(html === undefined || js === undefined){
                  dialog.showMessageBox(this.mainWindow, 
                    {message: "Oh no! It looks like you're missing some files. Stamper projects must have an index.html file and a sketch.js file.",
                    buttons:["Ok"]})
                    return
                }
                


                if(this.stamperMatches(html, js, css, stamper)){
             
                  this.stamper = stamper
                }else{
             

                  var newStamper = parser.jsToStamps(js)
                  newStamper.fns.push({name:"style.css", args:" ", code:css, isCss:true})
                  newStamper.fns.push({name:"index.html", args:" ", code:html, isHtml:true})
             
                  this.stamper = newStamper
                }

                if(css === undefined){
                  this.css = ""
                }else{
                  this.css = css
                }


                this.html = html
                this.js = js
                this.name = this.path.replace(/^.*[\\\/]/, '')


                this.writeToView()
                this.mainWindow.setTitle(this.name)

  }
  onOpenCommand(){
 
    dialog.showOpenDialog(this.mainWindow, { properties: ["openDirectory"] }).then(result =>
    {
      if(result.canceled === false){
        if(result.filePaths.length != 1){
          return
        }

        this.path = result.filePaths[0]
       
        

        jetpack.readAsync(this.path + "/index.html").then(html =>{
          jetpack.readAsync(this.path + "/sketch.js").then(js => {
            jetpack.readAsync(this.path + "/style.css").then(css => {
              jetpack.readAsync(this.path+ "/pls_dont_touch.stamper", "json").then(stamper => {
                this.openFile(html, js, css, stamper)
          
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
        this.path = result.filePath
      
        this.mainWindow.send("requestSave")
      }
    })
  }

  // defaultEquals(stamps){
  //   var editableStamps = _.clone(stamps)
  //   Object.values(editableStamps.fns).map(stamp => 
  //   {
  //     var neededKeys = {code:"", name:"", args:""}
  //     Object.keys(stamp).map(key => {
  //       if(key in neededKeys === false){
  //         delete stamp[key]

  //       }
  //     })
  //   })

  //   Object.values(editableStamps.vars).map(stamp => 
  //   {
  //     var neededKeys = {code:""}
  //     Object.keys(stamp).map(key => {
  //       if(key in neededKeys === false){
  //         delete stamp[key]
  //       }
  //     })
  //   })

  //     return _.isEqual(this.stamper, editableStamps)
  // }



  saveFiles(files){
    if(this.path === undefined){
        return       
    }

        if(this.html === files.html && _.isEqual(this.stamper, files.stamper)
      && this.js === files.js && this.css === files.css){return}


      this.html = files.html
      this.stamper = files.stamper
      this.js = files.js
      this.css = files.css
      this.mainWindow.setTitle(this.name)

      this.stamper.compressedHtml = LZUTF8.compress(this.html, {outputEncoding:"StorageBinaryString"});
      this.stamper.compressedCss = LZUTF8.compress(this.css, {outputEncoding:"StorageBinaryString"});
      this.stamper.compressedJs = LZUTF8.compress(this.js, {outputEncoding:"StorageBinaryString"});

      jetpack.writeAsync(this.path + "/sketch.js", this.js)
      jetpack.writeAsync(this.path + "/style.css", this.css)
      jetpack.writeAsync(this.path + "/index.html", this.html)
      jetpack.writeAsync(this.path + "/pls_dont_touch.stamper", JSON.stringify(this.stamper))

  }



  writeToView() {
    this.mainWindow.webContents.send("writeToView", {
      stamper: this.stamper
    });
  }
};
