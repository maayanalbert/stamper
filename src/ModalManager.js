import "./App.scss";
import $ from "jquery"
import React, { Component, useState } from "react";

import parser from "./parser.js";
import LZUTF8 from "lzutf8";

import Modal from "react-bootstrap/Modal";
const { detect } = require("detect-browser");
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
      modalVisible: !ipc && browser && browser.name != "chrome",
      modalHeader: "Use Chrome please!",
      modalContent:
        "Right now, the web version of Stamper is only supported in Google Chrome."
    };
  }

  componentDidMount() {
    ipc &&
      ipc.on("openFiles", (event, files) => {
        console.log(files);
        this.openFiles(
          files.html,
          files.js,
          files.css,
          files.stamper,
          files.path
        );
      });
      var inputElem = document.createElement('input', {id:"projectInput", type:"file", 
        webkitdirectory:"true", multiple:"true"} )

      var idAttr = document.createAttribute("id");
      idAttr.value = "projectInput"; 
      inputElem.setAttributeNode(idAttr)

      var typeAttr = document.createAttribute("type");
      typeAttr.value = "file"; 
      inputElem.setAttributeNode(typeAttr)

      var multipleAttr = document.createAttribute("multiple");
      multipleAttr.value = "true"; 
      inputElem.setAttributeNode(multipleAttr)

      var directoryAttr = document.createAttribute("webkitdirectory");
      directoryAttr.value = "true"; 
      inputElem.setAttributeNode(directoryAttr)

      document.getElementById("root").appendChild(inputElem)

  }

  uploadProject() {
    console.log("uploading project");
    document.getElementById("projectInput").click()

  }

  updateStamperJs(js, stamper) {
    if (stamper === undefined) {
      var oldJs = "";
    } else {
      var oldJs = LZUTF8.decompress(stamper.compressedJs, {
        inputEncoding: "StorageBinaryString"
      });
    }

    if (oldJs === js) {
      return stamper;
    }

    try {
      var newStamper = parser.jsToStamps(js);
    } catch (e) {
      throw "Syntax error in Javascript";
    }

    newStamper.fns.push({
      name: "style.css",
      args: " ",
      code: "",
      isCss: true
    });
    newStamper.fns.push({
      name: "index.html",
      args: " ",
      code: "",
      isHtml: true
    });
    newStamper.console = {};
    newStamper.scale = 1;

    return newStamper;
  }

  openFiles(html, js, css = "", stamper, path) {
    if (html === undefined || js === undefined) {
      this.setState({
        modalVisible: true,
        modalHeader: "Oh no! It looks like you're missing some files.",
        modalContent:
          "Stamper projects must have an 'index.html' file and a 'sketch.js' file."
      });
      return;
    }

    try {
      var newStamper = this.updateStamperJs(js, stamper);
    } catch (e) {
      this.setState({
        modalVisible: true,
        modalHeader:
          "Oh no! It looks like your sketch file has a few syntax errors.",
        modalContent:
          "We can't parse javascript with syntax errors into Stamper land :("
      });
      return;
    }

    newStamper.fns.map(stamp => {
      if (stamp.isHtml) {
        stamp.code = html;
      }
    });
    newStamper.fns.map(stamp => {
      if (stamp.isCss) {
        stamp.code = css;
      }
    });

    this.props.loadStamperFile(newStamper);
    ipc && ipc.send("updatePath", { path: path });
  }

  render() {
    return (
      <div>

        <Modal
          show={this.state.modalVisible}
          style={{ zIndex: 2000000000000000001 }}
          centered
          onHide={() => this.setState({ modalVisible: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title className="name">{this.state.modalHeader}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="picker">{this.state.modalContent} </Modal.Body>
        </Modal>
      </div>
    );
  }
}
