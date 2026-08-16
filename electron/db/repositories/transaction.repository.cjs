const { getDatabase } = require("../database.cjs");

const transactionRepository = {
  getAll() {
    const db = getDatabase();
    return db
      .prepare(
        `SELECT t.*, 
                pc.name AS primary_category_name, 
                sc.name AS secondary_category_name 
         FROM spesely_transactions t
         LEFT JOIN spesely_primary_categories pc ON t.primary_category_id = pc.public_id
         LEFT JOIN spesely_secondary_categories sc ON t.secondary_category_id = sc.public_id
         ORDER BY t.date DESC, t.id DESC`
      )
      .all();
  },

  getTop10(is_expense) {
    const db = getDatabase();
    return db
      .prepare(
        `SELECT t.*, 
                pc.name AS primary_category_name, 
                sc.name AS secondary_category_name 
         FROM spesely_transactions t
         LEFT JOIN spesely_primary_categories pc ON t.primary_category_id = pc.public_id
         LEFT JOIN spesely_secondary_categories sc ON t.secondary_category_id = sc.public_id
         WHERE t.is_expense = ?
         ORDER BY t.amount DESC 
         LIMIT 10`
      )
      .all(is_expense);
  },

  create(transaction) {
    const db = getDatabase();
    const stmt = db.prepare(
      `INSERT INTO spesely_transactions 
        (amount, note, primary_category_id, secondary_category_id, date, is_expense) 
       VALUES (?, ?, ?, ?, ?, ?)`
    );
    const result = stmt.run(
      transaction.amount,
      transaction.note || "",
      transaction.primary_category_id,
      transaction.secondary_category_id || null,
      transaction.date,
      transaction.is_expense !== undefined ? transaction.is_expense : 1
    );

    return db
      .prepare("SELECT * FROM spesely_transactions WHERE id = ?")
      .get(result.lastInsertRowid);
  },

  delete(public_id) {
    const db = getDatabase();
    const stmt = db.prepare(
      "DELETE FROM spesely_transactions WHERE public_id = ?"
    );
    const info = stmt.run(public_id);
    return info.changes > 0;
  },
};

module.exports = transactionRepository;
