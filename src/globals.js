import GridIcon from "./icons/grid.svg";
import LinesIcon from "./icons/git-commit.svg";
import ConsoleStampIcon from "./icons/message-circle.svg";
import FunctionStampIcon from "./icons/box.svg";
import FileStampIcon from "./icons/file.svg";
import HtmlStampIcon from "./icons/layout.svg";
import BuiltInStampIcon from "./icons/tool.svg";
import ListenerStampIcon from "./icons/bell.svg";
import ImageStampIcon from "./icons/image.svg";
import BlobStampIcon from "./icons/code.svg";
import MediaAssetIcon from "./icons/layers-light.svg";
import DeleteStampIcon from "./icons/trash.svg";
import CopyIcon from "./icons/copy.svg";
import ClearConsoleIcon from "./icons/rotate-ccw.svg";
import CodeSizeIcon from "./icons/type.svg";
import MinimzeIcon from "@material-ui/icons/MinimizeOutlined";

import ExpandLessIcon from "./icons/chevron-up.svg";
import ExpandMoreIcon from "./icons/chevron-down.svg";
import DownloadIcon from "./icons/download.svg";
import UploadIcon from "./icons/upload.svg";
import WorldsIcon from "./icons/archive.svg";
import GlobalVarIcon from "./icons/globe.svg";
import CommentIcon from "./icons/message-square.svg";
import InfoIcon from "./icons/info.svg";
import PermanentWorldIcon from "./icons/star.svg";

import VisibilityIcon from "./icons/eye.svg";
import VisibilityOffIcon from "./icons/eye-off.svg";
import EmptyIcon from "./icons/empty.svg";

export const globals = {
  ExpandLessIcon:ExpandLessIcon,
  EmptyIcon:EmptyIcon,
  GridIcon:GridIcon,
  LinesIcon:LinesIcon,
  ConsoleStampIcon:ConsoleStampIcon, 
  FunctionStampIcon:FunctionStampIcon,
  FileStampIcon:FileStampIcon,
  HtmlStampIcon:HtmlStampIcon, 
  BuiltInStampIcon:BuiltInStampIcon,
  ListenerStampIcon:ListenerStampIcon,
  ImageStampIcon:ImageStampIcon,
  BlobStampIcon:BlobStampIcon, 
  MediaAssetIcon:MediaAssetIcon,
  DeleteStampIcon:DeleteStampIcon, 
  CopyIcon:CopyIcon, 
  ClearConsoleIcon:ClearConsoleIcon,
  ExpandMoreIcon:ExpandMoreIcon,
  DownloadIcon:DownloadIcon,
  UploadIcon:UploadIcon,
  WorldsIcon:WorldsIcon,
  GlobalVarIcon:GlobalVarIcon,
  CommentIcon:CommentIcon,
  InfoIcon:InfoIcon,
  PermanentWorldIcon:PermanentWorldIcon,
  CodeSizeIcon:CodeSizeIcon,
  MinimzeIcon:MinimzeIcon,
  VisibilityIcon:VisibilityIcon,
  VisibilityOffIcon:VisibilityOffIcon,
  defaultEditorWidth: 225,
  defaultVarEditorHeight: 200,
  defaultEditorHeight:200,
  defaultIframeWidth: 200,
  iframeMargin: 0,
  headerHeight: 30,
  brHeight: 25,
  codeSize: 14,
  buttonTextSize: 12,
  bigCodeSize:28,
  fnTitleHeight: 100,
  copyOffset: 35,
  iconOpacity:.5,
  iconSize:15,
  iconTransition: "all .3s ease",
  borderTransition: "border .3s ease-out",

  listeners:{
        windowResized:  false,
    deviceMoved:  false,
    deviceTurned: false,
    deviceShaken: false,

    keyPressed: false,
    keyReleased:  false,
    keyTyped: false,

    mouseMoved: false,
    mouseDragged: false,

    mousePressed: false,
    mouseReleased:  false,
    mouseClicked: false,
    doubleClicked:  false,
    
    mouseWheel: false,
  },


  builtIns:{
        draw:           true,
    preload:        true,
    setup:          true,
  },

  specialFns: {
    draw:           true,
    preload:        true,
    setup:          true,
    
    windowResized:  false,
    deviceMoved:  false,
    deviceTurned: false,
    deviceShaken: false,

    keyPressed: false,
    keyReleased:  false,
    keyTyped: false,

    mouseMoved: false,
    mouseDragged: false,

    mousePressed: false,
    mouseReleased:  false,
    mouseClicked: false,
    doubleClicked:  false,
    
    mouseWheel: false,
  },

  fnStampWidth:     557,
  fnStampHeight:    318

};

