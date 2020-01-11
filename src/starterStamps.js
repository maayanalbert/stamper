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

var empty = {
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


export const starter = {"fns":[{"name":"style.css","code":"\nhtml, body {\n  margin: 0;\n  padding: 0;\n}","args":" ","x":1214.0152913777786,"y":-177.38952700122098,"editorWidth":225,"editorHeight":175,"iframeWidth":200,"iframeHeight":200,"isHtml":false,"isCss":true,"hidden":true,"exported":true},{"name":"index.html","code":"<html>\n  <head>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/p5.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.dom.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.sound.min.js\"></script>\n    <link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">\n  </head>\n  <body>\n    <script src='sketch.js'></script>\n  </body>\n</html>\n","args":" ","x":717.7235737149142,"y":-174.70178004670035,"editorWidth":225,"editorHeight":175,"iframeWidth":200,"iframeHeight":200,"isHtml":true,"isCss":false,"hidden":true,"exported":true},{"name":"keyPressed","code":"\nbackground(255)\nfill(117,250,151)\ntextSize(50);\n\n// display last key pressed.\ntext(dotSize + ' ' + keyCode, 20, 70)\n\nif (keyCode == 187) { // keyCode for '+'\n  dotSize++\n} else if (keyCode == 189) { // keyCode for '-'\n  dotSize--\n}\n","args":"","x":2368.480604262091,"y":833.4887820007216,"editorWidth":367.4416035868834,"editorHeight":236.03934381388729,"iframeWidth":200,"iframeHeight":200,"isHtml":false,"isCss":false,"hidden":true,"exported":true},{"name":"draw","code":"\ncolorMode(RGB, 255, 255, 255, 1);\nbackground(151, 97, 246, .01);\nstroke(255);\nstrokeWeight(1)\n\nif (mouseIsPressed) {\n  line(mouseX, mouseY, pmouseX, pmouseY);\n}\n","args":"","x":1165.4509496828648,"y":742.6970514094569,"editorWidth":225,"editorHeight":175,"iframeWidth":200,"iframeHeight":200,"isHtml":false,"isCss":false,"hidden":false,"exported":true},{"name":"setup","code":"\ncreateCanvas(200, 200)\n","args":"","x":670.8836830009536,"y":744.080110275419,"editorWidth":225,"editorHeight":175,"iframeWidth":200,"iframeHeight":200,"isHtml":false,"isCss":false,"hidden":false,"exported":true},{"name":"dotPattern","code":"\nbackground(255, 10)\nfor(var i = 0; i < 10; i++){\n  basicDot(mouseX, i*20 )\n}\n\n","args":"","x":3330.0227123737986,"y":834.9322956589234,"editorWidth":225,"editorHeight":175,"iframeWidth":279,"iframeHeight":257,"isHtml":false,"isCss":false,"hidden":false,"exported":true},{"name":"basicDot","code":"\nnoStroke()\nbackground(255, 10)\nfill(117,250,151)\nellipse(x, y, dotSize, dotSize)\n","args":"x=mouseX, y=mouseY","x":1877.4903434233374,"y":837.7006059839921,"editorWidth":225,"editorHeight":175,"iframeWidth":200,"iframeHeight":200,"isHtml":false,"isCss":false,"hidden":false,"exported":true},{"name":"sizeDot","code":"\n// generate a random size\nnoStroke()\nvar size = random(0, 20)\n\n// use it to draw the dot\nfill(86,220,248, size*.05 *255);\nellipse(x,y,size, size);\n","args":"x=mouseX, y=mouseY","x":3895.5198057448943,"y":835.3288232987358,"editorWidth":225,"editorHeight":175,"iframeWidth":200,"iframeHeight":200,"isHtml":false,"isCss":false,"hidden":false,"exported":true}],"blobs":[{"code":"/* and comments!\n \n  click the 'T' to\n  toggle text-size\n  \n*/","editorWidth":348.3514917659609,"editorHeight":195.5945895797871,"x":2369.39170216625,"y":566.2162988773974,"hidden":false,"codeSize":28},{"code":"/*\n READ ME\n   ____    __    ____      ____    ______ ______           ____    ____    ____       \n  /\\  _\\  _\\ \\ _/\\__ \\    /\\  _`\\ /\\__  _/\\  _  \\  /'\\_/`\\/\\  _`\\ /\\  _`\\ /\\  _`\\     \n  \\ \\ \\/ /\\_` ' \\/_/\\ \\   \\ \\,\\L\\_\\/_/\\ \\\\ \\ \\L\\ \\/\\      \\ \\ \\L\\ \\ \\ \\L\\_\\ \\ \\L\\ \\   \n   \\ \\ \\ \\/_>   <_ \\ \\ \\   \\/_\\__ \\  \\ \\ \\\\ \\  __ \\ \\ \\__\\ \\ \\ ,__/\\ \\  _\\L\\ \\ ,  /   \n    \\ \\ \\_ /\\_, ,_\\ \\_\\ \\    /\\ \\L\\ \\ \\ \\ \\\\ \\ \\/\\ \\ \\ \\_/\\ \\ \\ \\/  \\ \\ \\L\\ \\ \\ \\\\ \\  \n     \\ \\___\\/_/\\_\\/ /\\___\\   \\ `\\____\\ \\ \\_\\\\ \\_\\ \\_\\ \\_\\\\ \\_\\ \\_\\   \\ \\____/\\ \\_\\ \\_\\\n      \\/___/  \\/_/  \\/___/    \\/_____/  \\/_/ \\/_/\\/_/\\/_/ \\/_/\\/_/    \\/___/  \\/_/\\/ / \n\n     An Artbord-Oriented Programming Enviroment for the p5.js Library.\n     \n     In Stamper, your code is structured into \"Stamps\", there are 5 types:\n     \n     1. Function for Setup(), Draw(), keyPressed(), yourFavFunc(), etc.\n     \n     2. Anything for everything else: Global Variables, Comments (like this one), Classes, etc.\n     \n     3. Console for printing messages\n        \n     4. HTML for updating the webpage which holds your sketch\n     \n     5. CSS for updating global style of that webpage\n*/","editorWidth":712,"editorHeight":309,"x":231.105803149567,"y":175.00967117636048,"hidden":false,"codeSize":14},{"code":"//This is an \"Anything\" Stamp\n// Which can be used for global variables\n\nvar dotSize = 20;","editorWidth":235.27929098049674,"editorHeight":101.6125006152455,"x":2090.1232297229144,"y":661.2246291643922,"hidden":false,"codeSize":14},{"code":"/*\n  Stamps can call one another. Try switching out the 'basicDot' for the 'sizeDot'\n*/","editorWidth":276.296346723557,"editorHeight":109.39558738280925,"x":3577.074740971314,"y":656.1956771244991,"hidden":false,"codeSize":14},{"code":"/*\n  A Stamper project is ~= to one p5 sketch, this means:\n    \n    1. Everything is in global scope and you can call functions freely\n    2. When you're export, the Stamp named \"draw\" will act as the draw() function, if you import this code into the p5 web editor.\n*/","editorWidth":451.14440157092827,"editorHeight":151.54048537765823,"x":752.0874271415859,"y":1086.0441248123698,"hidden":false,"codeSize":14},{"code":"/*\n\n  Duplicate a Stamp to try a new idea\n  \n  1. Click on Stamp titlebar\n  2. Hold Option (⌥) and drag to new position\n  3. Release Mouse\n\n*/","editorWidth":225,"editorHeight":168.28845558398316,"x":3892.7486139641014,"y":599.7783058248328,"hidden":false,"codeSize":14},{"code":"/*Stamps can be hidden by clicking their eye-cons in the layer list\n\n*/","editorWidth":291.0811563031933,"editorHeight":200,"x":987.2292727588588,"y":178.52248092290748,"hidden":false,"codeSize":28}],"scale":0.6854017092287545,"console":{"x":67.20990314036078,"y":559.9352212006518,"consoleWidth":225,"consoleHeight":200,"hidden":false},"originX":209.47972499070545,"originY":14.546644181615989,"compressedJs":"ផ࠘ⷌ䈆᭻㖵䫜瑳ႅࠂ䐄ض捋ඬ䃨桥ဓ唉搎䛰儁Ǒ廎杬㊐ᴙ⼎䋗ᭋ榔ᑀ ᔗ䊋敁∅ሪԐ䂚䔊တࠗ毫痲ب⌘ඌ࣌ౢ䊱惹“愆㣫䠁༯⸐ࠗ磀䗂˹㵱㺾⁜戍煆ఋ䈌⢖ၤ䁀张戍䯉残狶˦⢃ᰑ䝗戧ᜋ碇昂ĹŰ很䇄ຮࠗ֋䓅拾᱋੎䳄ᗣັ䜘䄜ぇᐂⶌჅ⯣رਇ戂ā玐ř䝘ឯ秀᝸儬⢮ᑁ㡀屟挣ࠋ௸坎 ㌕⑘†៣嗱攼䀋š³ࡡ䔴猀䈱䗙ᖎ ㌘徐य瞀⸱❸啼㏿᠃岿昁ࡲ#境،⁞ᖙ㢿䐲携猃㤈ౖ嘰匙⿈ð⾯焞׸灬⡶ᰫᐵ䕹掂㉃㨈เӁ+ಲ䅮ဠ岝్眦Ⅺ㷉勊湴㊲ࠔํ癷ጋ㖵勜朠⊷ᶚ⹍繀ᙹƙ廥攂掸ോ䵎㈄捋৉䋤礮挣熁䤭戅ᮣֵ惊爬ြ寝⹄ض笣ᒁ勦⁳㨹ᵘ溎圦⬡ƥ峨漠ᅢ䧜摅䱅ஓᒁ䋤攠᪐ᴞ⸌圳噢䓄局䙵㜱崚ⷭ汗窛ᗑ櫠⠩ᘐᄜ䰮籀䍛ᗥ⃤敳㦲失ǘ䝄㌋嬐枈ཥ㨱筀Ꮶ⋢ȋ㧥棑搀汢᎙⻌圬㡻ᖱ曊㨠⎶ᯘ䰭䈅㌋䦥䋄汥㦖ࠐ糠㲲Ńㆥ囊⁴㐴峈෭晒䥡č壂獳我琙䙥戄᭻㧍廘旅㊸Ლⷎ䱆᭫ᗍ曂来㧣ল◦䋢ɂ儵ᦊⱵ㠲ᡱ▜䀖㮻ᖉ惂来ျ娚ⱭȆ䍻㆑柌ŕ㦵奝౭ೇᦩ㢁ڦ収↳禀ᦎ㝇䭣ᒁ廌⁴㐰崲જ偆楺厐ƚ楳ူ守ѝ\u0011䄗᠇Ȕ⼯ါ煞౬ᛢ̓ᒁ櫦敤抰㇕滝\u0012ᡐ⧙䋤⁤㞺ᓚ⽌刃椁䣀矊ӈ挤ᳱ⠌㘖捧င汀慮㟲|ׄՇᏉǍ滒瑣戺ࠛ溮习⤃অ曒捄㞺৺⁍䉾 缐◐Ԡဠ熖䲼䀕卻⦕䛩搀憿཈ຍ籖ᮁ垜Ɂ搂ⶴ峈ඬ嘖眸॓ਊㄮဢ窀㻼䀐୷␄囆潰爀⤙ᲀᙾ倅斛丅ųဳᲙⲭ䞜⨹䢸䂮桥㝢ઉ湌分⯃䆽擩䑳㋳'損昖欫ႀ䓈牡㮑ࠝ洭䛂̋ැ䃂珅ᇢ֊Թᖢ愃▛૨業戣禀᜼怳张ಷࡤ瀵爀漈ಬ䚗⍻䢻丂ഊတᄝ⸍䚖ᬋ冔䃃䝹战岞␌ሆ猫岁勈敡爃᝹‟о⠴▿万␠㨴崛ಬ☗ၗᐃᲐ潬㈐ᏜᲠ㚢䜔㊔及ĉ㈹ᡙ碊ⱄ掃㷍厈Ἂ犁㣔䲭䙖஛ᒁ᫞畳㊅㦀ሽ〟ᬓᒁ僒摤㊷࠘似恰᜸ଢ଼勤⁥㲲䭘粀ᔆ䭶၈䃘慹㊹ࠛമ㝌⩇ ⷚϜ㶅ʘ䰬㚶㮓㷕峈⠲᪚䩂䳍ᛆ慁䓄湘㈵᠖్☥Ⴎ›䎐Ԏ⠵᠔仂岀ⱆ⍋䷁壂礠㘰峝ᢊȇز䒻੘⣨ś䫈ӤɲŞႉ۞摥ᘐಌքͳň⠩勌 掋ࠏ➤̓䆹⒁癀⼯搕祀唤犲㡑Π؈⬫Ծ祁ৼ䀝⹱烧⡸ⷋḖ䭂価₧潐Џ䰄⥻ԅᣛ涍眤死ᆔ傤䝂ᘐ಍⚹䁓ॉ澰Ⱦㄵᢖࠎ⛥䈃ᆡ墰䁜ツྐྵ崜䷭㙞⠉欠᪮敩㎴ᴊؼ瀎㭯ဇᒒ珧¹䩈ཡ∂ͣ▹䮌ᥘᘐㅂଥ䈇ـ䜘ኲ⤻瞀⶜糀婮 巉䫂瑥↰宝䰮㊃ᆁ䎐ʵ搁⯥䭙෮䔆ண冕擝猁猖ࠌ★Ⴆ㍻䢣䠈晩သ䠌ݤڒǡÇࠐ⬫ᓲ)㴀䍮䠅▤呤〠ᓲ%㦍Გ㯁眠勳䘊Ⳣṛ䷪㹠ङ⟘ĉ焂㜲嬛മܶ⥃悰䃲⳨á㉂㷀๞㠦᭝癞⼠㎲宙⹜怼㮓ֹ䣞淅᧶%㲀လ₡÷ไ⣥§ੱ⟮幀፻厐ݕ搂ᥳę෮习֩惘塤㈰ᘙഎ֘吒共䃔䁕昂ӵ1༥䱁昱ஐٺ紊耂老"}
var particles = {"fns":[{"name":"style.css","code":"\nhtml, body {\n  margin: 0;\n  padding: 0;\n}","args":" ","x":2487.723154997192,"y":454.1828386163433,"editorWidth":155.2851590781397,"editorHeight":108.88644457518404,"iframeWidth":225,"iframeHeight":200,"isHtml":false,"isCss":true,"hidden":true,"exported":true},{"name":"index.html","code":"<html>\n  <head>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/p5.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.dom.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.sound.min.js\"></script>\n    <link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">\n  </head>\n  <body>\n    <script src='sketch.js'></script>\n  </body>\n</html>\n","args":" ","x":2926.0613195853425,"y":460.660255253893,"editorWidth":331.9915568373324,"editorHeight":267.30348833629085,"iframeWidth":225,"iframeHeight":200,"isHtml":true,"isCss":false,"hidden":true,"exported":true},{"name":"setup","code":"// nothing much to see here\ncreateCanvas(300,300) // this won't alter the window size\nbackground(backgroundFade)\nnoStroke()","args":"","x":1922.4727804881593,"y":-28.839556505847952,"editorWidth":300,"editorHeight":95.77622017221594,"iframeWidth":229.2823664771775,"iframeHeight":125.05858664939339,"isHtml":false,"isCss":false,"hidden":true,"exported":true},{"name":"basicDot","code":"fill(255);\nellipse(x, y, 10, 10)","args":"x=mouseX, y=mouseY","x":-59.00091994708015,"y":619.609814794894,"editorWidth":181.2419711791158,"editorHeight":111.52588114745845,"iframeWidth":134.907702273812,"iframeHeight":130.38322448430927,"isHtml":false,"isCss":false,"hidden":false,"exported":true},{"name":"speedColorDot","code":"if(!speed){\n  speed = random(0, .01)\n}\n\n// set the opacity and color based on the speed the dots are moving\nvar opacity = max(100, speed *100 * 255)\nvar colorOff = speed *100\nfill(150 - colorOff*40, 100+ colorOff*80, 255, opacity);\nellipse(x,y,5, 5);\n","args":"x = mouseX, y=mouseY","x":329.9599253794122,"y":976.0473944121347,"editorWidth":296.7340422149467,"editorHeight":176.59932474664424,"iframeWidth":169.71609003165736,"iframeHeight":195.90489555790055,"isHtml":false,"isCss":false,"hidden":false,"exported":true},{"name":"getPosition","code":"\n if(angle === 0){\n  lastFaderX = faderX\n  faderX = faderX*.97 + .03* mouseX / width;\n  speed = abs(faderX - lastFaderX)\n  randomSeed(actRandomSeed); \n }\n var randomX = random(0,width);\n  var randomY = random(0,height);\n  var circleX = width / 2 + cos(angle) * 100;\n  var circleY = height / 2 + sin(angle) * 100;\n  var x = lerp(randomX,circleX,faderX);\n  var y = lerp(randomY,circleY,faderX);\n  if(mouseIsPressed){\n     background(backgroundFade, 10)\n  var angle = map(mouseX, 0, width, 0,7)\n  var circleX = width / 2 + cos(angle) * 100;\n  var circleY = height / 2 + sin(angle) * 100;\n  basicDot(circleX, circleY) \n  }\n\n  \n  return {x:x, y:y}\n  ","args":"angle","x":1307.5816569518977,"y":677.5063472275517,"editorWidth":379.21463817319534,"editorHeight":376.8484971084752,"iframeWidth":289.3981629416132,"iframeHeight":292.2735384641079,"isHtml":false,"isCss":false,"hidden":false,"exported":true},{"name":"drawFadedParticles","code":"background(backgroundFade, 20);\n\nfor (var i = 0; i < count; i++) {\n  var angle = i*360/count\n  \n  // mix and match dot functions here!\n  pos = getPosition(angle)\n  basicDot(pos.x, pos.y)\n}","args":"","x":655.2944910006604,"y":-49.9258150353464,"editorWidth":309.7943589626219,"editorHeight":146.47663811577075,"iframeWidth":297.3456070084918,"iframeHeight":298.4895813984271,"isHtml":false,"isCss":false,"hidden":false,"exported":true},{"name":"speedDot","code":"\nif(!speed){\n  speed = random(0, .01)\n}\n\n// set the opacity based on the speed the dots are moving\nvar opacity = max(100, speed *100 * 255)\nfill(150, 100, 255,opacity);\nellipse(x,y,10, 10);\n\n","args":"x = mouseX, y=mouseY","x":-159.95756973196586,"y":906.1192916260952,"editorWidth":308.7544796011597,"editorHeight":185.16405770099925,"iframeWidth":116.75259491582909,"iframeHeight":204.18278884948927,"isHtml":false,"isCss":false,"hidden":false,"exported":true},{"name":"sizeDot","code":"// generate a random size\nnoStroke()\nvar size = random(0, 10)\n\n// use it to draw the dot\nfill(86,186,255, size*.1 *255);\nellipse(x,y,size, size);","args":"x = mouseX, y=mouseY","x":327.8196574329079,"y":620.3268102451857,"editorWidth":199.66994116856335,"editorHeight":179.9979040763115,"iframeWidth":91.90910563176772,"iframeHeight":206.14265666314918,"isHtml":false,"isCss":false,"hidden":false,"exported":true},{"name":"drawParticles","code":"\nbackground(40);\n\nfor (var i = 0; i < count; i++) {\n  var angle = i*360/count\n  pos = getPosition(angle)\n  \n  // mix and match dot functions here!\n  sizeDot(pos.x, pos.y)\n  speedColorDot(pos.x, pos.y)\n}","args":"","x":-6.737551201596916,"y":-46.19936428968789,"editorWidth":300,"editorHeight":193.4799063003186,"iframeWidth":303.3009633960733,"iframeHeight":302.15825303488214,"isHtml":false,"isCss":false,"hidden":false,"exported":true}],"blobs":[{"code":"// globals\n\nvar actRandomSeed = 0;\nvar count = 300;\nvar faderX = 0\nvar backgroundFade = 40\nvar lastFaderX\nvar speed\nvar angleUnit = (360 / count);","editorWidth":200,"editorHeight":201.84709943153263,"x":1670.5811271907414,"y":-31.050619448774135,"hidden":true,"codeSize":12},{"code":"// a helper function to get the particle pattern, mouse over the canvas while pressing your mouse down to visualize what it does","editorWidth":864.7567589687693,"editorHeight":56.38414040982718,"x":1082.4240330014338,"y":553.2565203857729,"hidden":false,"codeSize":24},{"code":"// setup stuff","editorWidth":355.59623103433,"editorHeight":37.85493935071861,"x":1753.6850108693698,"y":-135.0995569860125,"hidden":true,"codeSize":24},{"code":"// the particle pattern","editorWidth":612.8513837941782,"editorHeight":38.73195511379262,"x":-155.73357031076716,"y":-150.3640165446208,"hidden":false,"codeSize":24},{"code":"// different types of dots, mouse over the canvases to see them","editorWidth":850.4735375344712,"editorHeight":34.487326158190314,"x":-327.7333275664664,"y":509.4890524416247,"hidden":false,"codeSize":24}],"scale":0.48753207296132967,"console":{"x":2406.431838044327,"y":726.7041236433164,"consoleWidth":398.5547609288658,"consoleHeight":312.41625580738497,"hidden":true},"originX":435.55907755431997,"originY":175.31588208790083,"compressedJs":"ភ䠙涍瘦ୣ䰨ᓬ慲ူ壝ੌᛦ⍻㕍䫊搠Ẑఎ碢瘶箫㧐䁺″ᡣ䑙䰬䙗዆ႇਞ扡ㆵ姜䷮囦∳֑䩀㴠ᩣ؛మ㝌ₓ䥣ਞ獰㊲失䴍晶挪喹厈唨ᦛఈ׸時䧘⠨幞⁡ဴᥛฌ圢̳喹䛨楯㜐ᴛ搌癗℃冡䩀灡㤺ᩘ涘䂗⎣ᗉ屘⁭㞺峙␍睦⮖ᒅ䛂湶ス䠝洍᱂⮓ᗍ曒湧ြ寝⹘犦⍻引⓬楳㪰嬚⽌切㭃א䃒琠㈷奜粠ࠧᬫ凕恀獴㪳ᦱ√䞜⣋ᆥ䳌敲㊷ᴈຏᜆ⮙ƽ䱀摯㨹緀ኬ圼⏃䶕䮈ᑭԅ㩀ᰘ圂䅋漑⛜潴㑲,䶮嘶䙁㶡䫤攊ㆹᥘ⺌吼⩑⃌恠ⰳ᠘ੈᲠ০䮙ǝ廜❴ူ嬝ᣮ❶䭳ᆽ湀獩㴲䊺䀴ኌ偟ဆ㑒੮㞩崜䷭㙒䅈⧷嘁ᅢス婘梍睂䏁瞔Ɣ堬ြ熂䬥ឰ匳▱塐㈵᪔仂䲭䛆䮃䶔僰Ⱐ㲖ࠌ☘䁌牟ᐇ溆潬㞹ㅔЇ幠ࣦ㥉勌⠡抔䩞慄ౣᤁ璁旊ʍᐘଈ׆̜⪷᠆㧊á㞸ᡘ洮䞒̋㦐䃇䑟爀ⵙⲄเᅻ↗ຉ䐊爀摈మ♒ͫ㷙勜查Ł㈏➤ۖு⃄恠ⳇᢕౌ؄ʢܠͷ੓䕚➳ᦈ޹㈞〈ӄ橠‭撐䪍Რ࿃Ş⡈灠Ⳅ⒖㈛嶠ዷ䥡咰䇈ł皀䭙沮䔆箛✐ᡑ攃ጔ廂䅄ږ㘰㒀空㴠ᡲ䁈絀㗂ǯᰎ—⃇Ӥ䒊䗇፲ř¸恦⫧º䠋搎皖⎣⃯嘂晡ㄹ䨱朥岵䅈⢃七Ǥȇ਻₃䊓夀⢁稔⃤ㆉᢎ屠允䂳૆⧄㉥ࡖ㦄ᚆ⭋ᶣ䠇濆ᄱ婜䱭䙜∞ᓨ䁞′ၲR๼瀐℁⮐ʵ丮戨㆑磥眶佀ӏᱟ搂㤶ᥜ丅౧狁㌝屙昀穴䀡㲀⃜奂朜傳䰨㒳ਹ җ᪇ထ㏎ʯတ㫁⁽瀶ᜰృ೅朁成᭘⸘摵䅡À姌ô戅ෲԿ瀑߸у瘂ჩǫ燘䖙ϒ䤀⢀䃺ਊၢȜ䲮䝗፱ǭ灵搃欝ṟ㢂绀ᔳᇉ䋯搀溲ᐹ悢䜾‥珬Ȉ㈰爁㩙䷮∂䜠ˉ及ٜဴ䠏᳀徃夃⒬噒⃤¦㬀┍ኣᦱ䂿੅昀䲗䯈තណ⠟䦵䋨捨爁盺⃄圾⠩ᢄᑀ⁰㞹䠏㹠㒾怈ׁ廦⹸ᙢો似䁅垈ዋ瘉ⷿɗ㽁ᗟ灊⟸ና搉ⓨɅ㥁ྜ恆羰ᆻ下ᬻշĜ㲀戏堇⾐၄敮㊹ᡝತ؞㠇ଔ様ع犃睹éເࠧဋ澈㿤΃婝ᲀ沞‑宠Ǜ昀尜උا͢木ᒓࢂ⨮ᢐ઼Ëޒ映漘䉒㯱ń㭀偽䀨↧簉槾ɴ犁ᴾ恉⿰ᑿⰊῐţ省᳹恇ຐ㣎㡻䠅ᄀ耀"}


export const worlds = [
  {name:"starter" , data:starter},
  { name: "empty", data: empty },
  {name:"particles", data:particles}
];
