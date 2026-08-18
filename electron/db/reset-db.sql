DROP TABLE IF EXISTS spesely_secondary_categories;
DROP TABLE IF EXISTS spesely_primary_categories;
DROP TABLE IF EXISTS spesely_transactions;

DROP INDEX IF EXISTS index_primary_categories;
DROP INDEX IF EXISTS index_secondary_categories;
DROP INDEX IF EXISTS index_transactions;
DROP INDEX IF EXISTS index_transactions_primary_category_id;
DROP INDEX IF EXISTS index_transactions_secondary_category_id;
DROP INDEX IF EXISTS index_transactions_date;