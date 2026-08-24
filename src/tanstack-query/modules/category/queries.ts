import { queryOptions, keepPreviousData } from "@tanstack/react-query";
import { CategoryKeys } from "./keys";
import { CategoryService } from "./services";
import { CategoryMappers } from "./mappers";

export const CategoryQueries = {
  tree: () =>
    queryOptions({
      queryKey: CategoryKeys.treeList(),
      queryFn: CategoryService.getCategoryTree,
      placeholderData: keepPreviousData,
    }),

  primaryList: () =>
    queryOptions({
      queryKey: CategoryKeys.primaryList(),
      queryFn: CategoryService.getAllPrimary,
      select: CategoryMappers.toPrimaryList,
      placeholderData: keepPreviousData,
    }),

  secondaryList: () =>
    queryOptions({
      queryKey: CategoryKeys.secondaryList(),
      queryFn: CategoryService.getAllSecondary,
      select: CategoryMappers.toSecondaryList,
      placeholderData: keepPreviousData,
    }),

  secondaryByPrimary: (primaryPublicId?: string | null) =>
    queryOptions({
      queryKey: CategoryKeys.secondaryByPrimary(primaryPublicId ?? ""),
      queryFn: () => CategoryService.getByPrimaryId(primaryPublicId!),
      select: CategoryMappers.toSecondaryList,
      enabled: !!primaryPublicId,
    }),
};
