import { queryOptions, keepPreviousData } from "@tanstack/react-query";
import { TransactionKeys } from "./keys";
import { TransactionService } from "./services";

export const TransactionQueries = {
  list: () =>
    queryOptions({
      queryKey: TransactionKeys.list(),
      queryFn: TransactionService.getAll,
      placeholderData: keepPreviousData,
    }),

  top10: (isExpense: number = 1) =>
    queryOptions({
      queryKey: TransactionKeys.top10(isExpense),
      queryFn: () => TransactionService.getTop10(isExpense),
      placeholderData: keepPreviousData,
    }),
};
