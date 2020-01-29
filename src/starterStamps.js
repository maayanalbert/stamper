import pf, { globals, p5Lib } from "./globals.js";

var asciiArt = "   ____    __    ____      ____    ______ ______           ____    ____    ____       \n  /\\  _\\  _\\ \\ _/\\__ \\    /\\  _`\\ /\\__  _/\\  _  \\  /'\\_/`\\/\\  _`\\ /\\  _`\\ /\\  _`\\     \n  \\ \\ \\/ /\\_` ' \\/_/\\ \\   \\ \\,\\L\\_\\/_/\\ \\\\ \\ \\L\\ \\/\\      \\ \\ \\L\\ \\ \\ \\L\\_\\ \\ \\L\\ \\   \n   \\ \\ \\ \\/_>   <_ \\ \\ \\   \\/_\\__ \\  \\ \\ \\\\ \\  __ \\ \\ \\__\\ \\ \\ ,__/\\ \\  _\\L\\ \\ ,  /   \n    \\ \\ \\_ /\\_, ,_\\ \\_\\ \\    /\\ \\L\\ \\ \\ \\ \\\\ \\ \\/\\ \\ \\ \\_/\\ \\ \\ \\/  \\ \\ \\L\\ \\ \\ \\\\ \\  \n     \\ \\___\\/_/\\_\\/ /\\___\\   \\ `\\____\\ \\ \\_\\\\ \\_\\ \\_\\ \\_\\\\ \\_\\ \\_\\   \\ \\____/\\ \\_\\ \\_\\\n      \\/___/  \\/_/  \\/___/    \\/_____/  \\/_/ \\/_/\\/_/\\/_/ \\/_/\\/_/    \\/___/  \\/_/\\/ /"

export const stamperHeader = 
`/*
${asciiArt}


Hello and welcome to your Stamper metadata file! 
This file keeps track of all of the info Stamper needs about your stamps. 

Don't worry, it won't affect your sketch if you run it on any other IDE.

Please DON'T MODIFY ANY OF THE INFORMATION BELOW or else your project may behave unexpectantly in Stamper.
However, if your project is acting strangely, delete this file and reopen your project. 
You'll lose your stamps' formatting but keep all of the code.

Happy Stamping :)

*/

`

export const builtInFns = [
  {
    name: "draw",
    args: "",
    code: `colorMode(RGB, 255, 255, 255, 1);
background(0, 0, 0, .01);
stroke(255);
strokeWeight(1)

if (mouseIsPressed) {
  line(mouseX, mouseY, pmouseX, pmouseY);
}`
  },
  {
    name: "setup",
    args: "",
    code: `createCanvas(${globals.defaultIframeWidth},${globals.defaultEditorHeight})
background(100);`
  },
  { name: "preload", args: "", code: "" }
];

var keyPressCode =
`fill("black")
textSize(50);

// display last key pressed.
text(key + ' ' + keyCode, 20, 70);`

var mousePressCode =
`fill('black')

// display last clicked location
text(mouseX + ', ' + mouseY, mouseX + 10, mouseY - 10)
rectMode(CENTER)
rect(mouseX, mouseY, 1, 20)
rect(mouseX, mouseY, 20, 1)`

export const listenerFns = [
  {
    name: "keyPressed",
    args: "",
    code: `background('yellow')\n` +keyPressCode
  },
   {
    name: "keyReleased",
    args: "",
    code: `background('springgreen')\n`  + keyPressCode
  },
   {
    name: "keyTyped",
    args: "",
    code: `background('cyan')\n`  + keyPressCode
  },
  {},
  {
    name: "mousePressed",
    args: "",
    code: `background('yellow')\n` +mousePressCode
  },
  {
    name: "mouseReleased",
    args: "",
    code: `background('springgreen')\n`  + mousePressCode
  },
  {
    name: "mouseClicked",
    args: "",
    code: `background('cyan')\n`  + mousePressCode
  },
    {
    name: "doubleClicked",
    args: "",
    code: `background('cyan')\n`  + mousePressCode
  },
    {},
  {
    name: "mouseMoved",
    args: "",
    code: `background(0, 10)
strokeWeight(0)
fill(255)
size = 2*random(0, width)/3
ellipse(width/2,height/2,size, size)`
  },

   {
    name: "mouseDragged",
    args: "",
    code: `background(0, 10)
strokeWeight(0)
fill(255)
size = 2*random(0, width)/3
ellipse(width/2,height/2,size, size)`
  },
  {},
  {
    name: "mouseWheel",
    args: "",
    code: `background('yellow')
strokeWeight(1)
stroke("black")
var y = random(0, height)
line(0, y, width, y)`
  }
];

