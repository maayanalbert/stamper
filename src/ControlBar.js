import React, { Component } from "react";
import Cristal from "./react-cristal/dist/es2015/index.js";
import $ from "jquery";
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
import VisibilityIcon from "./icons/eye.svg";
import VisibilityOffIcon from "./icons/eye-off.svg";

import FunctionStampIcon from "./icons/box.svg";
import BuiltInStampIcon from "./icons/tool.svg";
import ListenerStampIcon from "./icons/bell.svg";
import BlobStampIcon from "./icons/code.svg";
import ExpandMoreIcon from "./icons/chevron-down.svg";
import DownloadIcon from "./icons/download.svg";
import WorldsIcon from "./icons/archive.svg";
import GlobalVarIcon from "./icons/globe.svg";
import CommentIcon from "./icons/message-square.svg";

import Overlay from "react-bootstrap/Overlay";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/javascript";
import Modal from 'react-bootstrap/Modal'

import pf1, {
  normalFn,
  commentBlob,
  varBlob,
  listenerFns,
  builtInFns,
  worlds
} from "./starterStamps.js";

var _ = require("lodash");

var esprima = require("esprima");


export default class ControlBar extends Component {
  constructor(props) {
    super(props);
    this.editorRef = React.createRef();
    this.minPickerHeight = 30;
    this.minJsImporterHeight = 30;
    this.topBarHeight = 60;
    this.minWidth = 150;
    this.minNonSideBarWidth = 30
    this.editorRef = React.createRef();
    this.importButtonHeight = 50;
    this.state = {
      jsImporterHeight:110,
      sideBarWidth: 200,
      pickerHeight:
        window.innerHeight -
        (this.topBarHeight + this.importButtonHeight + 110),
      pickerScrollEnabled: true,
      codeHasError: false,
      code: `\n// import unstructured Javascript code or individual functions

// like the below, feel free to delete: 
function noiseWave() {
  let noiseScale=0.02;
  background(0);
  for (let x=0; x < width; x++) {
    let noiseVal = noise((mouseX+x)*noiseScale, mouseY*noiseScale);
    stroke(noiseVal*255);
    line(x, mouseY+noiseVal*80, x, height);
  }
}`
    };
  }

