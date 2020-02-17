import pf, { globals, p5Lib } from "./globals.js";
import purpleDots from "./worlds/purpleDots.js";
import blank from "./worlds/blank.js";
import particles from "./worlds/particles.js";
import imageGlitch from "./worlds/imageGlitch.js";
import lines from "./worlds/lines.js";
import painter from "./worlds/painter.js";

export const starter = blank;

export const worlds = [
  { name: "blank", data: blank },
  { name: "purble dots", data: purpleDots },
  { name: "image glitch", data: imageGlitch },
  { name: "painter", data: painter }
];

var asciiArt =
  "   ____    __    ____      ____    ______ ______           ____    ____    ____       \n  /\\  _\\  _\\ \\ _/\\__ \\    /\\  _`\\ /\\__  _/\\  _  \\  /'\\_/`\\/\\  _`\\ /\\  _`\\ /\\  _`\\     \n  \\ \\ \\/ /\\_` ' \\/_/\\ \\   \\ \\,\\L\\_\\/_/\\ \\\\ \\ \\L\\ \\/\\      \\ \\ \\L\\ \\ \\ \\L\\_\\ \\ \\L\\ \\   \n   \\ \\ \\ \\/_>   <_ \\ \\ \\   \\/_\\__ \\  \\ \\ \\\\ \\  __ \\ \\ \\__\\ \\ \\ ,__/\\ \\  _\\L\\ \\ ,  /   \n    \\ \\ \\_ /\\_, ,_\\ \\_\\ \\    /\\ \\L\\ \\ \\ \\ \\\\ \\ \\/\\ \\ \\ \\_/\\ \\ \\ \\/  \\ \\ \\L\\ \\ \\ \\\\ \\  \n     \\ \\___\\/_/\\_\\/ /\\___\\   \\ `\\____\\ \\ \\_\\\\ \\_\\ \\_\\ \\_\\\\ \\_\\ \\_\\   \\ \\____/\\ \\_\\ \\_\\\n      \\/___/  \\/_/  \\/___/    \\/_____/  \\/_/ \\/_/\\/_/\\/_/ \\/_/\\/_/    \\/___/  \\/_/\\/ /";

export const stamperHeader = `/*
${asciiArt}


Hello and welcome to your Stamper metadata file! 
This file keeps track of all of the info Stamper needs about your stamps. 

Don't worry, it won't affect your sketch if you run it on any other IDE.

Please DON'T MODIFY ANY OF THE INFORMATION BELOW or else your project may behave unexpectantly in Stamper.
However, if your project is acting strangely, delete this file and reopen your project. 
You'll lose your stamps' formatting but keep all of the code.

Happy Stamping :)

*/

`;

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
    code: `createCanvas(${globals.defaultIframeWidth},${globals.defaultIframeHeight})
background(100);`
  },
  { name: "preload", args: "", code: "img = loadImage('YOUR IMAGE');" }
];

var keyPressCode = `fill("black")
textSize(50);

// display last key pressed.
text(key + ' ' + keyCode, 20, 70);`;

var mousePressCode = `fill('black')

// display last clicked location
text(mouseX + ', ' + mouseY, mouseX + 10, mouseY - 10)
rectMode(CENTER)
rect(mouseX, mouseY, 1, 20)
rect(mouseX, mouseY, 20, 1)`;

export const listenerFns = [
  {
    name: "keyPressed",
    args: "",
    code: `background('yellow')\n` + keyPressCode
  },
  {
    name: "keyReleased",
    args: "",
    code: `background('springgreen')\n` + keyPressCode
  },
  {
    name: "keyTyped",
    args: "",
    code: `background('cyan')\n` + keyPressCode
  },
  {},
  {
    name: "mousePressed",
    args: "",
    code: `background('yellow')\n` + mousePressCode
  },
  {
    name: "mouseReleased",
    args: "",
    code: `background('springgreen')\n` + mousePressCode
  },
  {
    name: "mouseClicked",
    args: "",
    code: `background('cyan')\n` + mousePressCode
  },
  {
    name: "doubleClicked",
    args: "",
    code: `background('cyan')\n` + mousePressCode
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
  code: `strokeWeight(1)
stroke("black")
fill('lightblue')
ellipse(posX, posY, 30, 30)`
};

export const starterBlobs = [
  {
    name: "global variable",
    data: { code: "var global1 = 1", isBlob: true }
  },
  {
    name: "comment",
    data: {
      code: `/*\n  comment here\n*/`,
      codeSize: globals.bigCodeSize,
      isBlob: true
    }
  },
  {
    name: "class",
    data: {
      code: `class Jitter {
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
}`,
      isBlob: true
    }
  }
];

export const sampleFile = {
  name: "sample.js",
  code: "// put some code to import into your js in here",
  isTxtFile: true
};

export const varBlob = { code: "var global1 = 1", isBlob: true };

export default function DefaultExportPlaceholder() {
  return null;
}


