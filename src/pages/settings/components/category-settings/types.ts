// ============================================================================
// Shared Types for Category Settings
// ============================================================================

export interface SecondaryCategory {
  id: string; // public_id
  name: string;
  color: string;
  is_expense?: number; // 1 = Expense, 0 = Income
  is_deleted?: number; // 1 = Archived, 0 = Active
  transaction_count?: number;
  isNew?: boolean;
}

export interface PrimaryCategory {
  id: string; // public_id
  name: string;
  color: string;
  is_expense?: number; // 1 = Expense, 0 = Income
  is_deleted?: number; // 1 = Archived, 0 = Active
  transaction_count?: number;
  secondaryCategories: SecondaryCategory[];
  isNew?: boolean;
}

export interface ActiveColorTarget {
  primaryId: string;
  secondaryId?: string;
  currentColor: string;
}
