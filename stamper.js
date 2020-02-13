/*
   ____    __    ____      ____    ______ ______           ____    ____    ____       
  /\  _\  _\ \ _/\__ \    /\  _`\ /\__  _/\  _  \  /'\_/`\/\  _`\ /\  _`\ /\  _`\     
  \ \ \/ /\_` ' \/_/\ \   \ \,\L\_\/_/\ \\ \ \L\ \/\      \ \ \L\ \ \ \L\_\ \ \L\ \   
   \ \ \ \/_>   <_ \ \ \   \/_\__ \  \ \ \\ \  __ \ \ \__\ \ \ ,__/\ \  _\L\ \ ,  /   
    \ \ \_ /\_, ,_\ \_\ \    /\ \L\ \ \ \ \\ \ \/\ \ \ \_/\ \ \ \/  \ \ \L\ \ \ \\ \  
     \ \___\/_/\_\/ /\___\   \ `\____\ \ \_\\ \_\ \_\ \_\\ \_\ \_\   \ \____/\ \_\ \_\
      \/___/  \/_/  \/___/    \/_____/  \/_/ \/_/\/_/\/_/ \/_/\/_/    \/___/  \/_/\/ /


Hello and welcome to your Stamper metadata file! 
This file keeps track of all of the info Stamper needs about your stamps. 

Don't worry, it won't affect your sketch if you run it on any other IDE.

Please DON'T MODIFY ANY OF THE INFORMATION BELOW or else your project may behave unexpectantly in Stamper.
However, if your project is acting strangely, delete this file and reopen your project. 
You'll lose your stamps' formatting but keep all of the code.

Happy Stamping :)

*/

