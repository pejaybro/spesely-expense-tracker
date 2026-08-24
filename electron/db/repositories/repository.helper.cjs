const { updateRecord } = require("./base.cjs");

/* ==================================================
 * REPOSITORY HELPERS & CONVENIENCE UTILITIES
 * ==================================================
 */

/**
 * Soft deletes a record by setting is_deleted = 1 and updating updated_at.
 * @param {{ tableName: string, columnName?: string, id?: any, whereClause?: string, whereParams?: any[] }}
 * @returns {boolean} True if a record was updated
 */
function softDeleteRecord({
  tableName,
  columnName = "public_id",
  id,
  whereClause,
  whereParams = [],
}) {
  const updated = updateRecord({
    tableName,
    data: { is_deleted: 1 },
    columnName,
    id,
    whereClause,
    whereParams,
  });
  return Boolean(updated);
}

/**
 * Restores a soft-deleted record by setting is_deleted = 0 and updating updated_at.
 * @param {{ tableName: string, columnName?: string, id?: any, whereClause?: string, whereParams?: any[] }}
 * @returns {boolean} True if a record was restored
 */
function restoreRecord({
  tableName,
  columnName = "public_id",
  id,
  whereClause,
  whereParams = [],
}) {
  const updated = updateRecord({
    tableName,
    data: { is_deleted: 0 },
    columnName,
    id,
    whereClause,
    whereParams,
  });
  return Boolean(updated);
}

module.exports = {
  softDeleteRecord,
  restoreRecord,
};
