const { getDatabase } = require("../database.cjs");
const {
  buildRangeFilter,
  buildSearchFilter,
  buildValueFilter,
  buildWhereClause,
  buildSortClause,
} = require("./helpers.cjs");

/* ==================================================
 * MERGE DATA
 * ==================================================
 */

function mergeRecords({ tableName, columnName, currentID, sourceID }) {
  const db = getDatabase();
  db.prepare(
    `UPDATE ${tableName} 
      SET ${columnName} = ? 
      WHERE ${columnName} = ?`,
  ).run(sourceID, currentID);
}

/* ==================================================
 * MOVE DATA
 * ==================================================
 */

function moveRecords({ tableName, columnName, targetID, sourceID }) {
  const db = getDatabase();
  db.prepare(
    `UPDATE ${tableName} 
      SET ${columnName} = ? 
      WHERE ${columnName} = ?`,
  ).run(targetID, sourceID);
}

/* ==================================================
 * COUNT DATA
 * ==================================================
 */

function countRecords({ tableName, whereClause = "", filterParams = [] }) {
  const db = getDatabase();
  const { count } = db
    .prepare(
      `SELECT COUNT(*) as count
       FROM ${tableName}
       ${whereClause}`,
    )
    .get(...filterParams);
  return count;
}

/* ==================================================
 * PAGINATED DATA
 * ==================================================
 */

function getPaginatedRecords({
  tableName,
  allowedColumns = [],
  searchColumns = [],
  rangeFilters = [],
  valueFilters = [],
  page = 1,
  limit = 10,
  sortBy = "id",
  sortOrder = "desc",
  search,
}) {
  const db = getDatabase();

  // -------------------------
  // Sorting
  // -------------------------
  const { safeSortBy, safeSortOrder } = buildSortClause({
    sortBy,
    sortOrder,
    allowedColumns,
  });

  // -------------------------
  // Filters
  // -------------------------
  const rangeFilter = buildRangeFilter({ rangeFilters, allowedColumns });
  const searchFilter = buildSearchFilter({ searchColumns, search, allowedColumns });
  const valueFilter = buildValueFilter({ valueFilters, allowedColumns });

  const filterConditions = [
    ...rangeFilter.conditions,
    ...searchFilter.conditions,
    ...valueFilter.conditions,
  ];
  const filterParams = [
    ...rangeFilter.params,
    ...searchFilter.params,
    ...valueFilter.params,
  ];

  const whereClause = buildWhereClause({ conditions: filterConditions });

  // -------------------------
  // Total Records & Pagination
  // -------------------------
  const totalRecords = countRecords({ tableName, whereClause, filterParams });
  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));
  const safePage = Math.min(page, totalPages);
  const safeOffset = Math.max(0, (safePage - 1) * limit);

  // -------------------------
  // Actual Data
  // -------------------------
  const data = db
    .prepare(
      `SELECT * FROM ${tableName} ${whereClause} ORDER BY ${safeSortBy} ${safeSortOrder} LIMIT ? OFFSET ?`,
    )
    .all(...filterParams, limit, safeOffset);

  // -------------------------
  // Meta Data
  // -------------------------
  const meta = {
    totalRecords,
    totalPages,
    currentPage: safePage,
    sortBy: safeSortBy,
    sortOrder: safeSortOrder.toLowerCase(),
  };
  return { data, meta };
}

/* ==================================================
 * NON-PAGINATED DATA
 * ==================================================
 */

