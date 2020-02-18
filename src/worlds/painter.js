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
			icon: "/static/media/layout.8a437d55.svg",
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
			icon: "/static/media/file.5bd43cb8.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "u7d8r8zg7",
			name: "setup",
			code: "createCanvas(200,200)",
			args: "",
			x: -220,
			y: 1340,
			editorWidth: 163.77673952969928,
			editorHeight: 45.91477877712373,
			iframeWidth: 60,
			iframeHeight: 60,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: true,
			exported: true,
			zIndex: 828,
			isBlob: false,
			codeSize: 14,
			icon: "/static/media/tool.d68b9b61.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "io132adyu",
			name: "// Part 1: Here...",
			code:
				"// Part 1: Here we have a few different 'painting tools' represented as function Stamps.",
			args: " ",
			x: -220,
			y: 1480,
			editorWidth: 658,
			editorHeight: 20,
			iframeWidth: 0,
			iframeHeight: 0,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 875,
			isBlob: true,
			codeSize: 14,
			icon: "/static/media/globe.50d70b6d.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "z63p5s1jd",
			name: "lineTool",
			code:
				"// draw a line\nstroke(200);\nstrokeWeight(1)\nline(x, y, lastX, lastY)",
			args: "x=50, y=50, lastX = 0, lastY = 0",
			x: -220,
			y: 1600,
			editorWidth: 278,
			editorHeight: 200,
			iframeWidth: 200,
			iframeHeight: 200,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 876,
			isBlob: false,
			codeSize: 14,
			icon: "/static/media/box.310d8273.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "4qr4vn2xt",
			name: "circleTool",
			code:
				"// generate a random size\nvar size = random(0, 20)\n\n// set the opacity\nvar opacity = map(size, 0, 20, 0, 255)\n\n// draw a circle   \nfill(200, opacity)\nnoStroke()\nellipse(x,y,size, size)",
			args: "x=50, y=50",
			x: 320,
			y: 1600,
			editorWidth: 278,
			editorHeight: 199.99999999999994,
			iframeWidth: 200,
			iframeHeight: 200,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 877,
			isBlob: false,
			codeSize: 14,
			icon: "/static/media/box.310d8273.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "dmjucllic",
			name: "rectTool",
			code:
				"// generate a random size\nvar size = random(0, 20)\n\n// set the opacity\nvar opacity = map(size, 0, 20, 0, 255)\n\n// draw a rectangle\nrectMode(CENTER)\nfill(200, opacity)\nnoStroke()\nrect(x,y,size, size)",
			args: "x=50, y=50",
			x: 860,
			y: 1600,
			editorWidth: 278,
			editorHeight: 199.99999999999994,
			iframeWidth: 200,
			iframeHeight: 200,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 878,
			isBlob: false,
			codeSize: 14,
			icon: "/static/media/box.310d8273.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "pkjccf076",
			name: "// Part 2: We c...",
			code:
				"// Part 2: We can pass one of these painting tools into the 'painter' as a 'toolFn'. Try commenting out the different lines in 'draw' to paint with different shapes.",
			args: " ",
			x: -220,
			y: 2040,
			editorWidth: 1198,
			editorHeight: 20,
			iframeWidth: 0,
			iframeHeight: 0,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 881,
			isBlob: true,
			codeSize: 14,
			icon: "/static/media/globe.50d70b6d.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "8as41qoym",
			name: "painter",
			code:
				"// made a fading background\ncolorMode(RGB, 255, 255, 255, 1);\nbackground(0, 0, 0, .01);\n\n// paint using the mouse position\ntoolFn(mouseX, mouseY, pmouseX, pmouseY)",
			args: "toolFn = lineTool",
			x: -220,
			y: 2160,
			editorWidth: 318,
			editorHeight: 200.00000000000006,
			iframeWidth: 200,
			iframeHeight: 200,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 882,
			isBlob: false,
			codeSize: 14,
			icon: "/static/media/box.310d8273.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "xqccowqfy",
			name: "draw",
			code:
				"//painter(lineTool)\npainter(circleTool)\n// painter(rectTool)",
			args: "",
			x: 360,
			y: 2160,
			editorWidth: 260,
			editorHeight: 200.00000000000006,
			iframeWidth: 200,
			iframeHeight: 200,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 883,
			isBlob: false,
			codeSize: 14,
			icon: "/static/media/tool.d68b9b61.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "0buiqsz20",
			name: "// HOW TO: Pass...",
			code: "// HOW TO: Passing Functions as Arguments",
			args: " ",
			x: -280,
			y: 1280,
			editorWidth: 596.8184091168227,
			editorHeight: 40.00000000000005,
			iframeWidth: 0,
			iframeHeight: 0,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 884,
			isBlob: true,
			codeSize: 28,
			icon: "/static/media/globe.50d70b6d.svg",
			lineHighLightingStatus: "none"
		}
	],
	scale: 0.5815559925138963,
	originX: 405.8928106744263,
	originY: -641.359503072498,
	worldKey: "HOW_TO:_Passing_Functions_as_Arguments",
	worldEdited: false,
	snapToGrid: false,
	linesOn: false,
	js:
		"function setup(){\n  createCanvas(200,200)\n}\n\n\n// Part 1: Here we have a few different 'painting tools' represented as function Stamps.\n\n\nfunction lineTool(x=50, y=50, lastX = 0, lastY = 0){\n  // draw a line\n  stroke(200);\n  strokeWeight(1)\n  line(x, y, lastX, lastY)\n}\n\nfunction circleTool(x=50, y=50){\n  // generate a random size\n  var size = random(0, 20)\n  \n  // set the opacity\n  var opacity = map(size, 0, 20, 0, 255)\n  \n  // draw a circle   \n  fill(200, opacity)\n  noStroke()\n  ellipse(x,y,size, size)\n}\n\nfunction rectTool(x=50, y=50){\n  // generate a random size\n  var size = random(0, 20)\n  \n  // set the opacity\n  var opacity = map(size, 0, 20, 0, 255)\n  \n  // draw a rectangle\n  rectMode(CENTER)\n  fill(200, opacity)\n  noStroke()\n  rect(x,y,size, size)\n}\n\n\n// Part 2: We can pass one of these painting tools into the 'painter' as a 'toolFn'. Try commenting out the different lines in 'draw' to paint with different shapes.\n\n\nfunction painter(toolFn = lineTool){\n  // made a fading background\n  colorMode(RGB, 255, 255, 255, 1);\n  background(0, 0, 0, .01);\n  \n  // paint using the mouse position\n  toolFn(mouseX, mouseY, pmouseX, pmouseY)\n}\n\nfunction draw(){\n  //painter(lineTool)\n  painter(circleTool)\n  // painter(rectTool)\n}\n\n\n// HOW TO: Passing Functions as Arguments\n\n",
	highlightedLines: {}
};
