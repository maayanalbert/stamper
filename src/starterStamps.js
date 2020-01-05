import pf, { globals, p5Lib } from "./globals.js";

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

export const commentBlob = {
  code: `/*\n  comment here\n*/`,
  codeSize: globals.bigCodeSize
};

export const varBlob = { code: "var global1 = 1" };

export default function DefaultExportPlaceholder() {
  return null;
}

var world1 = {
  blobs: [
    {
      code:
        "// globals\n\nvar actRandomSeed = 0;\nvar count = 300;\nvar faderX = 0\nvar backgroundFade = 40\nvar lastFaderX\nvar speed\nvar angleUnit = (360 / count);",
      codeSize: 12,
      editorHeight: 201.84709943153263,
      editorWidth: 200,
      hidden: true,
      originX: 411.9482032963044,
      originY: 85.51423660084197,
      scale: 0.5749355676770208,
      x: 311.70689585344496,
      y: 665.1005595572993
    },
    {
      code:
        "// a helper function to get the particle pattern, mouse over the canvas while pressing your mouse down to visualize what it does",
      codeSize: 24,
      editorHeight: 56.38414040982718,
      editorWidth: 864.7567589687693,
      hidden: false,
      originX: 0,
      originY: 0,
      scale: 0.5749355676770208,
      x: 1109.0422118750803,
      y: 440.64114822803793
    },
    {
      code: "// setup stuff",
      codeSize: 24,
      editorHeight: 37.85493935071861,
      editorWidth: 778.6149650048328,
      hidden: true,
      originX: 411.9482032963044,
      originY: 85.51423660084197,
      scale: 0.5749355676770208,
      x: 310.88018216407465,
      y: 602.9347984240814
    },
    {
      code: "// the particle pattern",
      codeSize: 24,
      editorHeight: 38.73195511379262,
      editorWidth: 612.8513837941782,
      hidden: false,
      originX: 0,
      originY: 0,
      scale: 0.5749355676770208,
      x: 1111.701254519014,
      y: 89.19959331819723
    },
    {
      code: "// different types of dots, mouse over the canvases to see them",
      codeSize: 24,
      editorHeight: 34.487326158190314,
      editorWidth: 1147.3686095866817,
      hidden: false,
      originX: 0,
      originY: 0,
      scale: 0.5749355676770208,
      x: 307.00786095894887,
      y: 91.78839934748044
    }
  ],
  console: {
    consoleHeight: 312.41625580738497,
    consoleWidth: 398.5547609288658,
    hidden: true,
    originX: 411.9482032963044,
    originY: 85.51423660084197,
    scale: 0.5749355676770208,
    x: 24.76051168865979,
    y: 597.3498463778498
  },
  fns: [
    {
      args: " ",
      code: "\nhtml, body {\n  margin: 0;\n  padding: 0;\n}",
      editorHeight: 277.77679545226056,
      editorWidth: 199.36438778632868,
      hidden: true,
      iframeHeight: 200,
      iframeWidth: 225,
      isCss: true,
      isHtml: false,
      name: "style.css",
      originX: 411.9482032963044,
      originY: 85.51423660084197,
      scale: 0.5749355676770208,
      x: 109.96884819879574,
      y: 336.6662834735052
    },
    {
      args: " ",
      code:
        '<html>\n  <head>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/p5.min.js"></script>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.dom.min.js"></script>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.sound.min.js"></script>\n    <link rel="stylesheet" type="text/css" href="style.css">\n  </head>\n  <body>\n    <script src=\'sketch.js\'></script>\n  </body>\n</html>\n',
      editorHeight: 267.30348833629085,
      editorWidth: 331.9915568373324,
      hidden: true,
      iframeHeight: 200,
      iframeWidth: 225,
      isCss: false,
      isHtml: true,
      name: "index.html",
      originX: 411.9482032963044,
      originY: 85.51423660084197,
      scale: 0.5749355676770208,
      x: -74.62259188131372,
      y: 91.13686709888839
    },
    {
      args: "",
      code:
        "// nothing much to see here\ncreateCanvas(300,300) // this won't alter the window size\nbackground(backgroundFade)\nnoStroke()",
      editorHeight: 95.77622017221594,
      editorWidth: 300,
      hidden: true,
      iframeHeight: 125.05858664939339,
      iframeWidth: 229.2823664771775,
      isCss: false,
      isHtml: false,
      name: "setup",
      originX: 411.9482032963044,
      originY: 85.51423660084197,
      scale: 0.5749355676770208,
      x: 450.8800400942755,
      y: 666.3652028486166
    },
    {
      args: "x=mouseX, y=mouseY",
      code: "fill(255);\nellipse(x, y, 10, 10)",
      editorHeight: 175,
      editorWidth: 300,
      hidden: false,
      iframeHeight: 200,
      iframeWidth: 225,
      isCss: false,
      isHtml: false,
      name: "basicDot",
      originX: 560.9752218706174,
      originY: 366.2956161443158,
      scale: 0.5749355676770208,
      x: 305.4633753997713,
      y: 160.9581172797552
    },
    {
      args: "x = mouseX, y=mouseY",
      code:
        "if(!speed){\n  speed = random(0, .01)\n}\n\n// set the opacity and color based on the speed the dots are moving\nvar opacity = max(100, speed *100 * 255)\nvar colorOff = speed *100\nfill(150 - colorOff*40, 100+ colorOff*80, 255, opacity);\nellipse(x,y,5, 5);\n",
      editorHeight: 176.59932474664424,
      editorWidth: 296.7340422149467,
      hidden: false,
      iframeHeight: 200,
      iframeWidth: 225,
      isCss: false,
      isHtml: false,
      name: "speedColorDot",
      originX: 332.9682053941128,
      originY: 156.5425618995235,
      scale: 0.5749355676770208,
      x: 659.6158329684184,
      y: 369.9719369814155
    },
    {
      args: "angle",
      code:
        "\n if(angle === 0){\n  lastFaderX = faderX\n  faderX = faderX*.97 + .03* mouseX / width;\n  speed = abs(faderX - lastFaderX)\n  randomSeed(actRandomSeed); \n }\n var randomX = random(0,width);\n  var randomY = random(0,height);\n  var circleX = width / 2 + cos(angle) * 100;\n  var circleY = height / 2 + sin(angle) * 100;\n  var x = lerp(randomX,circleX,faderX);\n  var y = lerp(randomY,circleY,faderX);\n  if(mouseIsPressed){\n     background(backgroundFade, 10)\n  var angle = map(mouseX, 0, width, 0,7)\n  var circleX = width / 2 + cos(angle) * 100;\n  var circleY = height / 2 + sin(angle) * 100;\n  basicDot(circleX, circleY) \n  }\n\n  \n  return {x:x, y:y}\n  ",
      editorHeight: 376.8484971084752,
      editorWidth: 379.21463817319534,
      hidden: false,
      iframeHeight: 292.2735384641079,
      iframeWidth: 289.3981629416132,
      isCss: false,
      isHtml: false,
      name: "getPosition",
      originX: 411.9482032963044,
      originY: 85.51423660084197,
      scale: 0.5749355676770208,
      x: 1108.9690915100741,
      y: 511.6546173225238
    },
    {
      args: "",
      code:
        "background(backgroundFade, 20);\n\nfor (var i = 0; i < count; i++) {\n  var angle = i*360/count\n  \n  // mix and match dot functions here!\n  pos = getPosition(angle)\n  basicDot(pos.x, pos.y)\n}",
      editorHeight: 257.04445805245604,
      editorWidth: 309.7943589626219,
      hidden: true,
      iframeHeight: 294.39447695632765,
      iframeWidth: 299.39315922954154,
      isCss: false,
      isHtml: false,
      name: "drawFadedParticles",
      originX: 411.9482032963044,
      originY: 85.51423660084197,
      scale: 0.5749355676770208,
      x: 1496.8384538520986,
      y: 150.73430262752692
    },
    {
      args: "x = mouseX, y=mouseY",
      code:
        "\nif(!speed){\n  speed = random(0, .01)\n}\n\n// set the opacity based on the speed the dots are moving\nvar opacity = max(100, speed *100 * 255)\nfill(150, 100, 255,opacity);\nellipse(x,y,10, 10);\n\n",
      editorHeight: 185.16405770099925,
      editorWidth: 308.7544796011597,
      hidden: false,
      iframeHeight: 204.18278884948927,
      iframeWidth: 217.08265374726574,
      isCss: false,
      isHtml: false,
      name: "speedDot",
      originX: 332.9682053941128,
      originY: 156.5425618995235,
      scale: 0.5749355676770208,
      x: 654.9682142458253,
      y: 162.85783538504427
    },
    {
      args: "x = mouseX, y=mouseY",
      code:
        "// generate a random size\nnoStroke()\nvar size = random(0, 10)\n\n// use it to draw the dot\nfill(86,186,255, size*.1 *255);\nellipse(x,y,size, size);",
      editorHeight: 175,
      editorWidth: 300,
      hidden: false,
      iframeHeight: 200,
      iframeWidth: 225,
      isCss: false,
      isHtml: false,
      name: "sizeDot",
      originX: 608.278019611442,
      originY: 357.6617464920328,
      scale: 0.5749355676770208,
      x: 307.34413522241096,
      y: 368.4778870560692
    },
    {
      args: "",
      code:
        "\nbackground(40);\n\nfor (var i = 0; i < count; i++) {\n  var angle = i*360/count\n  pos = getPosition(angle)\n  \n  // mix and match dot functions here!\n  sizeDot(pos.x, pos.y)\n  speedColorDot(pos.x, pos.y)\n}",
      editorHeight: 297.9050695738547,
      editorWidth: 300,
      hidden: false,
      iframeHeight: 300.1107008138324,
      iframeWidth: 307.39606783817277,
      isCss: false,
      isHtml: false,
      name: "drawParticles",
      originX: -469.679587362437,
      originY: 288.2190116923002,
      scale: 0.5749355676770208,
      x: 1109.1784092705043,
      y: 150.36564893108584
    }
  ],
  originX: 411.9482032963044,
  originY: 85.51423660084197,
  scale: 0.5749355676770208,
  compressedJs:
    "ភ䠙涍瘦ୣ䰨ᓬ慲ူ壝ੌᛦ⍻㕍䫊搠Ẑఎ碢瘶箫㧐䁺″ᡣ䑙䰬䙗዆ႇਞ扡ㆵ姜䷮囦∳֑䩀㴠ᩣ؛మ㝌ₓ䥣ਞ獰㊲失䴍晶挪喹厈唨ᦛఈ׸時䧘⢼幀愠㐲嬜ಮ∆㎫㦍棒潮်ᯈ೬坂Σ↔䃠慲㨴壛ᢁᝇ⌫䦸塀浯㪹奈෮晗ᘩ֍䋜癡㦐ᷚസ䉗ጫ䷍勜朠㲷嵜壥♆箾ᕉ泒獵ザᩞ䲤ݶ䌋傁勨⁤㞲峹\u0010᜶⮣嗀䃦瑵㌳㄃窎籁䌣▙䳊牥㜺ࠝ༮ٗᤃ㶘䃈潴㧻䀤䲮㱇⮛ᖗࠨ洊璀㜱ⶥʗ帢䦹廨棤W᭝Ɑಂ獃ᗉ䨔捲㊰崙⡸咒䆙䃀塦〰ᒐ㥀ᎍᜲλ㶸仨⁡㘺㇜⻭ᛦ⍻岁曒穥յgԙ₾‌咤ᓜ潓㨹ᯚ沥ʐ可⠂⃄慳㒱儛溅ރ漨̡じ⁹挅ᙊ⽡♦䭣゠摪㔩ᶅᥛඍᜇᬩ⇠塀礬ဘ䰱咮⠏䄍廘潲抧䠏㳀ᆜ犋▘偃䔩ᒽ䊈ᣆ㈃椃䮔Ԍ⠰ᘐ஌ظ䕞㠌徔ƾ潰ケ婝༤ؖ猡Əࢿ搀娲夈ᲀ⊖䌮ᴓࠕ搁䜐ᡜ䲤ۖ箳▹俊ɻ搞佈ඬគ䆉䃀妎ㄪᢘఈՄเۦᒧ઴佦㌐ི搼怐Ɖ哀䁛䤡ᔚ㥀ὦʼ傑惀妈䤬搷㭀●ዃ⥡ΐʃ氁ᘳ奝਍眶丠ィ䨆ḩ㶅ʈബ池椁瓴穀ュ㪀檄Ϟ㠜 䆎৉कஎ⛤ʲű䃌嗎Ŵဗ䠝洬䝆䇟Ⰵ䫂扳ᑣ之㥫ʐ儇ᰆǈІᑶ䄅ԧ㈀儃琨䇈ġ挒ㄝ㣁⊃Ŧᖌ厈擊Ⴌ猈ⴌ嚖㭇ဏ侌≣㒹ᣛಸ䐼⧑¼䁤⃤£峹怠䈂圠էᱝ䑐挣燋湭Ẁঞ㢿䠄煬㊹ᰊᣏ斂昻㢳䰁瓩B礀䆙㊅丹Ⅷᡐ楦ᑲ䁒म㔎•䮜՜†疂㻻恫繠ᡶᦋ七䐠㚰就䣫˂Ɓ㎘ǩ䐊ᯤ੿怢࿰ࢇ氄⇒ϕ掱ଲޥሀ儁Ǵᐔ⃄йᥝຮ⛢ϛ惫䠇吺㲾焅絠⩖⎓ן䠁層⡳䅃乼䁋䟘Ќ摡搂玳ᯜ䐅เ֋➔ದ⁩သ㦁㷧㈆䥙Ⲥ䇈ŋ瘀䧚╆㍣žᒋ䰁ᠯថ᭚⼜倿ͫב䛑搃泴䆇⹼偒ᄈ⢀䃠潳သ糀楝䀐΃㷌峰Ⳅᖗṹༀ╿氒嗾ҫ纂⫿悔῰┏䠒䏐҇犂ṹ䂍你⍟ᰖ⹶૭ȷ㤁䍟『圠⁝䫜敲ズ᥈఼瀎ษ厰౧攇楲Ǐ嶀ှ‗匐翈܀㒺㤁塼䀣❀γ䰁㜸ᬖ౎ۅ乐⤆ᄄ呜ㄠᕸƔ漥䱁帱Ҥ矠ʅ皁※Pፏ砓䟼ӣ攂㣽䂑翠⣎堔㎠˅渂㡳䂍崠煌烷ညᰀ耀"
};

