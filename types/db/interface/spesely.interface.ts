export interface SpeselyPrimaryCategory {
  id: number;
  public_id: string;
  name: string;
  color?: string;
  is_expense: number; // 1 or 0
  status: number;     // 1 or 0
  is_deleted: number; // 1 or 0
  transaction_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SpeselySecondaryCategory {
  id: number;
  public_id: string;
  primary_category_id: string;
  name: string;
  color?: string;
  is_expense: number;
  status: number;
  is_deleted: number;
  transaction_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SpeselyTransaction {
  id: number;
  public_id: string;
  amount: number;
  note?: string;
  primary_category_id: string;
  secondary_category_id?: string;
  date: string;
  is_expense: number;
  created_at?: string;
  updated_at?: string;
  // Joined fields for display
  primary_category_name?: string;
  secondary_category_name?: string;
}

export interface PrimaryCategoryAPI {
  getAll: () => Promise<SpeselyPrimaryCategory[]>;
  create: (category: Partial<SpeselyPrimaryCategory>) => Promise<SpeselyPrimaryCategory>;
  update: (public_id: string, category: Partial<SpeselyPrimaryCategory>) => Promise<SpeselyPrimaryCategory>;
  toggleStatus: (public_id: string) => Promise<boolean>;
  softDelete: (public_id: string) => Promise<boolean>;
  delete: (public_id: string) => Promise<boolean>;
}

export interface SecondaryCategoryAPI {
  getAll: () => Promise<SpeselySecondaryCategory[]>;
  getByPrimaryId: (primary_public_id: string) => Promise<SpeselySecondaryCategory[]>;
  create: (category: Partial<SpeselySecondaryCategory>) => Promise<SpeselySecondaryCategory>;
  update: (public_id: string, category: Partial<SpeselySecondaryCategory>) => Promise<SpeselySecondaryCategory>;
  toggleStatus: (public_id: string) => Promise<boolean>;
  softDelete: (public_id: string) => Promise<boolean>;
  delete: (public_id: string) => Promise<boolean>;
}

export interface TransactionAPI {
  getAll: () => Promise<SpeselyTransaction[]>;
  getTop10: (is_expense: number) => Promise<SpeselyTransaction[]>;
  create: (transaction: Partial<SpeselyTransaction>) => Promise<SpeselyTransaction>;
  delete: (public_id: string) => Promise<boolean>;
}
