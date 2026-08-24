export const CategoryKeys = {
  all: ["categories"] as const,
  treeList: () => [...CategoryKeys.all, "tree"] as const,
  primaryList: () => [...CategoryKeys.all, "primary", "list"] as const,
  primaryDetail: (publicId: string) =>
    [...CategoryKeys.all, "primary", "detail", publicId] as const,
  secondaryList: () => [...CategoryKeys.all, "secondary", "list"] as const,
  secondaryByPrimary: (primaryPublicId: string) =>
    [...CategoryKeys.all, "secondary", "by-primary", primaryPublicId] as const,
};