function getRecords({
  tableName,
  allowedColumns = [],
  searchColumns = [],
  rangeFilters = [],
  valueFilters = [],
  sortBy = "id",
  sortOrder = "desc",
  search,
}) {
  const db = getDatabase();

  // -------------------------
  // Sorting
  // -------------------------
  const { safeSortBy, safeSortOrder } = buildSortClause({
    sortBy,
    sortOrder,
    allowedColumns,
  });

  // -------------------------
  // Filters
  // -------------------------
  const rangeFilter = buildRangeFilter({ rangeFilters, allowedColumns });
  const searchFilter = buildSearchFilter({ searchColumns, search, allowedColumns });
  const valueFilter = buildValueFilter({ valueFilters, allowedColumns });

  const filterConditions = [
    ...rangeFilter.conditions,
    ...searchFilter.conditions,
    ...valueFilter.conditions,
  ];
  const filterParams = [
    ...rangeFilter.params,
    ...searchFilter.params,
    ...valueFilter.params,
  ];

  const whereClause = buildWhereClause({ conditions: filterConditions });

  // -------------------------
  // Total Records
  // -------------------------
  const totalRecords = countRecords({ tableName, whereClause, filterParams });

  // -------------------------
  // Actual Data
  // -------------------------
  const data = db
    .prepare(
      `SELECT * FROM ${tableName} ${whereClause} ORDER BY ${safeSortBy} ${safeSortOrder}`,
    )
    .all(...filterParams);

  // -------------------------
  // Meta Data
  // -------------------------
  const meta = {
    totalRecords,
    totalPages: 1,
    currentPage: 1,
    sortBy: safeSortBy,
    sortOrder: safeSortOrder.toLowerCase(),
  };
  return { data, meta };
}

/* ==================================================
 * DATA BY ID - Single
 * ==================================================
 */

function getRecordById({ tableName, columnName = "id", id }) {
  const db = getDatabase();
  return db
    .prepare(`SELECT * FROM ${tableName} WHERE ${columnName} = ?`)
    .get(id);
}

/* ==================================================
 * INSERT DATA
 * ==================================================
 */

function insertRecord({ tableName, data }) {
  const db = getDatabase();
  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = columns.map(() => "?").join(", ");
  return db
    .prepare(
      `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`,
    )
    .get(...values);
}

/* ==================================================
 * UPSERT DATA
 * ==================================================
 */

function upsertRecord({ tableName, data, conflictColumn }) {
  const db = getDatabase();
  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = columns.map(() => "?").join(", ");
  const setClause = columns
    .filter((c) => c !== conflictColumn)
    .map((c) => `${c} = excluded.${c}`)
    .join(", ");
  return db
    .prepare(
      `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders})
       ON CONFLICT(${conflictColumn}) DO UPDATE SET ${setClause}
       RETURNING *`,
    )
    .get(...values);
}

/* ==================================================
 * BATCH INSERT
 * ==================================================
 */

function batchInsert({ tableName, dataArray }) {
  const db = getDatabase();
  const insert = db.transaction((rows) =>
    rows.map((data) => insertRecord({ tableName, data })),
  );
  return insert(dataArray);
}

/* ==================================================
 * UPDATE DATA
 * ==================================================
 */

function updateRecord({ tableName, data, columnName = "id", id }) {
  const db = getDatabase();
  const columns = Object.keys(data);
  const values = Object.values(data);
  const setClause = columns.map((c) => `${c} = ?`).join(", ");
  return db
    .prepare(
      `UPDATE ${tableName} SET ${setClause} WHERE ${columnName} = ? RETURNING *`,
    )
    .get(...values, id);
}

/* ==================================================
 * BATCH UPDATE
 * ==================================================
 */

function batchUpdate({ tableName, dataArray, columnName = "id" }) {
  const db = getDatabase();
  const update = db.transaction((rows) =>
    rows.map(({ [columnName]: id, ...data }) =>
      updateRecord({ tableName, data, columnName, id }),
    ),
  );
  return update(dataArray);
}

/* ==================================================
 * DELETE DATA
 * ==================================================
 */

function deleteRecord({ tableName, columnName = "id", data }) {
  const db = getDatabase();
  const idsList = Array.isArray(data) ? data : [data];
  const placeholders = idsList.map(() => "?").join(", ");
  return db
    .prepare(
      `DELETE FROM ${tableName} WHERE ${columnName} IN (${placeholders}) RETURNING *`,
    )
    .all(...idsList);
}

/* ==================================================
 * EXPORTS
 * ==================================================
 */

module.exports = {
  // CRUD
  getRecords,
  getRecordById,
  getPaginatedRecords,
  insertRecord,
  upsertRecord,
  batchInsert,
  updateRecord,
  batchUpdate,
  deleteRecord,
  countRecords,
  // Utility
  mergeRecords,
  moveRecords,
};
