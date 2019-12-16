import React, { Component } from "react";
import Cristal from "./react-cristal/dist/es2015/index.js";
import $ from "jquery";
import { saveAs } from "file-saver";
import pf, { globals, p5Lib } from "./globals.js";
import FunctionStamp from "./FunctionStamp.js";
import ConsoleStamp from "./ConsoleStamp.js";
import BlobStamp from "./BlobStamp.js";
import { Mutex } from "async-mutex";
import { Line } from "react-lineto";
import cheerio from "cheerio";
import { SteppedLineTo } from "react-lineto";
import parser from "./parser.js";
import anim from "css-animation";
import { Resizable, ResizableBox } from "react-resizable";
import styled from "styled-components";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/javascript";

var _ = require("lodash");

var esprima = require("esprima");


const defaultSetup = require("./defaultSetup.js");

export default class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width:200,
      pickerHeight:window.innerHeight-150,
      code:

`// import unstructred Javascript code or individual functions

// like the below: 
function noiseWave() {
  let noiseScale=0.02;
  background(0);
  for (let x=0; x < width; x++) {
    let noiseVal = noise((mouseX+x)*noiseScale, mouseY*noiseScale);
    stroke(noiseVal*255);
    line(x, mouseY+noiseVal*80, x, height);
  }
}`




      , 
      codeHasError:false


    };
  this.editorRef = React.createRef()


  }

  parseCode(){
    try{
      var stamps = parser.jsToStamps(this.state.code)
              stamps.fns.map(data => this.props.addFnStamp(data));
        stamps.blobs.map(data => this.props.addBlobStamp(data));

        this.setState({code:""})
    }catch(e){
      this.setState({codeHasError:true})
    }
  }

  renderJsImporter(){

    return(
<div class="bg-jsArea p-3" style={{overflow:"hidden", width:this.state.width}}>
        <AceEditor
          style={{
            width: this.state.width-30,
            height: window.innerHeight- this.state.pickerHeight,
            background: "transparent",
    
          }}
          mode="javascript"
          theme="p5"
          onChange={(value) => this.setState({code:value, codeHasError:false}) }
          name={"jsImporter"}
          fontSize={globals.codeSize}
          showPrintMargin={false}
          wrapEnabled={true}
          showGutter={false}
          highlightActiveLine={false}
          value={this.state.code}
          ref={this.editorRef}
          setOptions={{
            tabSize: 2,
            hasCssTransforms: true
          }}
        />
        </div>

  )
  }

    createIcon(iconType, size = 15, callback = null, opacity = 0.3) {
    return React.createElement(iconType, {
      style: { opacity: opacity, height: size, width: size },
      className: "m-1 text-greyText",
      onClick: callback
    });
  }

  renderResizeHandle(){
    return(

 <div className="border-bottom border-borderGrey"
              style={{
                width: this.state.width,
                cursor: "ns-resize",
                height: 20,
                right: 0,
                bottom: 0,
                position: "absolute",
                background: "white",
                color: "transparent",

              }}
            >hi</div>

      )
  }

  renderLayerPicker() {

    var pickers = [];
    this.props.pickerData.map(item => {
      if (item.status) {
        var iconType = VisibilityIcon;
      } else {
        var iconType = VisibilityOffIcon;
      }

      var overalOpacity = 1;
      if (item.status === false) {
        overalOpacity = 0.5;
      }
        pickers.push(
          <div
            class="d-flex justify-content-between"
            style={{ opacity: overalOpacity }}
            onClick={item.callback}
          >
            <div clas="row" style={{ overflow: "hidden" }}>

              {this.createIcon(item.icon, 15, null, 0.5)}
              <a class="text-greyText picker ml-1">
                {item.name}
              </a>
            </div>
            {this.createIcon(iconType, 20, null, 0.8)}
          </div>
        );
    });

    return (

          <ResizableBox
          width={this.state.width}
 onResize={e=> { 
  this.setState({pickerHeight:this.state.pickerHeight + e.movementY}, 
    ()=>   this.editorRef.current.editor.resize())

 }}


 
          height= {this.state.pickerHeight}
          axis="y"


          handle={this.renderResizeHandle()}
          >
          <div className="p-3"

          style={{overflow:"hidden", "overflow-y":'scroll',
           width:this.state.width,
          height:this.state.pickerHeight}}>
              {pickers}
              </div>
          </ResizableBox>



      );
  }


  renderButton(){

    if(this.state.codeHasError){
      return(
            <button class="btn btn-block shadow-sm m-1 bg-warningOrangeDark"
            disabled
            style={{position:"absolute",  color:"rgb(0, 0, 0)",
            bottom:0,
            fontSize:globals.codeSize}}

            >
            Syntax Error
          </button>

        )
    }
    return(

            <button class={"btn btn-block shadow-sm m-1 bg-grey border-borderGrey text-greyText"}
            style={{position:"absolute", 
            bottom:30, left:-4,
            fontSize:globals.codeSize}}
            onClick={this.parseCode.bind(this)}

            >
            Import Javascript
          </button>

      )
  }

  render() {
    return (
      <div
        class="bg-white border border-borderGrey shadow-sm"
        onMouseOver={() => this.props.disablePan(true)}
        onMouseOut={() => this.props.disablePan(false)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height:"100%",


          zIndex: 1000000000000000000
        }}
      >
          <ResizableBox
          width={this.state.width}
 
   onResize={e=> { 
  this.setState({width:this.state.width + e.movementX}, 
    ()=>   this.editorRef.current.editor.resize())

 }}
          axis="x"
          handle={
            <div
              style={{
                width: 20,
                cursor: "ew-resize",
                height: "100%",
                right: 0,
                top: 0,
                position: "absolute",
                background: "transparent",
                color: "transparent"
              }}
            >
              hi
            </div>
          }
        >
          <div style={{height:"100%" }}>
            {this.renderLayerPicker()}


         
            {this.renderJsImporter()}
            {this.renderButton()}
          </div>
        </ResizableBox>
      </div>
    );
  }


}
