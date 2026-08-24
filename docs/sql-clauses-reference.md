# Complete SQL Clauses & Expressions Reference Guide

This reference document outlines all essential SQL clauses, operators, and expressions — including those actively used in this project's repositories (`base.cjs`, `transaction.repository.cjs`, `primaryCategory.repository.cjs`) as well as advanced clauses for future analytics and reporting.

---

## 📑 Table of Contents

1. [Logical Order of Execution (`SELECT`)](#1-logical-order-of-execution-select)
2. [Data Query Clauses (`SELECT`)](#2-data-query-clauses-select)
   - [`SELECT` & `DISTINCT`](#select--distinct)
   - [`FROM` & Table Aliasing](#from--table-aliasing)
   - [`JOIN` (`LEFT`, `INNER`, `CROSS`)](#join-clauses)
   - [`WHERE`](#where-clause)
   - [`GROUP BY`](#group-by-clause)
   - [`HAVING`](#having-clause)
   - [`ORDER BY`](#order-by-clause)
   - [`LIMIT` & `OFFSET` (Pagination)](#limit--offset-pagination)
3. [Data Manipulation Clauses (`INSERT`, `UPDATE`, `DELETE`)](#3-data-manipulation-clauses)
   - [`INSERT INTO ... VALUES`](#insert-into--values)
   - [`UPDATE ... SET`](#update--set)
   - [`DELETE FROM`](#delete-from)
   - [`RETURNING *`](#returning-)
   - [`ON CONFLICT(...) DO UPDATE` (Upsert)](#on-conflict-upsert)
4. [Filtering & Comparison Operators](#4-filtering--comparison-operators)
   - [`IN (...)` & `NOT IN (...)`](#in--not-in)
   - [`LIKE` (Full-Text / Pattern Matching)](#like-pattern-matching)
   - [`BETWEEN ... AND ...` / Range Filters](#between--range-filters)
   - [`IS NULL` & `IS NOT NULL`](#is-null--is-not-null)
5. [Conditional & Fallback Expressions](#5-conditional--fallback-expressions)
   - [`CASE WHEN ... THEN ... ELSE ... END`](#case-when-conditional)
   - [`COALESCE(a, b, ...)`](#coalesce)
6. [Set Operations & CTEs](#6-set-operations--ctes)
   - [`UNION` & `UNION ALL`](#union--union-all)
   - [`WITH` (Common Table Expressions / CTEs)](#with-common-table-expressions)
   - [`WINDOW FUNCTIONS` (`OVER()`)](#window-functions-over)

---

## 1. Logical Order of Execution (`SELECT`)

When SQLite / SQL engines execute a query, they follow this exact evaluation pipeline:

```text
┌───────────────────────────────────────────────────────────┐
│ 1. FROM & JOIN     → Identifies source tables & joins     │
│ 2. WHERE           → Filters raw rows                     │
│ 3. GROUP BY        → Aggregates rows into buckets         │
│ 4. HAVING          → Filters aggregated buckets           │
│ 5. SELECT          → Computes columns, aliases & formulas │
│ 6. DISTINCT        → Removes duplicate output rows        │
│ 7. ORDER BY        → Sorts final output rows              │
│ 8. LIMIT & OFFSET  → Slices the page                      │
└───────────────────────────────────────────────────────────┘
```

---

## 2. Data Query Clauses (`SELECT`)

### `SELECT` & `DISTINCT`

- **`SELECT`**: Specifies the columns, expressions, or aggregates to return.
- **`DISTINCT`**: Eliminates duplicate rows from the result set.

```sql
-- All columns
SELECT * FROM spesely_transactions;

-- Specific columns with aliases
SELECT amount, note AS description FROM spesely_transactions;

-- Distinct values only
SELECT DISTINCT primary_category_id FROM spesely_transactions;
```

---

### `FROM` & Table Aliasing

Specifies the table(s) from which data is retrieved and assigns short aliases.

```sql
-- "t" is an alias for spesely_transactions
SELECT t.id, t.amount
FROM spesely_transactions t;
```

---

### `JOIN` Clauses

Combines rows from two or more tables based on a related column.

#### **`LEFT JOIN`** _(Used in `transaction.repository.cjs`)_

Returns **all** rows from the left table, plus matched columns from the right table (or `NULL` if no match).

```sql
SELECT t.*,
       pc.name AS primary_category_name,
       sc.name AS secondary_category_name
FROM spesely_transactions t
LEFT JOIN spesely_primary_categories pc ON t.primary_category_id = pc.public_id
LEFT JOIN spesely_secondary_categories sc ON t.secondary_category_id = sc.public_id;
```

#### **`INNER JOIN`**

Returns only rows that have a match in **both** tables.

```sql
SELECT t.amount, pc.name
FROM spesely_transactions t
INNER JOIN spesely_primary_categories pc ON t.primary_category_id = pc.public_id;
```

---

### `WHERE` Clause

Filters rows **before** grouping or sorting based on boolean conditions (`=`, `!=`, `<`, `>`, `AND`, `OR`, `IN`, `LIKE`).

```sql
SELECT * FROM spesely_transactions
WHERE is_deleted = 0
  AND is_expense = 1
  AND amount >= 100;
```

---

### `GROUP BY` Clause

Groups rows sharing common values into summary rows (used with `COUNT()`, `SUM()`, `AVG()`, `MIN()`, `MAX()`).

```sql
-- Calculate total spent per category
SELECT primary_category_id,
       COUNT(*) AS total_transactions,
       SUM(amount) AS total_spent
FROM spesely_transactions
WHERE is_expense = 1
GROUP BY primary_category_id;
```

---

### `HAVING` Clause

Filters groups created by `GROUP BY`.

> 💡 **`WHERE` vs `HAVING`**:
>
> - `WHERE` filters rows **before** `GROUP BY` (cannot use aggregate functions like `SUM()`).
> - `HAVING` filters aggregated buckets **after** `GROUP BY`.

```sql
-- Only show categories where total spending exceeded 5000
SELECT primary_category_id, SUM(amount) AS total_spent
FROM spesely_transactions
WHERE is_expense = 1
GROUP BY primary_category_id
HAVING SUM(amount) > 5000;
```

---

### `ORDER BY` Clause

Sorts the output rows by one or more columns in ascending (`ASC`, default) or descending (`DESC`) order.

```sql
-- Sort by transaction date newest first, then by amount highest first
SELECT * FROM spesely_transactions
ORDER BY date DESC, amount DESC;
```

---

### `LIMIT` & `OFFSET` (Pagination)

Controls the number of rows returned and where to start reading.

```sql
-- Page 1 (first 10 records)
SELECT * FROM spesely_transactions ORDER BY id DESC LIMIT 10 OFFSET 0;

-- Page 2 (records 11 to 20)
SELECT * FROM spesely_transactions ORDER BY id DESC LIMIT 10 OFFSET 10;
```

---

## 3. Data Manipulation Clauses

### `INSERT INTO ... VALUES`

Inserts new records into a table.

```sql
INSERT INTO spesely_primary_categories (name, color, is_expense)
VALUES ('Groceries', '#3b82f6', 1);
```

---

### `UPDATE ... SET`

Modifies existing records matching a `WHERE` condition.

```sql
UPDATE spesely_primary_categories
SET name = 'Food & Drinks',
    updated_at = 1724517000000
WHERE public_id = 'cat_123';
```

---

### `DELETE FROM`

Deletes rows from a table matching a `WHERE` condition.

```sql
-- Delete single record
DELETE FROM spesely_transactions WHERE public_id = 'tx_123';

-- Bulk delete multiple IDs
DELETE FROM spesely_transactions WHERE public_id IN ('tx_1', 'tx_2', 'tx_3');
```

---

### `RETURNING *`

Returns the inserted, updated, or deleted rows directly from the operation in a single step (avoiding an extra `SELECT` query).

```sql
-- Insert and immediately get the created record
INSERT INTO spesely_transactions (amount, note, date)
VALUES (500, 'Dinner', 1724517000000)
RETURNING *;

-- Delete and get the records that were removed
DELETE FROM spesely_transactions
WHERE public_id IN ('tx_1', 'tx_2')
RETURNING *;
```

---

### `ON CONFLICT(...)` (Upsert)

Performs an **Insert OR Update** in one atomic statement.

```sql
INSERT INTO spesely_primary_categories (public_id, name, color)
VALUES ('cat_123', 'Shopping', '#ec4899')
ON CONFLICT(public_id) DO UPDATE SET
  name = excluded.name,
  color = excluded.color,
  updated_at = (unixepoch() * 1000)
RETURNING *;
```

---

## 4. Filtering & Comparison Operators

### `IN (...)` & `NOT IN (...)`

Matches against a list of values.

```sql
SELECT * FROM spesely_transactions
WHERE primary_category_id IN ('cat_1', 'cat_2', 'cat_3');
```

---

### `LIKE` (Pattern Matching)

Performs wildcard search on text.

- `%` matches 0 or more characters.
- `_` matches exactly 1 character.

```sql
-- Search for notes containing 'uber' (case-insensitive in SQLite by default for ASCII)
SELECT * FROM spesely_transactions
WHERE note LIKE '%uber%';
```

---

### `BETWEEN ... AND ...` / Range Filters

Matches values within an inclusive range (numbers or timestamps).

```sql
-- Filter transactions within a timestamp range
SELECT * FROM spesely_transactions
WHERE date BETWEEN 1704067200000 AND 1706745600000;
-- Equivalent to: date >= 1704067200000 AND date <= 1706745600000
```

---

### `IS NULL` & `IS NOT NULL`

Checks for the presence or absence of `NULL` values.

```sql
-- Find transactions without a secondary category assigned
SELECT * FROM spesely_transactions
WHERE secondary_category_id IS NULL;
```

---

## 5. Conditional & Fallback Expressions

### `CASE WHEN` (Conditional Logic)

Inline `if/else` logic in SQL queries.

```sql
-- Toggle boolean / binary status
UPDATE spesely_primary_categories
SET status = CASE WHEN status = 1 THEN 0 ELSE 1 END,
    updated_at = 1724517000000
WHERE public_id = 'cat_123';

-- Map numbers to labels in queries
SELECT amount,
       CASE
         WHEN is_expense = 1 THEN 'Expense'
         ELSE 'Income'
       END AS transaction_type
FROM spesely_transactions;
```

---

### `COALESCE`

Returns the first non-`NULL` argument.

```sql
-- Fallback note if note is NULL
SELECT amount, COALESCE(note, 'No description') AS note
FROM spesely_transactions;
```

---

## 6. Set Operations & CTEs

### `UNION` & `UNION ALL`

Combines results of two or more `SELECT` statements into one.

- `UNION`: Removes duplicates.
- `UNION ALL`: Preserves all rows (faster).

```sql
SELECT name, 'primary' AS type FROM spesely_primary_categories WHERE is_deleted = 0
UNION ALL
SELECT name, 'secondary' AS type FROM spesely_secondary_categories WHERE is_deleted = 0;
```

---

### `WITH` (Common Table Expressions / CTEs)

Defines temporary named result sets to structure complex queries cleanly.

```sql
WITH MonthlyExpenses AS (
  SELECT primary_category_id, SUM(amount) AS total_spent
  FROM spesely_transactions
  WHERE date >= 1704067200000 AND is_expense = 1
  GROUP BY primary_category_id
)
SELECT me.*, pc.name
FROM MonthlyExpenses me
JOIN spesely_primary_categories pc ON me.primary_category_id = pc.public_id
WHERE me.total_spent > 10000;
```

---

### Window Functions (`OVER()`)

Computes aggregate or ranking values across a subset of rows without collapsing them into a single summary row.

```sql
-- Returns running total along with each transaction
SELECT id, amount, date,
       SUM(amount) OVER (ORDER BY date ASC) AS running_total
FROM spesely_transactions;
```
