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
    width: 900,
    height: 680,
    webPreferences: { nodeIntegration: true }
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.webContents.openDevTools();
  mainWindow.on("closed", () => (mainWindow = null));

  setMenu();

  mainWindow.webContents.once("dom-ready", () => {
    fileManager = new FileManager(mainWindow);
    fileManager.setDefault();
    fileManager.writeToView();
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
        { label: "New Project" },
        {
          label: "Open...",
          click() {
            dialog.showOpenDialog(null, { properties: ["openDirectory"] });
          }
        },
        { label: "Save" ,          click() {
            fileManager.writeToView()
          }},
        { label: "Save As..." }
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
