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

let windows = {};

let fileManager;
let manualClose = false;
let worldNames = ["starter", "empty", "particles"];
let focusedWindow = null;
let worldButtons = [];

function createWindow(callback = () => null, name, path) {
  manualClose = false;
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
  var fileManager = new FileManager(window, createWindow, name, path);

  windows[window.id] = fileManager;
  window.maximize();
  window.show();
  window.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  window.on("closed", () => {
    Menu.setApplicationMenu(Menu.buildFromTemplate([]));
    window = null;
    ipcMain.removeAllListeners("edited");
    ipcMain.removeAllListeners("save");
    ipcMain.removeAllListeners("updatePath");
    ipcMain: null;
  });

  window.on("blur", e => {
    window.send("requestSave");
  });

  window.on("focus", e => {
    focusedWindow = e.sender;
  });

  window.on("close", event => {
    if (manualClose === false) {
      event.preventDefault();

      fileManager.protectUnsaved(() => {
        manualClose = true;
        fileManager.watcher.close();
        window.close();
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
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// app.on("activate", () => {
//   if (Object.keys(windows).length === 0) {
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
          windows[getFocusedWindow().id].onNewProject();
        },
        accelerator: "Cmd+N"
      },

      {
        label: "Open",
        click() {
          windows[getFocusedWindow().id].onOpenCommand();
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
          windows[getFocusedWindow().id].onSaveCommand();
        },
        accelerator: "Cmd+S"
      },
      {
        label: "Save As...",
        click() {
          windows[getFocusedWindow().id].onSaveAsCommand();
        },
        accelerator: "Shift+Cmd+S"
      },
      {
        label: "Show current directory...",
        click() {
          if (windows[getFocusedWindow().id].path) {
            shell.openItem(windows[getFocusedWindow().id].path);
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
