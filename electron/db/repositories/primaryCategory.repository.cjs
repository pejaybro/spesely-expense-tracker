const {
  getRecords,
  insertRecord,
  updateRecord,
  deleteRecord,
} = require("./base.cjs");
const { softDeleteRecord } = require("./repository.helper.cjs");
const { getDatabase } = require("../database.cjs");

const TABLE = "spesely_primary_categories";
const ALLOWED_COLUMNS = [
  "id",
  "public_id",
  "name",
  "color",
  "is_expense",
  "status",
  "is_deleted",
  "transaction_count",
  "created_at",
  "updated_at",
];

const primaryCategoryRepository = {

  getAll() {
    const { data } = getRecords({
      tableName: TABLE,
      allowedColumns: ALLOWED_COLUMNS,
      valueFilters: [{ columnName: "is_deleted", values: [0] }],
      sortBy: "id",
      sortOrder: "desc",
    });
    return data;
  },

  create(category) {
    return insertRecord({
      tableName: TABLE,
      data: {
        name: category.name,
        color: category.color || "#FFFFFF",
        is_expense: category.is_expense !== undefined ? category.is_expense : 1,
      },
    });
  },

  // Custom: CASE WHEN is SQL-only logic, can't be expressed as a plain value
  toggleStatus(public_id) {
    const db = getDatabase();
    const info = db
      .prepare(
        `UPDATE ${TABLE}
         SET status = CASE WHEN status = 1 THEN 0 ELSE 1 END,
             updated_at = ?
         WHERE public_id = ?`,
      )
      .run(Date.now(), public_id);
    return info.changes > 0;
  },

  softDelete(public_id) {
    return softDeleteRecord({
      tableName: TABLE,
      columnName: "public_id",
      id: public_id,
    });
  },

  /**
   * Cascading Smart Delete with Direct WHERE Clauses:
   * 1. Permanently delete all 0-transaction sub-categories in 1 query
   * 2. Soft-delete sub-categories that have transactions
   * 3. Permanently delete primary category if transaction_count is 0
   * 4. Otherwise, soft-delete primary category
   */
  delete(public_id) {
    const db = getDatabase();
    const executeDelete = db.transaction(() => {
      // 1. Permanently delete all 0-transaction sub-categories in 1 query:
      deleteRecord({
        tableName: "spesely_secondary_categories",
        whereClause: "primary_category_id = ? AND transaction_count = 0",
        whereParams: [public_id],
      });

      // 2. Soft-delete remaining sub-categories that have transactions:
      updateRecord({
        tableName: "spesely_secondary_categories",
        data: { is_deleted: 1 },
        whereClause: "primary_category_id = ? AND transaction_count > 0",
        whereParams: [public_id],
      });

      // 3. Try to permanently delete the primary category:
      const deleted = deleteRecord({
        tableName: TABLE,
        whereClause: "public_id = ? AND transaction_count = 0",
        whereParams: [public_id],
      });

      if (deleted.length > 0) {
        return true;
      }

      // 4. If it has transactions, soft-delete it:
      return this.softDelete(public_id);
    });

    return executeDelete();
  },

  update(public_id, category) {
    const data = Object.fromEntries(
      Object.entries(category).filter(([, v]) => v !== undefined),
    );
    return updateRecord({
      tableName: TABLE,
      data,
      columnName: "public_id",
      id: public_id,
    });
  },
};

module.exports = primaryCategoryRepository;
