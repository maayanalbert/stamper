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
  name: "Untitled",
  stamper: {
    fns: [
      {
        name: "setup",
        args: "",
        code: "createCanvas(400, 400)"
      },
      { name: "draw", args: "", code: "background(220)" },
      { name: "style.css", args: " ", code: cssCode, isCss: true },
      { name: "index.html", args: " ", code: htmlCode, isHtml: true }
    ],
    blobs: [],
    scale: 1
  }
};

exports.getSetup = () => setup;
