import React, { Component } from "react";
import Cristal from "./react-cristal/dist/es2015/index.js";
import $ from "jquery";
import "ace-builds/webpack-resolver";
import AceEditor from "react-ace";
import pf, { globals, p5Lib } from "./globals.js";

import StampConsole from "./StampConsole.js";

import "./theme-p5.js";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/javascript";
import Overlay from "react-bootstrap/Overlay";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { Resizable, ResizableBox } from "react-resizable";
import Mark from "mark.js";

var mime = require("mime-types");

var userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(" electron/") > -1) {
  const electron = window.require("electron");
  var ipc = electron.ipcRenderer;
} else {
  var ipc = false;
}

export default class FunctionStamp extends Component {
  constructor(props) {
    super(props);
    var starterEditorWidth = this.props.starterEditorWidth;
    if (this.props.isMediaFile) {
      starterEditorWidth = 0;
    }
    var starterArgs = this.props.starterArgs;
    if (
      this.props.isIndex ||
      this.props.isTxtFile ||
      this.props.isMediaFile ||
      this.props.isBlob
    ) {
      starterArgs = " ";
    }

    var starterName = this.props.starterName;
    if (this.props.isBlob) {
      starterName = "";
    }

    var starterIframeWidth = this.props.starterIframeWidth;
    var starterIframeHeight = this.props.starterIframeHeight;
    if (this.props.isTxtFile || this.props.isBlob) {
      starterIframeWidth = 0;
      starterIframeHeight = 0;
    }

    var lineHighLightingStatus = "none";

    this.state = {
      code: this.props.starterCode,
      name: starterName,
      args: starterArgs,
      iframeDisabled: this.props.iframeDisabled,
      iframeWidth: starterIframeWidth,
      iframeHeight: starterIframeHeight,
      editorHeight: this.props.starterEditorHeight,
      editorWidth: starterEditorWidth,
      isSpecialFn: false,
      editorScrolling: false,
      errorLines: this.props.errorLines,
      iframeCode: "",
      editsMade: false,
      runningBorder: false,
      resizingIframe: false,
      x: this.props.initialPosition.x,
      y: this.props.initialPosition.y,
      hidden: this.props.initialHidden,
      looping: true,
      loopingTransition: "",
      zIndex: this.props.starterZIndex,
      exportableCode: "",
      codeSize: this.props.starterCodeSize,
      dataUri: "",
      lineData: [],
      editorTopShadow: false,
      editorBottomShadow: false,
      ghostX: starterIframeWidth,
      ghostY: starterIframeHeight,
      iframeDimensTransition: "",
      mediaAssetHeight: null,
      mediaAssetWidth: null,
      lineHighLightingStatus: this.props.starterLineHighLightingStatus,
      identifierMarkers: [],

      mouseOnStamp: false,

      mouseOnTooltip: false
      // on, off, none
    };

    this.cristalRef = React.createRef();
    this.editorRef = React.createRef();
    this.consoleRef = React.createRef();

    this.updateLooping = this.updateLooping.bind(this);
  }

  toggleHide(callback) {
    window.postMessage({ type: "edited" }, "*");
    if (this.state.hidden) {
      this.setState(
        {
          hidden: false,
          iframeHeight: this.state.iframeHeight,
          zIndex: undefined
        },
        callback
      );
    } else {
      this.setState({ hidden: true }, callback);
    }
  }

  updateLooping(e) {
    if (
      e.data.type != "loop" ||
      e.data.id != this.props.id ||
      this.props.isIndex ||
      this.props.isMediaFile ||
      this.props.isBlob
    ) {
      return;
    }

    if (e.data.message === "start") {
      this.setState({ looping: true, loopingTransition: "" });
    } else if (e.data.message === "stop") {
      this.setState({
        looping: false,
        loopingTransition: "opacity 1s ease-in"
      });
    }
  }

  componentDidMount() {
    // this.loadp5Lib()

    this.checkName();
    this.setDataUri(() => this.props.requestCompile(this.props.id));
    window.addEventListener("message", this.updateLooping);

    var highlightedLines = this.props.getHighlightedLines();
    this.setIdentifierMarkers(highlightedLines);
  }

  componentWillUnmount() {
    window.removeEventListener("message", this.updateLooping);
  }

