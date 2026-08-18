/**
 * db-migrate script
 * Runs database migrations headlessly via Electron without launching any UI window.
 */
const { app } = require("electron");
const path = require("path");
const { initDatabase } = require("../electron/db/database.cjs");

// Disable GPU / background throttling for fast CLI execution
app.disableHardwareAcceleration();

app.whenReady().then(() => {
  try {
    const dbPath = path.join(app.getPath("userData"), "spesely-db-v1.sqlite");
    console.log("?? Running migrations on:", dbPath);

    initDatabase(dbPath);

    console.log("\n? All migrations up to date!");
  } catch (error) {
    console.error("\n? Migration failed:", error);
    process.exit(1);
  } finally {
    app.quit();
  }
});
