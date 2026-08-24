const {
  getRecords,
  insertRecord,
  updateRecord,
  deleteRecord,
} = require("./base.cjs");
const { softDeleteRecord } = require("./repository.helper.cjs");
const { getDatabase } = require("../database.cjs");

const TABLE = "spesely_secondary_categories";
const ALLOWED_COLUMNS = [
  "id",
  "public_id",
  "primary_category_id",
  "name",
  "color",
  "is_expense",
  "status",
  "is_deleted",
  "transaction_count",
  "created_at",
  "updated_at",
];

const secondaryCategoryRepository = {

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

  getByPrimaryId(primary_public_id) {
    const { data } = getRecords({
      tableName: TABLE,
      allowedColumns: ALLOWED_COLUMNS,
      valueFilters: [
        { columnName: "primary_category_id", values: [primary_public_id] },
        { columnName: "is_deleted", values: [0] },
      ],
      sortBy: "name",
      sortOrder: "asc",
    });
    return data;
  },

  create(category) {
    return insertRecord({
      tableName: TABLE,
      data: {
        primary_category_id: category.primary_category_id,
        name: category.name,
        color: category.color || null,
        is_expense: category.is_expense !== undefined ? category.is_expense : 1,
      },
    });
  },

  // Custom: CASE WHEN is SQL-only logic
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
   * Smart Delete with Direct WHERE Clauses:
   * - 0 transactions -> Permanently deleted in 1 shot (gone for good)
   * - >0 transactions -> Soft-deleted (sent to archive)
   */
  delete(public_id) {
    // 1. Try to permanently delete (ONLY if transaction_count is 0)
    const deleted = deleteRecord({
      tableName: TABLE,
      whereClause: "public_id = ? AND transaction_count = 0",
      whereParams: [public_id],
    });

    if (deleted.length > 0) {
      return true;
    }

    // 2. If it has transactions, soft-delete it to archive
    return this.softDelete(public_id);
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

module.exports = secondaryCategoryRepository;
