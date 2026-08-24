/* ==================================================
 * FILTER BUILDER HELPERS
 * ==================================================
 */

/**
 * Builds a BETWEEN range filter for numeric/date columns.
 * @param {{ rangeFilters: {columnName: string, rangeStart: any, rangeEnd: any}[], allowedColumns: string[] }}
 * @returns {{ conditions: string[], params: any[] }}
 */
function buildRangeFilter({ rangeFilters, allowedColumns }) {
  const conditions = [];
  const params = [];

  for (const filter of rangeFilters) {
    if (!allowedColumns.includes(filter.columnName)) continue;
    if (filter.rangeStart && filter.rangeEnd) {
      conditions.push(`${filter.columnName} BETWEEN ? AND ?`);
      params.push(filter.rangeStart, filter.rangeEnd);
    }
  }
  return { conditions, params };
}

/**
 * Builds a LIKE search filter across multiple columns.
 * Only searches columns that exist in allowedColumns.
 * @param {{ searchColumns: string[], search: string, allowedColumns: string[] }}
 * @returns {{ conditions: string[], params: any[] }}
 */
function buildSearchFilter({ searchColumns, search, allowedColumns }) {
  const conditions = [];
  const params = [];

  const safeSearchColumns = allowedColumns.length
    ? searchColumns.filter((col) => allowedColumns.includes(col))
    : searchColumns;

  if (search?.trim() && safeSearchColumns.length) {
    const searchConditions = safeSearchColumns.map(
      (column) => `CAST(${column} AS TEXT) LIKE ?`,
    );
    conditions.push(`(${searchConditions.join(" OR ")})`);
    const searchValue = `%${search.trim()}%`;
    params.push(...safeSearchColumns.map(() => searchValue));
  }
  return { conditions, params };
}

/**
 * Builds an IN (value list) filter for exact matches.
 * @param {{ valueFilters: {columnName: string, values: any[]}[], allowedColumns: string[] }}
 * @returns {{ conditions: string[], params: any[] }}
 */
function buildValueFilter({ valueFilters, allowedColumns }) {
  const conditions = [];
  const params = [];

  for (const filter of valueFilters) {
    if (!allowedColumns.includes(filter.columnName)) continue;
    const values = Array.isArray(filter.values)
      ? filter.values
      : [filter.values];
    if (!values.length) continue;
    const placeholders = values.map(() => "?").join(", ");
    conditions.push(`${filter.columnName} IN (${placeholders})`);
    params.push(...values);
  }
  return { conditions, params };
}

/**
 * Joins an array of SQL conditions into a WHERE clause string.
 * Returns an empty string if there are no conditions.
 * @param {{ conditions: string[] }}
 * @returns {string}
 */
function buildWhereClause({ conditions }) {
  return conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
}

/**
 * Returns safe, whitelist-validated sort column and direction.
 * @param {{ sortBy: string, sortOrder: string, allowedColumns: string[] }}
 * @returns {{ safeSortBy: string, safeSortOrder: "ASC" | "DESC" }}
 */
function buildSortClause({ sortBy, sortOrder, allowedColumns }) {
  const safeSortBy = allowedColumns.includes(sortBy) ? sortBy : "id";
  const safeSortOrder =
    sortOrder && sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";
  return { safeSortBy, safeSortOrder };
}

/* ==================================================
 * EXPORTS
 * ==================================================
 */

module.exports = {
  buildRangeFilter,
  buildSearchFilter,
  buildValueFilter,
  buildWhereClause,
  buildSortClause,
};
