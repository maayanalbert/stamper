import "./App.scss";

import React, { Component, useState } from "react";

import View from "./View.js";
import Modal from "react-bootstrap/Modal";
const { detect } = require('detect-browser');
const browser = detect();

var userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(" electron/") > -1) {
  const electron = window.require("electron");
  var ipc = electron.ipcRenderer;
} else {
  var ipc = false;
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { modalVisible: !ipc && browser && browser.name != "chrome" };
  }

  getModalVisible(){
  	console.log(this.state.modalVisible)
  	return this.state.modalVisible
  }




  render() {
    return (
      <div>
        <Modal
          show={this.state.modalVisible}
          style={{ zIndex: 2000000000000000001 }}
          centered
          onHide={() => this.setState({ modalVisible: false }) }
        >
          <Modal.Header closeButton>
            <Modal.Title className="name">Use Chrome please!</Modal.Title>
          </Modal.Header>
          <Modal.Body className="picker">
            Right now, Stamper is only supported in Google Chrome.{" "}
          </Modal.Body>
        </Modal>
        <View />
      </div>
    );
  }
}