{"stamps":[{"id":"dbh149831","name":"index.html","code":"<html>\n  <head>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/p5.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.dom.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.sound.min.js\"></script>\n    <link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">\n  </head>\n  <body>\n    <script src='sketch.js'></script>\n  </body>\n</html>\n","args":" ","x":1551.2140684066003,"y":526.1806151153287,"editorWidth":225,"editorHeight":176.29205282888586,"iframeWidth":200,"iframeHeight":200,"isIndex":true,"isTxtFile":false,"isMediaFile":false,"hidden":true,"exported":true,"zIndex":-1,"isBlob":false,"codeSize":14,"icon":"/static/media/layout.8a437d55.svg","lineHighLightingStatus":"none"},{"id":"n5o9s51y1","name":"style.css","code":"html, body {\n  margin: 0;\n  padding: 0;\n}","args":" ","x":1551.6900090741035,"y":889.4753177293393,"editorWidth":225,"editorHeight":175,"iframeWidth":0,"iframeHeight":0,"isIndex":false,"isTxtFile":true,"isMediaFile":false,"hidden":true,"exported":true,"zIndex":-1,"isBlob":false,"codeSize":14,"icon":"/static/media/file.5bd43cb8.svg","lineHighLightingStatus":"none"},{"id":"jqzhy64uo","name":"/* READ ME","code":"/* READ ME\n\n    Welcome to Stamper!\n    \n    What you have before you is a p5.js sketch formatted in artboard-like items called Stamps. \n    \n    You can think of these big Stamps titled \"setup\", \"draw\", and \"sizeDot\" as functions. They can call one another and use global variables.\n    \n    You can also import file and media Stamps in the bar above and use the console Stamp to debug your code.\n    \n    Anything in p5.js should work in Stamper. You can upload existing p5 sketches to Stamper or download this Sketch and open it up somewhere else. \n    \n    Happy stamping, we're excited to see what you make! \n    \n    - Maayan & Cam\n    \n*/","args":" ","x":702.0843016558624,"y":526.3886604608753,"editorWidth":224.2321933879481,"editorHeight":627.8573293703668,"iframeWidth":0,"iframeHeight":0,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":632,"isBlob":true,"codeSize":14,"icon":"/static/media/globe.50d70b6d.svg","lineHighLightingStatus":"none"},{"id":"xc14j2gdm","name":"var xPos = 0","code":"var xPos = 0\nvar maxSize = 20","args":" ","x":1025.2197591789836,"y":526.1831709984822,"editorWidth":120.72506930849877,"editorHeight":174.63795191901036,"iframeWidth":0,"iframeHeight":0,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":627,"isBlob":true,"codeSize":14,"icon":"/static/media/globe.50d70b6d.svg","lineHighLightingStatus":"none"},{"id":"svs2aryzl","name":"setup","code":"createCanvas(200, 200)\nbackground(175, 112, 248)\nnoStroke()","args":"","x":1216.6046212636682,"y":526.1050713082992,"editorWidth":187.33684948280245,"editorHeight":75.20212084900183,"iframeWidth":47.18718026609529,"iframeHeight":84.26214854159208,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":630,"isBlob":false,"codeSize":14,"icon":"/static/media/tool.d68b9b61.svg","lineHighLightingStatus":"none"},{"id":"0uusqsdvh","name":"sizeDot","code":"// generate a random size\nvar size = random(0, maxSize)\n\n// set the opacity\nvar opacity = map(size, \n    0, maxSize, \n    0, 255)\n\n// draw a dot   \nfill(255, opacity);\nellipse(x,y,size, size);\n\n","args":"x=mouseX, y=mouseY","x":1025.1123055679532,"y":789.7862113698332,"editorWidth":225,"editorHeight":175,"iframeWidth":200.4613444482518,"iframeHeight":199.7524142951453,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":579,"isBlob":false,"codeSize":14,"icon":"/static/media/box.310d8273.svg","lineHighLightingStatus":"none"},{"id":"pbndu2gtx","name":"draw","code":"// update xPos and background\nbackground(175, 112, 248, 10)\nxPos = (xPos +2) % width\n\n// draw a row of dots\nfor(var i = 0; \n    i < height/maxSize; \n    i++){\n      sizeDot(xPos, i*maxSize )\n}\n","args":"","x":1025.3740565788173,"y":1153.6991713934658,"editorWidth":225,"editorHeight":175,"iframeWidth":200,"iframeHeight":200,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":580,"isBlob":false,"codeSize":14,"icon":"/static/media/tool.d68b9b61.svg","lineHighLightingStatus":"none"}],"scale":0.7838764402270318,"console":{"x":700.0778726617857,"y":1240.2239882058916,"consoleWidth":244.781440843727,"consoleHeight":199.19044002384612,"hidden":true,"zIndex":-1},"originX":-257.2010372715673,"originY":-311.9703251082989,"worldEdited":false,"snapToGrid":false,"linesOn":false,"js":"\n/* READ ME\n\n    Welcome to Stamper!\n    \n    What you have before you is a p5.js sketch formatted in artboard-like items called Stamps. \n    \n    You can think of these big Stamps titled \"setup\", \"draw\", and \"sizeDot\" as functions. They can call one another and use global variables.\n    \n    You can also import file and media Stamps in the bar above and use the console Stamp to debug your code.\n    \n    Anything in p5.js should work in Stamper. You can upload existing p5 sketches to Stamper or download this Sketch and open it up somewhere else. \n    \n    Happy stamping, we're excited to see what you make! \n    \n    - Maayan & Cam\n    \n*/\n\n\n\nvar xPos = 0\nvar maxSize = 20\n\n\nfunction setup(){\n  createCanvas(200, 200)\n  background(175, 112, 248)\n  noStroke()\n}\n\nfunction sizeDot(x=mouseX, y=mouseY){\n  // generate a random size\n  var size = random(0, maxSize)\n  \n  // set the opacity\n  var opacity = map(size, \n      0, maxSize, \n      0, 255)\n  \n  // draw a dot   \n  fill(255, opacity);\n  ellipse(x,y,size, size);\n  \n  \n}\n\nfunction draw(){\n  // update xPos and background\n  background(175, 112, 248, 10)\n  xPos = (xPos +2) % width\n  \n  // draw a row of dots\n  for(var i = 0; \n      i < height/maxSize; \n      i++){\n        sizeDot(xPos, i*maxSize )\n  }\n  \n}\n","highlightedLines":{}}