import pf, { globals, p5Lib } from "./globals.js";

export const builtInFns = [
  {
    name: "draw",
    args: "",
    code: `background(102, 0.1);
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
  code: `fill('blue')\nellipse(posX, posY, 30, 30)`
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

export const worlds = [
  { name: "empty", data: world2 },
  { name: "particles", data: world1 }
];