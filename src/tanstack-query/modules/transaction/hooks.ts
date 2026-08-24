import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TransactionQueries } from "./queries";
import { TransactionMutations } from "./mutations";

// ============================================================================
// Transaction Query Hooks
// ============================================================================

export const useTransactions = () => {
  return useQuery(TransactionQueries.list());
};

export const useTop10Transactions = (isExpense: number = 1) => {
  return useQuery(TransactionQueries.top10(isExpense));
};

// ============================================================================
// Transaction Mutation Hooks
// ============================================================================

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation(TransactionMutations.create(queryClient));
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation(TransactionMutations.delete(queryClient));
};
