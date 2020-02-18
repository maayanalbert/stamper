export default {
	stamps: [
		{
			id: "rfphskcb3",
			name: "index.html",
			code:
				'<html>\n  <head>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/p5.min.js"></script>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.dom.min.js"></script>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.sound.min.js"></script>\n    <link rel="stylesheet" type="text/css" href="style.css">\n    <script src=\'sketch.js\'></script>\n  </head>\n  <body>\n    <!--you can link to a local asset-->\n    <link href=\'Ailerons-Typeface.otf\' rel=\'stylesheet\'>\n    <!--or something from the web-->\n    <link href="https://fonts.googleapis.com/css?family=Alice&display=swap" rel="stylesheet">\n  </body>\n</html>\n',
			args: " ",
			x: 1180,
			y: 760,
			editorWidth: 772.5001968854585,
			editorHeight: 240.00000000000006,
			iframeWidth: 85.49980311454138,
			iframeHeight: 85.49980311454136,
			isIndex: true,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 772,
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
			id: "iqmq852qf",
			name: "renderText",
			code:
				"fill(255)\nnoStroke()\nbackground(0, 255, 255)\n\n// draw the text\ntextFont(fontName)\ntextSize(mouseX)  \ntext(fontName, mouseX, mouseY)\n\n",
			args: 'fontName="Helvetica"',
			x: 920,
			y: 1360,
			editorWidth: 238,
			editorHeight: 199.99999999999997,
			iframeWidth: 400,
			iframeHeight: 200,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 776,
			isBlob: false,
			codeSize: 14,
			icon: "/static/media/box.310d8273.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "f8yltudev",
			name: "setup",
			code: "createCanvas(400,200)",
			args: "",
			x: 850.7359382869682,
			y: 607.6212379226394,
			editorWidth: 165.21216098619152,
			editorHeight: 54.276078548618784,
			iframeWidth: 60,
			iframeHeight: 60,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: true,
			exported: true,
			zIndex: 744,
			isBlob: false,
			codeSize: 14,
			icon: "/static/media/tool.d68b9b61.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "5q5jidcg7",
			name: "Ailerons-Typeface.otf",
			code:
				"data:application/octet-stream;base64,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yAt2ngoLlZWXHwt1+X0B9z/3lgMLnKAfC7K7GgucnKALBqKVCxWjVwWCkJWACweWsgoOBqKWlZQLgZV/HlkLsQofC4GBgB9wC/iTB6CcC4cKQwuilZYLBn+BCwAB9AAAAjAAjQIwAIoCMACKAjAAigIwAIoCWAC+AlgAwAJYAMACWAC6AlgA2wJYANsCWADbAlgA2wJYANgCWAC+AlgAtQH0ANYB9ADWAfQAowH0AK4CJgCNAlgAzgImANMCbACZAlgAuQJYALkCWAC4AlgAuAJYALgCWAC4AlgAuAJYANECWACnAlgAvQJYAL0CJgCFAlgAuQJYALkCWAC5AlgAuQJIAJUCbABtAlgAlwImAJkCWACAAjAAigIwAIoCMACKAjAAigIwAIoCWAC+AlgAwAJYAMACWAC6AlgA2wJYANsCWADbAlgA2wJYANgCWAC+AlgAtQH0ANYB9ADWAfQAowH0AK4CJgCNAlgAzgImANMCbACZAlgAuQJYALkCWAC4AlgAuAJYALgCWAC4AlgAuAJYANECWACnAlgAvQJYAL0CJgCFAlgAuQJYALkCWAC5AlgAuQJIAJUCbABtAlgAlwImAJkCWACAAlgAvgIwAL4CWAC4AlgAtAJYAJMCWADBAlgAvgJIAKECWAC9AlgAvgJYAAACWACrAfQApAH0AKQB9ACkAfQApAH0AKQB9ACkAlgAmQH0AKQCWAC5AlgAwwH0ALoB9ACwAlgBBwJYAKsCWACcAfQA1gH0AJAB9ADWAfQAkAH0AIMBmgCMAfQAsAH0ALoCRACwAfMAsAH0ALAB9ACwAlgAAAJYAL4CWAC3AlgAkgJYAJcCWACpAlgAlgJYAKkCWAAcAlgAogSSAIUCWAEQARQA2QDfANcAAQAAAAAAAAAAAAA=",
			args: " ",
			x: 920,
			y: 760,
			editorWidth: 0,
			editorHeight: 200,
			iframeWidth: 200,
			iframeHeight: 200,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: true,
			hidden: false,
			exported: true,
			zIndex: 770,
			isBlob: false,
			codeSize: 14,
			icon: "/static/media/image.117a6d3e.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "zw8v5lh7a",
			name: "drawAliceText",
			code: 'renderText("Alice")\n',
			args: "",
			x: 1620,
			y: 1360,
			editorWidth: 158.27483783492426,
			editorHeight: 200,
			iframeWidth: 400,
			iframeHeight: 200,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 779,
			isBlob: false,
			codeSize: 14,
			icon: "/static/media/box.310d8273.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "27ba2zibu",
			name: "drawAileronText",
			code: 'renderText("Ailerons")\n\n',
			args: "",
			x: 2240,
			y: 1360,
			editorWidth: 178,
			editorHeight: 200,
			iframeWidth: 400,
			iframeHeight: 200,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 781,
			isBlob: false,
			codeSize: 14,
			icon: "/static/media/box.310d8273.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "pqor7uc01",
			name: "// HOW TO: Edit...",
			code: "// HOW TO: Editing the Index",
			args: " ",
			x: 840,
			y: 300,
			editorWidth: 457.99999999999994,
			editorHeight: 39.99999999999994,
			iframeWidth: 0,
			iframeHeight: 0,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 765,
			isBlob: true,
			codeSize: 28,
			icon: "/static/media/globe.50d70b6d.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "hnzi0mggu",
			name: "// Part 1: Simi...",
			code:
				"// Part 1: Similarly to normal p5 sketches, every Stamper project comes with an 'index.html' that you can use to import fonts, libraries, and packages.",
			args: " ",
			x: 920,
			y: 440,
			editorWidth: 718,
			editorHeight: 40.00000000000009,
			iframeWidth: 0,
			iframeHeight: 0,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 768,
			isBlob: true,
			codeSize: 14,
			icon: "/static/media/globe.50d70b6d.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "drrvy5lrd",
			name: "// Part 2: Here...",
			code:
				"// Part 2: Here, we're importing two typefaces, 'Ailerons' using a local .otf file and 'Alice' using. a link to Google Sheets.",
			args: " ",
			x: 920,
			y: 640,
			editorWidth: 957.9999999999999,
			editorHeight: 19.99999999999998,
			iframeWidth: 0,
			iframeHeight: 0,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 771,
			isBlob: true,
			codeSize: 14,
			icon: "/static/media/globe.50d70b6d.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "r2f9klcqw",
			name: "// Part 3: Let'...",
			code:
				"// Part 3: Let's use this helper function 'renderText' to draw the two different types of fonts.",
			args: " ",
			x: 920,
			y: 1240,
			editorWidth: 952.4498992459897,
			editorHeight: 20.000000000000092,
			iframeWidth: 0,
			iframeHeight: 0,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 773,
			isBlob: true,
			codeSize: 14,
			icon: "/static/media/globe.50d70b6d.svg",
			lineHighLightingStatus: "none"
		},
		{
			id: "5ayqsz82j",
			name: "// Notice how t...",
			code:
				"// Notice how this sketch doesn't have a 'draw' function. That's alright, it just means that we'll have to add a 'draw' if we want something to show up when we run this on other IDE's.",
			args: " ",
			x: 2880,
			y: 1360,
			editorWidth: 257.99999999999994,
			editorHeight: 99.99999999999994,
			iframeWidth: 0,
			iframeHeight: 0,
			isIndex: false,
			isTxtFile: false,
			isMediaFile: false,
			hidden: false,
			exported: true,
			zIndex: 782,
			isBlob: true,
			codeSize: 14,
			icon: "/static/media/globe.50d70b6d.svg",
			lineHighLightingStatus: "none"
		}
	],
	scale: 0.5112116286158555,
	originX: -199.95261967891247,
	originY: -45.20348068688952,
	worldKey: "HOW_TO:_Editing_the_Index",
	worldEdited: false,
	snapToGrid: false,
	linesOn: false,
	js:
		"function renderText(fontName=\"Helvetica\"){\n  fill(255)\n  noStroke()\n  background(0, 255, 255)\n  \n  // draw the text\n  textFont(fontName)\n  textSize(mouseX)  \n  text(fontName, mouseX, mouseY)\n  \n  \n}\n\nfunction setup(){\n  createCanvas(400,200)\n}\n\nfunction drawAliceText(){\n  renderText(\"Alice\")\n  \n}\n\nfunction drawAileronText(){\n  renderText(\"Ailerons\")\n  \n  \n}\n\n\n// HOW TO: Editing the Index\n\n\n\n// Part 1: Similarly to normal p5 sketches, every Stamper project comes with an 'index.html' that you can use to import fonts, libraries, and packages.\n\n\n\n// Part 2: Here, we're importing two typefaces, 'Ailerons' using a local .otf file and 'Alice' using. a link to Google Sheets.\n\n\n\n// Part 3: Let's use this helper function 'renderText' to draw the two different types of fonts.\n\n\n\n// Notice how this sketch doesn't have a 'draw' function. That's alright, it just means that we'll have to add a 'draw' if we want something to show up when we run this on other IDE's.\n\n",
	highlightedLines: {}
};
