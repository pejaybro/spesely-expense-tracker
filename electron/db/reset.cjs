/**
 * db-reset script
 *
 * Terminates running Electron instances and safely removes
 * the SQLite database and its WAL/SHM companion files.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const DB_NAME = "spesely-db-v1.sqlite";

// Potential userData directories (dev vs packaged)
const candidateDirs = [
  path.join(process.env.APPDATA || "", "Electron"),
  path.join(process.env.APPDATA || "", "spesely-expense-tracker"),
];

// 1. Force kill any running Electron instances so files are released
try {
  execSync("taskkill /F /T /IM electron.exe", { stdio: "ignore" });
} catch {
  // Ignored if electron wasn't running
}

// Helper to retry deleting a file with backoff
function removeFileWithRetry(filePath, maxRetries = 10, delayMs = 300) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false; // File doesn't exist
    } catch (err) {
      if (i === maxRetries - 1) {
        throw err;
      }
      // Wait before next attempt
      const end = Date.now() + delayMs;
      while (Date.now() < end) {}
    }
  }
  return false;
}

let deletedCount = 0;

for (const dir of candidateDirs) {
  if (!fs.existsSync(dir)) continue;

  const targetFiles = [
    path.join(dir, DB_NAME),
    path.join(dir, `${DB_NAME}-wal`),
    path.join(dir, `${DB_NAME}-shm`),
  ];

  for (const file of targetFiles) {
    if (fs.existsSync(file)) {
      try {
        removeFileWithRetry(file);
        console.log(`[db-reset] Deleted: ${file}`);
        deletedCount++;
      } catch (err) {
        console.error(`[db-reset] Could not delete ${file}: ${err.message}`);
      }
    }
  }
}

if (deletedCount > 0) {
  console.log("\n Database reset complete! Start your app to run fresh migrations.");
} else {
  console.log("\n[db-reset] No existing database file found to delete.");
}
