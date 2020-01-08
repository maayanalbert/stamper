import './App.scss';

import React, {Component} from "react";

import View from "./View.js"
import Modal from 'react-bootstrap/Modal'
import BrowserDetection from 'react-browser-detection';

var userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(" electron/") > -1) {
  const electron = window.require("electron");
  var ipc = electron.ipcRenderer;
} else {
  var ipc = false;
}


function App() {
const [show, setShow] = useState(!ipc);
const handleClose = () => setShow(false);
const browserModal = {
  chrome: () => null,
  default: () => 
      <Modal show={true} style={{zIndex:2000000000000000001}} centered onclose={handleClose}>
        <Modal.Header closeButton>
     <Modal.Title  className="name">Woohoo, you're reading this text in a modal!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="picker">Woohoo, you're reading this text in a modal!</Modal.Body>
      </Modal>,
};

  return (
    <div>
      <BrowserDetection>
        { browserModal }
      </BrowserDetection>

    	<View />
    </div>
  );

}

export default App;