  setDataUri(callback = () => null) {
    if (this.props.isTxtFile === false) {
      return;
    }
    var mimeType = mime.lookup(this.state.name);

    if (!mimeType || mimeType.split("/").length === 0) {
      callback();
      return;
    }
    var mimeTypeArr = mimeType.split("/");
    mimeTypeArr[0] = "text";
    mimeType = mimeTypeArr.join("/");

    var fileObj = new File([this.state.code], this.state.name, {
      type: mimeType
    });

    var reader = new FileReader();

    reader.onload = function(e) {
      this.setState({ dataUri: e.target.result }, callback);
    };

    reader.onload = reader.onload.bind(this);

    reader.readAsDataURL(fileObj);
  }

  checkName() {
    var isSpecialFn = this.state.name in globals.specialFns;
    this.setState({ isSpecialFn: isSpecialFn });
  }

  addErrorLine(lineNum, message) {
    var errorLines = Object.assign({}, this.state.errorLines);
    errorLines[lineNum] = message;

    this.setState({ errorLines: errorLines }, () =>
      this.props.setLayerPicker()
    );
  }

  setLineData(lineData = []) {
    this.setState({ lineData: lineData });
  }

  clearErrorsAndUpdate() {
    var iframeCode = "";
    var exportableCode = "";
    this.props.setLayerPicker();

    this.setState({ errorLines: {} }, () => {
      if (this.props.isBlob) {
        exportableCode = this.props.getExportableCode();
      } else if (
        this.props.isTxtFile === false &&
        this.props.isMediaFile === false
      ) {
        iframeCode = this.props.getHTML(this.props.id);
      }
      this.props.setLayerPicker();

      if (iframeCode != this.state.iframeCode) {
        window.postMessage(
          {
            type: "debug",
            message: "Updated code",
            id: this.props.id
          },
          "*"
        );
      }
      this.setState({
        iframeCode: iframeCode,
        exportableCode: exportableCode,
        looping: true,
        loopingTransition: ""
      });
    });
  }

  loadp5Lib() {
    this.editorRef.current &&
      this.editorRef.current.editor.completers.push({
        getCompletions: function(editor, session, pos, prefix, callback) {
          var completions = [];
          p5Lib.forEach(function(w) {
            completions.push({
              value: w,
              meta: "p5.js"
            });
          });
          callback(null, completions);
        }
      });
  }

  getIframeDimensionFromGhost(movementX, movementY) {
    var snapMargin = this.props.getSnapMargin();
    var newX = this.state.ghostX + movementX;
    var newY = this.state.ghostY + movementY;
    this.setState({ ghostX: newX, ghostY: newY });
    var snapMargin = this.props.getSnapMargin();

    if (snapMargin === 0) {
      return { movementX: movementX, movementY: movementY };
    } else {
      var roundX = Math.round(newX / snapMargin) * snapMargin;
      var roundY = Math.round(newY / snapMargin) * snapMargin;
      return {
        movementX: roundX - this.state.iframeWidth,
        movementY: roundY - this.state.iframeHeight
      };
    }
  }

  updateIframeDimensions(movementX = 0, movementY = 0, willSnapToGrid = true) {
    if (willSnapToGrid) {
      var newDimensions = this.getIframeDimensionFromGhost(
        movementX,
        movementY
      );
      movementX = newDimensions.movementX;
      movementY = newDimensions.movementY;
    }

    if (movementX === 0 && movementY === 0) {
      return;
    }

    window.postMessage({ type: "edited" }, "*");

    var width = this.state.iframeWidth + movementX;
    var height = this.state.iframeHeight + movementY;
    if (width < 30) {
      movementX = 0;
      width = 30;
    }
    if (height < 30) {
      movementY = 0;
      height = 30;
    }

    this.setState({ iframeWidth: width, iframeHeight: height });

    if (this.props.isMediaFile === false) {
      movementY = 0;
    }

    this.cristalRef.current.manualResize(movementX, movementY);
  }

  setEditorScrolling(isScrolling) {
    if (isScrolling && this.state.editorScrolling == false) {
      this.setState({ editorScrolling: true });
      this.props.disablePan(true);
    } else if (isScrolling === false && this.state.editorScrolling) {
      this.setState({ editorScrolling: false });
      this.props.disablePan(false);
    }
  }

