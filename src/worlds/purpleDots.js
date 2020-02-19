export default {
  stamps: [
    {
      id: "rfphskcb3",
      name: "index.html",
      code:
        '<html>\n  <head>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/p5.min.js"></script>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.dom.min.js"></script>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.sound.min.js"></script>\n    <link rel="stylesheet" type="text/css" href="style.css">\n  </head>\n  <body>\n    <script src=\'sketch.js\'></script>\n  </body>\n</html>\n',
      args: " ",
      x: 1551.2140684066003,
      y: 526.1806151153287,
      editorWidth: 225,
      editorHeight: 176.29205282888586,
      iframeWidth: 200,
      iframeHeight: 200,
      isIndex: true,
      isTxtFile: false,
      isMediaFile: false,
      hidden: true,
      exported: true,
      zIndex: -1,
      isBlob: false,
      codeSize: 14,
      icon: "./static/media/layout.8a437d55.svg",
      lineHighLightingStatus: "none"
    },
    {
      id: "e6gmt31vd",
      name: "style.css",
      code: "html, body {\n  margin: 0;\n  padding: 0;\n}",
      args: " ",
      x: 1551.6900090741035,
      y: 889.4753177293393,
      editorWidth: 225,
      editorHeight: 175,
      iframeWidth: 0,
      iframeHeight: 0,
      isIndex: false,
      isTxtFile: true,
      isMediaFile: false,
      hidden: true,
      exported: true,
      zIndex: -1,
      isBlob: false,
      codeSize: 14,
      icon: "./static/media/file.5bd43cb8.svg",
      lineHighLightingStatus: "none"
    },
    {
      id: "7jqn88erd",
      name: "/* Part 1: Befo...",
      code:
        "/* Part 1: Before you is a siple Stamper sketch to teach you the basics. Before we get started, some things you should know:\n    - 1 Stamper project = 1 p5.js sketch\n    - You can open any p5.js sketch in Stamper\n    - You can save/download any Stamper project and open it up in your (second) favorite p5.js editor\n  \n*/",
      args: " ",
      x: 720,
      y: 320,
      editorWidth: 918,
      editorHeight: 99.99999999999989,
      iframeWidth: 0,
      iframeHeight: 0,
      isIndex: false,
      isTxtFile: false,
      isMediaFile: false,
      hidden: false,
      exported: true,
      zIndex: 751,
      isBlob: true,
      codeSize: 14,
      icon: "./static/media/globe.50d70b6d.svg",
      lineHighLightingStatus: "none"
    },
    {
      id: "0psoiyaga",
      name: "var xPos = 0",
      code: "var xPos = 0\nvar maxSize = 20",
      args: " ",
      x: 720,
      y: 700,
      editorWidth: 120.72506930849877,
      editorHeight: 160.00000000000003,
      iframeWidth: 0,
      iframeHeight: 0,
      isIndex: false,
      isTxtFile: false,
      isMediaFile: false,
      hidden: false,
      exported: true,
      zIndex: 742,
      isBlob: true,
      codeSize: 14,
      icon: "./static/media/globe.50d70b6d.svg",
      lineHighLightingStatus: "none"
    },
    {
      id: "cjkdv45i9",
      name: "setup",
      code: "createCanvas(200, 200)\nbackground(175, 112, 248)\nnoStroke()",
      args: "x=50, y=50, lastX = 0, lastY = 0",
      x: 1220,
      y: 700,
      editorWidth: 258.0000000000001,
      editorHeight: 79.99999999999997,
      iframeWidth: 80,
      iframeHeight: 80,
      isIndex: false,
      isTxtFile: false,
      isMediaFile: false,
      hidden: false,
      exported: true,
      zIndex: 759,
      isBlob: false,
      codeSize: 14,
      icon: "./static/media/box.310d8273.svg",
      lineHighLightingStatus: "none"
    },
    {
      id: "k6jqu86o0",
      name: "sizeDot",
      code:
        "// generate a random size\nvar size = random(0, maxSize)\n\n// set the opacity\nvar opacity = map(size, 0, maxSize, 0, 255)\n\n// draw a dot   \nfill(255, opacity)\nellipse(x,y,size, size)",
      args: "x=mouseX, y=mouseY",
      x: 1540,
      y: 1140,
      editorWidth: 318,
      editorHeight: 200,
      iframeWidth: 200,
      iframeHeight: 200,
      isIndex: false,
      isTxtFile: false,
      isMediaFile: false,
      hidden: false,
      exported: true,
      zIndex: 757,
      isBlob: false,
      codeSize: 14,
      icon: "./static/media/box.310d8273.svg",
      lineHighLightingStatus: "none"
    },
    {
      id: "ipvqwxobk",
      name: "draw",
      code:
        "// update xPos and background\nbackground(175, 112, 248, 10)\nxPos = (xPos +2) % width\n\n// draw a row of dots\nfor(var i = 0; i < height/maxSize; i++){\n  sizeDot(xPos, i*maxSize )\n}",
      args: "",
      x: 720,
      y: 1140,
      editorWidth: 297.9999999999998,
      editorHeight: 200,
      iframeWidth: 200,
      iframeHeight: 200,
      isIndex: false,
      isTxtFile: false,
      isMediaFile: false,
      hidden: false,
      exported: true,
      zIndex: 755,
      isBlob: false,
      codeSize: 14,
      icon: "./static/media/tool.d68b9b61.svg",
      lineHighLightingStatus: "none"
    },
    {
      id: "chnd9e97b",
      name: "// HOW TO: The ...",
      code: "// HOW TO: The Basics",
      args: " ",
      x: 640,
      y: 180,
      editorWidth: 378.00000000000006,
      editorHeight: 40,
      iframeWidth: 0,
      iframeHeight: 0,
      isIndex: false,
      isTxtFile: false,
      isMediaFile: false,
      hidden: false,
      exported: true,
      zIndex: 739,
      isBlob: true,
      codeSize: 28,
      icon: "./static/media/globe.50d70b6d.svg",
      lineHighLightingStatus: "none"
    },
    {
      id: "rkjkllogm",
      name: "// Part 2: Belo...",
      code:
        "// Part 2: Below are the two Stamp types you'll probably use most frequently.",
      args: " ",
      x: 720,
      y: 580,
      editorWidth: 698,
      editorHeight: 19.54811420582079,
      iframeWidth: 0,
      iframeHeight: 0,
      isIndex: false,
      isTxtFile: false,
      isMediaFile: false,
      hidden: false,
      exported: true,
      zIndex: 741,
      isBlob: true,
      codeSize: 14,
      icon: "./static/media/globe.50d70b6d.svg",
      lineHighLightingStatus: "none"
    },
    {
      id: "rsum3x567",
      name: "// This is a 'G...",
      code:
        "// This is a 'Global Stamp'. Anything you put in here will be visbile to all of the other Stamps in your program.",
      args: " ",
      x: 900,
      y: 700,
      editorWidth: 238.0000000000001,
      editorHeight: 159.9999999999999,
      iframeWidth: 0,
      iframeHeight: 0,
      isIndex: false,
      isTxtFile: false,
      isMediaFile: false,
      hidden: false,
      exported: true,
      zIndex: 743,
      isBlob: true,
      codeSize: 14,
      icon: "./static/media/globe.50d70b6d.svg",
      lineHighLightingStatus: "none"
    },
    {
      id: "84wq8kdnf",
      name: "/* Next up is t...",
      code:
        "/* Next up is the 'Function Stamp'. You can think of this Stamp as a function:\n    - Stamp title = function name\n    - Stamp subtitle = function arguments\n    - Stamp contents = function interior\n*/",
      args: " ",
      x: 1620,
      y: 700,
      editorWidth: 245.4960166609036,
      editorHeight: 160,
      iframeWidth: 0,
      iframeHeight: 0,
      isIndex: false,
      isTxtFile: false,
      isMediaFile: false,
      hidden: false,
      exported: true,
      zIndex: 745,
      isBlob: true,
      codeSize: 14,
      icon: "./static/media/globe.50d70b6d.svg",
      lineHighLightingStatus: "none"
    },
    {
      id: "9zng9tkw7",
      name: "// Part 3: Here...",
      code:
        "// Part 3: Here we're defining a helper function, 'sizeDot', to be used in our main function, 'draw'. ",
      args: " ",
      x: 720,
      y: 1020,
      editorWidth: 774.3744675843168,
      editorHeight: 19.999999999999968,
      iframeWidth: 0,
      iframeHeight: 0,
      isIndex: false,
      isTxtFile: false,
      isMediaFile: false,
      hidden: false,
      exported: true,
      zIndex: 754,
      isBlob: true,
      codeSize: 14,
      icon: "./static/media/globe.50d70b6d.svg",
      lineHighLightingStatus: "none"
    },
    {
      id: "e7nal2fpr",
      name: "// Notice how d...",
      code:
        "// Notice how draw has a pink title? That's because it's a special built in p5 function. Normal functions have blue titles.",
      args: " ",
      x: 1280,
      y: 1140,
      editorWidth: 178.00000000000009,
      editorHeight: 129.0214978979661,
      iframeWidth: 0,
      iframeHeight: 0,
      isIndex: false,
      isTxtFile: false,
      isMediaFile: false,
      hidden: false,
      exported: true,
      zIndex: 756,
      isBlob: true,
      codeSize: 14,
      icon: "./static/media/globe.50d70b6d.svg",
      lineHighLightingStatus: "none"
    },
    {
      id: "zd4k6iina",
      name: "// See how we'r...",
      code:
        "// See how we're setting default arguments 'x=mouseX, y=mouseY'? Doing this ensures x and y default to the mouse position when no arguments are given. This is helpful when drawing. 'debug' view within the helper function. ",
      args: " ",
      x: 2120,
      y: 1140,
      editorWidth: 385.0438530860463,
      editorHeight: 138.71268949566536,
      iframeWidth: 0,
      iframeHeight: 0,
      isIndex: false,
      isTxtFile: false,
      isMediaFile: false,
      hidden: false,
      exported: true,
      zIndex: 758,
      isBlob: true,
      codeSize: 14,
      icon: "./static/media/globe.50d70b6d.svg",
      lineHighLightingStatus: "none"
    }
  ],
  scale: 0.5704445748031138,
  originX: -122.25386956780108,
  originY: -25.154363526924953,
  worldKey: "HOW_TO:_The_Basics",
  worldEdited: true,
  snapToGrid: false,
  linesOn: false,
  js:
    "\n/* Part 1: Before you is a siple Stamper sketch to teach you the basics. Before we get started, some things you should know:\n    - 1 Stamper project = 1 p5.js sketch\n    - You can open any p5.js sketch in Stamper\n    - You can save/download any Stamper project and open it up in your (second) favorite p5.js editor\n  \n*/\n\n\n\nvar xPos = 0\nvar maxSize = 20\n\n\nfunction setup(x=50, y=50, lastX = 0, lastY = 0){\n  createCanvas(200, 200)\n  background(175, 112, 248)\n  noStroke()\n}\n\nfunction sizeDot(x=mouseX, y=mouseY){\n  // generate a random size\n  var size = random(0, maxSize)\n  \n  // set the opacity\n  var opacity = map(size, 0, maxSize, 0, 255)\n  \n  // draw a dot   \n  fill(255, opacity)\n  ellipse(x,y,size, size)\n}\n\nfunction draw(){\n  // update xPos and background\n  background(175, 112, 248, 10)\n  xPos = (xPos +2) % width\n  \n  // draw a row of dots\n  for(var i = 0; i < height/maxSize; i++){\n    sizeDot(xPos, i*maxSize )\n  }\n}\n\n\n// HOW TO: The Basics\n\n\n\n// Part 2: Below are the two Stamp types you'll probably use most frequently.\n\n\n\n// This is a 'Global Stamp'. Anything you put in here will be visbile to all of the other Stamps in your program.\n\n\n\n/* Next up is the 'Function Stamp'. You can think of this Stamp as a function:\n    - Stamp title = function name\n    - Stamp subtitle = function arguments\n    - Stamp contents = function interior\n*/\n\n\n\n// Part 3: Here we're defining a helper function, 'sizeDot', to be used in our main function, 'draw'. \n\n\n\n// Notice how draw has a pink title? That's because it's a special built in p5 function. Normal functions have blue titles.\n\n\n\n// See how we're setting default arguments 'x=mouseX, y=mouseY'? Doing this ensures x and y default to the mouse position when no arguments are given. This is helpful when drawing. 'debug' view within the helper function. \n\n",
  highlightedLines: {}
};