  componentDidMount() {
    this.props.updateControlBarDimensions(this.state.sideBarWidth, this.topBarHeight)
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.onWindowResize)
  }

  onWindowResize(e){
    this.setState({pickerHeight: window.innerHeight - (this.topBarHeight + this.importButtonHeight + this.state.jsImporterHeight)})
    if(this.state.sideBarWidth > window.innerWidth - this.minNonSideBarWidth){
      this.setState({sideBarWidth: window.innerWidth - this.minNonSideBarWidth})
    }
  }

  renderSideBar() {
    return (
      <div
        class="bg-white border border-borderGrey shadow-sm"
        onMouseOver={() => {
          this.props.disablePan(true);
          this.props.disableZoom(true);
        }}
        onMouseOut={() => {
          this.props.disablePan(false);
          this.props.disableZoom(false);
        }}
        style={{
          position: "absolute",
          top: this.topBarHeight,
          left: 0,
          height: window.innerHeight - this.topBarHeight,

          zIndex: 1000000000000000000
        }}
      >
        <Resizable
          width={this.state.sideBarWidth}
          onResize={e => {
            var newWidth = this.state.sideBarWidth + e.movementX;
            if (newWidth > this.minWidth && newWidth <= window.innerWidth - this.minNonSideBarWidth) {
              this.setState({ sideBarWidth: newWidth }, () =>
                this.editorRef.current.editor.resize()
              );
            }
          }}
          onResizeStop={e => this.props.updateControlBarDimensions(this.state.sideBarWidth, this.topBarHeight)}
          height={window.innerHeight - this.topBarHeight}
          axis="x"
          handle={this.renderSideBarResizeHandle()}
        >
          <div>
            {this.renderLayerPicker()}
            {this.renderJsImporter()}
            {this.renderImportButton()}
          </div>
        </Resizable>
      </div>
    );
  }

  parseCode() {
    try {
      var stamps = parser.jsToStamps(this.state.code);
      var curNumStamps = this.props.getNumStamps()


            var callback = () => {
console.log(curNumStamps)

                this.props.recompileIfEnoughStamps(stamps.fns.length + curNumStamps.fns, 
              stamps.blobs.length + curNumStamps.blobs)

            }



      stamps.fns.map(data => {
        this.props.addFnStamp(data, callback);
      });
      stamps.blobs.map(data => {
        this.props.addBlobStamp(data, callback);
      });

      this.setState({ code: "" });
    } catch (e) {
      this.setState({ codeHasError: true });
    }
  }
  renderJsImporter() {
    return (
      <div
        class="bg-jsArea"
        style={{
          width: this.state.sideBarWidth,
          height:
            window.innerHeight - (this.state.pickerHeight + this.topBarHeight)
        }}
      >
        <AceEditor
          style={{
            width: this.state.sideBarWidth,
            height:
              window.innerHeight -
              (this.state.pickerHeight +
                this.topBarHeight +
                this.importButtonHeight),
            background: "transparent",
            fontFamily: 'Inconsolata',
          }}
          mode="javascript"
          theme="p5"
          onChange={value =>
            this.setState({ code: value, codeHasError: false })
          }
          name={"jsImporter"}
          fontSize={globals.codeSize}
          showPrintMargin={false}
          wrapEnabled={true}
          showGutter={false}
          highlightActiveLine={false}
          onMouseOver={() => this.props.disablePan(true)}
          onMouseOut={() => this.props.disablePan(false)}
          value={this.state.code}
          ref={this.editorRef}
          setOptions={{
            tabSize: 2,
            hasCssTransforms: true
          }}
        />
      </div>
    );
  }

  renderImportButton() {
    var text = "import javascript";
    var color = "grey";
    if (this.state.codeHasError) {
      text = "syntax error";
      color = "warningOrangeDark";
    }

    return (
      <div
        class="p-2"
        style={{ position: "absolute", bottom: -2, left: -5, width: "100%" }}
      >
        <button
          class={
            "btn btn-block shadow-sm m-1 bg-" + color + " border-borderGrey"
          }
          style={{
            fontSize: globals.buttonTextSize
          }}
          onClick={this.parseCode.bind(this)}
          disabled={this.state.codeHasError}
        >
          {text}
        </button>
      </div>
    );
  }

  renderLayerPicker() {
    var pickers = [];

    this.props.pickerData.map(item => {
      if (item.status) {
        var iconType = VisibilityIcon;
        var iconNameCallback =                   () =>
                    centerCallback(this.state.sideBarWidth, this.topBarHeight)
             
      } else {
        var iconType = VisibilityOffIcon;
        var iconNameCallback = null
      }


      var overalOpacity = 1;
      var centerCallback = item.centerCallback;

      if (item.status === false) {
        overalOpacity = 0.5;
        centerCallback = () => null;
      }
      if (item.name) {
        pickers.push(
          <div class="border-bottom border-borderGrey">
            <div
              style={{ opacity: overalOpacity }}
              class="d-flex justify-content-between p-1 pl-2 pr-3"
            >
              <div clas="row border-bottom" style={{ overflow: "hidden" }}
                                onClick={() =>
                    centerCallback(this.state.sideBarWidth, this.topBarHeight)
                  }>
                {this.createIcon(
                  "type" + item.id.toString(),
                  item.icon,
                  iconNameCallback,
                         item.name
                )}

              </div>

              {this.createIcon(
                "hide" + item.id.toString(),
                iconType,
                item.hideCallback,
              )}
            </div>
          </div>
        );
      } else {
        pickers.push(<br />);
      }
    });

    var overflowY = "hidden";
    if (this.state.pickerScrollEnabled) {
      overflowY = "scroll";
    }
    return (
      <Resizable
        width={this.state.sideBarWidth}
        onResize={e => {
          var newHeight = this.state.pickerHeight + e.movementY;
          if (
            newHeight > this.minPickerHeight &&
            newHeight <
              window.innerHeight -
                (this.topBarHeight +
                  this.minJsImporterHeight +
                  +this.importButtonHeight)
          ) {
            this.setState(
              { pickerHeight: this.state.pickerHeight + e.movementY, jsImporterHeight:this.state.jsImporterHeight - e.movementY },
              () => this.editorRef.current.editor.resize()
            );
          }
        }}
        onResizeStart={() => this.setState({ pickerScrollEnabled: false })}
        onResizeStop={() => this.setState({ pickerScrollEnabled: true })}
        height={this.state.pickerHeight}
        axis="y"
        handle={this.renderPickerResizeHandle()}
      >
        <div>
          <div
            className=" bg-white"
            style={{
              overflow: "hidden",
              "overflow-y": overflowY,
              width: this.state.sideBarWidth,
              height: this.state.pickerHeight
            }}
          >
            {pickers}
            <br/>
            <br/>
          </div>
        </div>
      </Resizable>
    );
  }

  createIcon(
    uniqueClass,
    iconType,
    hideCallback = null,
    text
  ) {
   
    var mouseOverCallback = () => {
      $("." + uniqueClass + "Icon").css({ opacity: "1" });
      $("." + uniqueClass + "Text").removeClass("text-greyText").addClass("text-greyIcon");
    };

    var mouseOutCallback = () => {
      $("." + uniqueClass + "Icon").css({ opacity:globals.iconOpacity });
      $("." + uniqueClass + "Text").addClass("text-greyText").removeClass("text-greyIcon");
    };
    if (!hideCallback) {
      mouseOverCallback = () => {};
      mouseOutCallback = () => {};
    }
    if(text){
return (
<div onMouseOver={mouseOverCallback} onMouseOut={mouseOutCallback}>
      {React.createElement("img", {
      style: { height: globals.iconSize, opacity:globals.iconOpacity, width: globals.iconSize },
      className: " m-1 text-greyIcon " + uniqueClass + "Icon",
      onClick: hideCallback,
      src: iconType
    })}
        <b class={"text-greyText picker ml-1 " + uniqueClass + "Text"}>
          {text}
        </b>
      </div>)
    }

    return React.createElement("img", {
      style: { height: globals.iconSize, opacity:globals.iconOpacity, width: globals.iconSize },
      className: " m-1 text-greyIcon " + uniqueClass + "Icon",
      onClick: hideCallback,
      onMouseOver: mouseOverCallback,
      onMouseOut: mouseOutCallback,
      src: iconType
    });
  }

  renderSideBarResizeHandle() {
    return (
      <div
        style={{
          width: 10,
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
    );
  }

  renderPickerResizeHandle() {
    return (
      <div
        className="border-bottom border-borderGrey border-top bg-grey"
        style={{
          width: "100%",
          cursor: "ns-resize",
          height: 15,
          right: 0,
          bottom: 0,
          position: "absolute",
          background: "transparent",
          color: "transparent"
        }}
      >
        hi
      </div>
    );
  }

  renderTopBar() {
    return (
      <div
        class="bg-white border border-borderGrey shadow-sm row justify-content-between"
        style={{
          position: "absolute",
          top: 0,
          left: 15,
          height: this.topBarHeight + 2,
          width: "100%",
          zIndex: 1000000000000000001
        }}
      >



        <TopButton
          iconType={DownloadIcon}
          uniqueClass="download"
          iconCallback={() => {
            this.props.modalManagerRef.current.requestDownload()
          }}
          tooltipText="download javascript"
          alignLeft
        />


                 
        <div class="row">
          <TopButton
            iconType={FunctionStampIcon}
            uniqueClass="basic"
            iconCallback={() =>
              this.props.addFnStamp(normalFn, (id) => this.props.requestCompile(id))
            }
            dropDownData={builtInFns.map(data => ({
              name: data.name,
              callback: () =>
                this.props.addFnStamp(data, (id) => this.props.requestCompile(id))
            }))}
            tooltipText="function"
          />
          <span style={{width:50}}/>


          <TopButton
            iconType={ListenerStampIcon}
            uniqueClass="listenerFns"
            iconCallback={null}
            dropDownData={listenerFns.map(data => ({
              name: data.name,
              callback: () =>
                this.props.addFnStamp(data, (id) => this.props.requestCompile(id))
            }))}
            tooltipText="listener"
          />

                  <span style={{width:50}}/>

          <TopButton
            iconType={ BlobStampIcon}
            uniqueClass="varStamp"
            iconCallback={() =>
              this.props.addBlobStamp(varBlob, (id) => this.props.requestCompile(id))
            }
            tooltipText="global variable"
          />
        <span style={{width:50}}/>
          <TopButton
            iconType={BlobStampIcon}
            uniqueClass="commentStamp"
            iconCallback={() =>
              this.props.addBlobStamp(commentBlob, (id) => this.props.requestCompile(id))
            }
            tooltipText="comment"
          />


        </div>

        <TopButton
          iconType={WorldsIcon}
          uniqueClass="worlds"
          iconCallback={null}
          dropDownData={worlds.map(world => ({
            name: world.name,
            callback: () => this.props.modalManagerRef.current.requestWorldLoad(world.data)
          }))}
          tooltipText="overwrite with example"
          alignRight
        />



      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderSideBar()}
        {this.renderTopBar()}
      </div>
    );
  }
}

