import { electronClient } from "../../client";
import type { SpeselyTransaction } from "@/types/db/interface/spesely.interface";

export const TransactionService = {
  getAll: async (): Promise<SpeselyTransaction[]> => {
    return electronClient.transaction.getAll();
  },

  getTop10: async (isExpense: number): Promise<SpeselyTransaction[]> => {
    return electronClient.transaction.getTop10(isExpense);
  },

  create: async (
    transaction: Partial<SpeselyTransaction>
  ): Promise<SpeselyTransaction> => {
    return electronClient.transaction.create(transaction);
  },

  delete: async (publicId: string): Promise<boolean> => {
    return electronClient.transaction.delete(publicId);
  },
};
