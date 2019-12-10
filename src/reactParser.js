var esprima = require("esprima");
var _ = require("lodash");
const log = require("electron-log");

var code = `

'use strict';

var drawMode = 1;

function setup() {
  createCanvas(800, 800);
  noFill();
}

function draw() {
  background(255);

  translate(width / 2, height / 2);

  // first shape (fixed)
  strokeWeight(3);
  overlay();

  // second shape (dynamically translated/rotated and scaled)
  var x = map(mouseX, 0, width, -50, 50);
  var a = map(mouseX, 0, width, -0.5, 0.5);
  var s = map(mouseY, 0, height, 0.7, 1);

  if (drawMode == 1) rotate(a);
  if (drawMode == 2) translate(x, 0);
  scale(s);

  strokeWeight(2);
  overlay();
}

function overlay() {
  var w = width - 100;
  var h = height - 100;

  if (drawMode == 1) {
    for (var i = -w / 2; i < w / 2; i += 5) {
      line(i, -h / 2, i, h / 2);
    }
  } else if (drawMode == 2) {
    for (var i = 0; i < w; i += 10) {
      ellipse(0, 0, i);
    }
  }
}

function keyPressed() {
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');

  // change draw mode
  if (key == '1') drawMode = 1;
  if (key == '2') drawMode = 2;
}

`
function printQ(q){
  var str = ""
  q.map(data => {
    if(data[0] === null){
      str +=  "null" + ","
    }else{
      str +=  data[0].toString() + ","
    }

  })
}

console.log(getIdentifiers(code))

function isDeclaration(typeName){
  return typeName.includes("Declaration") || typeName.includes("Declarator")
}

function getIdentifiers(rawCode) {
  try {
    var fullDict = esprima.parseScript(rawCode);
  } catch (error) {
    // throw error i guess
  }
  var declared = {};
  var undeclared = {};

  var q = [[null, fullDict, 0, null]];

  while (q.length > 0) {

    var cur = q.shift();
  
  
    var key = cur[0];
    var val = cur[1];
    var pVal = cur[3];
    var lvl = cur[2];




    if (val === null) {
      continue;
    }

    if (key && val && pVal) {

      if (
        key === "id" &&
        val.type === "Identifier" &&
        isDeclaration(pVal.type) &&
        val.name in declared === false
      ) {
  
        declared[val.name] = [pVal.type, lvl];
      }
    }
   
    if (key && key === "name") {
      if (val in declared === false) {
        undeclared[val] = lvl;
      }
    }


    if (val instanceof Array) {

      val.map(newVal => q.push([null, newVal, lvl + 1, val]));
    } else if (val instanceof Object) {
  
      Object.keys(val).map(newKey => {
        q.push([newKey, val[newKey], lvl + 1, val]);
      });

    } else {
      // let it die
    }
    
  }

  var relevantDeclared = {}
  Object.keys(declared).map(name => {
    if (declared[name][1] === 3 && declared[name][0].includes("Declaration") ) {
      relevantDeclared[name] = ""
    }else if(declared[name][1] === 5 && declared[name][0].includes("Declarator")){
    relevantDeclared[name] = ""
    }
  });

  var relevantUndeclared = {}
  Object.keys(undeclared).map(name => {
    relevantUndeclared[name] = ""
  })

  return { declared: relevantDeclared, undeclared: relevantUndeclared };
}
