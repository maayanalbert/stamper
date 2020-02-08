import "./App.scss";
import $ from "jquery";
import React, { Component, useState } from "react";
import { saveAs } from "file-saver";
import parser from "./parser.js";
import LZUTF8 from "lzutf8";
import JSZip from "jszip";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

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

import pf1, {
  normalFn,
  commentBlob,
  varBlob,
  listenerFns,
  builtInFns,
  worlds,
  starter,
  empty,
  stamperHeader
} from "./starterStamps.js";
var GitHub = require("github-api");
const { detect } = require("detect-browser");
var deepEqual = require("deep-equal");
const browser = detect();

var userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(" electron/") > -1) {
  const electron = window.require("electron");
  var ipc = electron.ipcRenderer;
} else {
  var ipc = false;
}

export default class ModalManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publishVisible: true,
      publishModalName: this.props.publishModalName,
      publishModalAuthor: this.props.publishModalAuthor,
      publishNameAuthorExists: false,
      publishModalMode: "unsubmitted"
      // can be unsubmitted, success, failure, loading
    };
  }

  componentDidMount() {
    this.setState({
      publishNameAuthorExists: this.props.checkPublishWorldName(
        this.state.publishModalName,
        this.state.publishModalAuthor
      )
    });
  }

  componentWillUnmout() {}

  render() {
    return (
      <Modal
        show={this.state.publishVisible}
        style={{ zIndex: 2000000000000000001 }}
        centered
        onHide={this.props.hidePublishModal}
      >
        <Modal.Header closeButton>
          <Modal.Title className="name">{"Publish current sketch"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="picker ">
            {
              "This will add your sketch to the examples list and give you a link to share it with."
            }
            <div class="row picker p-2">
              <input
                placeholder="name"
                class=" m-1 form-control form-control-sm"
                style={{ width: 150 }}
                value={this.state.publishModalName}
                onChange={e => {
                  this.setState(
                    {
                      publishModalName: e.target.value
                        .split("_")
                        .join(" ")
                        .split("~")
                        .join(" "),

                      publishModalMode: "unsubmitted"
                    },
                    () =>
                      this.setState({
                        publishNameAuthorExists: this.props.checkPublishWorldName(
                          this.state.publishModalName,
                          this.state.publishModalAuthor
                        )
                      })
                  );
                }}
              />
              <div class=" picker m-2">{"by"}</div>
              <input
                placeholder="author (you)"
                class=" m-1 form-control form-control-sm"
                style={{ width: 150 }}
                value={this.state.publishModalAuthor}
                onChange={e => {
                  this.setState(
                    {
                      publishModalAuthor: e.target.value
                        .split("_")
                        .join(" ")
                        .split("~")
                        .join(" "),
                      publishModalMode: "unsubmitted"
                    },
                    () =>
                      this.setState({
                        publishNameAuthorExists: this.props.checkPublishWorldName(
                          this.state.publishModalName,
                          this.state.publishModalAuthor
                        )
                      })
                  );
                }}
              />
            </div>
            <div class="mt-2">
              <div
                hidden={this.state.publishModalMode != "loading"}
                class="picker text-greyText"
                style={{ fontStyle: "italic" }}
              >
                {"loading..."}
              </div>
              <div
                hidden={this.state.publishModalMode != "failure"}
                class="picker text-warningOrangeDark"
              >
                {
                  "Oh no! There was an error publishing your sketch. If you recently published a sketch with the same name and author, we may still be processing it. Please try again in another minute or so."
                }
              </div>
              <div
                hidden={
                  !this.state.publishNameAuthorExists ||
                  this.state.publishModalMode !== "unsubmitted"
                }
                class="picker text-warningOrangeDark"
              >
                {
                  "An example with this name and author already exists. If you publish, you'll overwrite that example (please don't do this if this isn't your example to overwrite)."
                }
              </div>
              <div hidden={this.state.publishModalMode != "success"}>
                <div class="picker text-primary">
                  Congrats! Your sketch was successfully published (it will take
                  several minutes for it to show up in the examples list).
                  Access it at:
                </div>
                {this.props.renderLinkForm()}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant={"outline-secondary"}
            size="sm"
            onClick={this.props.hidePublishModal}
          >
            {this.state.publishModalMode === "unsubmitted" ? "cancel" : "done"}
          </Button>
          <Button
            disabled={
              !this.state.publishModalName ||
              !this.state.publishModalAuthor ||
              this.state.publishModalLoading
            }
            variant={"outline-primary"}
            size="sm"
            onClick={() => {
              this.setState({ publishModalMode: "loading" });
              this.props.publishWorld(
                this.state.publishModalName,
                this.state.publishModalAuthor,
                error => {
                  if (error) {
                    this.setState({ publishModalMode: "failure" });
                  } else {
                    this.setState({ publishModalMode: "success" });
                  }
                }
              );
            }}
          >
            {"publish"}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