class TopButton extends Component {
  constructor(props) {
    super(props);
    this.state = { down: false, mouseOverDropDown: false };
  }

  onMouseDown() {
    if (this.state.mouseOverDropDown === false) {
      this.setState({ down: false });
    }
  }
  componentDidMount() {
    document.addEventListener("mousedown", this.onMouseDown.bind(this));
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.onMouseDown);
  }

  createIcon(iconType, callback, givenUniqueClass, size) {
    var uniqueClass = givenUniqueClass;
    var mouseOverCallback = () => {

        this.setState({ mouseOverDropDown: true }, () =>
          $("." + uniqueClass).css({ opacity: "1" })
        );

    };

    var mouseOutCallback = () => {

        this.setState(
          { mouseOverDropDown: false },

          () => {
            if (this.state.down === false || (iconType != ExpandMoreIcon && this.props.iconCallback) ) {
              $("." + uniqueClass).css({ opacity: globals.iconOpacity });
            }
          }
        );

    };

    if (!callback) {
      callback = () => this.setState({ down: !this.state.down });
      uniqueClass += "expand";
    }

    return React.createElement("img", {
      style: { opacity: globals.iconOpacity, height: size, width: size },
      className: " text-greyIcon " + uniqueClass,
      onClick: callback,
      onMouseOver: mouseOverCallback,
      onMouseOut: mouseOutCallback,
      src: iconType
    });
  }

  renderDropDowns() {
    if (this.state.down === false) {
      return null;
    }

    var dropDowns = this.props.dropDownData.map(data => (

      <div
        class={
          this.props.uniqueClass +
          data.name +
          " picker text-greyText p-2 pl-3 pr-3"
        }
        onMouseOver={() => { if(!data.name){return}
          this.setState({ mouseOverDropDown: true });
          $("." + this.props.uniqueClass + data.name).css({
            background: "rgb(240, 240, 240)"
          });
        }}
        onMouseOut={() => {if(!data.name){return}
          this.setState({ mouseOverDropDown: false });
          $("." + this.props.uniqueClass + data.name).css({
            background: "transparent"
          });
        }}
        onClick={() => {if(!data.name){return}
          data.callback();
          this.setState({ down: false });
        }}
      >
        {data.name}
      </div>
    ));

    var right = "default";
    if (this.props.alignRight) {
      right = 0;
    }
    return (
      <div
        class="bg-white border border-borderGrey rounded mt-2"
        style={{ position: "absolute", right: right }}
      >
        {dropDowns}
      </div>
    );
  }


  renderTooltip(){
    if(this.props.alignRight){
      return(

      <div class={"picker text-greyText tooltip" + this.props.uniqueClass}
      style={{opacity:"1", position:"absolute", right:15, top:5,
      transition:"all .2s ease-out"}}
      >
      {this.props.tooltipText}</div>

        )
    }

    if(this.props.alignLeft){
      return(

      <div class={"picker text-greyText tooltip" + this.props.uniqueClass}
      style={{opacity:"1", position:"absolute", left:15, top:5,
      transition:"all .2s ease-out"}}
      >
      {this.props.tooltipText}</div>

        )
    }

    var offset = "-138px"
    if(this.props.dropDownData){
      var offset = "-133px"
    }
    return(
      <div style = {{position:"absolute", top:5}}>
      <div style={{position:"absolute", width:300, left:offset}} >
      <div class={"picker text-greyText tooltip" + this.props.uniqueClass}
      style={{opacity:"1", textAlign:"center",
      transition:"all .2s ease-out"}}
      >
      {this.props.tooltipText}</div>
      </div>
      </div>
     
  
    )

  }
  render() {
    if (this.state.down) {
      $("." + this.props.uniqueClass + "expand").css({
        opacity: "1"
      });
    } else {
      $("." + this.props.uniqueClass + "expand").css({
        opacity: ".5"
      });
    }

    var expandButton = null;
    if (this.props.dropDownData) {
      expandButton = this.createIcon(
        ExpandMoreIcon,
        () => this.setState({ down: !this.state.down }),
        this.props.uniqueClass + "expand",
        16
      );
    }

          // onMouseOver={() => $(".tooltip" + this.props.uniqueClass).css({opacity: "1"})}
      // onMouseOut={() => $(".tooltip" + this.props.uniqueClass).css({opacity: "0"})}

    return (
      <div class="m-3 mt-4"

      >

            {this.renderTooltip()}
              <div


              >

            {this.createIcon(
              this.props.iconType,
              this.props.iconCallback,
              this.props.uniqueClass,
              20
            )}

            {expandButton}
          </div>
     

        {this.renderDropDowns()}

      </div>
    );
  }
}
