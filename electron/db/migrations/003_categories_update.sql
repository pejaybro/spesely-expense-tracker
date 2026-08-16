-- Migration 003: Add transaction_count column to primary and secondary categories tables

ALTER TABLE spesely_primary_categories ADD COLUMN transaction_count INTEGER DEFAULT 0;

ALTER TABLE spesely_secondary_categories ADD COLUMN transaction_count INTEGER DEFAULT 0;
