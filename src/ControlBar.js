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

import GradientIcon from "@material-ui/icons/Gradient";
import CategoryIcon from "@material-ui/icons/Category";
import HearingIcon from "@material-ui/icons/Hearing";
import CodeIcon from "@material-ui/icons/Code";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/javascript";

import pf1, {
  normalFn,
  commentBlob,
  varBlob,
  listenerFns,
  builtInFns
} from "./starterStamps.js";

var _ = require("lodash");

var esprima = require("esprima");

const defaultSetup = require("./defaultSetup.js");

export default class ControlBar extends Component {
  constructor(props) {
    super(props);
    this.editorRef = React.createRef();
    this.minPickerHeight = 30;
    this.minJsImporterHeight = 30;
    this.topBarHeight = 60;
    this.minWidth = 150;
    this.maxWidth = window.innerWidth - 30;
    this.editorRef = React.createRef();
    this.importButtonHeight = 50;
    this.newStampMargin = 20;
    this.newStampMarginVariance = 100;
    this.state = {
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

  componentDidMount() {}

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
            if (newWidth > this.minWidth && newWidth < this.maxWidth) {
              this.setState({ sideBarWidth: newWidth }, () =>
                this.editorRef.current.editor.resize()
              );
            }
          }}
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

  setInitialPosition(data) {
    data.x =
      this.state.sideBarWidth +
      this.newStampMargin +
      Math.random() * this.newStampMarginVariance;
    data.y =
      this.topBarHeight +
      this.newStampMargin +
      Math.random() * this.newStampMarginVariance;
    return data;
  }

  parseCode() {
    try {
      var stamps = parser.jsToStamps(this.state.code);
      stamps.fns.map(data => {
        this.props.addFnStamp(this.setInitialPosition(data));
      });
      stamps.blobs.map(data => {
        this.props.addBlobStamp(this.setInitialPosition(data));
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
            background: "transparent"
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
    var text = "Import Javascript";
    var color = "grey";
    if (this.state.codeHasError) {
      text = "Syntax Error";
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
            fontSize: globals.codeSize
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
      } else {
        var iconType = VisibilityOffIcon;
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
              <div clas="row border-bottom" style={{ overflow: "hidden" }}>
                {this.createIcon(
                  "type" + item.id.toString(),
                  item.icon,
                  18,
                  null,
                  0.3
                )}
                <b
                  class="text-greyText picker ml-1"
                  onClick={() =>
                    centerCallback(this.state.sideBarWidth, this.topBarHeight)
                  }
                >
                  {item.name}
                </b>
              </div>

              {this.createIcon(
                "hide" + item.id.toString(),
                iconType,
                18,
                item.hideCallback,
                0.6
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
              { pickerHeight: this.state.pickerHeight + e.movementY },
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
          </div>
        </div>
      </Resizable>
    );
  }

  createIcon(
    uniqueClass,
    iconType,
    size = 15,
    hideCallback = null,
    opacity = 0.3
  ) {
    var mouseOverCallback = () => {
      $("." + uniqueClass).css({ opacity: "1" });
    };

    var mouseOutCallback = () => {
      $("." + uniqueClass).css({ opacity: opacity });
    };
    if (!hideCallback) {
      mouseOverCallback = () => {};
      mouseOutCallback = () => {};
    }

    return React.createElement(iconType, {
      style: { opacity: opacity, height: size, width: size },
      className: " m-1 text-greyText " + uniqueClass,
      onClick: hideCallback,
      onMouseOver: mouseOverCallback,
      onMouseOut: mouseOutCallback
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
          iconType={GradientIcon}
          uniqueClass="basic"
          iconCallback={() =>
            this.props.addFnStamp(this.setInitialPosition(normalFn))
          }
        />

        <div class="row">
          <TopButton
            iconType={GradientIcon}
            uniqueClass="basic"
            iconCallback={() =>
              this.props.addFnStamp(this.setInitialPosition(normalFn))
            }
          />

          <TopButton
            iconType={CategoryIcon}
            uniqueClass="builtIn"
            iconCallback={null}
            dropDownData={builtInFns.map(data => ({
              name: data.name,
              callback: () =>
                this.props.addFnStamp(this.setInitialPosition(data))
            }))}
          />

          <TopButton
            iconType={HearingIcon}
            uniqueClass="listenerFns"
            iconCallback={null}
            dropDownData={listenerFns.map(data => ({
              name: data.name,
              callback: () =>
                this.props.addFnStamp(this.setInitialPosition(data))
            }))}
          />

          <TopButton
            iconType={CodeIcon}
            uniqueClass="anything"
            iconCallback={() =>
                this.props.addFnStamp(this.setInitialPosition(varBlob))}
            dropDownData={[
              {name: "variable",
              callback: () =>
                this.props.addFnStamp(this.setInitialPosition(varBlob))},
            {name: "comment",
              callback: () =>
                this.props.addFnStamp(this.setInitialPosition(commentBlob))}
              ]}
          />

        </div>

        <TopButton
          iconType={GradientIcon}
          uniqueClass="basic"
          iconCallback={() =>
            this.props.addFnStamp(this.setInitialPosition(normalFn))
          }
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
    if (this.state.mouseOverDropDown == false) {
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
    var uniqueClass = givenUniqueClass
    var mouseOverCallback = () => {
      $("." + uniqueClass).css({ opacity: "1" });
    };

    var mouseOutCallback = () => {
      $("." + uniqueClass).css({ opacity: ".6" });
    };
    if (!callback) {
      callback = () => this.setState({ down: !this.state.down });
      uniqueClass += "expand"
    }

    return React.createElement(iconType, {
      style: { opacity: ".6", height: size, width: size },
      className: " text-greyText " + uniqueClass,
      onClick: callback,
      onMouseOver: mouseOverCallback,
      onMouseOut: mouseOutCallback
    });
  }

  renderDropDowns() {
    if (this.state.down === false) {
      return null;
    }

    var dropDowns = this.props.dropDownData.map(data => (
      <div
        class={this.props.uniqueClass + data.name + " picker text-greyText p-2"}
        onMouseOver={() => {
          this.setState({ mouseOverDropDown: true });
          $("." + this.props.uniqueClass + data.name).css({
            background: "rgb(240, 240, 240)"
          });
        }}
        onMouseOut={() => {
          this.setState({ mouseOverDropDown: false });
          $("." + this.props.uniqueClass + data.name).css({
            background: "transparent"
          });
        }}
        onClick={() => {
          data.callback();
          this.setState({ down: false });
        }}
      >
        {data.name}
      </div>
    ));
    return (
      <div
        class="bg-white border border-borderGrey rounded"
        style={{ position: "absolute" }}
      >
        {dropDowns}
      </div>
    );
  }

  render() {
    var expandButton = null;
    if (this.props.dropDownData) {
      expandButton = this.createIcon(
        ExpandMoreIcon,
        () => this.setState({ down: !this.state.down }),
        this.props.uniqueClass + "expand",
        20
      );
    }

    return (
      <div class="p-3">
        {this.createIcon(
          this.props.iconType,
          this.props.iconCallback,
          this.props.uniqueClass,
          25
        )}
        <a
          onMouseOver={() => this.setState({ mouseOverDropDown: true })}
          onMouseOut={() => this.setState({ mouseOverDropDown: false })}
        >
          {expandButton}
        </a>
        {this.renderDropDowns()}
      </div>
    );
  }
}
