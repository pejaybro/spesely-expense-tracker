const {
  insertRecord,
  updateRecord,
  deleteRecord,
  getPaginatedRecords,
} = require("./base.cjs");
const { getDatabase } = require("../database.cjs");

const TABLE = "spesely_transactions";
const ALLOWED_COLUMNS = [
  "id",
  "public_id",
  "amount",
  "note",
  "primary_category_id",
  "secondary_category_id",
  "transaction_date",
  "is_expense",
  "created_at",
  "updated_at",
];
const SEARCH_COLUMNS = ["note"];

// JOIN fragment — appended to the main table for category names
const JOIN_CATEGORIES = `
  LEFT JOIN spesely_primary_categories   pc ON t.primary_category_id   = pc.public_id
  LEFT JOIN spesely_secondary_categories sc ON t.secondary_category_id = sc.public_id
`;

// SELECT fragment — main table columns + joined category names
const SELECT_CATEGORIES = `
  t.*,
  pc.name AS primary_category_name,
  sc.name AS secondary_category_name
`;

const transactionRepository = {

  // Uses base getPaginatedRecords with JOIN
  getPaginated({
    page = 1,
    limit = 10,
    sortBy = "transaction_date",
    sortOrder = "desc",
    search,
    rangeFilters = [],
    valueFilters = [],
  } = {}) {
    return getPaginatedRecords({
      tableName: `${TABLE} t`,
      joinClause: JOIN_CATEGORIES,
      selectClause: SELECT_CATEGORIES,
      allowedColumns: ALLOWED_COLUMNS,
      searchColumns: SEARCH_COLUMNS,
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      rangeFilters,
      valueFilters,
    });
  },

  create(transaction) {
    const db = getDatabase();
    const createTx = db.transaction(() => {
      const created = insertRecord({
        tableName: TABLE,
        data: {
          amount: transaction.amount,
          note: transaction.note || "",
          primary_category_id: transaction.primary_category_id,
          secondary_category_id: transaction.secondary_category_id || null,
          transaction_date: transaction.transaction_date || transaction.date,
          is_expense: transaction.is_expense !== undefined ? transaction.is_expense : 1,
        },
      });

      const now = Date.now();

      // Increment transaction_count on primary category
      db.prepare(
        `UPDATE spesely_primary_categories
         SET transaction_count = transaction_count + 1, updated_at = ?
         WHERE public_id = ?`,
      ).run(now, transaction.primary_category_id);

      // Increment transaction_count on secondary category if present
      if (transaction.secondary_category_id) {
        db.prepare(
          `UPDATE spesely_secondary_categories
           SET transaction_count = transaction_count + 1, updated_at = ?
           WHERE public_id = ?`,
        ).run(now, transaction.secondary_category_id);
      }

      return created;
    });

    return createTx();
  },

  update(public_id, transaction) {
    const data = Object.fromEntries(
      Object.entries(transaction).filter(([, v]) => v !== undefined),
    );
    if ("date" in data && !("transaction_date" in data)) {
      data.transaction_date = data.date;
      delete data.date;
    }
    return updateRecord({
      tableName: TABLE,
      data,
      columnName: "public_id",
      id: public_id,
    });
  },

  delete(public_id) {
    const db = getDatabase();
    const deleteTx = db.transaction(() => {
      const deleted = deleteRecord({
        tableName: TABLE,
        columnName: "public_id",
        data: [public_id],
      });

      if (deleted.length > 0) {
        const item = deleted[0];
        const now = Date.now();

        // Decrement transaction_count on primary category
        db.prepare(
          `UPDATE spesely_primary_categories
           SET transaction_count = MAX(0, transaction_count - 1), updated_at = ?
           WHERE public_id = ?`,
        ).run(now, item.primary_category_id);

        // Decrement transaction_count on secondary category if present
        if (item.secondary_category_id) {
          db.prepare(
            `UPDATE spesely_secondary_categories
             SET transaction_count = MAX(0, transaction_count - 1), updated_at = ?
             WHERE public_id = ?`,
          ).run(now, item.secondary_category_id);
        }
      }

      return deleted.length > 0;
    });

    return deleteTx();
  },
};

module.exports = transactionRepository;
