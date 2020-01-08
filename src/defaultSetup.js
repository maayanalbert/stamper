var cssCode = `
html, body {
  margin: 0;
  padding: 0;
}`;

var htmlCode = `<html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/p5.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.dom.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.sound.min.js"></script>
    <link rel="stylesheet" type="text/css" href="style.css">
  </head>
  <body>
    <script src='sketch.js'></script>
  </body>
</html>
`;

var setup = {"blobs":[{"code":"/* and comments!\n \n  click the 'T' to\n  toggle text-size\n  \n*/","codeSize":28,"editorHeight":170.19109860377665,"editorWidth":354.70900337275435,"hidden":false,"originX":0,"originY":0,"scale":0.7676893919706339,"x":1852.2303712131875,"y":460.0827512550624},{"code":"/*Stamps can be hidden by clicking their eye-cons in the layer list\n*/","codeSize":28,"editorHeight":165.3477841240168,"editorWidth":307.1892154701716,"hidden":false,"originX":0,"originY":0,"scale":0.7676893919706339,"x":824.9440861374821,"y":151.9388674746644},{"code":"// This is an \"Anything\" Stamp\n// Which can be used for global variables\n\nvar dotSize = 20;","codeSize":14,"editorHeight":98.52985762467915,"editorWidth":266.5912253449911,"hidden":false,"originX":282.62676656995563,"originY":-15.46266693473126,"scale":0.7676893919706339,"x":1644.793753629589,"y":502.0226501105607},{"code":"/* READ ME\n   ____    __    ____      ____    ______ ______           ____    ____    ____       \n  /\\  _\\  _\\ \\ _/\\__ \\    /\\  _`\\ /\\__  _/\\  _  \\  /'\\_/`\\/\\  _`\\ /\\  _`\\ /\\  _`\\     \n  \\ \\ \\/ /\\_` ' \\/_/\\ \\   \\ \\,\\L\\_\\/_/\\ \\\\ \\ \\L\\ \\/\\      \\ \\ \\L\\ \\ \\ \\L\\_\\ \\ \\L\\ \\   \n   \\ \\ \\ \\/_>   <_ \\ \\ \\   \\/_\\__ \\  \\ \\ \\\\ \\  __ \\ \\ \\__\\ \\ \\ ,__/\\ \\  _\\L\\ \\ ,  /   \n    \\ \\ \\_ /\\_, ,_\\ \\_\\ \\    /\\ \\L\\ \\ \\ \\ \\\\ \\ \\/\\ \\ \\ \\_/\\ \\ \\ \\/  \\ \\ \\L\\ \\ \\ \\\\ \\  \n     \\ \\___\\/_/\\_\\/ /\\___\\   \\ `\\____\\ \\ \\_\\\\ \\_\\ \\_\\ \\_\\\\ \\_\\ \\_\\   \\ \\____/\\ \\_\\ \\_\\\n      \\/___/  \\/_/  \\/___/    \\/_____/  \\/_/ \\/_/\\/_/\\/_/ \\/_/\\/_/    \\/___/  \\/_/\\/ / \n\n     An Artbord-Oriented Programming Enviroment for the p5.js Library.\n     \n     In Stamper, your code is structured into \"Stamps\", there are 5 types:\n     \n     1. Function for Setup(), Draw(), keyPressed(), yourFavFunc(), etc.\n     \n     2. Anything for everything else: Global Variables, Comments (like this one), Classes, etc.\n     \n     3. Console for printing messages\n        \n     4. HTML for updating the webpage which holds your sketch\n     \n     5. CSS for updating global style of that webpage\n\n*/","codeSize":14,"editorHeight":290,"editorWidth":676,"hidden":false,"originX":0,"originY":0,"scale":0.7676893919706339,"x":349.00619896050864,"y":155.27021550077865},{"code":"/*\n  Stamps can call one another. Try switching out the 'basicDot' for the 'sizeDot'\n*/","codeSize":14,"editorHeight":110.28612602487812,"editorWidth":300.5714094617597,"hidden":false,"originX":0,"originY":0,"scale":0.7676893919706339,"x":2575.6535841590558,"y":512.3757763314227},{"code":"/*\n  A Stamper project is ~= to one p5 sketch, this means:\n    \n    1. Everything is in global scope and you can call functions freely\n    2. When you're export, the Stamp named \"draw\" will act as the draw() function, if you import this code into the p5 web editor.\n*/","codeSize":14,"editorHeight":158,"editorWidth":465,"hidden":false,"originX":0,"originY":0,"scale":0.7676893919706339,"x":643.4022632181682,"y":778.4010462972009},{"code":"/*\n  Duplicate a Stamp to try a new idea\n  \n  1. Click on Stamp titlebar\n  2. Hold Option (⌥) and drag to new position\n  3. Release Mouse\n*/","codeSize":14,"editorHeight":113.07436560542837,"editorWidth":411.46198635889164,"hidden":false,"originX":0,"originY":0,"scale":0.7676893919706339,"x":2822.5651142202446,"y":512.1624845761107}],"console":{"consoleHeight":224,"consoleWidth":220,"hidden":false,"originX":1004.6898982788305,"originY":-30.29915414513107,"scale":0.7676893919706339,"x":282.25833447049956,"y":395.20177816351355},"fns":[{"args":" ","code":"\nhtml, body {\n  margin: 0;\n  padding: 0;\n}","editorHeight":175,"editorWidth":225,"hidden":true,"iframeHeight":200,"iframeWidth":200,"isCss":true,"isHtml":false,"name":"style.css","originX":1741.7078732136542,"originY":130.85751294965604,"scale":0.6775643374025817,"x":1228.6214214610281,"y":214.96242299706108},{"args":" ","code":"<html>\n  <head>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/p5.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.dom.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.sound.min.js\"></script>\n    <link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">\n  </head>\n  <body>\n    <script src='sketch.js'></script>\n  </body>\n</html>\n","editorHeight":175,"editorWidth":225,"hidden":true,"iframeHeight":200,"iframeWidth":200,"isCss":false,"isHtml":true,"name":"index.html","originX":1741.7078732136542,"originY":130.85751294965604,"scale":0.6775643374025817,"x":1425.3752845524734,"y":217.0974917737948},{"args":"","code":"background(255)\nfill(117,250,151)\ntextSize(50);\n\n// display last key pressed.\ntext(dotSize + ' ' + keyCode, 20, 70)\n\nif (keyCode == 187) { // keyCode for '+'\n  dotSize++\n} else if (keyCode == 189) { // keyCode for '-'\n  dotSize--\n}","editorHeight":182,"editorWidth":413,"hidden":true,"iframeHeight":118,"iframeWidth":197,"isCss":false,"isHtml":false,"name":"keyPressed","originX":889.007514520416,"originY":269.8040062840238,"scale":0.7676893919706339,"x":961.253652168773,"y":539.9161365527827},{"args":"","code":"colorMode(RGB, 255, 255, 255, 1);\nbackground(151, 97, 246, .01);\nstroke(255);\nstrokeWeight(1)\n\nif (mouseIsPressed) {\n  line(mouseX, mouseY, pmouseX, pmouseY);\n}","editorHeight":179,"editorWidth":309,"hidden":false,"iframeHeight":200,"iframeWidth":200,"isCss":false,"isHtml":false,"name":"draw","originX":0,"originY":0,"scale":0.7676893919706339,"x":914.4621169685273,"y":545.8313547694676},{"args":" ","code":"createCanvas(200, 200)","editorHeight":178,"editorWidth":204,"hidden":false,"iframeHeight":200,"iframeWidth":200,"isCss":false,"isHtml":false,"name":"setup","originX":0,"originY":0,"scale":0.7676893919706339,"x":612.965425514595,"y":546.8721690976088},{"args":"","code":"background(255, 10)\nfor(var i = 0; i < 10; i++){\n  basicDot(mouseX, i*20 )\n}\n","editorHeight":175,"editorWidth":225,"hidden":false,"iframeHeight":200,"iframeWidth":200,"isCss":false,"isHtml":false,"name":"dotPattern","originX":0,"originY":0,"scale":0.7676893919706339,"x":2434.1382983107806,"y":640.4186577408053},{"args":"x=mouseX, y=mouseY","code":"noStroke()\nbackground(255, 10)\nfill(117,250,151)\nellipse(x, y, dotSize, dotSize)","editorHeight":175,"editorWidth":225,"hidden":false,"iframeHeight":200,"iframeWidth":200,"isCss":false,"isHtml":false,"name":"basicDot","originX":0,"originY":0,"scale":0.7676893919706339,"x":1524.8344849444825,"y":625.2196042839628},{"args":"x=mouseX, y=mouseY","code":"// generate a random size\nnoStroke()\nvar size = random(0, 20)\n\n// use it to draw the dot\nfill(86,220,248, size*.05 *255);\nellipse(x,y,size, size);","editorHeight":175,"editorWidth":225,"hidden":false,"iframeHeight":200,"iframeWidth":200,"isCss":false,"isHtml":false,"name":"sizeDot","originX":0,"originY":0,"scale":0.7676893919706339,"x":2766.9123106515162,"y":640.4347516059636}],"originX":1711.8106112865134,"originY":90.05420049639952,"scale":0.6635166071355336,"compressedJs":"ផ࠘ⷌ䈆᭻㖵䫜瑳ႅࠂ䐄ض捋ඬ䃨桥ဓ唉搎䛰儁Ǒ廎杬㊐ᴙ⼎䋗ᭋ榔ᑀ ᔗ䊋敊㝆୫䇌䃆慮ေ᥈഍ᙆ⌫㢁䓳䙄㒷᧱࣭ᜢ̫斔嫆潮㦐ᩛ墫ᛆோᗈ䃘楳㩢凋搊䚆䮙ƥ晀慮ထၛ伮䚆䭳ᲈ䆊廄ྫ娚Ɑಆ㎫䶕䡀景㤐᧛෬☖愃妅擒慢㘲峂䅎昗ᄃᆽ梦楺㊐཈نΰ兹⢁⒊䅄ဦ兂䐄ȅ竺絼䆊ࣆͣȳ̘催㠾⠇ᡁ为爀䱋殄ȅ縰ᅰ䂾⽜⾯䠗ᢃ㱑䌂炃ਥ䐙တៈᢃ㋲㫢粽䂹䨠朄㇕碉旂縡禀䁎⁜២ၱΫ䈅慢焱㢿䜒抓匱ո掬㇆၇఑攀䭣б⫸憌⊁碀䁀㳤V㇖׫繰מᑋਫ䔐⸐᜗磈戂拾ᗓ䠁泅⤖ࠈ׸畼㥏ဂ恘‬战ㅍ᳀ႌㅶ╣䠁Ⳇ៤ɋ締஌⧞ᕟ೿昀眯禀∜䀈瘠憃ࠗ䕦ⸯ焌夎峀湂̕喌ᓆ⯲<௫籇䅾ᰛਝ䜊攍ㅞ㣠䲐溂ΐİ 挬偛䐈ᜧ⌓㷉䡚佲㒲宝ಬ䈅Γ㶝擂浭爁䓑ⷎ暗፿ဍ揊ˆ爁䐜ڥ暧ᤂㆥ䓤慲㲗㆑磀撖眰ఙ䫤Ⱐ㲷嵜䐌㛶⌯ဌ哦瑲㪱崝⹌噂͋㧑幀⋅Ꮉ䢋ᢊᜦ⤃׉䩀㔠㨼尙⹧ⳅউ㢁೪湣㨴寛墯甶⮣嗀偒Ⱐ∹ᡝ碁ڶ⯊䇉䫦獥㉢αຈ昗㘡伐Ị瑣皀⟌䗄຀ᵾᔹ䫬敲掇奛๬厢ȿ᠎䢭栃刖ࠐ糠䛒Ńㆥ囊⁴爁纛淌劒愂න䋦珄ᇨᦌ旄ж筳䶽壋䕥㠹ᩛ亘䘶欫䷍䋎敳挓㉋暅戄䊢㔳੘異㈰煋ᲀᙷ㬫ু䋎攠㯲䄓洍盆⎟᠅⫦步㨱娳๦勢Ț䵏ᲇ朄㠹崞ⶌ分笱Ǒ僂瓈⨅㦁∁∎」㾘ਦ捡㘶㤀ᮄؖ獿ဆⱜ⁔㤼䠜滭ᝆἨҍ廪瓦ʴᢘ⹭ᘴ⍻傟刄ሧ爂姱əᖄา榗䠂o㔲壝ᲀ⁧燩Ǒ徊捰᫳䀱岀‖䮙Ƶ䫂滧ýㅁ☥戄⽐ٷ䠊湮璀㑘淮เԣ᎐ț樀岳㧀䓮㈆㎓ᖕ壳䕇ᤗࠕ洌囬⅑᷉䩀數㠷岝ᢎ㙞〄粁峂浥㈐࢙์ᝲᄃ嶥壘⁡ㆺ࠘⹸刼₱₧ኴⰠ㒳ㅝഭ屄㼰˧䰅懤ũ焌丆幀଑ƕ䣒瑯㤗㩀↨䝗ͣ▍䋨攠ャ帱؎➒̉ƹ䫮⁩㈲塹Ô乐޺ྔච濧Ƥ䠝മ䛆⬓׈ᗊÍ␷嬙Љ眎⠘㲣䔙┩犀䈙์ᙼ⊖ᄱ惞獩戏䊹⁑Ԧ⭣ᖅ曊⁍㞺峙㲀ࣾ䀆㎴ٰ笊㄰壚泮⛷⭳Ⴀ摪㔩Գᩛඅ̓হト橠ⰱ᪘䩂岀瓞‵⒠橠⤻ղƹ䲍᜷ͣפ䃘慳㩢Ꮘธ攂瘩ィ倍夫ဓ䠉搅㱂ማ㶑䩘′᠖ࠍ昅Ⴀ卋ᢀ冎ᘠẞ䠌✆犒ϙ¼徐⯥į৊擡∎䀹᢬嘔緥Ǖ㤀ㅙ揃亡炷ᙸⴭԾ䊟㵀သ『痬ᓆ潬㞹፛沌劅ሺࢰ䁤㔵昂䱊❽䀑榉哄塀㤷ᘐ಍ۅ䈂熆ၽ曨牯㖲祀✙Õ㬫▝僨⠱玀㥛㲀៤䮟ᰅ恒⁻Ԑࠛഭ晜ナ悰䆊࡙ᘐᰲȸ悕䥉澸Ũ珥ɿ࠹\u0016朦⬋冕ۂ湶ス䨌䘆เહ䂧ᡘ摯㨨ᡝຌ圦瞐ބ塀㄰ᒅᦛ湅เ䐛⒀穀〻ဴ䠏І᱀䅙ⲧ䠁⋨ǳ㩀ᓍኣᆁ̑䦘柉ጼིԏᱠ勉◬ᓜ潓猀䞊㻀࠯ࠓᶕ壘楰㦲䨞քޒ杀ۯሓ洀烳䄜竏ዲ礃ᶕ峊狦ƺᲘⷌ䛶温䮰ħ搀绢Ԉ޸爢䜨Ԡ及˟㫲亜䀵㼠ࢫ䰈ၯ㩳,朆拃ᆑ䂰摨㠬抠䪋䘆刂地ࠋ吁䉹ᙢܱ䑜倜倀耀"}

exports.getSetup = () => setup;