  getErrorTooltip(text, forEditor = true) {
    if (!text) {
      return <span />;
    }
    if (this.props.isBlob || forEditor === false) {
      var top = 48;
    } else {
      var top = globals.fnTitleHeight + 30;
    }
    return (
      <div
        className="rounded-left bg-warningOrange picker p-2"
        style={{
          position: "absolute",
          left: -globals.tooltipWidth,
          width: globals.tooltipWidth,
          top: top,
          cursor: "text",
          userSelect: "text",
          fontSize: 11,
          font: "Inconsolata"
        }}
        hidden={!this.state.mouseOnStamp}
      >
        {text}
      </div>
    );
  }
  renderEditor() {
    var markers = [];
    for (var i in this.state.errorLines) {
      if (i != 0) {
        markers.push({
          startRow: i - 1,
          endRow: i - 1,
          startCol: 0,
          endCol: 1,
          type: "text",
          className: "bg-warningOrange errorMarker"
        });
      }
    }

    var theme = "p5";

    if (this.props.isIndex || this.props.isTxtFile || this.props.isMediaFile) {
      theme = "solarized_light";
    }

    if (this.props.isTxtFile || this.props.isIndex) {
      var mimeType = mime.lookup(this.state.name);
      if (!mimeType || mimeType.split("/").length === 0) {
        var mode = "";
      } else {
        var mimeTypeArr = mimeType.split("/");
        var mode = mimeTypeArr[mimeTypeArr.length - 1];
      }
    } else {
      var mode = "javascript";
    }

    var border = " border-borderGrey";
    if (this.state.editorTopShadow) {
      border += " border-top";
    } else if (this.state.editorBottomShadow) {
      border += " border-bottom";
    }

    var errorTooltipText = "";
    Object.keys(this.state.errorLines).map(line => {
      if (line > 0) {
        errorTooltipText += this.state.errorLines[line] + ` [line ${line}]\n`;
      }
    });

    // var shadow = "";

    // if (this.state.editorBottomShadow && this.state.editorTopShadow) {
    //   shadow =
    //     "inset 0 7px 6px -8px rgba(0, 0, 0, .15), inset 0 -7px 6px -8px rgba(0, 0, 0, .15)";
    // } else if (this.state.editorTopShadow) {
    //   shadow = "inset 0 7px 6px -8px rgba(0, 0, 0, .15)";
    // } else if (this.state.editorBottomShadow) {
    //   shadow = "inset 0 -7px 6px -8px rgba(0, 0, 0, .15)";
    // }

    return (
      <div
        onMouseOut={() => {
          this.setEditorScrolling(false);
        }}
      >
        {this.getErrorTooltip(errorTooltipText)}
        <div>
          <br hidden={this.props.isBlob} />
          <AceEditor
            markers={markers.concat(this.state.identifierMarkers)}
            style={{
              width: this.state.editorWidth,
              height: this.state.editorHeight,
              background: "transparent",
              boxShadow: ""
            }}
            className={border}
            mode={mode}
            theme={theme}
            onChange={(value, editor) => {
              this.setState({ code: value });
              this.onEditsMade();
            }}
            name={"name" + this.props.id.toString()}
            onLoad={editor => {
              this.setEditorShadow(editor.renderer.scrollBar);
              editor.on("change", (arg, editor) => {
                this.setEditorShadow(editor.renderer.scrollBar);
              });
            }}
            fontSize={this.state.codeSize}
            showPrintMargin={false}
            wrapEnabled={true}
            showGutter={false}
            highlightActiveLine={false}
            value={this.state.code}
            ref={this.editorRef}
            onScroll={editor => {
              this.setEditorScrolling(true);
              this.setEditorShadow(editor.renderer.scrollBar);
            }}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: false,
              tabSize: 2,
              hasCssTransforms: true,
              fontFamily: "Inconsolata"
            }}
          />
        </div>
      </div>
    );
  }

  setEditorShadow(scrollBar) {
    var editorTopShadow = false;
    var editorBottomShadow = false;

    if (scrollBar.scrollTop - 5 > 0) {
      editorTopShadow = true;
    }

    if (
      scrollBar.scrollTop + this.state.editorHeight + 5 <
      scrollBar.scrollHeight
    ) {
      editorBottomShadow = true;
    }

    this.setState({
      editorTopShadow: editorTopShadow,
      editorBottomShadow: editorBottomShadow
    });
  }

  stripExtension(name) {
    var nameArr = name.split(".");

    if (nameArr.length < 2) {
      return name;
    } else {
      nameArr.pop();
      return nameArr.join(".");
    }
  }

  getExtension(name) {
    var nameArr = name.split(".");
    if (nameArr.length < 2) {
      return "";
    } else {
      var ext = nameArr.pop();
      return ext;
    }
  }

  addExtension(name, nameWithExtension) {
    var nameArr = nameWithExtension.split(".");
    if (nameArr.length < 2) {
      return name;
    } else {
      var ext = nameArr.pop();
      return name + "." + ext;
    }
  }

  compileCallback() {
    if (this.state.editsMade) {
      var compileActions = () => {
        this.props.requestCompile(this.props.id);
        window.postMessage({ type: "edited" }, "*");
        this.setState({ editsMade: false, runningBorder: true }, () =>
          setTimeout(() => {
            this.setState({ runningBorder: false });
          }, 300)
        );
      };

      if (this.props.isTxtFile) {
        this.setDataUri(compileActions);
      } else {
        compileActions();
      }
    }
  }

  onEditsMade() {
    this.setState({ editsMade: true });
    window.postMessage({ type: "edited" }, "*");
  }

  renderFunctionName() {
    var displayName = "";
    if (this.state.name != this.props.starterName) {
      var displayName = this.state.Name;
    }

    var nameColor = "blue";
    if (this.state.name in globals.builtIns) {
      nameColor = "pink";
    } else if (this.state.name in globals.listeners) {
      nameColor = "pink";
    } else if (
      this.props.isIndex ||
      this.props.isTxtFile ||
      this.props.isMediaFile
    ) {
      nameColor = "htmlCssName";
    }

    var argsColor = "greyText";
    var namePlaceholder = "function name...";
    if (this.props.isTxtFile) {
      namePlaceholder = "file name...";
    } else if (this.props.isMediaFile) {
      namePlaceholder = "";
    }

    var displayName = this.state.name;
    if (this.props.isMediaFile) {
      displayName = this.stripExtension(displayName);
    }

    var nameBackground = "bg-transparent";
    var argsBackground = "bg-transparent";

    if (0 in this.state.errorLines) {
      argsBackground = "bg-warningOrange";
    }

    if (-1 in this.state.errorLines) {
      nameBackground = "bg-warningOrange";
    }

    // this.state.identifierMarkers.map(mark => {
    //   if (mark.startRow === -1) {
    //     if (mark.startCol - "function ".length < this.state.name.length) {
    //       // nameBackground = mark.className.split(" ")[0];
    //     } else {
    //       argsBackground = mark.className.split(" ")[0];
    //     }
    //   }
    // });

    return (
      <div>
        {this.getErrorTooltip(this.state.errorLines[-1], false)}
        {this.getErrorTooltip(this.state.errorLines[0], false)}
        <p
          hidden={!this.props.isMediaFile}
          className={"text-lightGreyText name"}
          style={{ position: "absolute", top: 49, left: 19 }}
        >
          {this.state.name}
        </p>
        <input
          placeholder={namePlaceholder}
          disabled={this.props.isIndex}
          onChange={event => {
            var newName = event.target.value;

            if (this.props.isMediaFile) {
              newName = this.addExtension(newName, this.state.name);
            }
            this.setState({ name: newName });
            this.onEditsMade();
          }}
          style={{ background: "transparent" }}
          value={displayName}
          class={"text-" + nameColor + " name " + nameBackground}
        />

        <br />

        <input
          // @cameron styling for arguments field
          placeholder="arguments..."
          disabled={
            this.props.isIndex || this.props.isTxtFile || this.props.isMediaFile
          }
          onChange={event => {
            this.setState({ args: event.target.value });
            this.onEditsMade();
          }}
          style={{ background: "transparent" }}
          value={this.state.args}
          class={"text-" + argsColor + " args " + argsBackground}
        />
      </div>
    );
  }

  renderMediaAsset() {
    if (!this.props.isMediaFile) {
      return null;
    }

    var mimeType = mime.lookup(this.state.name);
    if (!mimeType) {
      return;
    }
    if (mimeType.startsWith("image")) {
      if (!this.state.imageWidth) {
        var img = new Image();

        img.onload = function() {
          this.setState({ imageWidth: img.width, imageHeight: img.height });
        };

        img.onload = img.onload.bind(this);

        img.src = this.state.code;
      }

      return <img src={this.state.code} />;
    } else if (mimeType.startsWith("audio")) {
      return (
        <audio controls>
          <source src={this.state.code} type={mimeType} />
        </audio>
      );
    } else if (mimeType.startsWith("video")) {
      return (
        <video controls>
          <source src={this.state.code} type={mimeType} />
        </video>
      );
    } else {
      return (
        <div
          className={"bg-borderGrey pt-5 d-flex justify-content-center"}
          style={{
            width: this.state.iframeWidth,
            height: this.state.iframeHeight
          }}
        >
          {React.createElement("img", {
            style: { width: 100, height: 100, opacity: 0.5 },
            src: globals.ImageStampIcon
          })}
        </div>
      );
    }
  }

  manualIframeResize(width, height) {
    // this.setState({iframeWidth:dimens.width, iframeHeight:dimens.height, resizingIframe:true}, setTimeout(() =>
    //       this.setState({resizingIframe:false}), 250))

    setTimeout(() => {
      this.setState({ iframeDimensTransition: "" });
    }, 1200);

    setTimeout(() => {
      this.setState({
        resizingIframe: false,
        iframeDimensTransition: "opacity 1s ease-out"
      });
    }, 200);

    this.setState({ resizingIframe: true });
    this.updateIframeDimensions(
      width - this.state.iframeWidth,
      height - this.state.iframeHeight,
      false
    );
  }

  renderIframe() {
    var loopingOpacity = 0.0;
    if (this.state.looping === false) {
      loopingOpacity = 0.5;
    }

    if (this.state.resizingIframe) {
      var iframeDimensOpacity = 0.5;
    } else {
      var iframeDimensOpacity = 0;
    }

    return (
      <div>
        <div
          style={{
            position: "absolute",
            fontSize: globals.codeSize,
            opacity: iframeDimensOpacity,
            top: globals.fnTitleHeight - 5,
            right: 25,
            transition: this.state.iframeDimensTransition
          }}
          class="text-greyText "
        >
          {"W:" +
            Math.floor(this.state.iframeWidth) +
            " H:" +
            Math.floor(this.state.iframeHeight)}
        </div>
        <div
          style={{
            transition: this.state.loopingTransition,
            position: "absolute",
            fontSize: globals.codeSize,
            opacity: loopingOpacity,
            top: globals.fnTitleHeight - 5,
            left: 25 + this.state.editorWidth
          }}
          class="text-greyText "
        >
          {"paused"}
        </div>

        <Resizable
          className="ml-1 bg-white shadow"
          onResize={e => {
            this.updateIframeDimensions(
              e.movementX / this.props.getScale(),
              e.movementY / this.props.getScale()
            );
          }}
          onResizeStart={() => {
            this.props.onStartMove();
            this.setState({ resizingIframe: true });
            this.setState({
              ghostX: this.state.iframeWidth,
              ghostY: this.state.iframeHeight
            });
          }}
          onResizeStop={e => {
            this.setState({
              ghostX: this.state.iframeWidth,
              ghostY: this.state.iframeHeight
            });
            this.props.onStopMove();
            this.setState({ resizingIframe: false });
            var newSize = this.props.getCristalDimens(this.getData());
            this.cristalRef.current.manualSetSize(
              newSize.width,
              newSize.height
            );
          }}
          onMouseOver={this.compileCallback.bind(this)}
          style={{
            overflow: "hidden",
            zIndex: 5,
            border: "none"
          }}
          handle={
            <span
              className="react-resizable-handle react-resizable-handle-se"
              onDoubleClick={() => {
                if (this.state.imageWidth) {
                  this.manualIframeResize(
                    this.state.imageWidth,
                    this.state.imageHeight
                  );
                } else {
                  var dimens = this.props.getP5CanvasDimensions();
                  this.manualIframeResize(dimens.width, dimens.height);
                }
              }}
            />
          }
        >
          <div>
            <div
              style={{
                position: "absolute",
                width: this.state.iframeWidth,
                height: this.state.iframeHeight,
                background: "transparent"
              }}
              hidden={!this.state.iframeDisabled}
            >
              {" "}
            </div>
            <div
              style={{
                height: this.state.iframeHeight,
                width: this.state.iframeWidth,
                zIndex: -1
              }}
            >
              {this.renderMediaAsset()}

              <iframe
                ref={iframeElem => {
                  iframeElem &&
                    this.consoleRef &&
                    this.consoleRef.current.addNewIframeConsole(
                      iframeElem.contentWindow.console
                    );
                }}
                hidden={this.props.isMediaFile}
                id={"iframe" + this.props.id}
                scrolling="no"
                style={{
                  border: "none",

                  height: this.state.iframeHeight,
                  width: this.state.iframeWidth
                  // pointerEvents:"none"
                }}
                srcdoc={this.state.iframeCode}
                sandbox="allow-forms allow-modals allow-pointer-lock allow-popups  allow-same-origin allow-scripts"
                allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media"
              />
            </div>
          </div>
        </Resizable>
      </div>
    );
  }

  setIframeDisabled(status) {
    this.setState({ iframeDisabled: status });
  }

  getCopyStampName(name, isFile) {
    if (!isFile) {
      return name + "Copy";
    } else {
      var nameArr = name.split(".");
      if (nameArr.length === 0) {
        return "";
      }
      nameArr[0] = nameArr[0] + "Copy";
      return nameArr.join(".");
    }
  }

  copyAndOpt(isOpt = false) {
    window.postMessage({ type: "edited" }, "*");
    if (this.props.isIndex) {
      return;
    }

    var data = this.getData();
    data.zIndex = undefined;

    var newName = this.getCopyStampName(
      this.state.name,
      this.props.isTxtFile || this.props.isMediaFile
    );

    if (!this.props.isBlob) {
      if (isOpt) {
        this.setState({ name: newName }, () => this.checkName());
      } else {
        data.name = newName;
      }
    }

    if (isOpt) {
      data.iframeDisabled = true;
    } else {
      data.x += globals.copyOffset;
      data.y += globals.copyOffset;
    }

    var callback = id => this.props.requestCompile(id);
    if (isOpt) {
      callback = id => {
        this.props.requestCompile(id);
        this.cristalRef.current.changeZIndex();
      };
    }
    delete data.id;
    var newName = this.props.addStamp(data, callback);
  }

  getData() {
    var name = this.state.name;
    if (this.props.isBlob) {
      name = this.props.getFirstLine(this.state.code);
    }

    var data = {
      id: this.props.id,
      name: name,
      code: this.state.code,
      args: this.state.args,
      x: this.state.x,
      y: this.state.y,
      editorWidth: this.state.editorWidth,
      editorHeight: this.state.editorHeight,
      iframeWidth: this.state.iframeWidth,
      iframeHeight: this.state.iframeHeight,
      isIndex: this.props.isIndex,
      isTxtFile: this.props.isTxtFile,
      isMediaFile: this.props.isMediaFile,
      hidden: this.state.hidden,
      exported: true,
      zIndex: this.state.zIndex,
      isBlob: this.props.isBlob,
      codeSize: this.state.codeSize,
      icon: this.getIcon(),
      lineHighLightingStatus: this.state.lineHighLightingStatus
    };

    return data;
  }

  resizeEditor(widthDiff, heightDiff, x, change = true) {
    var height = this.state.editorHeight + heightDiff;
    var width = this.state.editorWidth + widthDiff;

    if (height < 0 || width < 0) {
      return true;
    }

    if (change) {
      this.setState({
        editorHeight: height,
        editorWidth: width,
        x: x
      });
      this.editorRef.current.editor.resize();
    }

    this.editorRef.current.editor.resize();
  }

  getIcon() {
    var icon = globals.FunctionStampIcon;
    if (this.props.isIndex) {
      icon = globals.HtmlStampIcon;
    } else if (this.props.isBlob) {
      icon = globals.BlobStampIcon;
    } else if (this.props.isTxtFile) {
      icon = globals.FileStampIcon;
    } else if (this.props.isMediaFile) {
      icon = globals.ImageStampIcon;
    } else if (this.state.isSpecialFn) {
      if (globals.specialFns[this.state.name]) {
        icon = globals.BuiltInStampIcon;
      } else {
        icon = globals.ListenerStampIcon;
      }
    }

    return icon;
  }

  getTextPositions(text) {
    if (this.state.isIndex || this.state.isTxtFile || this.state.isMediaFile) {
      if (text === this.state.title) {
        return [{ startRow: -1, endRow: -1, startCol: 0, endCol: text.length }];
      }
    }
    var letters = /^[a-zA-Z]+$/;
    var lettersNumbers = /^[0-9a-zA-Z]+$/;
    var positions = [];
    var curCol = 0;
    var curRow = 0;
    var code = this.state.code;
    if (!this.state.isBlob) {
      curRow = -1;
      code = `function ${this.state.name}(${this.state.args}){\n${this.state.code}\n}`;
    }

    for (var i = 0; i < code.length; i++) {
      if (
        code.length >= i + text.length &&
        code.substr(i, text.length) === text &&
        (i - 1 < 0 || !code[i - 1].match(letters)) &&
        (i + text.length >= code.length ||
          !code[i + text.length].match(lettersNumbers))
      ) {
        positions.push({
          startRow: curRow,
          endRow: curRow,
          startCol: curCol,
          endCol: curCol + text.length
        });
      }

      if (code[i] === "\n") {
        curRow += 1;
        curCol = 0;
      } else {
        curCol += 1;
      }
    }

    return positions;
  }

  setIdentifierMarkers(highlightedLines) {
    var identifierMarkers = [];
    if (this.state.lineHighLightingStatus === "on") {
      var identifierData = [];
      Object.values(highlightedLines).map(line => {
        if (line.start === this.props.id || line.end === this.props.id) {
          var identifiers = line.labelText
            .split(", ")
            .join("()")
            .split("()")
            .filter(text => text != "");

          identifiers.map(identifier =>
            identifierData.push({ identifier: identifier, type: line.type })
          );
        }
      });
      var identifierMarkers = [];
      identifierData.map(data => {
        var textPositions = this.getTextPositions(data.identifier);
        textPositions.map(pos => {
          var marker = Object.assign({}, pos);

          marker.className =
            "bg-" + this.getLineClassColor(data.type) + " referenceMarker";
          marker.type = "text";
          identifierMarkers.push(marker);
        });
      });
    }
    this.setState({ identifierMarkers: identifierMarkers });
  }

  getLineClassColor(type) {
    var color = "";
    if (type === "file") {
      color = "fileLine";
    } else if (type === "js") {
      color = "jsLine";
    } else if (type === "listener") {
      color = "listenerLine";
    } else {
      color = "systemLine";
    }
    return `${color}`;
  }

  setLineHighlighted(lineHighLightingStatus, highlightedLines) {
    this.setState(
      {
        lineHighLightingStatus: lineHighLightingStatus
      },
      () => {
        this.setIdentifierMarkers(highlightedLines);
      }
    );
  }

  renderConsole() {
    return (
      <div
        className=""
        style={{
          zIndex: 2,
          position: "absolute",
          top: globals.fnTitleHeight + 38,
          left: 30 + this.state.editorWidth,
          width: this.state.iframeWidth - 15,
          height: this.state.editorHeight
        }}
      >
        <StampConsole
          ref={this.consoleRef}
          parentId={this.props.id}
          addErrorLine={this.addErrorLine.bind(this)}
          setEditorScrolling={this.setEditorScrolling.bind(this)}
          invisible={
            this.props.isBlob || this.props.isMediaFile || this.props.isTxtFile
          }
        />
      </div>
    );
  }

  render() {
    var headerColor = "bg-white";

    var border = "border border-borderGrey";

    if (Object.keys(this.state.errorLines).length > 0) {
      border = "border border-warningOrange";
    }
    if (this.state.runningBorder) {
      border = "border border-blue";
    }

    // <!-- @cameron little white div thing --> scroll down to style

    var bgColor = "bg-jsArea";
    if (this.props.isIndex || this.props.isTxtFile || this.props.isMediaFile) {
      bgColor = "bg-htmlCssArea";
    }

    if (this.state.hidden) {
      return <div></div>;
    }

    var iframeWidth = this.state.iframeWidth;
    if (this.props.isTxtFile) {
      iframeWidth = 0;
    }

    var initialHeight = this.state.editorHeight + globals.fnTitleHeight + 60;
    if (this.props.isMediaFile) {
      initialHeight = this.state.iframeHeight + globals.fnTitleHeight + 35;
    } else if (this.props.isBlob) {
      initialHeight = this.state.editorHeight + 60;
    }

    var cristalOpacity = 1;
    var shadowSize = "shadow-sm";
    if (this.state.lineHighLightingStatus === "off") {
      cristalOpacity = 0.5;
    }

    if (this.state.lineHighLightingStatus === "on") {
      shadowSize = "shadow-lg";
    }

    return (
      <div style={{ opacity: cristalOpacity }}>
        <Cristal
          opacity={cristalOpacity}
          zIndex={this.state.zIndex}
          onZChange={s => {
            this.setState({ zIndex: s.zIndex });
          }}
          getScale={this.props.getScale}
          getSnapMargin={this.props.getSnapMargin}
          initialSize={this.props.getCristalDimens(this.getData())}
          ref={this.cristalRef}
          isResizable={!this.props.isMediaFile}
          onStartResize={() => {
            this.props.onStartMove();
            this.setEditorShadow(
              this.editorRef.current.editor.renderer.scrollBar
            );
          }}
          onStopResize={() => {
            this.props.onStopMove();
            this.setEditorShadow(
              this.editorRef.current.editor.renderer.scrollBar
            );
          }}
          onShiftClick={() =>
            this.props.getLinesOn() &&
            this.props.setDependencyLineHighlightings(this.props.id)
          }
          onMouseOver={() => this.setState({ mouseOnStamp: true })}
          onMouseOut={() => this.setState({ mouseOnStamp: false })}
          onStartMove={this.props.onStartMove}
          onStopMove={this.props.onStopMove}
          onClose={() => this.props.onDelete(this.props.id)}
          onCopy={() => this.copyAndOpt()}
          onOptMove={() => this.copyAndOpt(true)}
          closeHidden={this.props.isIndex}
          copyHidden={this.props.isIndex}
          getLinesOn={this.props.getLinesOn}
          initialPosition={{ x: this.state.x, y: this.state.y }}
          lineData={this.state.lineData}
          className={
            "stamp " +
            shadowSize +
            " " +
            bgColor +
            " " +
            border +
            " vertex" +
            this.props.id
          }
          onResize={this.resizeEditor.bind(this)}
          onMove={s => this.setState({ x: s.x, y: s.y })}
          icon={this.getIcon()}
          parentId={this.props.id}
          showCodeSize={this.props.isBlob}
          onConsole={() =>
            this.consoleRef.current && this.consoleRef.current.clearConsole()
          }
          showConsole={
            !this.props.isBlob &&
            !this.props.isMediaFile &&
            !this.props.isTxtFile
          }
          onCodeSize={() => {
            window.postMessage({ type: "edited" }, "*");
            if (this.state.codeSize === globals.codeSize) {
              this.setState({ codeSize: globals.bigCodeSize });
            } else {
              this.setState({ codeSize: globals.codeSize });
            }
          }}
        >
          <div onMouseLeave={this.compileCallback.bind(this)}>
            <div
              class={headerColor}
              hidden={this.props.isBlob}
              style={{
                position: "absolute",
                top: globals.headerHeight,
                left: 0,
                width: "100%",
                height: globals.fnTitleHeight,
                color: "transparent"
              }}
            >
              {" "}
            </div>

            <div class="p-2">
              <div hidden={this.props.isBlob}>{this.renderFunctionName()}</div>

              <div class="row m-0 mt-2" style={{ flexWrap: "nowrap" }}>
                {this.renderEditor()}
                {this.renderConsole()}
                {this.renderIframe()}
              </div>
            </div>
          </div>
        </Cristal>
      </div>
    );
  }
}
