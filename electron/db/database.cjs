const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

let db = null;

function initDatabase(dbPath) {
  db = new Database(dbPath);

  db.pragma("foreign_keys = ON");
  runMigrations();
  console.log(" SQLite DB init ", dbPath);
  return db;
}

function runMigrations() {
  const migrationsPath = path.join(__dirname, "migrations");
  const files = fs
    .readdirSync(migrationsPath)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsPath, file), "utf8");
    db.exec(sql);
  }
}

function getDatabase() {
  if (!db) {
    throw new Error("DB is not initalize");
  }
  return db;
}

module.exports = {
  initDatabase,
  getDatabase,
};
