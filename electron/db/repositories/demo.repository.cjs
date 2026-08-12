const { getDatabase } = require("../database.cjs");

function getAll() {
  const db = getDatabase();
  return db.prepare("SELECT * FROM demo ORDER BY id DESC").all();
}

function getById(id) {
  const db = getDatabase();
  return db.prepare("SELECT * FROM demo WHERE id = ?").get(id);
}

function create(demo) {
  const db = getDatabase();
  return db
    .prepare("INSERT INTO demo (demo) VALUES (?) RETURNING *")
    .get(demo.demo);
}

/* 

function create(demo) {
  const db = getDatabase();

  const result = db
    .prepare(`
      INSERT INTO demo (demo)
      VALUES (?)
    `)
    .run(demo);

  return getById(result.lastInsertRowid);
}*/

function update(id, demo) {
  const db = getDatabase();
  return db
    .prepare(
      "UPDATE demo SET demo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING *",
    )
    .get(demo.demo, id);
}

function deleteById(id) {
  const db = getDatabase();
  const result = db.prepare("DELETE FROM demo WHERE id = ?").run(id);
  return result.changes > 0;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteById,
};