export const p5Lib = [
"abs()",
"acos()",
"alpha(color)",
"ambient(color)",
"ambientLight(r,g,b)",
"append(array,value)",
"applyMatrix(n00,n01,n02,n03,n10,n11,n12,n13,n20,n21,n22,n23,n30,n31,n32,n33)",
"arc(x,y,width,start,stop)",
"arrayCopy(src,dst,(length))",
"asin()",
"atan()",
"atan2()",
"background(color)",
"beginCamera()",
"beginContour()",
"beginRaw(renderer,filename)",
"beginRecord(renderer,filename)",
"beginShape()",
"bezier(x1,y1,x2,y2,x3,y3,x4,y4)",
"bezierDetail(detail)",
"bezierPoint(a,b,c,d,t)",
"bezierTangent(a,b,c,d,t)",
"bezierVertex(x2,y2,x3,y3,x4,y4)",
"binary(value,(digits))",
"blend(sx,sy,sw,sh,dx,dy,dw,dh,mode)",
"blendMode(mode)",
"blue(color)",
"boolean(value)",
"box(size)",
"brightness(color)",
"byte(value)",
"camera(eyeX,eyeY,eyeZ,centerX,centerY,centerZ,upX,upY,upZ)",
"ceil()",
"char(value)",
"clear()",
"color(color)",
"colorMode(mode)",
"concat(a,b)",
"constrain()",
"copy(sx,sy,sw,sh,dx,dy,dw,dh)",
"cos()",
"createFont(name,size)",
"createGraphics(w,h)",
"createImage(w,h,format)",
"createInput(filename)",
"createOutput(filename)",
"createReader(filename)",
"createShape(kind,parameters)",
"createWriter(filename)",
"cursor(img)",
"curve(x1,y1,x2,y2,x3,y3,x4,y4)",
"curveDetail(detail)",
"curvePoint(a,b,c,d,t)",
"curveTangent(a,b,c,d,t)",
"curveTightness(tightness)",
"curveVertex(x,y)",
"day()",
"degrees()",
"directionalLight(r,g,b,nx,ny,nz)",
"displayDensity()",
"dist()",
"ellipse(x,y,width,height)",
"ellipseMode(mode)",
"emissive(color)",
"endCamera()",
"endContour()",
"endRaw()",
"endRecord()",
"endShape()",
"exp()",
"expand(list,(newSize))",
"fill(color)",
"filter(shader)",
"float(value)",
"floor()",
"frameRate(fps)",
"frustum(left,right,bottom,top,near,far)",
"fullScreen(renderer)",
"get(x,y)",
"green(color)",
"hex(value,(digits))",
"hour()",
"hue(color)",
"image(image,x,y)",
"imageMode(mode)",
"int(value)",
"join(list,seperator)",
"launch(args)",
"lerp()",
"lerpColor(color1,color2,amount)",
"lightFalloff(constant,linear,quadratic)",
"lights()",
"lightSpecular(r,g,b)",
"line(x1,y1,x2,y2)",
"loadBytes(filename)",
"loadFont(filename)",
"loadImage(filename)",
"loadPixels()",
"loadShader(fragFilename,(vertFilename))",
"loadShape(filename)",
"loadStrings(filename)",
"loadTable(filename,(options))",
"loadXML(filename)",
"log()",
"mag()",
"map()",
"match(string,regexp)",
"matchAll(string,regexp)",
"max()",
"millis()",
"min()",
"minute()",
"modelX(x,y,z)",
"modelY(x,y,z)",
"modelZ(x,y,z)",
"month()",
"nf(num,digits)",
"nfc(num,(right))",
"nfp(num,(digits))",
"nfs(num,digits)",
"noCursor()",
"noCursor()",
"noFill()",
"noise()",
"noiseDetail()",
"noiseSeed()",
"noLights()",
"norm()",
"normal(nx,ny,nz)",
"noSmooth()",
"noStroke()",
"noTint()",
"ortho(left,right,bottom,top)",
"parseXML(string,(options))",
"perspective(fovy,aspect,zNear,zFar)",
"pixelDensity(density)",
"point(x,y)",
"pointLight(r,g,b,x,y,z)",
"popMatrix()",
"pow()",
"print(variables)",
"printArray(array)",
"printCamera()",
"println(variables)",
"printMatrix()",
"printProjection()",
"pushMatrix()",
"quad(x,y,x2,y2,x3,y3,x4,y4)",
"quadraticVertex(x,y,x2,y2)",
"radians()",
"random()",
"randomGaussian()",
"randomSeed()",
"rect(x,y,width,height)",
"rectMode(mode)",
"red(color)",
"requestImage(filename)",
"resetMatrix()",
"resetShader()",
"reverse(list)",
"rotate(angle)",
"rotateX(angle)",
"rotateY(angle)",
"rotateZ(angle)",
"round()",
"saturation(color)",
"save(filename)",
"saveBytes(filename,data)",
"saveFrame(filename####)",
"saveStream(target,source)",
"saveStrings(filename,data)",
"saveTable(table,filename,(options))",
"saveXML(xml,filename,(options))",
"scale(s)",
"screenX(x,y)",
"screenY(x,y)",
"screenZ(x,y)",
"second()",
"selectFolder(prompt,callback)",
"selectInput(prompt,callback)",
"selectOutput(prompt,callback)",
"set(x,y,color)",
"shader(shader)",
"shape(shape,x,y)",
"shapeMode(mode)",
"shearX(angle)",
"shearY(angle)",
"shininess(shine)",
"shorten(list)",
"sin()",
"size(width,height,renderer)",
"smooth()",
"sort(list,(count))",
"specular(color)",
"sphere(radius)",
"sphereDetail(res)",
"splice(list,value,index)",
"split(value,digits)",
"splitTokes(value,(delim))",
"spotLight(r,g,b,x,y,z,nx,ny,nz,angle,concentration)",
"sq()",
"sqrt()",
"string(value)",
"stroke(color)",
"strokeCap(cap)",
"strokeJoin(join)",
"strokeWeight(weight)",
"subset(list,start,(count))",
"tan()",
"text(string,x,y)",
"textAlign(alignX,(alignY))",
"textAscent()",
"textDescent()",
"textFont(font,(size))",
"textLeading(leading)",
"textMode(mode)",
"textSize(size)",
"texture(image)",
"textureMode(mode)",
"textureWrap(wrap)",
"textWidth(string)",
"tint(color)",
"translate(x,y)",
"triangle(x1,y1,x2,y2,x3,y3)",
"trim(string)",
"unbinary(value)",
"unhex(value)",
"updatePixels()",
"vertex(x,y)",
"year()",
"HALF_PI",
"PI",
"QUARTER_PI",
"TAU",
"TWO_PI",
"frameCount",
"deltaTime",
"focused",
"displayWidth",
"displayHeight",
"windowWidth",
"windowHeight",
"width",
"height",
"disableFriendlyErrors",
"p5.Element",
"VIDEO",
"AUDIO",
"p5.MediaElement",
"p5.File",
"p5.Graphics",
"p5.TypedDict",
"p5.NumberDict",
"deviceOrientation",
"accelerationX",
"accelerationY",
"accelerationZ",
"pAccelerationX",
"pAccelerationY",
"pAccelerationZ",
"rotationX",
"rotationY",
"rotationZ",
"pRotationX",
"pRotationY",
"pRotationZ",
"turnAxis",
"keyIsPressed",
"key",
"keyCode",
"movedX",
"movedY",
"mouseX",
"mouseY",
"pmouseX",
"pmouseY",
"winMouseX",
"winMouseY",
"pwinMouseX",
"pwinMouseY",
"mouseButton",
"mouseIsPressed",
"DEGREES",
"RADIANS",
"CORNER",
"CORNERS",
"CENTER",
"RADIUS",
"exitPointerLock()",
"angleMode(mode)",
"touches",
"touchStarted(fxn)",
"touchMoved(fxn)",
"touchEnded(fxn)",
"saveCanvas(selectedCanvas, [filename], [extension])",
"saveCanvas([filename], [extension])",
"saveFrames(filename, extension, duration, framerate, [callback])",
"pixels",
"loadJSON(path, [jsonpOptions], [datatype], [callback], [errorCallback])",
"loadJSON(path, datatype, [callback], [errorCallback])",
"loadJSON(path, callback, [errorCallback])",
"httpGet(path, [datatype], [data], [callback], [errorCallback])",
"httpGet(path, data, [callback], [errorCallback])",
"httpGet(path, callback, [errorCallback])",
"httpPost(path, [datatype], [data], [callback], [errorCallback])",
"httpPost(path, data, [callback], [errorCallback])",
"httpPost(path, callback, [errorCallback])",
"httpDo(path, [method], [datatype], [data], [callback], [errorCallback])",
"httpDo(path, options, [callback], [errorCallback])",
"saveJSON(json, filename, [optimize])",
"createVector([x], [y], [z])",
"textStyle(theStyle)",
"orbitControl([sensitivityX], [sensitivityY], [sensitivityZ])",
"debugMode()",
"debugMode(mode)",
"debugMode(mode, [gridSize], [gridDivisions], [xOff], [yOff], [zOff])",
"debugMode(mode, [axesSize], [xOff], [yOff], [zOff])",
"debugMode([gridSize], [gridDivisions], [gridXOff], [gridYOff], [gridZOff], [axesSize], [axesXOff], [axesYOff], [axesZOff])",
"noDebugMode()",
"specularColor(v1, v2, v3)",
"specularColor(value)",
"specularColor(gray)",
"specularColor(values)",
"specularColor(color)",
"createShader(vertSrc, fragSrc)",
"normalMaterial()",
"ambientMaterial(v1, [v2], [v3], [a])",
"ambientMaterial(color)",
"emissiveMaterial(v1, [v2], [v3], [a])",
"emissiveMaterial(color)",
"specularMaterial(v1, [v2], [v3], [a])",
"specularMaterial(color)",
"createCamera()",
"setCamera(cam)"
];

export default function DefaultExportPlaceholder() {
  return null;
}