export const normalFn = {
  name: "blueCircle",
  args: "posX=mouseX, posY=mouseY",
  code: 
 `strokeWeight(1)
stroke("black")
fill('lightblue')
ellipse(posX, posY, 30, 30)`
};

export const starterBlobs = [
{
  name:"global variable", data:
{ code: "var global1 = 1", isBlob:true }
}
,{
  name:"comment", data:
{
  code: `/*\n  comment here\n*/`,
  codeSize: globals.bigCodeSize,
  isBlob:true
}},
{
  name:"class", data:
{ code: `class Jitter {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.diameter = random(10, 30);
    this.speed = 1;
  }

  move() {
    this.x += random(-this.speed, this.speed);
    this.y += random(-this.speed, this.speed);
  }

  display() {
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}`, isBlob:true }
}]

export const sampleFile = {
  name: "sample.js",
  code: "// put some code to import into your js in here",
  isTxtFile:true
};

export const varBlob = { code: "var global1 = 1", isBlob:true };

export default function DefaultExportPlaceholder() {
  return null;
}

export const empty = {"stamps":[{"name":"style.css","code":"\nhtml, body {\n  margin: 0;\n  padding: 0;\n}","args":" ","x":268.53419986245996,"y":177.7984650004281,"editorWidth":225,"editorHeight":175,"iframeWidth":0,"iframeHeight":0,"isIndex":false,"isTxtFile":true,"isMediaFile":false,"hidden":true,"exported":true,"zIndex":642,"isBlob":false,"codeSize":14},{"name":"index.html","code":"<html>\n  <head>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/p5.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.dom.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.sound.min.js\"></script>\n    <link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">\n  </head>\n  <body>\n    <script src='sketch.js'></script>\n  </body>\n</html>\n","args":" ","x":309.13872819066705,"y":148.12237211435783,"editorWidth":225,"editorHeight":175,"iframeWidth":200,"iframeHeight":200,"isIndex":true,"isTxtFile":false,"isMediaFile":false,"hidden":true,"exported":true,"zIndex":641,"isBlob":false,"codeSize":14}],"scale":1,"console":{"x":303.0271580940204,"y":206.71662152101146,"consoleWidth":225,"consoleHeight":200,"hidden":true,"zIndex":640},"originX":0,"originY":0,"worldKey":null,"worldEdited":true,"worldPublishTime":null,"compressedJs":""}


var starter2 = {"stamps":[{"name":"index.html","code":"<html>\n  <head>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/p5.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.dom.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.sound.min.js\"></script>\n    <link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">\n  </head>\n  <body>\n    <script src='sketch.js'></script>\n  </body>\n</html>\n","args":" ","x":1551.2140684066003,"y":526.1806151153287,"editorWidth":225,"editorHeight":176.29205282888586,"iframeWidth":200,"iframeHeight":200,"isIndex":true,"isTxtFile":false,"isMediaFile":false,"hidden":true,"exported":true,"zIndex":-1,"isBlob":false,"codeSize":14},{"name":"style.css","code":"html, body {\n  margin: 0;\n  padding: 0;\n}","args":" ","x":1551.6900090741035,"y":889.4753177293393,"editorWidth":225,"editorHeight":175,"iframeWidth":0,"iframeHeight":0,"isIndex":false,"isTxtFile":true,"isMediaFile":false,"hidden":true,"exported":true,"zIndex":-1,"isBlob":false,"codeSize":14},{"name":"","code":"/* READ ME\n\n    Welcome to Stamper!\n    \n    What you have before you is a p5.js sketch formatted in artboard-like items called Stamps. \n    \n    You can think of these big Stamps titled \"setup\", \"draw\", and \"sizeDot\" as functions. They can call one another and use global variables.\n    \n    You can also import file and media Stamps in the bar above and use the console Stamp to debug your code.\n    \n    Anything in p5.js should work in Stamper. You can upload existing p5 sketches to Stamper or download this Sketch and open it up somewhere else. \n    \n    Happy stamping, we're excited to see what you make! \n    \n    - Maayan & Cam\n    \n*/","args":" ","x":702.0843016558624,"y":526.3886604608753,"editorWidth":224.2321933879481,"editorHeight":627.8573293703668,"iframeWidth":0,"iframeHeight":0,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":632,"isBlob":true,"codeSize":14},{"name":"","code":"var xPos = 0\nvar maxSize = 20","args":" ","x":1025.2197591789836,"y":526.1831709984822,"editorWidth":120.72506930849877,"editorHeight":174.63795191901036,"iframeWidth":0,"iframeHeight":0,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":627,"isBlob":true,"codeSize":14},{"name":"setup","code":"createCanvas(200, 200)\nbackground(175, 112, 248)\nnoStroke()","args":"","x":1216.6046212636682,"y":526.1050713082992,"editorWidth":187.33684948280245,"editorHeight":75.20212084900183,"iframeWidth":47.18718026609529,"iframeHeight":84.26214854159208,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":630,"isBlob":false,"codeSize":14},{"name":"sizeDot","code":"// generate a random size\nvar size = random(0, maxSize)\n\n// set the opacity\nvar opacity = map(size, \n    0, maxSize, \n    0, 255)\n\n// draw a dot   \nfill(255, opacity);\nellipse(x,y,size, size);\n\n","args":"x=mouseX, y=mouseY","x":1025.1123055679532,"y":789.7862113698332,"editorWidth":225,"editorHeight":175,"iframeWidth":200.4613444482518,"iframeHeight":199.7524142951453,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":579,"isBlob":false,"codeSize":14},{"name":"draw","code":"// update xPos and background\nbackground(175, 112, 248, 10)\nxPos = (xPos +2) % width\n\n// draw a row of dots\nfor(var i = 0; \n    i < height/maxSize; \n    i++){\n      sizeDot(xPos, i*maxSize )\n}\n","args":"","x":1025.3740565788173,"y":1153.6991713934658,"editorWidth":225,"editorHeight":175,"iframeWidth":200,"iframeHeight":200,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":580,"isBlob":false,"codeSize":14}],"scale":0.7838764402270318,"console":{"x":700.0778726617857,"y":1240.2239882058916,"consoleWidth":244.781440843727,"consoleHeight":199.19044002384612,"hidden":true,"zIndex":-1},"originX":-257.2010372715673,"originY":-311.9703251082989,"worldName":null,"worldAuthor":null,"worldKey":null,"worldPublishTime":null,"compressedJs":"ԗ䪈ੈ吔ℂ㔔ᐔ†တᗙⶌ㛶欩Ǒ幀却ザ尙⹄᱑䘰疡䋨⁹㞺䠚మ晒̓ᖙ廤旅࠴峈త܃⥳⧌䃦步㨱娈್眦欋凑䫈⁩㜐ᡜ二⛶ஓႵ壒步ဴ崙ⶮ㈆ᬋㆱ䫉䙥㦗㆘ᢠ喖箩ƍ䋜⁴㐴定損癢Σ↕曊⁢㒳燋␎䚗☡沉曊瑵㠑ଈь䜦ஹࢰ䃂滄઴庙⢍睂ᄃ׌䃌畮ㆺᩛ淎㋢ʣ↕玊埄㰐ᯛ䲤ؖ獻冡䫥䔶㪹奈೭䛶ጋめ泂物ケᬙ⹥漠қֱ曞⁩㚸ᯜ亄٦䭦ᄑ䡀浥㈴塺\u0013㚞 憔䃄慲ူ墛滘戬⋶ၙ䛞湳㞶ᥱ䖜䀖ጣᖉ櫏搁₹࠘淬䙜宒ֹ珈Ā㏢ᑹ怫چ箫㆐䃮潲㗢ձ⢌圢睈ɱ櫠汯ゲ࠙⼍᜷☡旀毎Ƌ㊹竀㦤۷ᄃᆽ滝䔬㨴ᩜ搊㱒⼨ʡ廠敮ဴ崈ຮȇ᭻㖕滐敲㊐ᥛ๬廀೺ↅ惠礠㧢Ꮪⷌ狂λᒟࡌ硣㓲{⺍爇ᬫᒁ濐ȩ㚰嫙␹㏢椂㖅䋲慮ဓࠐ氭屡䅑㰨ᐔ੶スࠞ਍眲ǩÃਚ浡㰩婞䲤ϒƑ䀨ᐕ栁昐㥀㻅ʗ塑䛤敡㨲僘ⷎ昗᥁䣀恘′᠘ੂ䐄ئଛ⶝擞畮㈔్暥䈃উ䢰䁤㐸戎ᮛ橮䜦筛ᒠ刔緌⯳ԏϖ死嗍䪰Ⱐ㳣ʖ㢭㋲礃ᶕ峊牡㨲䠘␎☖猣㶷੨ਠ爁ೱⅤϜ㣉⃀姐¿戹㆏湬坎⠐ᦽ惂捩㨼燎ᣡ戃椃㖅恑䑆ᙢఱ9⑜悙䣔殔哤ż䠘␌䛷✰օ䳒汬ᐙ്▙ւ䧘⢀䃊汬㒸᳙┏ˇ䥦ᦋࠍ䔛戁笀⃘䔞《炼幀異㉲;粠᥮‑Ψʭ笁㆖ࠌ㲠ᠼ⦱璀冊ࠫᤔ䠉␎皖⎣⏀Ÿ牯㯲ùⲍ睇ἠ̅廤⣤婹@玾䀇嶤䁸⁨㊴姚຅繰࢖⡬噗攀埣z‸唆箙め剕䜮ၲ$⾸䞧桐耂老"}
var particles = {"stamps":[{"name":"style.css","code":"\nhtml, body {\n  margin: 0;\n  padding: 0;\n}","args":" ","x":2487.723154997192,"y":454.1828386163433,"editorWidth":155.2851590781397,"editorHeight":108.88644457518404,"iframeWidth":0,"iframeHeight":0,"isIndex":false,"isTxtFile":true,"isMediaFile":false,"hidden":true,"exported":true,"zIndex":-1,"isBlob":false,"codeSize":14},{"name":"index.html","code":"<html>\n  <head>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/p5.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.dom.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.sound.min.js\"></script>\n    <link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">\n  </head>\n  <body>\n    <script src='sketch.js'></script>\n  </body>\n</html>\n","args":" ","x":2926.0613195853425,"y":460.660255253893,"editorWidth":331.9915568373324,"editorHeight":267.30348833629085,"iframeWidth":225,"iframeHeight":200,"isIndex":true,"isTxtFile":false,"isMediaFile":false,"hidden":true,"exported":true,"zIndex":-1,"isBlob":false,"codeSize":14},{"name":"setup","code":"// nothing much to see here\ncreateCanvas(300,300) // this won't alter the window size\nbackground(backgroundFade)\nnoStroke()","args":"","x":1922.4727804881593,"y":-28.839556505847952,"editorWidth":300,"editorHeight":95.77622017221594,"iframeWidth":229.2823664771775,"iframeHeight":125.05858664939339,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":true,"exported":true,"zIndex":-1,"isBlob":false,"codeSize":14},{"name":"basicDot","code":"fill(255);\nellipse(x, y, 10, 10)","args":"x=mouseX, y=mouseY","x":-59.00091994708015,"y":619.609814794894,"editorWidth":181.2419711791158,"editorHeight":111.52588114745845,"iframeWidth":134.907702273812,"iframeHeight":130.38322448430927,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":101,"isBlob":false,"codeSize":14},{"name":"speedColorDot","code":"if(!speed){\n  speed = random(0, .01)\n}\n\n// set the opacity and color based on the speed the dots are moving\nvar opacity = max(100, speed *100 * 255)\nvar colorOff = speed *100\nfill(150 - colorOff*40, 100+ colorOff*80, 255, opacity);\nellipse(x,y,5, 5);\n","args":"x = mouseX, y=mouseY","x":329.9599253794122,"y":976.0473944121347,"editorWidth":296.7340422149467,"editorHeight":176.59932474664424,"iframeWidth":169.71609003165736,"iframeHeight":195.90489555790055,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":102,"isBlob":false,"codeSize":14},{"name":"getPosition","code":"\n if(angle === 0){\n  lastFaderX = faderX\n  faderX = faderX*.97 + .03* mouseX / width;\n  speed = abs(faderX - lastFaderX)\n  randomSeed(actRandomSeed); \n }\n var randomX = random(0,width);\n  var randomY = random(0,height);\n  var circleX = width / 2 + cos(angle) * 100;\n  var circleY = height / 2 + sin(angle) * 100;\n  var x = lerp(randomX,circleX,faderX);\n  var y = lerp(randomY,circleY,faderX);\n  if(mouseIsPressed){\n     background(backgroundFade, 10)\n  var angle = map(mouseX, 0, width, 0,7)\n  var circleX = width / 2 + cos(angle) * 100;\n  var circleY = height / 2 + sin(angle) * 100;\n  basicDot(circleX, circleY) \n  }\n\n  \n  return {x:x, y:y}\n  ","args":"angle","x":1307.5816569518977,"y":677.5063472275517,"editorWidth":379.21463817319534,"editorHeight":376.8484971084752,"iframeWidth":289.3981629416132,"iframeHeight":292.2735384641079,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":103,"isBlob":false,"codeSize":14},{"name":"drawFadedParticles","code":"background(backgroundFade, 20);\n\nfor (var i = 0; i < count; i++) {\n  var angle = i*360/count\n  \n  // mix and match dot functions here!\n  pos = getPosition(angle)\n  basicDot(pos.x, pos.y)\n}","args":"","x":655.2944910006604,"y":-49.9258150353464,"editorWidth":309.7943589626219,"editorHeight":146.47663811577075,"iframeWidth":297.3456070084918,"iframeHeight":298.4895813984271,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":104,"isBlob":false,"codeSize":14},{"name":"speedDot","code":"\nif(!speed){\n  speed = random(0, .01)\n}\n\n// set the opacity based on the speed the dots are moving\nvar opacity = max(100, speed *100 * 255)\nfill(150, 100, 255,opacity);\nellipse(x,y,10, 10);\n\n","args":"x = mouseX, y=mouseY","x":-159.95756973196586,"y":906.1192916260952,"editorWidth":308.7544796011597,"editorHeight":185.16405770099925,"iframeWidth":116.75259491582909,"iframeHeight":204.18278884948927,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":105,"isBlob":false,"codeSize":14},{"name":"sizeDot","code":"// generate a random size\nnoStroke()\nvar size = random(0, 10)\n\n// use it to draw the dot\nfill(86,186,255, size*.1 *255);\nellipse(x,y,size, size);","args":"x = mouseX, y=mouseY","x":327.8196574329079,"y":620.3268102451857,"editorWidth":199.66994116856335,"editorHeight":179.9979040763115,"iframeWidth":91.90910563176772,"iframeHeight":206.14265666314918,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":106,"isBlob":false,"codeSize":14},{"name":"drawParticles","code":"\nbackground(40);\n\nfor (var i = 0; i < count; i++) {\n  var angle = i*360/count\n  pos = getPosition(angle)\n  \n  // mix and match dot functions here!\n  sizeDot(pos.x, pos.y)\n  speedColorDot(pos.x, pos.y)\n}","args":"","x":-6.737551201596916,"y":-46.19936428968789,"editorWidth":300,"editorHeight":193.4799063003186,"iframeWidth":308.1860599190181,"iframeHeight":294.830608250465,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":133,"isBlob":false,"codeSize":14},{"name":"","code":"// the particle pattern","args":" ","x":-101.36309304052276,"y":-164.3449970916704,"editorWidth":561.388125203422,"editorHeight":39.624291076671355,"iframeWidth":0,"iframeHeight":0,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":123,"isBlob":true,"codeSize":28},{"name":"","code":"// different types of dots, mouse over the canvases to see them","args":" ","x":-389.8061630364864,"y":495.0560125150731,"editorWidth":959.3106635538155,"editorHeight":49.88002660116602,"iframeWidth":0,"iframeHeight":0,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":124,"isBlob":true,"codeSize":28},{"name":"","code":"// a helper function to get the particle pattern, mouse over the canvas while pressing your mouse down to visualize what it does","args":" ","x":967.2439576737161,"y":522.8690319916844,"editorWidth":955.2083693440158,"editorHeight":62.18690923055951,"iframeWidth":0,"iframeHeight":0,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":125,"isBlob":true,"codeSize":28},{"name":"","code":"// globals\n\nvar actRandomSeed = 0;\nvar count = 300;\nvar faderX = 0\nvar backgroundFade = 40\nvar lastFaderX\nvar speed\nvar angleUnit = (360 / count);","args":" ","x":1662.564205981018,"y":-101.65610389740152,"editorWidth":190.13049921671842,"editorHeight":183.20458841959572,"iframeWidth":0,"iframeHeight":0,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":true,"exported":true,"zIndex":-1,"isBlob":true,"codeSize":14},{"name":"","code":"// setup stuff","args":" ","x":1929.8952193556572,"y":-153.45214631512889,"editorWidth":341.91538497923824,"editorHeight":35.52199686687362,"iframeWidth":0,"iframeHeight":0,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":true,"exported":true,"zIndex":-1,"isBlob":true,"codeSize":28}],"scale":0.40940849184989847,"console":{"x":2406.431838044327,"y":726.7041236433164,"consoleWidth":398.5547609288658,"consoleHeight":312.41625580738497,"hidden":true,"zIndex":-1},"originX":450.0090809071319,"originY":189.64858810122308,"worldName":null,"worldAuthor":null,"worldKey":null,"worldPublishTime":null,"compressedJs":"㌺官溍ᛶ焃䶕棪瀨ᒽ䊈Ѕ狲ͳ㷑僒湧ံ嵘洄݆礃䶕䩀桥㤲䊈Ќ㜦⬋冕ۂ湶ス䨌昆˃ᦁ䂧ࡨ瑨㒹䠝淭扷℃ֱ棊爠㨴᥈໭ᛦ⍻岁曒竄ḱᡘ浬眦箫㦐冔୆ゲ᥊⅄Ȇ獺䷑擞步ᐔ䊟⅁⺐Ӌঅ曒捄㞺ਞޭ囷⮛ᕠ塀秆Ԭ祀ᗌ暖捡⃈橪⤻Ԑ࠙ⶍ䚗Λᒡ灘⁹ᘐౌᢀ䳤箛䆕䫈䍯㘷岱⪄ϒڪ妥䱐⇅ᗢ䎈ᣆ爃椃䦅峈潭ᐘଈ׆̞ 姴ᑀ⃦᳙⺜倏᭻䆅䛒瑹ူ宙Ќ㱆传̍䫈⁯㝢䟱䥘䂦⍻凌䃂牥ံ寝䴭晰儁Ǚ䋥䤿Ẑ᭘⼅̓Ɓ㌜晔㄰᠐ઈᲀຼ㥞ᕹỌ映ụ䣺\"㌓⦁·ቆ⨴犀䌌չ℣䆁㌑ᩙ䡲瞀偞▆勂ܰ՛娂䅧㊺ᐛ湭᱀慃ֹ付日㤀⒭ᙬらô空‰抋䠈ඌ᜷✠މ撰‽ဳㅂ㢣ౠ幈储屲㜠ᖐ஌٥⹰ಉ¼䃮楤㨴㤀ွ‘̋ৌ冎㬭斮㤀≄๰೪䶕䫈⡡ㆺᒲ⇅Ꮎ⠅ΐ͗攁ᱣ਱ྸ悢䆁㌕埊í昑噳ѭٖ䬻⇓ᙈ捩㤱嬙㢈籓焁㲀摁搁〹秀⌄ʮ​䭀憈哆◣䱜洽\u0014亁䞐Լ汥㤸ਹ怖ዌ㮑㎘ȅ欀䗲祥▜㥒朸哒昨犀園⹪ܦ⮛侤ֺ⃻Ǎ㦀桙ڎ㠏嫂烆▬ଈ؅习ࠆဨ澔⯿㿀⏟瀑睈ၗ໌Ⳉᾔ祀㵝9㘸ᗉ䫨畲㜐Ởݜ䁁䇓朐㷞˖㈹ᡝ粀໶⊃׉棒捬㊹禁↟】䆑䎘غ†㌷岈Ԝ䀌⍉ô䁠㬠㒐༈౭睖玡沁剖⬩ၢቻ䀨ڒ写壀徊⓪S䯋損嚗䜨ს嫂瑣㑲Ĉ␝\n᎟ᐖC䔩㠷峈޾〸佰ѭ惞献㰖ㄋ●᱁寯䠔ᇺԃ羂䆿悠満☿簓秾Ӽ笂㼺๐⚗᠓௰ӄ玃ù怵Ỡࠓ◩䯺āភ䠙沭晗ጋ冔䃃最穴Ʋ嵠櫞々漐㇚Ě猁䷱䣮圶⤃◓䠎䧤Ĵ㨀‽\f凁墰扰㘬犂挱ࣥ⋣ँ⯈ඤ礬戎熈攧㼐ᗷ㰊珜ʼ᩿䂫ῠ⫎栕㏴ӽ缂擷䂲㴀ᠿ\u0015⾜ӕ椇叨࠹⁙ギ⡃冔䃡最粐ᰘ⺎䙗፰⬘㛈楦㌲岙ⷎ䈇⏋䆕晀潦犁ᵋ᳀Ểͻ宜ᅄ揥ѥᥜ紁๷⍃ᖷຆ愠㐲嬜ಮ⺐צ႑俎ˡ栻痖␎皆両ថૣ搉⤼寝⹘犦⍻引⓬楳㪰嬹Hݶ䌋厐ђ摯㊹秀ႌ盆笓ֱ昔૥É笁嫜倜ب徔̸‽မ礁⏸䄞䠺瓃ਟ渄崐཈ژ憎债̔ῊŴ挴㤀㨪囦丢咠晬〠៣ᤊ❼瀉㜨⢸䃦瑵㌳ʂ䀀耀"}
var starter1 = {"stamps":[{"name":"index.html","code":"<html>\n  <head>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/p5.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.dom.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.sound.min.js\"></script>\n    <link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">\n  </head>\n  <body>\n    <script src='sketch.js'></script>\n  </body>\n</html>\n","args":" ","x":1551.2140684066003,"y":526.1806151153287,"editorWidth":225,"editorHeight":176.29205282888586,"iframeWidth":200,"iframeHeight":200,"isIndex":true,"isTxtFile":false,"isMediaFile":false,"hidden":true,"exported":true,"zIndex":-1,"isBlob":false,"codeSize":14},{"name":"style.css","code":"html, body {\n  margin: 0;\n  padding: 0;\n}","args":" ","x":1551.6900090741035,"y":889.4753177293393,"editorWidth":225,"editorHeight":175,"iframeWidth":0,"iframeHeight":0,"isIndex":false,"isTxtFile":true,"isMediaFile":false,"hidden":true,"exported":true,"zIndex":-1,"isBlob":false,"codeSize":14},{"name":"","code":"/* READ ME\n\n    Welcome to Stamper!\n    \n    What you have before you is a p5.js sketch formatted in artboard-like items called Stamps. \n    \n    You can think of these big Stamps titled \"setup\", \"draw\", and \"sizeDot\" as functions. They can call one another and use global variables.\n    \n    You can also import file and media Stamps in the bar above and use the console Stamp to debug your code.\n    \n    Anything in p5.js should work in Stamper. You can upload existing p5 sketches to Stamper or download this Sketch and open it up somewhere else. \n    \n    Happy stamping, we're excited to see what you make! \n    \n    - Maayan & Cam\n    \n*/","args":" ","x":702.0843016558624,"y":526.3886604608753,"editorWidth":224.2321933879481,"editorHeight":627.8573293703668,"iframeWidth":0,"iframeHeight":0,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":632,"isBlob":true,"codeSize":14},{"name":"","code":"var xPos = 0\nvar maxSize = 20","args":" ","x":1025.2197591789836,"y":526.1831709984822,"editorWidth":120.72506930849877,"editorHeight":174.63795191901036,"iframeWidth":0,"iframeHeight":0,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":627,"isBlob":true,"codeSize":14},{"name":"setup","code":"createCanvas(200, 200)\nbackground(175, 112, 248)\nnoStroke()","args":"","x":1216.6046212636682,"y":526.1050713082992,"editorWidth":187.33684948280245,"editorHeight":75.20212084900183,"iframeWidth":47.18718026609529,"iframeHeight":84.26214854159208,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":630,"isBlob":false,"codeSize":14},{"name":"sizeDot","code":"// generate a random size\nvar size = random(0, maxSize)\n\n// set the opacity\nvar opacity = map(size, \n    0, maxSize, \n    0, 255)\n\n// draw a dot   \nfill(255, opacity);\nellipse(x,y,size, size);\n\n","args":"x=mouseX, y=mouseY","x":1025.1123055679532,"y":789.7862113698332,"editorWidth":225,"editorHeight":175,"iframeWidth":200.4613444482518,"iframeHeight":199.7524142951453,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":579,"isBlob":false,"codeSize":14},{"name":"draw","code":"// update xPos and background\nbackground(175, 112, 248, 10)\nxPos = (xPos +2) % width\n\n// draw a row of dots\nfor(var i = 0; \n    i < height/maxSize; \n    i++){\n      sizeDot(xPos, i*maxSize )\n}\n","args":"","x":1025.3740565788173,"y":1153.6991713934658,"editorWidth":225,"editorHeight":175,"iframeWidth":200,"iframeHeight":200,"isIndex":false,"isTxtFile":false,"isMediaFile":false,"hidden":false,"exported":true,"zIndex":580,"isBlob":false,"codeSize":14}],"scale":0.7838764402270318,"console":{"x":700.0778726617857,"y":1240.2239882058916,"consoleWidth":244.781440843727,"consoleHeight":199.19044002384612,"hidden":true,"zIndex":-1},"originX":-257.2010372715673,"originY":-311.9703251082989,"compressedJs":"ԗ䪈ੈ吔ℂ㔔ᐔ†တᗙⶌ㛶欩Ǒ幀却ザ尙⹄᱑䘰疡䋨⁹㞺䠚మ晒̓ᖙ廤旅࠴峈త܃⥳⧌䃦步㨱娈್眦欋凑䫈⁩㜐ᡜ二⛶ஓႵ壒步ဴ崙ⶮ㈆ᬋㆱ䫉䙥㦗㆘ᢠ喖箩ƍ䋜⁴㐴定損癢Σ↕曊⁢㒳燋␎䚗☡沉曊瑵㠑ଈь䜦ஹࢰ䃂滄઴庙⢍睂ᄃ׌䃌畮ㆺᩛ淎㋢ʣ↕玊埄㰐ᯛ䲤ؖ獻冡䫥䔶㪹奈೭䛶ጋめ泂物ケᬙ⹥漠қֱ曞⁩㚸ᯜ亄٦䭦ᄑ䡀浥㈴塺\u0013㚞 憔䃄慲ူ墛滘戬⋶ၙ䛞湳㞶ᥱ䖜䀖ጣᖉ櫏搁₹࠘淬䙜宒ֹ珈Ā㏢ᑹ怫چ箫㆐䃮潲㗢ձ⢌圢睈ɱ櫠汯ゲ࠙⼍᜷☡旀毎Ƌ㊹竀㦤۷ᄃᆽ滝䔬㨴ᩜ搊㱒⼨ʡ廠敮ဴ崈ຮȇ᭻㖕滐敲㊐ᥛ๬廀೺ↅ惠礠㧢Ꮪⷌ狂λᒟࡌ硣㓲{⺍爇ᬫᒁ濐ȩ㚰嫙␹㏢椂㖅䋲慮ဓࠐ氭屡䅑㰨ᐔ੶スࠞ਍眲ǩÃਚ浡㰩婞䲤ϒƑ䀨ᐕ栁昐㥀㻅ʗ塑䛤敡㨲僘ⷎ昗᥁䣀恘′᠘ੂ䐄ئଛ⶝擞畮㈔్暥䈃উ䢰䁤㐸戎ᮛ橮䜦筛ᒠ刔緌⯳ԏϖ死嗍䪰Ⱐ㳣ʖ㢭㋲礃ᶕ峊牡㨲䠘␎☖猣㶷੨ਠ爁ೱⅤϜ㣉⃀姐¿戹㆏湬坎⠐ᦽ惂捩㨼燎ᣡ戃椃㖅恑䑆ᙢఱ9⑜悙䣔殔哤ż䠘␌䛷✰օ䳒汬ᐙ്▙ւ䧘⢀䃊汬㒸᳙┏ˇ䥦ᦋࠍ䔛戁笀⃘䔞《炼幀異㉲;粠᥮‑Ψʭ笁㆖ࠌ㲠ᠼ⦱璀冊ࠫᤔ䠉␎皖⎣⏀Ÿ牯㯲ùⲍ睇ἠ̅廤⣤婹@玾䀇嶤䁸⁨㊴姚຅繰࢖⡬噗攀埣z‸唆箙め剕䜮ၲ$⾸䞧桐耂老"}


export const starter = starter1

export const worlds = [
  {name:"starter" , data:starter2},
  { name: "empty", data: empty },
  {name:"particles", data:particles}
];
