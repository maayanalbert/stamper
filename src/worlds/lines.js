export default {
	stamps: [
		{
			id: "vn8yofk4h",
			name: "style.css",
			code: "\nhtml, body {\n  margin: 0;\n  padding: 0;\n}",
			args: " ",
			x: 779.5341998624599,
			y: 146.7984650004281,
			editorWidth: 225,
			editorHeight: 175,
			iframeWidth: 0,
			iframeHeight: 0,
			isIndex: false,
			isTxtFile: true,
			isMediaFile: false,
			hidden: true,
			exported: true,
			zIndex: 634,
			isBlob: false,
			codeSize: 14,
			icon: "/static/media/file.5bd43cb8.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "v5yjw1dwb",
			name: "index.html",
			code:
				'<html>\n  <head>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/p5.min.js"></script>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.dom.min.js"></script>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.sound.min.js"></script>\n    <link rel="stylesheet" type="text/css" href="style.css">\n  </head>\n  <body>\n    <script src=\'sketch.js\'></script>\n  </body>\n</html>\n',
			args: " ",
			x: 309.13872819066705,
			y: 148.12237211435783,
			editorWidth: 225,
			editorHeight: 175,
			iframeWidth: 200,
			iframeHeight: 200,
			isIndex: true,
			isTxtFile: false,
			isMediaFile: false,
			hidden: true,
			exported: true,
			zIndex: 639,
			isBlob: false,
			codeSize: 14,
			icon: "/static/media/layout.8a437d55.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "xpyf6i697",
			name: "var liftImg",
			code: "var liftImg\nvar numRows\nvar numCols",
			args: " ",
			x: 1306.350416296958,
			y: 142.14598334812166,
			editorWidth: 117.99999999999989,
			editorHeight: 60,
			iframeWidth: 0,
			iframeHeight: 0,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 1078,
			isBlob: true,
			codeSize: 14,
			icon: "/static/media/globe.50d70b6d.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "ilepy1xld",
			name: "setup",
			code:
				"createCanvas(200, 200)\nbackground(255)\nliftImg = loadImage('gradient.png')",
			args: "",
			x: 720,
			y: -260,
			editorWidth: 218,
			editorHeight: 80,
			iframeWidth: 80,
			iframeHeight: 80,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 1056,
			isBlob: false,
			codeSize: 14,
			icon: "/static/media/tool.d68b9b61.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "kfpiw9k9e",
			name: "draw",
			code:
				"background(255)\nvar imgWidth = width/numCols\nvar imgHeight = height/numRows\nvar rowNum = 0\nfor(var x = 0; x < width; x += imgWidth){\n  for(var y = 0; y < height + imgHeight; y += imgHeight){\n    rowNum += 1\n   image(liftImg,x, y, imgWidth, -imgHeight) \n  }\n}",
			args: "",
			x: 609.2700832593916,
			y: 528.1603847678009,
			editorWidth: 358,
			editorHeight: 199.99999999999994,
			iframeWidth: 200,
			iframeHeight: 200,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 1074,
			isBlob: false,
			codeSize: 14,
			icon: "/static/media/tool.d68b9b61.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "vjiydulrv",
			name: "mousePressed",
			code:
				"background(255)\nnumRows = Math.floor(random(1, 10))\nnumCols = Math.floor(random(1, 10))\nrect(0, 0, width/numCols, height/numRows)",
			args: "",
			x: 1920,
			y: -80,
			editorWidth: 260,
			editorHeight: 200,
			iframeWidth: 200,
			iframeHeight: 200,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 1075,
			isBlob: false,
			codeSize: 14,
			icon: "/static/media/bell.86facacc.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "9f6xi0w8o",
			name: "gradient.png",
			code:
				"data:image/png;base64,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",
			args: " ",
			x: 140,
			y: -520,
			editorWidth: 0,
			editorHeight: 200,
			iframeWidth: 150,
			iframeHeight: 150,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: true,
			hidden: false,
			exported: true,
			zIndex: 1070,
			isBlob: false,
			codeSize: 14,
			icon: "/static/media/image.117a6d3e.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "fb9f3wmw4",
			name: "// green lines ",
			code:
				"// green lines \n// point to Stamps loading that file or asset",
			args: " ",
			x: 420,
			y: -420,
			editorWidth: 198,
			editorHeight: 60,
			iframeWidth: 0,
			iframeHeight: 0,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 1071,
			isBlob: true,
			codeSize: 14,
			icon: "/static/media/globe.50d70b6d.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "ba329r869",
			name: "// blue lines ",
			code:
				"// blue lines \n// point to Stamps using that variable or function",
			args: " ",
			x: 980,
			y: 60,
			editorWidth: 198,
			editorHeight: 60,
			iframeWidth: 0,
			iframeHeight: 0,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 1076,
			isBlob: true,
			codeSize: 14,
			icon: "/static/media/globe.50d70b6d.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "0v0sty5yv",
			name: "// pink lines ",
			code: "// pink lines \n// point to Stamps hearing that listener",
			args: " ",
			x: 1520,
			y: 440,
			editorWidth: 198,
			editorHeight: 60,
			iframeWidth: 0,
			iframeHeight: 0,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 1077,
			isBlob: true,
			codeSize: 14,
			icon: "/static/media/globe.50d70b6d.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "wdmbpzm2q",
			name: "// grey lines",
			code:
				"// grey lines\n// point to Stamps that by default use this built in p5 function",
			args: " ",
			x: 1400,
			y: -200,
			editorWidth: 198,
			editorHeight: 60,
			iframeWidth: 0,
			iframeHeight: 0,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 1067,
			isBlob: true,
			codeSize: 14,
			icon: "/static/media/globe.50d70b6d.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "r6lp7yxrd",
			name: "// a line from ...",
			code:
				"// a line from A -> B means Stamp B references code in Stamp A",
			args: " ",
			x: 789.8077997254753,
			y: -564.1465858815953,
			editorWidth: 1009.1885287977747,
			editorHeight: 38.322435049972874,
			iframeWidth: 0,
			iframeHeight: 0,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 1073,
			isBlob: true,
			codeSize: 28,
			icon: "/static/media/globe.50d70b6d.svg",
			lineHighLightingStatus: "none"
		}
	],
	scale: 0.45375542193651225,
	originX: 188.5444426581107,
	originY: 367.8803064504864,
	worldKey: "lines~maayan",
	worldEdited: true,
	worldPublishTime:
		"Sun Feb 16 2020 23:17:06 GMT-0800 (Pacific Standard Time)",
	snapToGrid: false,
	linesOn: true,
	js:
		"\nvar liftImg\nvar numRows\nvar numCols\n\n\nfunction setup(){\n  createCanvas(200, 200)\n  background(255)\n  liftImg = loadImage('gradient.png')\n}\n\nfunction draw(){\n  background(255)\n  var imgWidth = width/numCols\n  var imgHeight = height/numRows\n  var rowNum = 0\n  for(var x = 0; x < width; x += imgWidth){\n    for(var y = 0; y < height + imgHeight; y += imgHeight){\n      rowNum += 1\n     image(liftImg,x, y, imgWidth, -imgHeight) \n    }\n  }\n}\n\nfunction mousePressed(){\n  background(255)\n  numRows = Math.floor(random(1, 10))\n  numCols = Math.floor(random(1, 10))\n  rect(0, 0, width/numCols, height/numRows)\n}\n\n\n// green lines \n// point to Stamps loading that file or asset\n\n\n\n// blue lines \n// point to Stamps using that variable or function\n\n\n\n// pink lines \n// point to Stamps hearing that listener\n\n\n\n// grey lines\n// point to Stamps that by default use this built in p5 function\n\n\n\n// a line from A -> B means Stamp B references code in Stamp A\n\n",
	highlightedLines: {}
};
