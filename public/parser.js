var esprima = require("esprima");
var _ = require("lodash");
const log = require("electron-log");

function jsToStamps(rawCode) {
  try{
    var program = esprima.parseScript(rawCode, {
      range: true,
      comment: true,
      tolerant: true,
      loc: true
    });
  }catch(error){
    return null
  }

  var body = _.cloneDeep(program.body);
  insertComments(body, program.comments);
  var stamps = { fns: [], blobs: [] };
  fillStampArrays(body, stamps.blobs, stamps.fns, rawCode);

  return stamps;
}

function fillStampArrays(body, blobStamps, fnStamps, rawCode) {
  var lastBlobLine = 0;
  var tempBlobStamps = [];
  for (var i = 0; i < body.length; i++) {
    item = body[i];
    if (item.type === "FunctionDeclaration") {
      addFn(fnStamps, item, rawCode);
    } else if (item.type === "Block" || item.type === "Line") {
      lastBlobLine = addBlob(tempBlobStamps, item, rawCode, lastBlobLine, true);
    } else {
      lastBlobLine = addBlob(
        tempBlobStamps,
        item,
        rawCode,
        lastBlobLine,
        false
      );
    }
  }

  for (var i = 0; i < tempBlobStamps.length; i++) {
    blobStamp = tempBlobStamps[i];
    if (blobStamp.code != "") {
      blobStamps.push(blobStamp);
    }
  }
}

function insertComments(body, comments) {
  for (var i = 0; i < comments.length; i++) {
    comment = comments[i];
    var pos = getPos(body, comment);

    if (pos >= 0) {
      body.splice(pos, 0, comment);
    }
  }
}

function getPos(body, comment) {
  for (var i = 0; i < body.length; i++) {
    var item = body[i];
    if (item.range[0] < comment.range[0] && comment.range[1] < item.range[1]) {
      return -1;
    }
    if (comment.range[1] < item.range[0]) {
      return i;
    }
  }
  return body.length;
}

function addBlob(blobStamps, item, rawCode, lastBlobLine, isComment) {
  if (isComment) {
    if ((item.type = "Block")) {
      var code = "/*\n" + item.value + "\n*/";
    } else {
      var code = "// " + item.value;
    }
  } else {
    var code = rawCode.substr(item.range[0], item.range[1] - item.range[0]);
  }

  if (blobStamps.length === 0) {
    blobStamps.push({ code: "" });
  }

  lastStamp = blobStamps[blobStamps.length - 1];

  var lineDiff = item.loc.start.line - lastBlobLine;
  if (lineDiff == 0) {
    lastStamp.code += code;
  } else if (lineDiff === 1) {
    lastStamp.code += "\n" + code;
  } else {
    blobStamps.push({ code: code });
  }

  return item.loc.end.line;
}

function addFn(fnStamps, item, rawCode) {
  var range = item.range;
  var name = item.id.name;

  var args = "";
  if (item.params.length > 1) {
    var argStart = item.params[0].range[0];
    var argEnd = item.params[item.params.length - 1].range[1];
    var args = rawCode.substr(argStart, argEnd - argStart);
  }

  var start = item.body.range[0] + 1;
  var end = item.body.range[1] - 1;
  var code = rawCode.substr(start, end - start);
  fnStamps.push({ code: code, name: name, args: args });
}

exports.jsToStamps = jsToStamps;
