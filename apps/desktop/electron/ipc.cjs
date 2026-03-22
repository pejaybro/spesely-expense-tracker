const { ipcMain } = require("electron");

/**
 * ANCHOR : Initializes IPC handlers for the main window.
 */
function initIPC(mainWindow) {
  ipcMain.handle("ping", () => "pong");
  ipcMain.handle("window:is-maximized", () => {
    return mainWindow ? mainWindow.isMaximized() || mainWindow.isFullScreen() : false;
  });

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

  // Sync window state with CSS class on root element
  const syncWindowState = () => {
    if (!mainWindow) return;
    const isMaximized = mainWindow.isMaximized() || mainWindow.isFullScreen();
    mainWindow.webContents.executeJavaScript(
      `document.documentElement.classList.toggle('is-maximized', ${isMaximized})`,
    );
  };

  // Listen for window state changes and notify renderer
  if (mainWindow) {
    mainWindow.on("maximize", syncWindowState);
    mainWindow.on("unmaximize", syncWindowState);
    mainWindow.on("enter-full-screen", syncWindowState);
    mainWindow.on("leave-full-screen", syncWindowState);

    // Also sync on initial show
    mainWindow.on("show", syncWindowState);
    // And when the page finishes loading
    mainWindow.webContents.on("did-finish-load", syncWindowState);
  }
}

module.exports = { initIPC };
