const log = require("electron-log");

module.exports = class ProjectManager {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.path = undefined;
    this.name = undefined;
    this.html = undefined;
    this.css = undefined;
    this.js = undefined;
    this.stamper = undefined;
    this.cssName = undefined;
    this.jsName = undefined;
  }
  setDefault() {
    this.jsName = "sketch.js"
    this.cssName = "style.css"
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
          isSetup: true,
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
      css: this.css,
      jsName:this.jsName, cssName:this.cssName
    });
  }
};
