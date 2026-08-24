const { getDatabase } = require("../database.cjs");

const primaryCategoryRepository = {
  getAll() {
    const db = getDatabase();
    return db
      .prepare(
        "SELECT * FROM spesely_primary_categories WHERE is_deleted = 0 ORDER BY id DESC"
      )
      .all();
  },

  create(category) {
    const db = getDatabase();
    const stmt = db.prepare(
      `INSERT INTO spesely_primary_categories (name, color, is_expense) 
       VALUES (?, ?, ?)`
    );
    const result = stmt.run(
      category.name,
      category.color || "#3b82f6",
      category.is_expense !== undefined ? category.is_expense : 1
    );

    return db
      .prepare("SELECT * FROM spesely_primary_categories WHERE id = ?")
      .get(result.lastInsertRowid);
  },

  toggleStatus(public_id) {
    const db = getDatabase();
    const stmt = db.prepare(
      `UPDATE spesely_primary_categories 
       SET status = CASE WHEN status = 1 THEN 0 ELSE 1 END,
           updated_at = CURRENT_TIMESTAMP 
       WHERE public_id = ?`
    );
    const info = stmt.run(public_id);
    return info.changes > 0;
  },

  softDelete(public_id) {
    const db = getDatabase();
    const stmt = db.prepare(
      `UPDATE spesely_primary_categories 
       SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP 
       WHERE public_id = ?`
    );
    const info = stmt.run(public_id);
    return info.changes > 0;
  },

  delete(public_id) {
    const db = getDatabase();
    db.prepare(
      `DELETE FROM spesely_secondary_categories WHERE primary_category_id = ?`
    ).run(public_id);
    const stmt = db.prepare(
      `DELETE FROM spesely_primary_categories WHERE public_id = ?`
    );
    const info = stmt.run(public_id);
    return info.changes > 0;
  },

  update(public_id, category) {
    const db = getDatabase();
    const stmt = db.prepare(
      `UPDATE spesely_primary_categories 
       SET name = COALESCE(?, name), 
           color = COALESCE(?, color), 
           updated_at = CURRENT_TIMESTAMP 
       WHERE public_id = ?`
    );
    stmt.run(
      category.name !== undefined ? category.name : null,
      category.color !== undefined ? category.color : null,
      public_id
    );
    return db
      .prepare("SELECT * FROM spesely_primary_categories WHERE public_id = ?")
      .get(public_id);
  },
};

module.exports = primaryCategoryRepository;
