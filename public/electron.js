const {
  app,
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

let mainWindow;
let fileManager;

function createWindow() {
  autoUpdater.checkForUpdates();
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 680,
    webPreferences: { nodeIntegration: true }
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.webContents.openDevTools();
  mainWindow.on("closed", () => {
    mainWindow = null;
    ipcMain.removeAllListeners("edited");
    ipcMain.removeAllListeners("save");
    ipcMain: null;
  });

  setMenu();

  mainWindow.webContents.once("dom-ready", () => {
    fileManager = new FileManager(mainWindow);

    fileManager.onNewProject();
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

function setMenu() {
  var menu = Menu.buildFromTemplate([
    {
      label: "Idk",
      submenu: [{ label: "Idk" }]
    },
    {
      label: "File",
      submenu: [
        {
          label: "New Project",
          click() {
            fileManager.onNewProject();
          },
          accelerator: "Cmd+N"
        },

        {
          label: "Open",
          click() {
            fileManager.onOpenCommand();
          },
          accelerator: "Cmd+O"
        },

        {
          label: "Save",
          click() {
            fileManager.onSaveCommand();
          },
          accelerator: "Cmd+S"
        },
        {
          label: "Save As...",
          click() {
            fileManager.onSaveAsCommand();
          },
          accelerator: "Shift+Cmd+S"
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        {
          label: "Select All",
          accelerator: "CmdOrCtrl+A",
          selector: "selectAll:"
        }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);
}

//////////

app.on("ready", function() {
  autoUpdater.checkForUpdates();
});

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.info("App starting...");
