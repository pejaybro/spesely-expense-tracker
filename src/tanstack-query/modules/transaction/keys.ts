export const TransactionKeys = {
  all: ["transactions"] as const,
  list: () => [...TransactionKeys.all, "list"] as const,
  top10: (isExpense: number) =>
    [...TransactionKeys.all, "top10", isExpense] as const,
};
