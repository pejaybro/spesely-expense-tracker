import { mutationOptions, type QueryClient } from "@tanstack/react-query";
import { toast } from "@/src/components/base";
import type {
  SpeselyPrimaryCategory,
  SpeselySecondaryCategory,
} from "@/types/db/interface/spesely.interface";
import type { PrimaryCategory } from "@/src/pages/settings/components/category-settings/types";
import { CategoryKeys } from "./keys";
import { CategoryService } from "./services";

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

export const CategoryMutations = {
  // ── Primary Category Mutations ──────────────────────────────────────────
  createPrimary: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (data: Partial<SpeselyPrimaryCategory>) =>
        CategoryService.createPrimary(data),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: CategoryKeys.all });
        toast.success("Primary category created successfully");
      },
      onError: async (err: unknown) => {
        // Revert by re-syncing from DB
        await queryClient.invalidateQueries({ queryKey: CategoryKeys.all });
        const errorMsg = getErrorMessage(err, "Failed to create category");
        console.error("[CategoryMutations.createPrimary] Backend error:", err);
        toast.error(errorMsg);
      },
    }),

  updatePrimary: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: ({
        publicId,
        data,
      }: {
        publicId: string;
        data: Partial<SpeselyPrimaryCategory>;
      }) => CategoryService.updatePrimary(publicId, data),
      onSuccess: async (_result, variables) => {
        await queryClient.invalidateQueries({ queryKey: CategoryKeys.all });
        if (variables.data.color) {
          toast.success("Category color updated");
        }
      },
      onError: async (err: unknown) => {
        // Revert by re-syncing from DB
        await queryClient.invalidateQueries({ queryKey: CategoryKeys.all });
        const errorMsg = getErrorMessage(err, "Failed to update category");
        console.error("[CategoryMutations.updatePrimary] Backend error:", err);
        toast.error(errorMsg);
      },
    }),

  deletePrimary: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: ({
        publicId,
        transactionCount = 0,
      }: {
        publicId: string;
        transactionCount?: number;
      }) => CategoryService.deletePrimary(publicId, transactionCount),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: CategoryKeys.all });
        toast.success("Category deleted");
      },
      onError: async (err: unknown) => {
        // Revert by re-syncing from DB
        await queryClient.invalidateQueries({ queryKey: CategoryKeys.all });
        const errorMsg = getErrorMessage(err, "Failed to delete category");
        console.error("[CategoryMutations.deletePrimary] Backend error:", err);
        toast.error(errorMsg);
      },
    }),

  // ── Secondary Category Mutations ────────────────────────────────────────
  createSecondary: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (data: Partial<SpeselySecondaryCategory>) =>
        CategoryService.createSecondary(data),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: CategoryKeys.all });
        toast.success("Sub-category added");
      },
      onError: async (err: unknown) => {
        // Revert by re-syncing from DB
        await queryClient.invalidateQueries({ queryKey: CategoryKeys.all });
        const errorMsg = getErrorMessage(err, "Failed to create sub-category");
        console.error("[CategoryMutations.createSecondary] Backend error:", err);
        toast.error(errorMsg);
      },
    }),

  updateSecondary: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: ({
        publicId,
        data,
      }: {
        publicId: string;
        data: Partial<SpeselySecondaryCategory>;
      }) => CategoryService.updateSecondary(publicId, data),
      onSuccess: async (_result, variables) => {
        await queryClient.invalidateQueries({ queryKey: CategoryKeys.all });
        if (variables.data.color) {
          toast.success("Sub-category color updated");
        }
      },
      onError: async (err: unknown) => {
        // Revert by re-syncing from DB
        await queryClient.invalidateQueries({ queryKey: CategoryKeys.all });
        const errorMsg = getErrorMessage(err, "Failed to update sub-category");
        console.error("[CategoryMutations.updateSecondary] Backend error:", err);
        toast.error(errorMsg);
      },
    }),

  deleteSecondary: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: ({
        publicId,
        transactionCount = 0,
      }: {
        publicId: string;
        transactionCount?: number;
      }) => CategoryService.deleteSecondary(publicId, transactionCount),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: CategoryKeys.all });
        toast.success("Sub-category deleted");
      },
      onError: async (err: unknown) => {
        // Revert by re-syncing from DB
        await queryClient.invalidateQueries({ queryKey: CategoryKeys.all });
        const errorMsg = getErrorMessage(err, "Failed to delete sub-category");
        console.error("[CategoryMutations.deleteSecondary] Backend error:", err);
        toast.error(errorMsg);
      },
    }),

  // ── Batch Save Mutation ──────────────────────────────────────────────────
  batchSave: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (categories: PrimaryCategory[]) =>
        CategoryService.batchSave(categories),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: CategoryKeys.all });
        toast.success("All category changes saved successfully");
      },
      onError: async (err: unknown) => {
        // Revert by re-syncing from DB
        await queryClient.invalidateQueries({ queryKey: CategoryKeys.all });
        const errorMsg = getErrorMessage(err, "Failed to save category changes");
        console.error("[CategoryMutations.batchSave] Backend error:", err);
        toast.error(errorMsg);
      },
    }),
};
