CREATE TABLE IF NOT EXISTS spesely_primary_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    public_id TEXT UNIQUE DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL,
    color TEXT,
    is_expense BOOLEAN DEFAULT 1 CHECK(is_expense IN (0, 1)),
    status BOOLEAN DEFAULT 1 CHECK(status IN (0, 1)),
    is_deleted BOOLEAN DEFAULT 0 CHECK(is_deleted IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS spesely_secondary_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    public_id TEXT UNIQUE DEFAULT (lower(hex(randomblob(16)))),
    primary_category_id TEXT NOT NULL,
    name TEXT NOT NULL,
    color TEXT,
    is_expense BOOLEAN DEFAULT 1 CHECK(is_expense IN (0, 1)),
    status BOOLEAN DEFAULT 1 CHECK(status IN (0, 1)),
    is_deleted BOOLEAN DEFAULT 0 CHECK(is_deleted IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (primary_category_id) REFERENCES spesely_primary_categories(public_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS spesely_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    public_id TEXT UNIQUE DEFAULT (lower(hex(randomblob(16)))),
    amount REAL NOT NULL,
    note TEXT,
    primary_category_id TEXT NOT NULL,
    secondary_category_id TEXT,
    date TEXT NOT NULL,
    is_expense BOOLEAN NOT NULL CHECK(is_expense IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (primary_category_id) REFERENCES spesely_primary_categories(public_id) ON DELETE RESTRICT,
    FOREIGN KEY (secondary_category_id) REFERENCES spesely_secondary_categories(public_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS index_primary_categories
ON spesely_primary_categories (is_expense, status, is_deleted);

CREATE INDEX IF NOT EXISTS index_secondary_categories
ON spesely_secondary_categories (primary_category_id);

CREATE INDEX IF NOT EXISTS index_transactions
ON spesely_transactions (is_expense, date);

CREATE INDEX IF NOT EXISTS index_transactions_primary_category_id 
ON spesely_transactions (primary_category_id);

CREATE INDEX IF NOT EXISTS index_transactions_secondary_category_id 
ON spesely_transactions (secondary_category_id);

CREATE INDEX IF NOT EXISTS index_transactions_date 
ON spesely_transactions (date);
