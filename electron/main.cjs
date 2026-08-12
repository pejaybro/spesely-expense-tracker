process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
const path = require("path");
const { app, BrowserWindow } = require("electron");
const CONFIG = require("./config.cjs");
const { initIPC } = require("./ipc/ipc.cjs");
const registerIPC_DB = require("./ipc/db-ipc/index.cjs");
const { initDatabase } = require("./db/database.cjs");

let mainWindow = null;
let splashWindow = null;

function createWindow() {
  /**
   *=================================
   * ? Splash Screen
   *=================================
   */
  splashWindow = new BrowserWindow(CONFIG.window.splash);
  splashWindow.loadFile("splash.html");

  /**
   *=================================
   * ? Main Screen
   *=================================
   */
  mainWindow = new BrowserWindow(CONFIG.window.main);

  if (CONFIG.isDev) {
    mainWindow.loadURL(CONFIG.urls.dev);
  } else {
    mainWindow.loadFile(CONFIG.urls.prod);
  }

  // Initialize IPC Handlers
  initIPC(mainWindow);

  // Transition from Splash to Main
  setTimeout(() => {
    if (splashWindow) splashWindow.close();
    if (mainWindow) mainWindow.show();
  }, CONFIG.timeouts.splash);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

/**
 *=================================================
 * ? App Lifecycle
 *=================================================
 */

app.whenReady().then(() => {
  const dbPath = path.join(app.getPath("userData"), "spesely-db-v1.sqlite");
  initDatabase(dbPath);
  registerIPC_DB();
  createWindow();
});

/* 
# NOTE: after changing the above when ready 
FLOW becomes
Electron starts
      ↓
app.whenReady()
      ↓
Get userData folder
      ↓
Create/open sps.sqlite
      ↓
Create BrowserWindow
      ↓
React starts 
*/

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
