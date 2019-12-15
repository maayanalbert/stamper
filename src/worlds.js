

var world1 = {"blobs":[],"console":{"consoleHeight":60,"consoleWidth":200,"hidden":false,"originX":0,"originY":0,"scale":1,"x":432.20689210502405,"y":192.56105311996302},"fns":[{"args":"","code":"\n\n\nnoFill();\nselect(\"head\").html(loadFromGoogleFonts(\"Orbitron\"), true)\ncreateCanvas(500, 300)\n","editorHeight":175,"editorWidth":300,"hidden":false,"iframeHeight":200,"iframeWidth":225,"isCss":false,"isHtml":false,"name":"setup","originX":0,"originY":0,"scale":1,"x":413.402263673433,"y":212.66083156349194},{"args":"","code":"\n\nreturn \"<link href='https://fonts.googleapis.com/css?family=\" + name + \"' rel='stylesheet'>\"\n","editorHeight":175,"editorWidth":300,"hidden":false,"iframeHeight":200,"iframeWidth":225,"isCss":false,"isHtml":false,"name":"loadFromGoogleFonts","originX":0,"originY":0,"scale":1,"x":431.7677342051545,"y":216.67825096520846},{"args":"","code":"\n\nstrokeWeight(1); // Default\nline(20, 20, 80, 20);\nstrokeWeight(4); // Thicker\nline(20, 40, 80, 40);\nstrokeWeight(10); // Beastly\nline(20, 70, 80, 70); \n\n","editorHeight":175,"editorWidth":300,"hidden":false,"iframeHeight":200,"iframeWidth":225,"isCss":false,"isHtml":false,"name":"draw5","originX":0,"originY":0,"scale":1,"x":369.25400545500753,"y":242.734389253467},{"args":"","code":"\n\nbezier(85,20, 10, 10, 90, 90, 15, 80)\n","editorHeight":175,"editorWidth":300,"hidden":false,"iframeHeight":200,"iframeWidth":225,"isCss":false,"isHtml":false,"name":"draw6","originX":0,"originY":0,"scale":1,"x":355.66516706321306,"y":233.51016452177277},{"args":"","code":"\n\nbezier(85, 20, 10, 10, 90, 90, 15, 80);\nlet steps = 6;\nfill(255);\nfor (let i = 0; i <= steps; i++) {\n  let t = i / steps;\n  // Get the location of the point\n  let x = bezierPoint(85, 10, 90, 15, t);\n  let y = bezierPoint(20, 10, 90, 80, t);\n  // Get the tangent point\n  let tx = bezierTangent(85, 10, 90, 15, t);\n  let ty = bezierTangent(20, 10, 90, 80, t)\n  // Calculate an angle from the tangent points\n  let a = atan2(ty, tx);\n  a += PI;\n  stroke(255, 102, 0);\n  line(x, y, cos(a) * 30 + x, sin(a) * 30 + y);\n  // The following line of code makes a line\n  // inverse of the above line\n  //line(x, y, cos(a)*-30 + x, sin(a)*-30 + y);\n  stroke(0);\n  ellipse(x, y, 5, 5);\n}\n\n","editorHeight":175,"editorWidth":300,"hidden":false,"iframeHeight":200,"iframeWidth":225,"isCss":false,"isHtml":false,"name":"draw7","originX":0,"originY":0,"scale":1,"x":394.095938811217,"y":216.5665413323938},{"args":"x=mouseX, y=mouseY","code":"\n\nnoStroke()\nfill(\"red\")\nellipse(x, y, 50, 50)\n\n\n\n","editorHeight":175,"editorWidth":300,"hidden":false,"iframeHeight":200,"iframeWidth":225,"isCss":false,"isHtml":false,"name":"myEllipse","originX":0,"originY":0,"scale":1,"x":382.38102683871557,"y":164.58666457764454},{"args":"x=mouseX, y=mouseY","code":"\n\nmyEllipse(x, y, 50, 50)\nnoFill()\nstroke(\"black\")\nellipse(x, y, 25, 25)\n\n","editorHeight":175,"editorWidth":300,"hidden":false,"iframeHeight":200,"iframeWidth":225,"isCss":false,"isHtml":false,"name":"sketch16","originX":0,"originY":0,"scale":1,"x":425.48793255067324,"y":186.7253054428621},{"args":"x=millis() % width, y=mouseY","code":"\n\nmyEllipse(x, y, 50, 50)\nnoFill()\nstroke(\"black\")\nellipse(x, y, 25, 25)\n\n","editorHeight":175,"editorWidth":300,"hidden":false,"iframeHeight":200,"iframeWidth":225,"isCss":false,"isHtml":false,"name":"sketch1618","originX":0,"originY":0,"scale":1,"x":407.50608779753236,"y":204.8902952275766},{"args":"","code":"\n\nbezier(85, 20, 10, 10, 90, 90, 15, 80);\nlet steps = 6;\nfill(255);\nfor (let i = 0; i <= steps; i++) {\n  let t = i / steps;\n  // Get the location of the point\n  let x = bezierPoint(85, 10, 90, 15, t);\n  let y = bezierPoint(20, 10, 90, 80, t);\n  // Get the tangent point\n  let tx = bezierTangent(85, 10, 90, 15, t);\n  let ty = bezierTangent(20, 10, 90, 80, t)\n  // Calculate an angle from the tangent points\n  let a = atan2(ty, tx);\n  a += PI;\n  stroke(255, 102, 0);\n  line(x, y, cos(a) * 30 + x, sin(a) * 30 + y);\n  // The following line of code makes a line\n  // inverse of the above line\n  //line(x, y, cos(a)*-30 + x, sin(a)*-30 + y);\n  stroke(0);\n  ellipse(x, y, 5, 5);\n}\n\n","editorHeight":175,"editorWidth":300,"hidden":false,"iframeHeight":200,"iframeWidth":225,"isCss":false,"isHtml":false,"name":"draw713","originX":0,"originY":0,"scale":1,"x":366.09948270581486,"y":244.89195937970564},{"args":"","code":"\n\nfill(200,0,0)\nnoStroke()\ntextFont('Orbitron')\nbackground(200,200,0)\ntextSize(mouseX)  \ntext(\"RECO\", 20, mouseY)\n\n","editorHeight":175,"editorWidth":300,"hidden":false,"iframeHeight":200,"iframeWidth":225,"isCss":false,"isHtml":false,"name":"draw","originX":0,"originY":0,"scale":1,"x":437.181727443347,"y":242.75820592253484},{"args":" ","code":"\nhtml, body {\n  margin: 0;\n  padding: 0;\n}","editorHeight":175,"editorWidth":300,"hidden":false,"iframeHeight":200,"iframeWidth":225,"isCss":true,"isHtml":false,"name":"style.css","originX":0,"originY":0,"scale":1,"x":433.3010431096784,"y":214.18218448445614},{"args":" ","code":"<html>\n  <head>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/p5.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.dom.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/addons/p5.sound.min.js\"></script>\n    <link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">\n  </head>\n  <body>\n    <script src='sketch.js'></script>\n  </body>\n</html>\n","editorHeight":175,"editorWidth":300,"hidden":false,"iframeHeight":200,"iframeWidth":225,"isCss":false,"isHtml":true,"name":"index.html","originX":0,"originY":0,"scale":1,"x":380.77750274233944,"y":193.77745260465605}],"scale":1,"compressedJs":"㌺官溍ᛶ焃䶕棪瀨ᒽ䊂䅁⛦稳▱塐⤻Թ奛ಬ㝂䄓↕䋈∩᜴ᴛⶅۆ笋ᄙ擞浇㞷姛ನ曶玣䲠䒞牢㒺Მ淄⊒愃凉櫊⤊ㆹᥘ⺌吶୳妅晐㔰᠖ࠌ昆ʐ偓琫ዩ告犀ₜ䲮䝗፱磘楮㖐᨜䲬插㭃凑惦㨯ឳㄉ旌籓ᬋ䆥晜捯㚗壜湧癦୫▱牺∠ᖐᮘⶬ刂夁࢜䃤敬ẓ峝༭䙗ᭃᖕ桎㸢皀ₙ์ᝳ⸳凍棤潫㊫奚Ⳮ݂䆉⓬䁞⼠∲妘⺭䝀卣▹䩐㈰ᘐ㄁ܘ傎 眰摩䘲⨴ᩘ浬圬冑匜摩儲ᢘㆌ桌嘗ᮣ㇧ᑦ㟇ᦛ焈⅞ဋƷ᠂惄敺㒲岊܆勌↡䜜ࡳ䜄ᢚ焑᷀᛼⇩彀篊Ó殟ໂ䶌坂Λ冕惦‽ရໂ䳜䀡㦑哔剶੦㞹ࠊᢃ皒ǩÀ癀椠Ḟ熊杤ڒ奙⒁瘔†成ᴈޤڒžᱰᑁ搀禣焆ഌ分捻ඇ䨁᭯㍢䐜෭ᛧ☹懠䁺⃦S吱˜倊杀ʓ䠁⁴ᓢ፱Տᳲ址͋ࡕ搁④લ滮䘖猻ᖹ榚潴攸ᔱ䏻㜧♓传室痆㨡塛౮囆ணᒁ䋜⁡㜳嬙␌朦筯䠂ყ䝜ゐ཈మ䘖熑⇑牘⁴㱢嵘␅㏒ʂ✐៌Ʉ爀憱ฦ⋂ܠڠ䁁攂Ἴଈ༥䈆᭻䲡䉒‪မ䰈դނ愃䶥嶖ᅹ琀䏕ഌ分㍻ㆱ廮楮㏢偹1ض笣ᒁ嫂步㦐ᡱ⊸拖䭳妕擧䔢爀⻘ⱍ睦⹐罅籔ⷎ㻣䐱侜瀌ἰ˥䫘汩㠹爏䚥䈎‒秷尅睭㲢爉䞭囷⮛ᕠ塀秆Ԭ祀娍曵Ḳ傧䰅␢㤲夈䔡⳵憆တ又Ӣ昮峚沮䘶䆉孡㦖緍⏴ŉ峠㵢䄓঱䋆毑㬙㤀沆屇㚛僄熈癩㘶ᩜ攅ሂ⤃嶥䣨棿@㿀ဟ瀈ݘာ执缄ۿ䄃㿠䃟砠㟼ࠛ缄ۿ䄃㿠䃟砠㟼ࠛ缄۪嵿悁忰⁯簐᯾Ѝ羂Ϳ悁忰⁯簐᯾Ѝ羂ͽ₁幀ᗧ᠊珌ʂ᠘ଌ֜倱݈ထ棊硴爄Ꮚӽ䄹␩䓂捫㎹ᯝⷌ䱓☩挘嚦楺㊔㦀羅ሂب䲠䒤䕃➑㦀托况估ഌ耂老"}


export default const worlds =[world1]