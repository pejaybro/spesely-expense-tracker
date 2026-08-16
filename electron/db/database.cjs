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
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const migrationsPath = path.join(__dirname, "migrations");
  const files = fs
    .readdirSync(migrationsPath)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  const executed = new Set(
    db.prepare("SELECT filename FROM schema_migrations").all().map((r) => r.filename)
  );

  for (const file of files) {
    if (executed.has(file)) continue;

    const sql = fs.readFileSync(path.join(migrationsPath, file), "utf8");
    try {
      db.transaction(() => {
        db.exec(sql);
        db.prepare("INSERT INTO schema_migrations (filename) VALUES (?)").run(file);
      })();
      console.log(" Migration executed:", file);
    } catch (err) {
      // Handle legacy tables where columns might already exist
      console.warn(`[migration] Warning running ${file}:`, err.message);
      db.prepare("INSERT OR IGNORE INTO schema_migrations (filename) VALUES (?)").run(file);
    }
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
