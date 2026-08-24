import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryQueries } from "./queries";
import { CategoryMutations } from "./mutations";

// ============================================================================
// Category Query Hooks (Isolated & Independent)
// ============================================================================

/** Fetches full hierarchical tree: Primary categories with nested sub-categories */
export const useCategoriesTree = () => {
  return useQuery(CategoryQueries.tree());
};

/** Fetches only primary categories (zero sub-categories queried) */
export const usePrimaryCategories = () => {
  return useQuery(CategoryQueries.primaryList());
};

/** Fetches all secondary categories across the entire database */
export const useAllSecondaryCategories = () => {
  return useQuery(CategoryQueries.secondaryList());
};

/** Fetches sub-categories for a specific parent primary category */
export const useSecondaryCategories = (primaryPublicId?: string | null) => {
  return useQuery(CategoryQueries.secondaryByPrimary(primaryPublicId));
};

// ============================================================================
// Category Mutation Hooks (Auto-Toast & Cache Invalidation)
// ============================================================================

export const useCreatePrimaryCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(CategoryMutations.createPrimary(queryClient));
};

export const useUpdatePrimaryCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(CategoryMutations.updatePrimary(queryClient));
};

export const useDeletePrimaryCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(CategoryMutations.deletePrimary(queryClient));
};

export const useCreateSecondaryCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(CategoryMutations.createSecondary(queryClient));
};

export const useUpdateSecondaryCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(CategoryMutations.updateSecondary(queryClient));
};

export const useDeleteSecondaryCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(CategoryMutations.deleteSecondary(queryClient));
};

export const useBatchSaveCategories = () => {
  const queryClient = useQueryClient();
  return useMutation(CategoryMutations.batchSave(queryClient));
};
