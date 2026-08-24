import { mutationOptions, type QueryClient } from "@tanstack/react-query";
import { toast } from "@/src/components/base";
import type { SpeselyTransaction } from "@/types/db/interface/spesely.interface";
import { TransactionKeys } from "./keys";
import { TransactionService } from "./services";

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) {
    const cleaned = err.message
      .replace(/^Error invoking remote method '.*?':\s*/i, "")
      .replace(/^Error:\s*/i, "")
      .trim();
    return cleaned || fallback;
  }
  return fallback;
}

export const TransactionMutations = {
  create: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (data: Partial<SpeselyTransaction>) =>
        TransactionService.create(data),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: TransactionKeys.all });
        toast.success("Transaction created successfully");
      },
      onError: (err: unknown) => {
        const errorMsg = getErrorMessage(err, "Failed to create transaction");
        console.error("[TransactionMutations.create] Backend error:", err);
        toast.error(errorMsg);
      },
    }),

  delete: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (publicId: string) => TransactionService.delete(publicId),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: TransactionKeys.all });
        toast.success("Transaction deleted");
      },
      onError: (err: unknown) => {
        const errorMsg = getErrorMessage(err, "Failed to delete transaction");
        console.error("[TransactionMutations.delete] Backend error:", err);
        toast.error(errorMsg);
      },
    }),
};
