export default {
	stamps: [
		{
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
			icon: "/static/media/layout.8a437d55.svg"
		},
		{
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
			icon: "/static/media/file.5bd43cb8.svg"
		},
		{
			name: "//  P_1_1_2_01",
			code:
				'//  P_1_1_2_01\n// \n//  Generative Gestaltung – Creative Coding im Web\n//  ISBN: 978-3-87439-902-9, First Edition, Hermann Schmidt, Mainz, 2018\n//  Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni\n//  with contributions by Joey Lee and Niels Poldervaart\n//  Copyright 2018\n// \n//  http://www.generative-gestaltung.de\n// \n//  Licensed under the Apache License, Version 2.0 (the "License");\n//  you may not use this file except in compliance with the License.\n//  You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0\n//  Unless required by applicable law or agreed to in writing, software\n//  distributed under the License is distributed on an "AS IS" BASIS,\n//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n//  See the License for the specific language governing permissions and\n//  limitations under the License.',
			args: " ",
			x: 519.3803177441339,
			y: 101.86034058786188,
			editorWidth: 225,
			editorHeight: 175,
			iframeWidth: 0,
			iframeHeight: 0,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 683,
			isBlob: true,
			codeSize: 14,
			icon: "/static/media/globe.50d70b6d.svg"
		},
		{
			name: "/**",
			code:
				"/**\n * changing the color circle by moving the mouse.\n *\n * MOUSE\n * position x          : saturation\n * position y          : brighness\n *\n * KEYS\n * 1-5                 : number of segments\n * s                   : save png\n */\n'use strict';",
			args: " ",
			x: 806.3803177441339,
			y: 101.86034058786188,
			editorWidth: 225,
			editorHeight: 175,
			iframeWidth: 0,
			iframeHeight: 0,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 684,
			isBlob: true,
			codeSize: 14,
			icon: "/static/media/globe.50d70b6d.svg"
		},
		{
			name: "var segmentCoun...",
			code: "var segmentCount = 360;\nvar radius = 300;",
			args: " ",
			x: 1093.380317744134,
			y: 101.86034058786188,
			editorWidth: 225,
			editorHeight: 175,
			iframeWidth: 0,
			iframeHeight: 0,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 690,
			isBlob: true,
			codeSize: 14,
			icon: "/static/media/globe.50d70b6d.svg"
		},
		{
			name: "setup",
			code: "createCanvas(800, 800);\nnoStroke();\n",
			args: "",
			x: 519.3803177441339,
			y: 356.86034058786186,
			editorWidth: 225,
			editorHeight: 175,
			iframeWidth: 200,
			iframeHeight: 200,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 696,
			isBlob: false,
			codeSize: 14,
			icon: "/static/media/tool.d68b9b61.svg"
		},
		{
			name: "draw",
			code:
				"colorMode(HSB, 360, width, height);\nbackground(360, 0, height);\n\nvar angleStep = 360 / segmentCount;\n\nbeginShape(TRIANGLE_FAN);\nvertex(width / 2, height / 2);\n\nfor (var angle = 0; angle <= 360; angle += angleStep) {\n  var vx = width / 2 + cos(radians(angle)) * radius;\n  var vy = height / 2 + sin(radians(angle)) * radius;\n  vertex(vx, vy);\n  fill(angle, mouseX, mouseY);\n}\n\nendShape()",
			args: "",
			x: 909.8880051998624,
			y: 765.6699803386549,
			editorWidth: 591,
			editorHeight: 431,
			iframeWidth: 728.1444609817516,
			iframeHeight: 834.028495429784,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 698,
			isBlob: false,
			codeSize: 14,
			icon: "/static/media/tool.d68b9b61.svg"
		},
		{
			name: "keyPressed",
			code:
				"\n  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');\n\n  switch (key) {\n  case '1':\n    segmentCount = 360;\n    break;\n  case '2':\n    segmentCount = 45;\n    break;\n  case '3':\n    segmentCount = 24;\n    break;\n  case '4':\n    segmentCount = 12;\n    break;\n  case '5':\n    segmentCount = 6;\n    break;\n  }\n",
			args: "",
			x: 325.4722064658096,
			y: 750.4839485021749,
			editorWidth: 225,
			editorHeight: 175,
			iframeWidth: 339.052527166693,
			iframeHeight: 273.9912529877816,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 699,
			isBlob: false,
			codeSize: 14,
			icon: "/static/media/bell.86facacc.svg"
		}
	],
	scale: 1,
	console: {
		x: 700.0778726617857,
		y: 1240.2239882058916,
		consoleWidth: 244.781440843727,
		consoleHeight: 199.19044002384612,
		hidden: false,
		zIndex: -1
	},
	originX: 62.53976430926173,
	originY: -312.6699803386549,
	worldKey: "checkThis~Cameron",
	worldEdited: true,
	worldPublishTime: "Tue Feb 04 2020 16:23:25 GMT+0000 (Greenwich Mean Time)",
	snapToGrid: false,
	linesOn: false,
	js:
		"\n//  P_1_1_2_01\n// \n//  Generative Gestaltung – Creative Coding im Web\n//  ISBN: 978-3-87439-902-9, First Edition, Hermann Schmidt, Mainz, 2018\n//  Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni\n//  with contributions by Joey Lee and Niels Poldervaart\n//  Copyright 2018\n// \n//  http://www.generative-gestaltung.de\n// \n//  Licensed under the Apache License, Version 2.0 (the \"License\");\n//  you may not use this file except in compliance with the License.\n//  You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0\n//  Unless required by applicable law or agreed to in writing, software\n//  distributed under the License is distributed on an \"AS IS\" BASIS,\n//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n//  See the License for the specific language governing permissions and\n//  limitations under the License.\n\n\n\n/**\n * changing the color circle by moving the mouse.\n *\n * MOUSE\n * position x          : saturation\n * position y          : brighness\n *\n * KEYS\n * 1-5                 : number of segments\n * s                   : save png\n */\n'use strict';\n\n\n\nvar segmentCount = 360;\nvar radius = 300;\n\n\nfunction setup(){\n  createCanvas(800, 800);\n  noStroke();\n  \n}\n\nfunction draw(){\n  colorMode(HSB, 360, width, height);\n  background(360, 0, height);\n  \n  var angleStep = 360 / segmentCount;\n  \n  beginShape(TRIANGLE_FAN);\n  vertex(width / 2, height / 2);\n  \n  for (var angle = 0; angle <= 360; angle += angleStep) {\n    var vx = width / 2 + cos(radians(angle)) * radius;\n    var vy = height / 2 + sin(radians(angle)) * radius;\n    vertex(vx, vy);\n    fill(angle, mouseX, mouseY);\n  }\n  \n  endShape()\n}\n\nfunction keyPressed(){\n  \n    if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');\n  \n    switch (key) {\n    case '1':\n      segmentCount = 360;\n      break;\n    case '2':\n      segmentCount = 45;\n      break;\n    case '3':\n      segmentCount = 24;\n      break;\n    case '4':\n      segmentCount = 12;\n      break;\n    case '5':\n      segmentCount = 6;\n      break;\n    }\n  \n}\n"
};