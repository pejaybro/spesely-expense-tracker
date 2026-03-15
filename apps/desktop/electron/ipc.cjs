const { ipcMain } = require("electron");

/**
 * ANCHOR : Initializes IPC handlers for the main window.
 */
function initIPC(mainWindow) {
  ipcMain.handle("ping", () => "pong");

  ipcMain.on("window:minimize", () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.on("window:maximize", () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.on("window:close", () => {
    if (mainWindow) mainWindow.close();
  });
}

module.exports = { initIPC };
