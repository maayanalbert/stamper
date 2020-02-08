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
    this.minPickerHeight = 70;
    this.minJsImporterHeight = 30;
    this.topBarHeight = 60;
    this.minWidth = 150;
    this.minNonSideBarWidth = 30;
    this.editorRef = React.createRef();
    this.importButtonHeight = 50;
    this.spanWidth = 5;
    this.spanWidthWide = 60;
    this.receiveMessage = this.receiveMessage.bind(this);

    this.state = {
      worldDropDowns: [],
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
    window.addEventListener("message", this.receiveMessage);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
    window.removeEventListener("message", this.receiveMessage);
  }

  receiveMessage(e) {
    if (e.data.type != "worlds") {
      return;
    }

    this.setWorldDropDowns();
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
      this.props.addRawJavascript(this.state.code);
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
    var className;
    if (snapshot.isDragging) {
      className = "border border-lightGreyText";
    } else {
      className = "border-bottom border-borderGrey";
    }

    if (hasError) {
      if (snapshot.isDragging) {
        className += " bg-warningOrange";
      } else {
        className = "border-bottom border-white bg-warningOrange";
      }
    } else {
      className += " bg-white";
    }

    return className;
  }

  renderPicker(item) {
    if (item.status) {
      var iconType = item.toggleOnIcon;
      var iconNameCallback = () =>
        centerCallback(this.state.sideBarWidth, this.topBarHeight);
    } else {
      var iconType = item.toggleOffIcon;
      var iconNameCallback = null;
    }

    var overalOpacity = 1;
    var centerCallback = item.centerCallback;

    if (item.status === false && item.icon != globals.EmptyIcon) {
      overalOpacity = 0.5;
      centerCallback = () => null;
    }

    if (!item.centerCallback) {
      centerCallback = () => null;
      iconNameCallback = null;
    }

    if (item.icon === globals.EmptyIcon) {
      var iconType = item.toggleOnIcon;
      if (item.status === false) {
        var iconType = item.toggleOffIcon;
      }
    }

    return (
      <div
        style={{ opacity: overalOpacity, width: this.state.sideBarWidth }}
        class="d-flex justify-content-between p-1 pl-2 pr-3"
      >
        <div
          clas="row"
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
      if (item.isSetting) {
        pickers.push(this.renderSettingsPicker(item));
        return;
      }

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
      );
    });

    return (
      <div
        className=" bg-white"
        style={{
          "overflow-y": overflowY,
          width: this.state.sideBarWidth,
          flexGrow: 1
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

  renderSettingsPicker(item) {
    return (
      <div class="border-bottom border-borderGrey bg-grey">
        {this.renderPicker(item)}
      </div>
    );
  }

  renderSettingsPickers() {
    var pickers = this.props.settingsPicker.map(item =>
      this.renderSettingsPicker(item)
    );

    return (
      <div
        class="bg-white  border-bottom border-borderGrey shadow-sm"
        style={{ zIndex: 2 }}
      >
        {pickers}
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
        <div
          style={{
            overflow: "hidden",
            flexFlow: "column",
            display: "flex",
            height: this.state.pickerHeight
          }}
        >
          {this.renderSettingsPickers()}
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
        <div class="row pl-5" hidden={ipc}>
          <TopButton
            disablePan={this.props.disablePan}
            disableZoom={this.props.disableZoom}
            iconType={globals.UploadIcon}
            uniqueClass="upload"
            iconCallback={() => {
              this.props.modalManagerRef.current.requestUpload();
            }}
            tooltipText="upload sketch"
            alignLeft
          />
          <span style={{ width: this.spanWidthWide }} />
          <TopButton
            disablePan={this.props.disablePan}
            disableZoom={this.props.disableZoom}
            iconType={globals.DownloadIcon}
            uniqueClass="download"
            iconCallback={() => {
              this.props.modalManagerRef.current.requestDownload();
            }}
            tooltipText="download sketch"
          />
        </div>

        <div class="row">
          <TopButton
            disablePan={this.props.disablePan}
            disableZoom={this.props.disableZoom}
            iconType={globals.FunctionStampIcon}
            uniqueClass="basic"
            iconCallback={() =>
              this.props.addStamp(normalFn, id => {
                this.props.requestCompile(id);
                window.postMessage({ type: "edited" }, "*");
              })
            }
            dropDownData={builtInFns
              .map(data => ({
                name: data.name,
                icon: globals.BuiltInStampIcon,
                callback: () =>
                  this.props.addStamp(data, id => {
                    this.props.requestCompile(id);
                    window.postMessage({ type: "edited" }, "*");
                  })
              }))
              .concat([{}])
              .concat(
                listenerFns.map(data => ({
                  name: data.name,
                  icon: globals.ListenerStampIcon,
                  callback: () =>
                    this.props.addStamp(data, id => {
                      this.props.requestCompile(id);
                      window.postMessage({ type: "edited" }, "*");
                    })
                }))
              )}
            tooltipText="function"
          />
          <span style={{ width: this.spanWidth }} />

          <TopButton
            disablePan={this.props.disablePan}
            disableZoom={this.props.disableZoom}
            iconType={globals.BlobStampIcon}
            uniqueClass="varStamp"
            iconCallback={() =>
              this.props.addStamp(starterBlobs[0].data, id => {
                this.props.requestCompile(id);
                window.postMessage({ type: "edited" }, "*");
              })
            }
            dropDownData={starterBlobs.map(starterBlob => ({
              name: starterBlob.name,
              icon: globals.BlobStampIcon,
              callback: () =>
                this.props.addStamp(starterBlob.data, id => {
                  this.props.requestCompile(id);
                  window.postMessage({ type: "edited" }, "*");
                })
            }))}
            tooltipText="global"
          />
          <span style={{ width: this.spanWidth }} />

          <TopButton
            disablePan={this.props.disablePan}
            disableZoom={this.props.disableZoom}
            iconType={globals.FileStampIcon}
            uniqueClass="fileStamp"
            iconCallback={() =>
              this.props.modalManagerRef.current.requestFileUpload("text")
            }
            tooltipText="file"
            dropDownData={[
              {
                name: "upload files",
                icon: globals.FileStampIcon,
                callback: () =>
                  this.props.modalManagerRef.current.requestFileUpload("text")
              },
              {
                name: "new file",
                icon: globals.FileStampIcon,
                callback: () =>
                  this.props.addStamp(sampleFile, id => {
                    this.props.requestCompile(id);
                    window.postMessage({ type: "edited" }, "*");
                  })
              }
            ]}
          />

          <span style={{ width: this.spanWidth }} />
          <TopButton
            iconType={globals.ImageStampIcon}
            uniqueClass="imageStamp"
            iconCallback={() =>
              this.props.modalManagerRef.current.requestFileUpload()
            }
            tooltipText="media"
            disablePan={this.props.disablePan}
            disableZoom={this.props.disableZoom}
          />

          <span style={{ width: this.spanWidthWide }} />

          <TopButton
            disablePan={this.props.disablePan}
            disableZoom={this.props.disableZoom}
            iconType={globals.ClearConsoleIcon}
            uniqueClass="undoDelete"
            iconCallback={() => this.props.undoDelete()}
            dropDownData={this.props.deletedStamps
              .map((stampData, index) => ({
                name: stampData.name,
                icon: stampData.icon,
                callback: () => this.props.undoDelete(index)
              }))
              .reverse()}
            tooltipText="undo delete"
            disabled={this.props.deletedStamps.length === 0}
          />
        </div>

        <span hidden={true} />
        <div className="pr-5 row">
          <TopButton
            iconType={globals.WorldsIcon}
            uniqueClass="worlds"
            iconCallback={null}
            dropDownData={this.state.worldDropDowns}
            tooltipText="examples..."
            alignRight
            disablePan={this.props.disablePan}
            disableZoom={this.props.disableZoom}
          />
        </div>
      </div>
    );
  }

  setWorldDropDowns() {
    var dropDownData = [
      {
        name: "publish current sketch",
        callback: () => this.props.modalManagerRef.current.requestPublish(),
        icon: globals.UploadIcon
      }
    ];

    dropDownData.push({
      name: "get current example info",
      callback: () => this.props.modalManagerRef.current.requestPublishInfo(),
      icon: globals.InfoIcon
    });

    if (ipc) {
      this.setState({ worldDropDowns: dropDownData });
      return;
    }
    dropDownData.push({});

    this.props.modalManagerRef.current.getWorldNamesAndKeys(allWorlds => {
      allWorlds.map(item => {
        dropDownData.push({
          name: item.name,
          callback: () => {
            window.open(
              this.props.modalManagerRef.current.worldKeyToUrl(item.key),
              "_blank"
            );

            // this.props.modalManagerRef.current.getWorldObject(item.key, true,
            //  (so) => this.props.modalManagerRef.current.loadWithOverwriteProtection(so))
          }
        });
        this.setState({ worldDropDowns: dropDownData });
      });
    });
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
    this.topBarHeight = 60;
  }

  onMouseDown() {
    if (this.state.mouseOverDropDown === false) {
      this.props.disablePan(false);

      this.props.disableZoom(false);
      this.setState({ down: false });
    }
  }
  componentDidMount() {
    document.addEventListener("mousedown", this.onMouseDown.bind(this));
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.onMouseDown);
  }

  createTopButtonIcon(
    iconType,
    callback,
    givenUniqueClass,
    size,
    dropDownIcon = false,
    disabled
  ) {
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
          if (
            this.state.down === false ||
            (iconType != globals.ExpandMoreIcon && this.props.iconCallback)
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

    if (this.props.disabled) {
      mouseOverCallback = () => null;
      // mouseOutCallback = () => null;
      callback = () => null;
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

  getUniqueID() {
    return Math.random()
      .toString(36)
      .substr(2, 9);
  }

  renderDropDowns() {
    if (this.state.down === false) {
      return null;
    }

    var dropDowns = this.props.dropDownData.map(data => {
      var oneWordName = "";
      if (data.name) {
        oneWordName = this.getUniqueID();
      } else {
        return (
          <div>
            <div style={{ height: 5, color: "transparent", width: "100%" }}>
              hi
            </div>
            <div
              className="border-top border-borderGrey"
              style={{ height: 5, color: "transparent", width: "100%" }}
            >
              hi
            </div>
          </div>
        );
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
            {this.createTopButtonIcon(
              data.icon,
              undefined,
              "dropDown",
              12,
              true,
              this.props.disabled
            )}
          </a>
          {data.name}
        </div>
      );
    });

    var right = "default";
    if (this.props.alignRight) {
      right = 0;
    }

    var dropDownHeight = window.innerHeight - this.topBarHeight;

    return (
      <div
        class="bg-white border border-borderGrey rounded mt-2 justify-content-left"
        style={{
          position: "absolute",
          right: right,
          "overflow-y": "scroll",
          maxHeight: dropDownHeight
        }}
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
      expandButton = this.createTopButtonIcon(
        globals.ExpandMoreIcon,
        () => this.setState({ down: !this.state.down }),
        this.props.uniqueClass + "expand",
        16,
        false,
        this.props.disabled
      );
    }

    var opacity = 1;
    if (this.props.disabled) {
      opacity = opacity * 0.5;
    }

    return (
      <div class="m-3 mt-4" style={{ opacity: opacity }}>
        {this.renderTooltip()}
        <div>
          {this.createTopButtonIcon(
            this.props.iconType,
            this.props.iconCallback,
            this.props.uniqueClass,
            20,
            false,
            this.props.disabled
          )}

          {expandButton}
        </div>

        {this.renderDropDowns()}
      </div>
    );
  }
}
