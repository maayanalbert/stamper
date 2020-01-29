import React, { Component } from "react";
import Cristal from "./react-cristal/dist/es2015/index.js";
import $ from "jquery";
import pf, { globals, p5Lib } from "./globals.js";
import ConsoleStamp from "./ConsoleStamp.js";

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
import UploadIcon from "./icons/upload.svg";
import WorldsIcon from "./icons/archive.svg";
import GlobalVarIcon from "./icons/globe.svg";
import CommentIcon from "./icons/message-square.svg";
import FileStampIcon from "./icons/file.svg";
import ImageStampIcon from "./icons/image.svg";
import InfoIcon from "./icons/info.svg";
import PermanentWorldIcon from "./icons/star.svg";

import Overlay from "react-bootstrap/Overlay";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/javascript";
import Modal from "react-bootstrap/Modal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ConsoleStampIcon from "./icons/message-circle.svg";

import pf1, {
  normalFn,
  starterBlobs,
  listenerFns,
  builtInFns,
  worlds,
  sampleFile, 
  empty,
  starter
} from "./starterStamps.js";

var _ = require("lodash");

var esprima = require("esprima");

var userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(" electron/") > -1) {
  const electron = window.require("electron");
  var ipc = electron.ipcRenderer;
} else {
  var ipc = false;
}

export default class ControlBar extends Component {
  constructor(props) {
    super(props);
    this.editorRef = React.createRef();
    this.minPickerHeight = 30;
    this.minJsImporterHeight = 30;
    this.topBarHeight = 60;
    this.minWidth = 150;
    this.minNonSideBarWidth = 30;
    this.editorRef = React.createRef();
    this.importButtonHeight = 50;
    this.spanWidth = 35;
    this.receiveMessage = this.receiveMessage.bind(this)

    this.state = {
      worldDropDowns:[],
      jsImporterHeight: 110,
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
  
    this.props.updateControlBarDimensions(
      this.state.sideBarWidth,
      this.topBarHeight
    );
    window.addEventListener("resize", this.onWindowResize.bind(this));
    window.addEventListener("message", this.receiveMessage)
    
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
    window.removeEventListener("message", this.receiveMessage)
  }

    receiveMessage(e){
     if(e.data.type != "worlds"){
        return
      } 


      this.setWorldDropDowns()

      
  }

  onWindowResize(e) {
    this.setState({
      pickerHeight:
        window.innerHeight -
        (this.topBarHeight +
          this.importButtonHeight +
          this.state.jsImporterHeight)
    });
    if (this.state.sideBarWidth > window.innerWidth - this.minNonSideBarWidth) {
      this.setState({
        sideBarWidth: window.innerWidth - this.minNonSideBarWidth
      });
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
            if (
              newWidth > this.minWidth &&
              newWidth <= window.innerWidth - this.minNonSideBarWidth
            ) {
              this.setState({ sideBarWidth: newWidth }, () =>
                this.editorRef.current.editor.resize()
              );
            }
          }}
          onResizeStop={e =>
            this.props.updateControlBarDimensions(
              this.state.sideBarWidth,
              this.topBarHeight
            )
          }
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
      var stamperObject = parser.jsToStamps(this.state.code);
      var curNumStamps = this.props.getNumStamps();

      var callback = () => {
        window.postMessage({type:"edited"}, '*')
        this.props.recompileIfEnoughStamps(
          stamperObject.stamps.length + curNumStamps.stamps
        );
      };

      this.props.addManyStamps(stamperObject.stamps, callback);

      this.setState({ code: "" });
    } catch (e) {
      console.log(e);
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
            fontFamily: "Inconsolata"
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

  getDraggableClass(snapshot, hasError) {
    var className
    if (snapshot.isDragging) {
      className = "border border-lightGreyText";
    } else {
      className = "border-bottom border-borderGrey";
    }

    if(hasError){
      if(snapshot.isDragging){
      className += " bg-warningOrange"
      }else{
      className = "border-bottom border-white bg-warningOrange"
      }
    }else{
      className += " bg-white"
    }

    return className
  }

  renderPicker(item) {
    if (item.status) {
      var iconType = VisibilityIcon;
      var iconNameCallback = () =>
        centerCallback(this.state.sideBarWidth, this.topBarHeight);
    } else {
      var iconType = VisibilityOffIcon;
      var iconNameCallback = null;
    }

    var overalOpacity = 1;
    var centerCallback = item.centerCallback;

    if (item.status === false) {
      overalOpacity = 0.5;
      centerCallback = () => null;
    }

    return (
      <div
        style={{ opacity: overalOpacity }}
        class="d-flex justify-content-between p-1 pl-2 pr-3"
      >
        <div
          clas="row border-bottom"
          style={{ overflow: "hidden", cursor: "auto" }}
          onClick={() =>
            centerCallback(this.state.sideBarWidth, this.topBarHeight)
          }
        >
          {this.createIcon(
            "type" + item.id.toString(),
            item.icon,
            iconNameCallback,
            item.name
          )}
        </div>
        <div style={{ cursor: "auto" }}>
          {this.createIcon(
            "hide" + item.id.toString(),
            iconType,
            item.hideCallback
          )}
        </div>
      </div>
    );
  }

  renderPickers(provided, snapshot) {
    var pickers = [];
    var overflowY = "hidden";
    if (this.state.pickerScrollEnabled) {
      overflowY = "scroll";
    }

    this.props.pickerData.map((item, index) => {

      if(item.isConsole){
      pickers.push(


            <div
              class="border-bottom border-borderGrey bg-grey"
            >
              {this.renderPicker(item)}

            </div>
      )

      }else{
      pickers.push(
        <Draggable draggableId={item.id.toString()} index={index}>
          {(provided, snapshot) => (
            <div
              class={this.getDraggableClass(snapshot, item.hasError)}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              {this.renderPicker(item)}
            </div>
          )}
        </Draggable>
      )
    }
    



    });

    return (
      <div
        className=" bg-white"
        style={{
          overflow: "hidden",
          "overflow-y": overflowY,
          width: this.state.sideBarWidth,
          height: this.state.pickerHeight
        }}
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        {pickers}
        {provided.placeholder}
        <br />
        <br />
      </div>
    );
  }

  renderLayerPicker() {
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
              {
                pickerHeight: this.state.pickerHeight + e.movementY,
                jsImporterHeight: this.state.jsImporterHeight - e.movementY
              },
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
          <DragDropContext onDragEnd={this.props.onDragEnd}>
            <Droppable droppableId="droppable">
              {this.renderPickers.bind(this)}
            </Droppable>
          </DragDropContext>
        </div>
      </Resizable>
    );
  }

