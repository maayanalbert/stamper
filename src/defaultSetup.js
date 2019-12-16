var cssCode = `
html, body {
  margin: 0;
  padding: 0;
}`;

var htmlCode = `<html>
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

var setup = {
    fns: [
      { name: "style.css", args: " ", code: cssCode, isCss: true, x:800, y:140, hidden:true},
      { name: "index.html", args: " ", code: htmlCode, isHtml: true , x:220, y:140, hidden:true},
      {
        name: "setup",
        args: "",
        code: "createCanvas(400, 400)", x:220, y:480
      },
      { name: "draw", args: "", code: "background(220)", x:800, y:480 }
    ],
    blobs: [{}],
    scale: 1,
    console:{x:220, y:15, hidden:true},
    originX:0,
    originY:0
  }


exports.getSetup = () => setup;
