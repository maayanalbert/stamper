const {
  app,
  shell,
  BrowserWindow,
  Menu,
  protocol,
  ipcMain,
  electron,
  dialog
} = require("electron");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

const path = require("path");
const isDev = require("electron-is-dev");

const FileManager = require("./FileManager.js");
const defaultMenu = require("electron-default-menu");

let fileManagerDict = {};
let windowDict = {};

let fileManager;

let worldNames = ["starter", "empty", "particles"];
let manualCloseDict = {};
let focusedWindow = null;
let worldButtons = [];

function pathIsAlreadyOpened(path) {
  console.log("PATH IS ALREAYD OPENED");
  console.log(path);
  for (var i = 0; i < Object.keys(fileManagerDict).length; i++) {
    var id = Object.keys(fileManagerDict)[i].toString();

    console.log("WFT IS HAPPENING", id, fileManagerDict[id].path, path);

    if (
      fileManagerDict[id] &&
      fileManagerDict[id].path === path &&
      path != undefined
    ) {
      windowDict[id] && windowDict[id].focus();
      return true;
    }
  }
  return false;
}

function createWindow(callback = () => null) {
  var identicalPath = false;

  autoUpdater.checkForUpdates();

  window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      "web-security": false,
      icon: __dirname + "./icons/map/icon.icns"
    },
    show: false,
    minHeight: 300,
    minWidth: 450
  });
  var fileManager = new FileManager(window, createWindow, pathIsAlreadyOpened);

  fileManagerDict[window.id] = fileManager;
  manualCloseDict[window.id] = false;
  windowDict[window.id] = window;
  window.maximize();
  window.show();
  window.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  window.on("closed", event => {
    // manualCloseDict[event.sender.id] = null;
    // fileManagerDict[event.sender.id] = null;
    // windowDict[event.sender.id] = null;

    window = null;
  });

  window.on("blur", e => {
    window && window.send("requestSave");
  });

  window.on("focus", e => {
    console.log("FOCUSING", fileManagerDict[e.sender.id].name);
    focusedWindow = e.sender;
  });

  window.on("close", event => {
    if (manualCloseDict[event.sender.id] === false) {
      event.preventDefault();

      fileManager.protectUnsaved(() => {
        manualCloseDict[event.sender.id] = true;
        fileManagerDict[event.sender.id].watcher &&
          fileManagerDict[event.sender.id].watcher.close();
        ipcMain.removeListener(
          "edited",
          fileManagerDict[event.sender.id].onEditedMessageBound
        );
        ipcMain.removeListener(
          "save",
          fileManagerDict[event.sender.id].onSaveMessageBound
        );
        ipcMain.removeListener(
          "updatePath",
          fileManagerDict[event.sender.id].onUpdatePathMessageBound
        );

        event.sender.close();
      });
    }
  });

  setMenu();

  window.webContents.once("dom-ready", () => {
    window.webContents.send("getWorlds");
    window.setTitle(fileManager.name);
    callback(window);

    ipcMain.on("sendWorlds", (event, data) => {
      worldButtons = data.map(world => {
        if (!world.name) {
          return { type: "separator" };
        }
        return {
          label: world.name,
          click() {
            fileManager.onNewProject(world.key);
          }
        };
      });

      setMenu(worldButtons);
    });
  });
}

app.on("ready", () => createWindow());

app.on("window-all-closed", () => {
  Menu.setApplicationMenu(Menu.buildFromTemplate([]));

  ipcMain: null;
  // if (process.platform !== "darwin") {
  //   app.quit();
  // }
});

// app.on("activate", () => {
//   if (Object.keys(fileManagerDict).length === 0) {
//     createWindow();
//   }
// });

function getFocusedWindow() {
  return focusedWindow;
}

function setMenu(worldButtons = []) {
  var menu = defaultMenu(app, shell);

  menu.splice(1, 0, {
    label: "File",
    submenu: [
      {
        label: "New",
        click() {
          fileManagerDict[getFocusedWindow().id].onNewProject();
        },
        accelerator: "Cmd+N"
      },

      {
        label: "Open",
        click() {
          fileManagerDict[getFocusedWindow().id].onOpenCommand();
        },
        accelerator: "Cmd+O"
      },
      {
        label: "Open example...",
        submenu: worldButtons
      },
      { type: "separator" },

      {
        label: "Save",
        click() {
          fileManagerDict[getFocusedWindow().id].onSaveCommand();
        },
        accelerator: "Cmd+S"
      },
      {
        label: "Save As...",
        click() {
          fileManagerDict[getFocusedWindow().id].onSaveAsCommand();
        },
        accelerator: "Shift+Cmd+S"
      },
      {
        label: "Show current directory...",
        click() {
          if (fileManagerDict[getFocusedWindow().id].path) {
            shell.openItem(fileManagerDict[getFocusedWindow().id].path);
          } else {
            const options = {
              buttons: ["Ok"],
              message: "This project isn't saved anywhere yet."
            };

            dialog.showMessageBox(null, options);
          }
        },
        accelerator: "Cmd+K"
      }
    ]
  });

  menu[5].submenu = [
    {
      label: "p5.js Reference",
      click() {
        shell.openExternal("https://p5js.org/reference/");
      }
    },
    {
      label: "p5.js Libraries",
      click() {
        shell.openExternal("https://p5js.org/libraries/");
      }
    },
    {
      label: "p5.js Learn",
      click() {
        shell.openExternal("https://p5js.org/learn/");
      }
    },
    {
      label: "p5.js Examples",
      click() {
        shell.openExternal("https://p5js.org/examples/");
      }
    }
  ];

  menu[3].submenu.push({ type: "separator" });
  menu[3].submenu.push({
    label: "Zoom In",
    click(e) {
      getFocusedWindow().webContents.send("zoomIn");
    },
    accelerator: "Cmd+plus"
  });

  menu[3].submenu.push({
    label: "Zoom Out",
    click(e) {
      getFocusedWindow().webContents.send("zoomOut");
    },
    accelerator: "Cmd+numsub"
  });

  menu[3].submenu.push({
    label: "Actual Size",
    click(e) {
      getFocusedWindow().webContents.send("zoomActual");
    },
    accelerator: "Cmd+0"
  });

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
}

//////////

app.on("ready", function() {
  autoUpdater.checkForUpdates();
});

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.info("App starting...");
