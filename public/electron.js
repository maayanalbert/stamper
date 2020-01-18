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

let mainWindow;
let fileManager;
let manualQuit = false;
let manualClose = false;
let worldNames = ["starter", "empty", "particles"]


function createWindow() {
  manualClose = false;
  autoUpdater.checkForUpdates();

  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      "web-security": false,
      icon: __dirname + "./icons/map/icon.icns"
    },
    show: false,
    minHeight: 300,
    minWidth: 450
  });
  mainWindow.maximize();
  mainWindow.show();
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => {
    Menu.setApplicationMenu(Menu.buildFromTemplate([]));
    mainWindow = null;
    ipcMain.removeAllListeners("edited");
    ipcMain.removeAllListeners("save");
    ipcMain.removeAllListeners("updatePath");
    ipcMain: null;
  });

  mainWindow.on("blur", (e) => {
    mainWindow.send("requestSave")
  })

  mainWindow.on("close", event => {
    if (manualClose === false && manualQuit === false) {
      event.preventDefault();

      fileManager.protectUnsaved(() => {
        manualClose = true;
        mainWindow.close();
      });
    }
  });

  setMenu();

  mainWindow.webContents.once("dom-ready", () => {
    fileManager = new FileManager(mainWindow);
    fileManager.name = "Untitled";
    mainWindow.setTitle(fileManager.name);
  });
}

app.on("ready", createWindow);
app.on("before-quit", event => {
  if (manualQuit === false) {
    event.preventDefault();

    fileManager.protectUnsaved(() => {
      manualQuit = true;
      app.quit();
    });
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  manualQuit = false;

  if (mainWindow === null) {
    createWindow();
  }
});

function setMenu() {
  var menu = defaultMenu(app, shell);

  var worldButtons = worldNames.map( name => 

          {
          return {
            label:name, 
            click(){
          fileManager.onNewProject(name)
            }
          }
        }

        )

  menu.splice(1, 0, {
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
        label: "Load example...",
        submenu:worldButtons
      },
      { type: "separator" },

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
      },
      {
        label: "Show current directory...",
        click() {
          if (fileManager.path) {
            shell.openItem(fileManager.path);
          }else{
                  const options = {

        buttons: ["Ok"],
        message: "This project isn't saved anywhere yet.",
      };

      dialog.showMessageBox(null, options)
          }
        },
        accelerator: "Cmd+K"
      },
    ]
  });

  menu.splice(5, 0, {
    label: "Sketch",
    submenu: []
  });

  menu[6].submenu = [
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
      mainWindow.webContents.send("zoomIn");
    },
    accelerator: "Cmd+plus"
  });

  menu[3].submenu.push({
    label: "Zoom Out",
    click(e) {
      mainWindow.webContents.send("zoomOut");
    },
    accelerator: "Cmd+numsub"
  });

  menu[3].submenu.push({
    label: "Actual Size",
    click(e) {
      mainWindow.webContents.send("zoomActual");
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