var world2 = {
  blobs: [],
  console: { hidden: true },
  fns: [
    {
      args: " ",
      code: "\nhtml, body {\n  margin: 0;\n  padding: 0;\n}",
      hidden: true,
      isCss: true,
      name: "style.css"
    },
    {
      args: " ",
      code:
        '<html>\n  <head>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/p5.min.js"></script>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.dom.min.js"></script>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.sound.min.js"></script>\n    <link rel="stylesheet" type="text/css" href="style.css">\n  </head>\n  <body>\n    <script src=\'sketch.js\'></script>\n  </body>\n</html>\n',
      hidden: true,
      isHtml: true,
      name: "index.html"
    }
  ],
  originX: 0,
  originY: 0,
  scale: 1
};

var world3 = {"blobs":[{"code":"var actRandomSeed = 0\nvar count = 150\nvar faderX = 0","codeSize":24,"editorHeight":135.8730721150204,"editorWidth":324.64861847467637,"hidden":false,"originX":0,"originY":0,"scale":0.631862561630551,"x":712.283413606399,"y":222.08575841213747}],"console":{"consoleHeight":60,"consoleWidth":200,"hidden":true,"originX":0,"originY":0,"scale":0.631862561630551,"x":139.2905045925266,"y":19.197088773970016},"fns":[{"args":"","code":"\ncreateCanvas(225, 225)\nnoStroke();\n\n","editorHeight":175,"editorWidth":300,"hidden":true,"iframeHeight":200,"iframeWidth":225,"isCss":false,"isHtml":false,"name":"setup","originX":0,"originY":0,"scale":0.631862561630551,"x":918.2905045925265,"y":134.19708877397002},{"args":"x=mouseX, y=mouseY","code":"// generate a randome size\nvar size = random(0, 10)\n// use it to draw the dot\nfill(0,130,164)\nellipse(x,y,size * 2, size * 2)","editorHeight":175,"editorWidth":300,"hidden":false,"iframeHeight":200,"iframeWidth":225,"isCss":false,"isHtml":false,"name":"sizedDotMaker","originX":0,"originY":0,"scale":0.631862561630551,"x":332.3149335151379,"y":572.5142247823878},{"args":"x=mouseX, y=mouseY","code":"// just a boring old dot maker\nfill(50,50,50);\nellipse(x, y, 10, 10)","editorHeight":175,"editorWidth":300,"hidden":false,"iframeHeight":200,"iframeWidth":225,"isCss":false,"isHtml":false,"name":"basicDotMaker","originX":0,"originY":0,"scale":0.631862561630551,"x":335.7393159226647,"y":109.08113896375039},{"args":"dotMaker=sizedDotMaker","code":"\n// a colored pattern\npatternMaker(dotMaker)\n\n\n","editorHeight":175,"editorWidth":0.12071497396732411,"hidden":false,"iframeHeight":200,"iframeWidth":225,"isCss":false,"isHtml":false,"name":"patternTester132","originX":0,"originY":0,"scale":0.631862561630551,"x":1169.005701754205,"y":531.4216358920653},{"args":"x=mouseX, y=mouseY","code":"// generate random colors\nvar off = 40\nvar r = random(-off, off)\nvar g = random(-off, off)\nvar b = random(-off, off)\n// use them to color the dots\nfill(229+r, 84+g, 122+b)\nellipse(x, y,10, 10)","editorHeight":175,"editorWidth":300,"hidden":false,"iframeHeight":200,"iframeWidth":225,"isCss":false,"isHtml":false,"name":"coloredDotMaker","originX":0,"originY":0,"scale":0.631862561630551,"x":333.2901038017544,"y":337.07787464362957},{"args":" ","code":"html, body {\n  margin: 0;\n  padding: 0;\n}","editorHeight":175,"editorWidth":300,"hidden":true,"iframeHeight":200,"iframeWidth":225,"isCss":true,"isHtml":false,"name":"style.css","originX":0,"originY":0,"scale":0.631862561630551,"x":869.9845236241445,"y":116.06940190316178},{"args":" ","code":"<html>\n  <head>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/p5.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.dom.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.sound.min.js\"></script>\n    <link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">\n  </head>\n  <body>\n    <script src='sketch.js'></script>\n  </body>\n</html>","editorHeight":175,"editorWidth":300,"hidden":true,"iframeHeight":200,"iframeWidth":225,"isCss":false,"isHtml":true,"name":"index.html","originX":0,"originY":0,"scale":0.631862561630551,"x":553.9040047854674,"y":116.06940190316178},{"args":"dotMaker=coloredDotMaker","code":"\n// a colored pattern\npatternMaker(dotMaker)\n\n\n","editorHeight":175,"editorWidth":0.12071497396732411,"hidden":false,"iframeHeight":200,"iframeWidth":225,"isCss":false,"isHtml":false,"name":"patternTester1","originX":0,"originY":0,"scale":0.631862561630551,"x":985.2305125502625,"y":532.5630966945743},{"args":"dotMaker=basicDotMaker","code":"background(255)\nfaderX = faderX * 0.97 + 0.03 * mouseX / width\nrandomSeed(actRandomSeed)\nvar angle = radians(360 / count)\n\nfor (var i = 0; i < count; i++) {\n  // positions\n  var randomX = random(0,width)\n  var randomY = random(0,height)\n  var circleX = width / 2 + cos(angle * i) * 100\n  var circleY = height / 2 + sin(angle * i) * 100\n  var x = lerp(randomX,circleX,faderX)\n  var y = lerp(randomY,circleY,faderX)\n  dotMaker(x, y)\n}","editorHeight":258.8790003054317,"editorWidth":415.53145325087803,"hidden":false,"iframeHeight":200,"iframeWidth":225,"isCss":false,"isHtml":false,"name":"patternMaker","originX":0,"originY":0,"scale":0.631862561630551,"x":984.9768322889943,"y":214.89919579749852}],"scale":0.631862561630551,"compressedJs":"㬰岈బ㝅ጋ㦑廚卥㊲ࠏ␆¬₳ල櫜琠Ẑ్㣂٦ଣᗉㆊὦ㪷ᣝഭ盢Λᗑ櫠⠩㶅ʘ湌嘗〉අ峬慳ᐙ಍▄̣ᆩ␩峞却㤷嫙┅Ꮀ偐⧷ᙴ楺㊲ᄛ溉嘖嬫䢡灺浯㪹奖քޜげ撥瘔⼯ဳ奛䲮☗〈Ƅ䃥攀儲煎㲠ऌ⁉÷ะ⠰ᘐౌԸ䍇⮛ᒁ勨⁴㞐ᤜ䰮爇⍃ᒁ䣞琊㌴嬛Ԇ˃ঙ䂰扬㐩Բ嬛മܶ⥃悱牙䕋ᔐಋᣊ劢Ƒ➰Ř扡㦴壿怕䋲͓嗍桀愠ㄷ岚ⷌ爆筣጑湀淄ᩣὍ★䱐᥉漭穀秤\\焁᦮㜆ண冕擜呥㦺ᥜ䘦㌢䌦᷼篚Ĺ爀庋旤̛ؒ㶱廤敤搜ʱ愘剜䧡␫尃Ӈ᫿䀶嵠ᡮ》㌘烧攁䊷妙䐇刃✰ࢉ旔Əᚷ妙䖘䇢丨榟㈴拕൳䁱溍ٖ漠ܧૣ栁改禀⧆⌣䥛䢰䁰㐫㎖ࠌ♆⊶ᝠݐ䃲⳿«᲌㵀ᕎ砈⟼ʭ缁⭪䥏㶠⑂䯘⦉䋆歧㤷嵛䲅̣⦩␫分廇ҕࠌׇ፲řÀ屠㌠ᔐ㦀㍄˲λ░棐૦礀瘅໐᷷᠅⫂湧㙳Ç಍ᘖ玙⃌池 猁瑊⅁♦箑£ࡎ槤Ǧ仈തόメ沁剖⬩ွ䊈Ѕ狲΃㷍又Ñ㦅ࠈᢅ汧ἠʏఔ⠰ᙲ䀣Թ刅乡ơ䫒杨㩤ࡘ洮☶挮ᄇੰ မࠊ搌㛷᥇᠂恔⁩ᒐઈئ̌榎ᅋಓ䜲㦴家ُȃ椃㆕擠⣧V䬱溅习ષ ᓳ丧ⳣ䧖㥤纀ාᐉᧈɅ㺅耂老"}

var starter = {"blobs":[{"code":"/* and comments!\n \n  click the 'T' to\n  toggle text-size\n  \n*/","codeSize":28,"editorHeight":170.19109860377665,"editorWidth":354.70900337275435,"hidden":false,"originX":0,"originY":0,"scale":0.6545969459414475,"x":1160.0981024936634,"y":316.509237954331},{"code":"/*Stamps can be hidden by clicking their eye-cons in the layer list\n*/","codeSize":28,"editorHeight":165.3477841240168,"editorWidth":307.1892154701716,"hidden":false,"originX":0,"originY":0,"scale":0.6545969459414475,"x":524.2270491804414,"y":92.54728951263178},{"code":"// This is an \"Anything\" Stamp\n// Which can be used for global variables\n\nvar gridSize = 20;","codeSize":14,"editorHeight":98.52985762467915,"editorWidth":314.7556969719473,"hidden":false,"originX":282.62676656995563,"originY":-15.46266693473126,"scale":0.6545969459414475,"x":1025.2589414102165,"y":337.866364701934},{"code":"/* READ ME\n   ____    __    ____      ____    ______ ______           ____    ____    ____       \n  /\\  _\\  _\\ \\ _/\\__ \\    /\\  _`\\ /\\__  _/\\  _  \\  /'\\_/`\\/\\  _`\\ /\\  _`\\ /\\  _`\\     \n  \\ \\ \\/ /\\_` ' \\/_/\\ \\   \\ \\,\\L\\_\\/_/\\ \\\\ \\ \\L\\ \\/\\      \\ \\ \\L\\ \\ \\ \\L\\_\\ \\ \\L\\ \\   \n   \\ \\ \\ \\/_>   <_ \\ \\ \\   \\/_\\__ \\  \\ \\ \\\\ \\  __ \\ \\ \\__\\ \\ \\ ,__/\\ \\  _\\L\\ \\ ,  /   \n    \\ \\ \\_ /\\_, ,_\\ \\_\\ \\    /\\ \\L\\ \\ \\ \\ \\\\ \\ \\/\\ \\ \\ \\_/\\ \\ \\ \\/  \\ \\ \\L\\ \\ \\ \\\\ \\  \n     \\ \\___\\/_/\\_\\/ /\\___\\   \\ `\\____\\ \\ \\_\\\\ \\_\\ \\_\\ \\_\\\\ \\_\\ \\_\\   \\ \\____/\\ \\_\\ \\_\\\n      \\/___/  \\/_/  \\/___/    \\/_____/  \\/_/ \\/_/\\/_/\\/_/ \\/_/\\/_/    \\/___/  \\/_/\\/ / \n\n     An Artbord-Oriented Programming Enviroment for the p5.js Library.\n     \n     In Stamper, your code is structured into \"Stamps\", there are 5 types:\n     \n     1. Function for Setup(), Draw(), keyPressed(), yourFavFunc(), etc.\n     \n     2. Anything for everything else: Global Variables, Comments (like this one), Classes, etc.\n     \n     3. Console for printing messages\n        \n     4. HTML for updating the webpage which holds your sketch\n     \n     5. CSS for updating global style of that webpage\n\n*/","codeSize":14,"editorHeight":290,"editorWidth":676,"hidden":false,"originX":0,"originY":0,"scale":0.6545969459414475,"x":244.65403846712002,"y":85.54951822210046},{"code":"// P5.dom works too\n","codeSize":14,"editorHeight":27.387469292907497,"editorWidth":173.8666440266595,"hidden":false,"originX":0,"originY":0,"scale":0.6545969459414475,"x":664.4669334975154,"y":842.6902805039922},{"code":"/*\n  Duplicate a Stamp to try a new idea\n  \n  1. Click on Stamp titlebar\n  2. Hold Option (⌥) and drag to new position\n  3. Release Mouse\n*/","codeSize":14,"editorHeight":104,"editorWidth":341,"hidden":false,"originX":0,"originY":0,"scale":0.6545969459414475,"x":695.6925480964783,"y":593.095318458676},{"code":"/*\n  A Stamper project is ~= to one p5 sketch, this means:\n    \n    1. Everything is in global scope and you can call functions freely\n    2. When you're export, the Stamp named \"draw\" will act as the draw() function, if you import this code into the p5 web editor.\n*/","codeSize":14,"editorHeight":158,"editorWidth":465,"hidden":false,"originX":0,"originY":0,"scale":0.6545969459414475,"x":329.4755092970614,"y":424.49112373739024}],"console":{"consoleHeight":224,"consoleWidth":220,"hidden":false,"originX":1004.6898982788305,"originY":-30.29915414513107,"scale":0.5,"x":657.8432199291099,"y":110.48172411963026},"fns":[{"args":" ","code":"\nhtml, body {\n  margin: 0;\n  padding: 0;\n}","editorHeight":175,"editorWidth":225,"hidden":true,"iframeHeight":200,"iframeWidth":200,"isCss":true,"isHtml":false,"name":"style.css","originX":1004.6898982788305,"originY":-30.29915414513107,"scale":0.6545969459414475,"x":400.46167041487115,"y":82.00211121778517},{"args":" ","code":"<html>\n  <head>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/p5.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.dom.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.sound.min.js\"></script>\n    <link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">\n  </head>\n  <body>\n    <script src='sketch.js'></script>\n  </body>\n</html>\n","editorHeight":175,"editorWidth":225,"hidden":true,"iframeHeight":200,"iframeWidth":200,"isCss":false,"isHtml":true,"name":"index.html","originX":1004.6898982788305,"originY":-30.29915414513107,"scale":0.6545969459414475,"x":548.5300413776317,"y":84.38956768337084},{"args":"bgColour = 'black', lineColour = 'cyan'                 ","code":"background(bgColour)\nnoStroke()\ntextSize(50);\n\nfor (let x = gridSize; x <= width - gridSize; x += gridSize) {\n  for (let y = gridSize; y <= height - gridSize; y += gridSize) {\n    noStroke();\n    fill(lineColour);\n    ellipse(x, y, 5, 5);\n    stroke(lineColour);\n    line(x, y, 0, 0);\n  }\n}","editorHeight":221.34053533603714,"editorWidth":499.91886949481443,"hidden":false,"iframeHeight":221.14120090399788,"iframeWidth":236.10915200348276,"isCss":false,"isHtml":false,"name":"lines","originX":0,"originY":0,"scale":0.6545969459414475,"x":1026.3276999822056,"y":410.3942277012918},{"args":"","code":"background('cyan')\nfill(\"black\")\ntextSize(50);\n\n// display last key pressed.\ntext(gridSize + ' ' + keyCode, 20, 70)\n\nif (keyCode == 187) { // keyCode for '-'\n  gridSize--\n} else if (keyCode == 189) { // keyCode for '+'\n  gridSize++\n}","editorHeight":182,"editorWidth":413,"hidden":false,"iframeHeight":118,"iframeWidth":197,"isCss":false,"isHtml":false,"name":"keyPressed","originX":0,"originY":0,"scale":0.6545969459414475,"x":1062.8084297040891,"y":565.798804872135},{"args":"","code":"colorMode(RGB, 255, 255, 255, 1);\nbackground(151, 97, 246, .01);\nstroke(255);\nstrokeWeight(1)\n\nif (mouseIsPressed) {\n  line(mouseX, mouseY, pmouseX, pmouseY);\n}","editorHeight":179,"editorWidth":309,"hidden":false,"iframeHeight":200,"iframeWidth":200,"isCss":false,"isHtml":false,"name":"draw","originX":0,"originY":0,"scale":0.6545969459414475,"x":478.1184784319902,"y":284.6367545951341},{"args":"name","code":"return \"<link href='https://fonts.googleapis.com/css?family=\" + name + \"' rel='stylesheet'>\"","editorHeight":42,"editorWidth":689,"hidden":true,"iframeHeight":44,"iframeWidth":31,"isCss":false,"isHtml":false,"name":"loadFromGoogleFonts","originX":1092.379796557661,"originY":-1082.5983082902621,"scale":0.6545969459414475,"x":339.5664567510112,"y":655.5805439137175},{"args":" ","code":"createCanvas(200, 200)","editorHeight":178,"editorWidth":204,"hidden":false,"iframeHeight":200,"iframeWidth":200,"isCss":false,"isHtml":false,"name":"setup","originX":0,"originY":0,"scale":0.6545969459414475,"x":299.41276472233824,"y":285.25367502120184},{"args":"string = 'Orbitron', txtSize = 30, horShift = 20, vertShift = 100","code":"select(\"head\").html(loadFromGoogleFonts(\"Orbitron\"), true)\n\nfill(\"black\")\nnoStroke()\ntextFont('Orbitron')\ntextSize(txtSize)\ntext(string, horShift, vertShift)","editorHeight":175,"editorWidth":430,"hidden":false,"iframeHeight":200,"iframeWidth":200,"isCss":false,"isHtml":false,"name":"Orbitron","originX":0,"originY":0,"scale":0.6545969459414475,"x":747.6782404822538,"y":799.5934743757235},{"args":"          ","code":"background(\"springgreen\")\nshearX(PI / 4.0);\ntranslate(-10,0)\nOrbitron(str(millis()), mouseX, -mouseY, 100)","editorHeight":174,"editorWidth":343,"hidden":false,"iframeHeight":199,"iframeWidth":200,"isCss":false,"isHtml":false,"name":"typePlay2","originX":0,"originY":0,"scale":0.6545969459414475,"x":749.1423193031873,"y":661.6165822372296},{"args":"","code":"background(117, 250, 141, 10)\nOrbitron('Orbitron', mouseX, 20, mouseY )","editorHeight":178,"editorWidth":5.684341886080802e-14,"hidden":false,"iframeHeight":199.35755929455925,"iframeWidth":201.06684775984823,"isCss":false,"isHtml":false,"name":"typePlay1","originX":0,"originY":0,"scale":0.6545969459414475,"x":644.5284364828796,"y":660.0434411421869}],"originX":358.4859655160991,"originY":124.2580525919509,"scale":0.3932852737605565,"compressedJs":"ផ࠘ⷌ䈆᭻㖵䫜瑳ႅࠂ䐄ض捋ඬ䃨桥ဓ唉搎䛰儁Ǒ廎杬㊐ᴙ⼎䋗ᭋ榔ᑀ ᔗ䊋敊㝆୫䇌䃆慮ေ᥈഍ᙆ⌫㢁䓳䙄㒷᧱࣭ᜢ̫斔嫆潮㦐ᩛ墫ᛆோᗈ䃘楳㩢凋搊䚆䮙ƥ晀慮ထၛ伮䚆䭳ᲈ䆊廄ྫ娚Ɑಆ㎫䶕䡀景㤐᧛෬☖愃妅擒慢㘲峂䅎昗ᄃ᷉勈卩㴲䠏␆⌃塑㲨䂤䕁∐ፑ⅄Ȃ˺絽㹁䔈挃ㆂᦃ౐嘸ἨΘ⃎ᵲL䗫䈂˾᠑㡀弯ⸯ埈஘䆼⣃Ű䆊ዄಐࠗ搘䆲示煼廀峊ၧȱ櫸䓥慾ჹ䁀✠⸗焐㢃嗂ˡㅱᢸ忇ॢ䧓ᢅ㱣嘱挐⎌ࣥKㆄᢪ籡䘢䃸䁀‼爀⬱欅痾㠅演▊ᗅ࠮ࠗ௸摢Ţ缕槈ì抩ଈЅ籵㸹➐ŠⰠᙢఱ⚜怐䘱㬥㇈¬挗爂◽瀋䘩漕⾌翦w៹䀢เѶၡ䆈௅㌮៱ٙݜ恮℃૕䘔挫礀ḋ痼⏁㼜ඊ໇եڱ⼸灌䡮䄃䠁ᠠգᙐⷄЗᎣঽ擈ⵏ㤴奛二噂ʃ䦽令慭㛲Åࢭ杦䮓㾐ۥ攂揲Ä⸆勦厙ı勄牡㤼䮱䣸恤䭷᠌໊爬ြ寝⹄ض笣ថٖ獴㤺壝ຮ♖℃▹棞•抓峈䖘䔗ጩƅ擊‵်Ṝಮ㎬抉䒸䂌畮ㆺᩛ淘埵ᬫ凕恐⤬ဢᲘ⻸䂆嬫敁擊獳㊲㄃墎䑦ஶ჏ࠞ整ㇶ䀧晅戎䀝䌕᳊癥㥣䏙ⶎ㙓儂ᾘ݊囨ǒ䬈ࡼ灆焁↱勖攠㩲þ淭晒䥡č壂獳我琙䙥戄᭻㧍廘旅㊸Ლⷎ䱆᭫ᗍ曂来㧣ল◦䋢ɂ儵ᦊⱵ㠲ᡱ▜䀖㮻ᖉ惂来ျ祁਍۶挣侘ʪ獫㊺ᣚᦎ㍒焂്➜䏧ȸ峝༭䙒ͻᢁ棐慴搪ʹ悙┃⥳ᆽ婀睯㤵峈ຍ盰兹⠨䁀䑵㠶ᩘ氮䙒̏᠇Ṁ瑯်Პ␌ሆ猫岁勈敡爂唹″搾⠬ƿ七砠㨴崛ಬ☗ၗᐅ媐潬㈐ᏜᲠᯢ䜔㊔及ׁ㈹ᡙ碊ⱄ掃㷍厈Ἂ犀䷔䲭䙖஛ᒁ᫞畳㋳ŭńȄา熗䠂䭯㔲壝ᲀ┗燮ᄍ廝搂䝳䁄㲀Ⓠ䮙Ƶ䫂滧Ģ煁☥戄⽐ޣ䠋㩮璀䜘淮ٞ⠄凥廫攅失塛඄ٮ㠓䧌䃌牥㊶ṱ⣦⋢ʻ↕嶈⨧㤲䠙⼎۷Ꭶᇍ䯎û㜰孙ⲄȦ⎓ל䑀睩㘶࠘Ɱ䈆ஞᒏࠬ⠩播ଈബ汗⍋㜑࿌¹猁䬹c汃ᎁ垐͚⁥㈴崛湅湀࡮⃴䃘楮㊹䨘䳨㛶朠࠼穀❢㘰壚擥䱑噐妍狂渧琁᭲‥ឰ匓֍囎牯㪷ᤲ⣅Ⴆ獺䷑擞步ᐔ䊹ç㹀㒱⃔恒㬊ղ攍䙗℃悀篒ڲᶐḈއ切㭋ᇑ偀ⷍக犉䔤ް儇ᐊㆊ䅹暠幱ٖ࠭䬻⇓᪄秒ℐ࠺䀓玼⢃ᦥ壘⣪x㇅䲭䛆䮃䶔僰Ⱐ㲖ࠍ▄͜㣋优箢㇄ࣣ䮌քเݹ稕䐂璀寻㻐১᠅䉒૥E䢹‰䈯ࠉ璼幀摩㦸ᬘ⼤ۆ஛匑᱀烆➗ㅋԝႀ⅙䁎‫我僛沌勂Ƒ䂰䁮〩ԅᩙ䐅౱㄁瓴䁢㠷ᒐỈץ粂弨ֈ乚✊ၴ䁎֥傧漨፛䠄毎ẜ甏╹䏒奟㠄ߌʿ㶅ᣛ涍眤死ᆔ傤䝂ᘐ಍⚹䁓ॉ澰Ⱦㄵᢖࠎ⛥䈃ᆡ墰䁜ツ࿳䁡晆幀ೆᠵ⿊ȁᐘ秀᳭幀ῢ●丂狦ÿ㥀㒸冕䅡̔ႲⰠ㡤ѱ䄫ና彰ˑ壞慤⌹ᯛ⣭盶㭣ᔙ廜瑳ᑲéԯェጫ凕擜•Ḷᩛ䵤ڇጫᣴ仐瑴㠹事旬求䥳ἔ櫂灩㦗ᣛ涥瘷ᮙ継䋚楬㲞䢈ռ倾夁Ⲁ䑎⁲㊶ཉ粠嘷ᭃᖕ桎㸢瘀⃜粠櫮‛䦍擊慴㊡塛仌ᜲ䆑䃃䠃尰ᓦଓ湌⚗⎓㶸僦瑲爂⩏␄粁᤹め槌ɔသ䠌昅䈆䍻䥍僒晴犅උЎ晗Ꭶ⁀扠〩㶅᳙ⶌ嘷⅁ড䫂搢ᒗ᨝ත䊏 䂋჆∩ᘐᴜ京劐坸଻师ᛄᮔ㪀ጽ〮眸ʋథ最拵*嵠ਫ਼标宐࿤偬ゼ䲊ἀ䨒᎟ဝˎ杲㊲守䔡✶䌫׉ぐ偉ဗ䠍ל䀶Ꭳ䦅峦污㨲䨋☦˃ň⮰ʔ⡭㒶ᬚ⹥ʒ伸ࣥじ‭琁Ⴙ%佀ѩ䞼ߐㄱ爁ㅍ★䈃ড䜐澖擬Ò爘㲀᥌㌡̑䀀老"}

var starter2 = {"blobs":[{"code":"/* and comments!\n \n  click the 'T' to\n  toggle text-size\n  \n*/","codeSize":28,"editorHeight":170.19109860377665,"editorWidth":354.70900337275435,"hidden":false,"originX":0,"originY":0,"scale":0.4941031394898886,"x":613.4646935609458,"y":440.6808164994866},{"code":"/*Stamps can be hidden by clicking their eye-cons in the layer list\n*/","codeSize":28,"editorHeight":165.3477841240168,"editorWidth":307.1892154701716,"hidden":false,"originX":0,"originY":0,"scale":0.4941031394898886,"x":-365.5593939971467,"y":147.01361872074915},{"code":"// This is an \"Anything\" Stamp\n// Which can be used for global variables\n\nvar dotSize = 20;","codeSize":14,"editorHeight":98.52985762467915,"editorWidth":266.5912253449911,"hidden":false,"originX":282.62676656995563,"originY":-15.46266693473126,"scale":0.4941031394898886,"x":415.77350639499014,"y":480.65036715522905},{"code":"/* READ ME\n   ____    __    ____      ____    ______ ______           ____    ____    ____       \n  /\\  _\\  _\\ \\ _/\\__ \\    /\\  _`\\ /\\__  _/\\  _  \\  /'\\_/`\\/\\  _`\\ /\\  _`\\ /\\  _`\\     \n  \\ \\ \\/ /\\_` ' \\/_/\\ \\   \\ \\,\\L\\_\\/_/\\ \\\\ \\ \\L\\ \\/\\      \\ \\ \\L\\ \\ \\ \\L\\_\\ \\ \\L\\ \\   \n   \\ \\ \\ \\/_>   <_ \\ \\ \\   \\/_\\__ \\  \\ \\ \\\\ \\  __ \\ \\ \\__\\ \\ \\ ,__/\\ \\  _\\L\\ \\ ,  /   \n    \\ \\ \\_ /\\_, ,_\\ \\_\\ \\    /\\ \\L\\ \\ \\ \\ \\\\ \\ \\/\\ \\ \\ \\_/\\ \\ \\ \\/  \\ \\ \\L\\ \\ \\ \\\\ \\  \n     \\ \\___\\/_/\\_\\/ /\\___\\   \\ `\\____\\ \\ \\_\\\\ \\_\\ \\_\\ \\_\\\\ \\_\\ \\_\\   \\ \\____/\\ \\_\\ \\_\\\n      \\/___/  \\/_/  \\/___/    \\/_____/  \\/_/ \\/_/\\/_/\\/_/ \\/_/\\/_/    \\/___/  \\/_/\\/ / \n\n     An Artbord-Oriented Programming Enviroment for the p5.js Library.\n     \n     In Stamper, your code is structured into \"Stamps\", there are 5 types:\n     \n     1. Function for Setup(), Draw(), keyPressed(), yourFavFunc(), etc.\n     \n     2. Anything for everything else: Global Variables, Comments (like this one), Classes, etc.\n     \n     3. Console for printing messages\n        \n     4. HTML for updating the webpage which holds your sketch\n     \n     5. CSS for updating global style of that webpage\n\n*/","codeSize":14,"editorHeight":290,"editorWidth":676,"hidden":false,"originX":0,"originY":0,"scale":0.4941031394898886,"x":-819.1375858771501,"y":150.1884590831557},{"code":"/*\n  Stamps can call one another. Try switching out the 'basicDot' for the 'sizeDot'\n*/","codeSize":14,"editorHeight":110.28612602487812,"editorWidth":300.5714094617597,"hidden":false,"originX":0,"originY":0,"scale":0.4941031394898886,"x":1302.9012812600374,"y":490.51710060529774},{"code":"/*\n  A Stamper project is ~= to one p5 sketch, this means:\n    \n    1. Everything is in global scope and you can call functions freely\n    2. When you're export, the Stamp named \"draw\" will act as the draw() function, if you import this code into the p5 web editor.\n*/","codeSize":14,"editorHeight":158,"editorWidth":465,"hidden":false,"originX":0,"originY":0,"scale":0.4941031394898886,"x":-538.5723312078458,"y":744.0444288480269},{"code":"/*\n  Duplicate a Stamp to try a new idea\n  \n  1. Click on Stamp titlebar\n  2. Hold Option (⌥) and drag to new position\n  3. Release Mouse\n*/","codeSize":14,"editorHeight":113.07436560542837,"editorWidth":411.46198635889164,"hidden":false,"originX":0,"originY":0,"scale":0.7206400825083252,"x":1538.212838454555,"y":490.3138293564143}],"console":{"consoleHeight":224,"consoleWidth":220,"hidden":false,"originX":1004.6898982788305,"originY":-30.29915414513107,"scale":0.3932852737605565,"x":250.40250896540624,"y":50.62861344049003},"fns":[{"args":" ","code":"\nhtml, body {\n  margin: 0;\n  padding: 0;\n}","editorHeight":175,"editorWidth":225,"hidden":true,"iframeHeight":200,"iframeWidth":200,"isCss":true,"isHtml":false,"name":"style.css","originX":1267.9344283031435,"originY":280.5387081219204,"scale":0.4853536966443059,"x":628.4057081388141,"y":381.8513734856667},{"args":" ","code":"<html>\n  <head>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/p5.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.dom.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.sound.min.js\"></script>\n    <link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">\n  </head>\n  <body>\n    <script src='sketch.js'></script>\n  </body>\n</html>\n","editorHeight":175,"editorWidth":225,"hidden":true,"iframeHeight":200,"iframeWidth":200,"isCss":false,"isHtml":true,"name":"index.html","originX":1267.9344283031435,"originY":280.5387081219204,"scale":0.4853536966443059,"x":777.852125008519,"y":384.19655352711646},{"args":"","code":"background(255)\nfill(117,250,151)\ntextSize(50);\n\n// display last key pressed.\ntext(dotSize + ' ' + keyCode, 20, 70)\n\nif (keyCode == 187) { // keyCode for '+'\n  dotSize++\n} else if (keyCode == 189) { // keyCode for '-'\n  dotSize--\n}","editorHeight":182,"editorWidth":413,"hidden":true,"iframeHeight":118,"iframeWidth":197,"isCss":false,"isHtml":false,"name":"keyPressed","originX":889.007514520416,"originY":269.8040062840238,"scale":0.3343220478296274,"x":961.253652168773,"y":539.9161365527827},{"args":"","code":"colorMode(RGB, 255, 255, 255, 1);\nbackground(151, 97, 246, .01);\nstroke(255);\nstrokeWeight(1)\n\nif (mouseIsPressed) {\n  line(mouseX, mouseY, pmouseX, pmouseY);\n}","editorHeight":179,"editorWidth":309,"hidden":false,"iframeHeight":200,"iframeWidth":200,"isCss":false,"isHtml":false,"name":"draw","originX":0,"originY":0,"scale":0.4941031394898886,"x":-280.24694533742166,"y":522.4009265940981},{"args":" ","code":"createCanvas(200, 200)","editorHeight":178,"editorWidth":204,"hidden":false,"iframeHeight":200,"iframeWidth":200,"isCss":false,"isHtml":false,"name":"setup","originX":0,"originY":0,"scale":0.4941031394898886,"x":-567.5792377477292,"y":523.3928431734678},{"args":"","code":"background(255, 10)\nfor(var i = 0; i < 10; i++){\n  basicDot(mouseX, i*20 )\n}\n","editorHeight":175,"editorWidth":225,"hidden":false,"iframeHeight":200,"iframeWidth":200,"isCss":false,"isHtml":false,"name":"dotPattern","originX":0,"originY":0,"scale":0.4941031394898886,"x":1168.034423193383,"y":612.5444915685594},{"args":"x=mouseX, y=mouseY","code":"noStroke()\nbackground(255, 10)\nfill(117,250,151)\nellipse(x, y, dotSize, dotSize)","editorHeight":175,"editorWidth":225,"hidden":false,"iframeHeight":200,"iframeWidth":200,"isCss":false,"isHtml":false,"name":"basicDot","originX":0,"originY":0,"scale":0.4941031394898886,"x":301.4499577651968,"y":598.0594939018815},{"args":"x=mouseX, y=mouseY","code":"// generate a random size\nnoStroke()\nvar size = random(0, 20)\n\n// use it to draw the dot\nfill(86,220,248, size*.05 *255);\nellipse(x,y,size, size);","editorHeight":175,"editorWidth":225,"hidden":false,"iframeHeight":200,"iframeWidth":200,"isCss":false,"isHtml":false,"name":"sizeDot","originX":0,"originY":0,"scale":0.4941031394898886,"x":1485.1746191913533,"y":612.5598293394229}],"originX":479.6418933011264,"originY":88.03631073715502,"scale":0.63234441101551,"compressedJs":"ផ࠘ⷌ䈆᭻㖵䫜瑳ႅࠂ䐄ض捋ඬ䃨桥ဓ唉搎䛰儁Ǒ廎杬㊐ᴙ⼎䋗ᭋ榔ᑀ ᔗ䊋敊㝆୫䇌䃆慮ေ᥈഍ᙆ⌫㢁䓳䙄㒷᧱࣭ᜢ̫斔嫆潮㦐ᩛ墫ᛆோᗈ䃘楳㩢凋搊䚆䮙ƥ晀慮ထၛ伮䚆䭳ᲈ䆊廄ྫ娚Ɑಆ㎫䶕䡀景㤐᧛෬☖愃妅擒慢㘲峂䅎昗ᄃᆽ梦楺㊐཈نΰ兹⢁⒊䅄ဦ兂䐄ȅ竺絼䆊ࣆͣȳ̘催㠾⠇ᡁ为爀䱋殄ȅ縰ᅰ䂾⽜⾯䠗ᢃ㱑䌂炃ਥ䐙တៈᢃ㋲㫢粽䂹䨠朄㇕碉旂縡禀䁎⁜២ၱΫ䈅慢焱㢿䜒抓匱ո掬㇆၇఑攀䭣б⫸憌⊁碀䁀㳤V㇖׫繰מᑋਫ䔐⸐᜗磈戂拾ᗓ䠁泅⤖ࠈ׸畼㥏ဂ恘‬战ㅍ᳀ႌㅶ╣䠁Ⳇ៤ɋ締஌⧞ᕟ೿昀眯禀∜䀈瘠憃ࠗ䕦ⸯ焌夎峀湂̕喌ᓆ⯲<௫籇䅾ᰛਝ䜊攍ㅞ㣠䲐溂ΐİ 挬偛䐈ᜧ⌓㷉䡚佲㒲宝ಬ䈅Γ㶝擂浭爁䓑ⷎ暗፿ဍ揊ˆ爁䐜ڥ暧ᤂㆥ䓤慲㲗㆑磀撖眰ఙ䫤Ⱐ㲷嵜䐌㛶⌯ဌ哦瑲㪱崝⹌噂͋㧑幀⋅Ꮉ䢋ᢊᜦ⤃׉䩀㔠㨼尙⹧ⳅউ㢁೪湣㨴寛墯甶⮣嗀偒Ⱐ∹ᡝ碁ڶ⯊䇉䫦獥㉢αຈ昗㘡伐Ị瑣皀⟌䗄຀ᵾᔹ䫬敲掇奛๬厢ȿ᠎䢭栃刖ࠐ糠䛒Ńㆥ囊⁴爁纛淌劒愂න䋦珄ᇨᦌ旄ж筳䶽壋䕥㠹ᩛ亘䘶欫䷍䋎敳挓㉋暅戄䊢㔳੘異㈰煋ᲀᙷ㬫ু䋎攠㯲䄓洍盆⎟᠅⫦步㨱娳๦勢Ț䵏ᲇ朄㠹崞ⶌ分笱Ǒ僂瓈⨅㦁∁∎」㾘ਦ捡㘶㤀ᮄؖ獿ဆⱜ⁔㤼䠜滭ᝆἨҍ廪瓦ʴᢘ⹭ᘴ⍻傟刄ሧ爂姱əᖄา榗䠂o㔲壝ᲀ⁧燩Ǒ徊捰᫳䀱岀‖䮙Ƶ䫂滧ýㅁ☥戄⽐ٷ䠊湮璀㑘淮เԣ᎐ț樀岳㧀䓮㈆㎓ᖕ壳䕇ᤗࠕ洌囬⅑᷉䩀數㠷岝ᢎ㙞〄粁峂浥㈐࢙์ᝲᄃ嶥壘⁡ㆺ࠘⹸刼₱₧ኴⰠ㒳ㅝഭ屄㼰˧䰅懤ũ焌丆幀଑ƕ䣒瑯㤗㩀↨䝗ͣ▍䋨攠ャ帱؎➒̉ƹ䫮⁩㈲塹Ô乐޺ྔච濧Ƥ䠝മ䛆⬓׈ᗊÍ␷嬙Љ眎⠘㲣䔙┩犀䈙์ᙼ⊖ᄱ惞獩戏䊹⁑Ԧ⭣ᖅ曊⁍㞺峙㲀ࣾ䀆㎴ٰ笊㄰壚泮⛷⭳Ⴀ摪㔩Գᩛඅ̓হト橠ⰱ᪘䩂岀瓞‵⒠橠⤻ղƹ䲍᜷ͣפ䃘慳㩢Ꮘธ攂瘩ィ倍夫ဓ䠉搅㱂ማ㶑䩘′᠖ࠍ昅Ⴀ卋ᢀ冎ᘠẞ䠌✆犒ϙ¼徐⯥į৊擡∎䀹᢬嘔緥Ǖ㤀ㅙ揃亡炷ᙸⴭԾ䊟㵀သ『痬ᓆ潬㞹፛沌劅ሺࢰ䁤㔵昂䱊❽䀑榉哄塀㤷ᘐ಍ۅ䈂熆ၽ曨牯㖲祀✙Õ㬫▝僨⠱玀㥛㲀៤䮟ᰅ恒⁻Ԑࠛഭ晜ナ悰䆊࡙ᘐᰲȸ悕䥉澸Ũ珥ɿ࠹\u0016朦⬋冕ۂ湶ス䨌䘆เહ䂧ᡘ摯㨨ᡝຌ圦瞐ބ塀㄰ᒅᦛ湅เ䐛⒀穀〻ဴ䠏І᱀䅙ⲧ䠁⋨ǳ㩀ᓍኣᆁ̑䦘柉ጼིԏᱠ勉◬ᓜ潓猀䞊㻀࠯ࠓᶕ壘楰㦲䨞քޒ杀ۯሓ洀烳䄜竏ዲ礃ᶕ峊狦ƺᲘⷌ䛶温䮰ħ搀绢Ԉ޸爢䜨Ԡ及˟㫲亜䀵㼠ࢫ䰈ၯ㩳,朆拃ᆑ䂰摨㠬抠䪋䘆刂地ࠋ吁䉹ᙢܱ䑜倜倀耀"}

export const worlds = [
  { name: "empty", data: world2 },
  { name: "particles", data: world1 },
  {name:"more particles", data:world3},
  {name:"starter" , data:starter},
  {name:"starter2", data:starter2}
];