  createIcon(uniqueClass, iconType, hideCallback = null, text) {
    var mouseOverCallback = () => {
      $("." + uniqueClass + "Icon").css({ opacity: "1" });
      $("." + uniqueClass + "Text")
        .removeClass("text-greyText")
        .addClass("text-greyIcon");
    };

    var mouseOutCallback = () => {
      $("." + uniqueClass + "Icon").css({ opacity: globals.iconOpacity });
      $("." + uniqueClass + "Text")
        .addClass("text-greyText")
        .removeClass("text-greyIcon");
    };
    if (!hideCallback) {
      mouseOverCallback = () => {};
      mouseOutCallback = () => {};
    }
    if (text) {
      return (
        <div onMouseOver={mouseOverCallback} onMouseOut={mouseOutCallback}>
          {React.createElement("img", {
            style: {
              height: globals.iconSize,
              opacity: globals.iconOpacity,
              width: globals.iconSize
            },
            className: " m-1 text-greyIcon " + uniqueClass + "Icon",
            onClick: hideCallback,
            src: iconType
          })}
          <b class={"text-greyText picker ml-1 " + uniqueClass + "Text"}>
            {text}
          </b>
        </div>
      );
    }

    return React.createElement("img", {
      style: {
        height: globals.iconSize,
        opacity: globals.iconOpacity,
        width: globals.iconSize
      },
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
      <span
        className="border-bottom border-borderGrey border-top bg-grey"
        style={{
          width: "100%",
          cursor: "ns-resize",
          height: 15,
          right: 0,
          bottom: 0,
          position: "absolute",
          background: "transparent"
        }}
      />
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
        onMouseOver={() => {
          this.props.disablePan(true);
          this.props.disableZoom(true);
        }}
        onMouseOut={() => {
          this.props.disablePan(false);
          this.props.disableZoom(false);
        }}
      >
        <span hidden={!ipc} />
        <div class="row ml-5" hidden={ipc}>
          <TopButton
            iconType={UploadIcon}
            uniqueClass="upload"
            iconCallback={() => {
              this.props.modalManagerRef.current.requestUpload();
            }}
            tooltipText="upload p5 sketch"
            alignLeft
          />
          <span style={{ width: this.spanWidth*2 }} />
          <TopButton
            iconType={DownloadIcon}
            uniqueClass="download p5 sketch"
            iconCallback={() => {
              this.props.modalManagerRef.current.requestDownload();
            }}
            tooltipText="download p5 sketch"
          />
        </div>

        <div class="row">
          <TopButton
            iconType={FunctionStampIcon}
            uniqueClass="basic"
            iconCallback={() =>
              this.props.addStamp(normalFn, id => {
              this.props.requestCompile(id)
              window.postMessage({type:"edited"}, '*')
            }
                )
            }
            dropDownData={builtInFns
              .map(data => ({
                name: data.name,
                icon: BuiltInStampIcon,
                callback: () =>
                  this.props.addStamp(data, id => {
              this.props.requestCompile(id)
              window.postMessage({type:"edited"}, '*')
            }
                    )
              }))
              .concat([{}])
              .concat(
                listenerFns.map(data => ({
                  name: data.name,
                  icon: ListenerStampIcon,
                  callback: () =>
                    this.props.addStamp(data, id =>
                      {
              this.props.requestCompile(id)
              window.postMessage({type:"edited"}, '*')
            }
                    )
                }))
              )}
            tooltipText="function"
          />
          <span style={{ width: this.spanWidth }} />

          <TopButton
            iconType={BlobStampIcon}
            uniqueClass="varStamp"
            iconCallback={() =>
              this.props.addStamp(starterBlobs[0].data, id => {
              this.props.requestCompile(id)
              window.postMessage({type:"edited"}, '*')
            })
            }
            dropDownData={starterBlobs.map(starterBlob => ({
              name:starterBlob.name,
              icon:BlobStampIcon,
              callback:() => 
                      this.props.addStamp(starterBlob.data, id =>
                      {
              this.props.requestCompile(id)
              window.postMessage({type:"edited"}, '*')
            }
                    )
            }))
          }
            tooltipText="global"
          />
          <span style={{ width: this.spanWidth }} />

          <TopButton
            iconType={FileStampIcon}
            uniqueClass="fileStamp"
            iconCallback={() =>
 this.props.modalManagerRef.current.requestFileUpload("text")
            }
            tooltipText="file"
            dropDownData={
              [{name:"upload files", icon:FileStampIcon, callback:() =>
              this.props.modalManagerRef.current.requestFileUpload("text") },
              {name:"new file", icon:FileStampIcon, callback:() =>
              this.props.addStamp(sampleFile, id =>
                {
              this.props.requestCompile(id)
              window.postMessage({type:"edited"}, '*')
            }
              ) } ]
          }
          />

          <span style={{ width: this.spanWidth }} />
          <TopButton
            iconType={ImageStampIcon}
            uniqueClass="imageStamp"
            iconCallback={() =>
              this.props.modalManagerRef.current.requestFileUpload()
            }
            tooltipText="media"
          />
        </div>

        <span hidden={true} />
        <div className="mr-5"

        >
          <TopButton
            iconType={WorldsIcon}
            uniqueClass="worlds"
            iconCallback={null}
            dropDownData={this.state.worldDropDowns}
            tooltipText="examples..."
            alignRight

          />
        </div>
      </div>
    );
  }




  setWorldDropDowns(){

    var dropDownData =
              [{
                name:"publish current sketch",
                callback:() => this.props.modalManagerRef.current.requestPublish(),
                icon:UploadIcon
              }]


      dropDownData.push({
        name: "get current example info",
        callback:() => this.props.modalManagerRef.current.requestPublishInfo(),
        icon: InfoIcon
      })

      if(ipc){
        this.setState({worldDropDowns:dropDownData})
        return
      }
    dropDownData.push({})

    this.props.modalManagerRef.current.getWorldNamesAndKeys((allWorlds) => {
      allWorlds.map(item => {
        dropDownData.push({name:item.name,
          callback:() => this.props.modalManagerRef.current.getWorldObject(item.key, true, 
            (so) => this.props.modalManagerRef.current.loadWithOverwriteProtection(so))
        })
        this.setState({worldDropDowns:dropDownData})
      })
    })

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
    this.topBarHeight = 60
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

  createIcon(iconType, callback, givenUniqueClass, size, dropDownIcon = false) {
    var uniqueClass = givenUniqueClass;
    var mouseOverCallback = () => {
      // $(".tooltip" + givenUniqueClass).addClass("text-black")
      //         .removeClass("text-greyText");

      this.setState({ mouseOverDropDown: true }, () =>
        $("." + uniqueClass).css({ opacity: "1" })
      );
    };

    var mouseOutCallback = () => {
      // $(".tooltip" + givenUniqueClass).addClass("text-greyText")
      //         .removeClass("text-black");

      this.setState(
        { mouseOverDropDown: false },

        () => {
          if (
            this.state.down === false ||
            (iconType != ExpandMoreIcon && this.props.iconCallback)
          ) {
            $("." + uniqueClass).css({ opacity: globals.iconOpacity });
          }
        }
      );
    };

    if (!callback && dropDownIcon === false) {
      callback = () => this.setState({ down: !this.state.down });
      uniqueClass += "expand";
    }

    if (dropDownIcon) {
      mouseOverCallback = () => null;
      mouseOutCallback = () => null;
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

    var dropDowns = this.props.dropDownData.map(data => {
      var oneWordName = "";
      if (data.name) {

        oneWordName = data.name.replace(new RegExp(' ', 'g'), "-");

      }else{

        return (
          <div>
          <div 
        style={{height:5, color:"transparent", width:"100%"}}>hi</div>
          <div className="border-top border-borderGrey" 
        style={{height:5, color:"transparent", width:"100%"}}>hi</div>
        </div>
        )
      }
      return (
        <div
          class={
            this.props.uniqueClass +
            oneWordName +
            " picker text-greyText p-1 pl-3 pr-3"
          }
          onMouseOver={() => {
            if (!data.name) {
              return;
            }
            this.setState({ mouseOverDropDown: true });
            $("." + this.props.uniqueClass + oneWordName).css({
              background: "rgb(240, 240, 240)"
            });
          }}
          onMouseOut={() => {
            if (!data.name) {
              return;
            }
            this.setState({ mouseOverDropDown: false });
            $("." + this.props.uniqueClass + oneWordName).css({
              background: "transparent"
            });
          }}
          onClick={() => {
            if (!data.name) {
              return;
            }
            data.callback();
            this.setState({ down: false });
          }}
        >
          <a className="mr-2" hidden={!data.name || !data.icon}>
            {this.createIcon(data.icon, undefined, "dropDown", 12, true)}
          </a>
          {data.name}
        </div>
      );
    });

    var right = "default";
    if (this.props.alignRight) {
      right = 0;
    }

    var dropDownHeight = window.innerHeight - this.topBarHeight

    return (
      <div
        class="bg-white border border-borderGrey rounded mt-2 justify-content-left"
        style={{ position: "absolute", right: right, "overflow-y":"scroll", maxHeight:dropDownHeight}}
      >
        {dropDowns}
      </div>
    );
  }

  renderTooltip() {
    // if (this.props.alignRight) {
    //   return (
    //     <div
    //       class={"picker text-greyText tooltip" + this.props.uniqueClass}
    //       style={{
    //         opacity: "1",
    //         position: "absolute",
    //         right: 20,
    //         top: 5,
    //         transition: "all .2s ease-out"
    //       }}
    //     >
    //       {this.props.tooltipText}
    //     </div>
    //   );
    // }

    // if (this.props.alignLeft) {
    //   return (
    //     <div
    //       class={"picker text-greyText tooltip" + this.props.uniqueClass}
    //       style={{
    //         opacity: "1",
    //         position: "absolute",
    //         left: 20,
    //         top: 5
    //       }}
    //     >
    //       {this.props.tooltipText}
    //     </div>
    //   );
    // }

    var offset = "-140px";
    if (this.props.dropDownData) {
      var offset = "-133px";
    }
    return (
      <div style={{ position: "absolute", top: 5 }}>
        <div style={{ position: "absolute", width: 300, left: offset }}>
          <div
            class={"picker text-greyText tooltip" + this.props.uniqueClass}
            style={{
              opacity: "1",
              textAlign: "center"
            }}
          >
            {this.props.tooltipText}
          </div>
        </div>
      </div>
    );
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

    return (
      <div class="m-3 mt-4">
        {this.renderTooltip()}
        <div>
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
