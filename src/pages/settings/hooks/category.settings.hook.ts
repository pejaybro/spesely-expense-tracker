import { useState, useEffect, useMemo } from "react";
import {
  useCategoriesTree,
  useCreatePrimaryCategory,
  useUpdatePrimaryCategory,
  useDeletePrimaryCategory,
  useCreateSecondaryCategory,
  useUpdateSecondaryCategory,
  useDeleteSecondaryCategory,
} from "@/src/tanstack-query/modules/category";
import { toast } from "@/src/components/base";
import type {
  PrimaryCategory,
  ActiveColorTarget,
} from "../components/category-settings/types";

// ============================================================================
// useCategoriesSettings — Auto-Save UX with Expense/Income/Archived Segment Support
// ============================================================================

export type CategoryType = "expense" | "income" | "archived";

// Mock dummy categories for Archived UI preview
const INITIAL_ARCHIVED_CATEGORIES: PrimaryCategory[] = [
  {
    id: "archived-1",
    name: "Legacy Subscriptions",
    color: "#F59E0B",
    is_expense: 1,
    is_deleted: 1,
    transaction_count: 14,
    secondaryCategories: [
      {
        id: "archived-sec-1",
        name: "Old Streaming Service",
        color: "#F59E0B",
        is_expense: 1,
        is_deleted: 1,
        transaction_count: 8,
      },
      {
        id: "archived-sec-2",
        name: "Vintage Magazine Club",
        color: "#FBBF24",
        is_expense: 1,
        is_deleted: 1,
        transaction_count: 6,
      },
    ],
  },
  {
    id: "archived-2",
    name: "Closed Side-Hustle Project",
    color: "#8B5CF6",
    is_expense: 0,
    is_deleted: 1,
    transaction_count: 9,
    secondaryCategories: [
      {
        id: "archived-sec-3",
        name: "Freelance Consulting (2023)",
        color: "#8B5CF6",
        is_expense: 0,
        is_deleted: 1,
        transaction_count: 9,
      },
    ],
  },
];

export const useCategoriesSettings = () => {
  const [categories, setCategories] = useState<PrimaryCategory[]>([]);
  const [categoryType, setCategoryType] = useState<CategoryType>("expense");
  const [colorTarget, setColorTarget] = useState<ActiveColorTarget | null>(null);

  // ── 1. Query Data (Hierarchy Tree from SQLite) ───────────────────────────
  const { data: treeData, isLoading: loading } = useCategoriesTree();

  // Sync local state whenever database queries refresh
  useEffect(() => {
    if (treeData && treeData.length > 0) {
      // Merge dummy archived categories if DB has none for preview
      const hasArchivedInDb = treeData.some((c) => c.is_deleted === 1 || c.secondaryCategories.some((s) => s.is_deleted === 1));
      if (!hasArchivedInDb) {
        setCategories([...treeData, ...INITIAL_ARCHIVED_CATEGORIES]);
      } else {
        setCategories(treeData);
      }
    } else {
      setCategories(INITIAL_ARCHIVED_CATEGORIES);
    }
  }, [treeData]);

  // ── 2. Filtered list and counts by type ──────────────────────────────────
  const expenseCount = useMemo(
    () => categories.filter((c) => c.is_expense !== 0 && c.is_deleted !== 1).length,
    [categories]
  );

  const incomeCount = useMemo(
    () => categories.filter((c) => c.is_expense === 0 && c.is_deleted !== 1).length,
    [categories]
  );

  // An archived primary category is visible in Archive tab if:
  // - The primary category itself is archived (is_deleted === 1)
  // - OR it has at least one sub-category that is still archived (is_deleted === 1)
  const archivedCategories = useMemo(() => {
    return categories
      .filter((c) => c.is_deleted === 1 || c.secondaryCategories.some((s) => s.is_deleted === 1))
      .map((c) => {
        // If primary is restored but in archive tab, only show its archived sub-categories
        if (c.is_deleted === 0) {
          return {
            ...c,
            secondaryCategories: c.secondaryCategories.filter((s) => s.is_deleted === 1),
          };
        }
        return c;
      });
  }, [categories]);

  const archivedCount = useMemo(() => archivedCategories.length, [archivedCategories]);

  const filteredCategories = useMemo(() => {
    if (categoryType === "archived") {
      return archivedCategories;
    }
    if (categoryType === "income") {
      return categories
        .filter((c) => c.is_expense === 0 && c.is_deleted !== 1)
        .map((c) => ({
          ...c,
          secondaryCategories: c.secondaryCategories.filter((s) => s.is_deleted !== 1),
        }));
    }
    return categories
      .filter((c) => c.is_expense !== 0 && c.is_deleted !== 1)
      .map((c) => ({
        ...c,
        secondaryCategories: c.secondaryCategories.filter((s) => s.is_deleted !== 1),
      }));
  }, [categories, categoryType, archivedCategories]);

  // ── 3. Direct Mutation Hooks (Auto-Toast + Invalidation) ─────────────────
  const createPrimary = useCreatePrimaryCategory();
  const updatePrimary = useUpdatePrimaryCategory();
  const deletePrimaryMutation = useDeletePrimaryCategory();

  const createSecondary = useCreateSecondaryCategory();
  const updateSecondary = useUpdateSecondaryCategory();
  const deleteSecondaryMutation = useDeleteSecondaryCategory();

  // ── 4. Actions ────────────────────────────────────────────────────────────

  /** Creates a new primary category with matching is_expense type */
  const addPrimary = () => {
    const isExpenseNum = categoryType === "expense" ? 1 : 0;
    const tempId = `temp-${Date.now()}`;
    const newCatName = categoryType === "expense" ? "New Category" : "New Income Stream";
    const newCatColor = categoryType === "expense" ? "#AA5BFC" : "#10B981";

    setCategories((prev) => [
      ...prev,
      {
        id: tempId,
        name: newCatName,
        color: newCatColor,
        is_expense: isExpenseNum,
        transaction_count: 0,
        secondaryCategories: [],
        isNew: true,
      },
    ]);

    createPrimary.mutate(
      {
        name: newCatName,
        color: newCatColor,
        is_expense: isExpenseNum,
      },
      {
        onSuccess: (saved) => {
          if (saved) {
            setCategories((prev) =>
              prev.map((c) =>
                c.id === tempId ? { ...c, id: saved.public_id, isNew: false } : c
              )
            );
          }
        },
      }
    );
  };

  /** Creates a new secondary category inheriting parent's is_expense type */
  const addSecondary = (
    primaryPublicId: string,
    primaryColor: string,
    isExpense?: number
  ) => {
    const tempId = `temp-sec-${Date.now()}`;
    const isExp = isExpense !== undefined ? isExpense : (categoryType === "expense" ? 1 : 0);

    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== primaryPublicId) return cat;
        return {
          ...cat,
          secondaryCategories: [
            ...cat.secondaryCategories,
            {
              id: tempId,
              name: "New Sub-category",
              color: primaryColor,
              is_expense: isExp,
              transaction_count: 0,
              isNew: true,
            },
          ],
        };
      })
    );

    createSecondary.mutate(
      {
        primary_category_id: primaryPublicId,
        name: "New Sub-category",
        color: primaryColor,
        is_expense: isExp,
      },
      {
        onSuccess: (saved) => {
          if (saved) {
            setCategories((prev) =>
              prev.map((cat) => {
                if (cat.id !== primaryPublicId) return cat;
                return {
                  ...cat,
                  secondaryCategories: cat.secondaryCategories.map((s) =>
                    s.id === tempId ? { ...s, id: saved.public_id, isNew: false } : s
                  ),
                };
              })
            );
          }
        },
      }
    );
  };

  /** Deletes primary category immediately after confirmation */
  const deletePrimary = (publicId: string, count: number = 0) => {
    setCategories((prev) => prev.filter((c) => c.id !== publicId));
    deletePrimaryMutation.mutate({
      publicId,
      transactionCount: count,
    });
  };

  /** Deletes secondary category immediately after confirmation */
  const deleteSecondary = (secondaryPublicId: string, count: number = 0) => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        secondaryCategories: cat.secondaryCategories.filter(
          (s) => s.id !== secondaryPublicId
        ),
      }))
    );
    deleteSecondaryMutation.mutate({
      publicId: secondaryPublicId,
      transactionCount: count,
    });
  };

  /** Restores primary category (optionally with its sub-categories) */
  const restorePrimary = (primaryId: string, restoreSubcategories: boolean = true) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== primaryId) return cat;
        return {
          ...cat,
          is_deleted: 0,
          secondaryCategories: cat.secondaryCategories.map((s) =>
            restoreSubcategories ? { ...s, is_deleted: 0 } : s
          ),
        };
      })
    );
    toast.success(
      restoreSubcategories
        ? "Category and all sub-categories restored"
        : "Primary category restored"
    );
  };

  /** Restores a specific sub-category (and ensures parent is restored) */
  const restoreSecondary = (primaryId: string, secondaryId: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== primaryId) return cat;
        return {
          ...cat,
          is_deleted: 0,
          secondaryCategories: cat.secondaryCategories.map((s) =>
            s.id === secondaryId ? { ...s, is_deleted: 0 } : s
          ),
        };
      })
    );
    toast.success("Sub-category restored");
  };

  /** Restores all currently archived categories and their sub-categories */
  const restoreAllArchived = () => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        is_deleted: 0,
        secondaryCategories: cat.secondaryCategories.map((s) => ({
          ...s,
          is_deleted: 0,
        })),
      }))
    );
    toast.success("All categories restored successfully");
  };

  /** Local state updates for typing responsiveness */
  const updatePrimaryState = (id: string, updated: PrimaryCategory) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  /** Auto-saves name changes to SQLite on input blur / debounce */
  const savePrimaryName = async (publicId: string, name: string) => {
    return updatePrimary.mutateAsync({
      publicId,
      data: { name },
    });
  };

  /** Auto-saves sub-category name changes to SQLite on input blur / debounce */
  const saveSecondaryName = async (secondaryPublicId: string, name: string) => {
    return updateSecondary.mutateAsync({
      publicId: secondaryPublicId,
      data: { name },
    });
  };

  /** Applies color and auto-saves to SQLite */
  const handleApplyColor = (color: string) => {
    if (!colorTarget) return;
    const { primaryId, secondaryId } = colorTarget;

    // Optimistic UI update
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== primaryId) return cat;
        if (!secondaryId) return { ...cat, color };
        return {
          ...cat,
          secondaryCategories: cat.secondaryCategories.map((sec) =>
            sec.id === secondaryId ? { ...sec, color } : sec
          ),
        };
      })
    );

    // Auto-save to DB
    if (!secondaryId) {
      updatePrimary.mutate({
        publicId: primaryId,
        data: { color },
      });
    } else {
      updateSecondary.mutate({
        publicId: secondaryId,
        data: { color },
      });
    }

    setColorTarget(null);
  };

  return {
    categories: filteredCategories,
    allCategories: categories,
    categoryType,
    setCategoryType,
    expenseCount,
    incomeCount,
    archivedCount,
    loading,
    colorTarget,
    setColorTarget,
    addPrimary,
    addSecondary,
    deletePrimary,
    deleteSecondary,
    restorePrimary,
    restoreSecondary,
    restoreAllArchived,
    updatePrimaryState,
    savePrimaryName,
    saveSecondaryName,
    handleApplyColor,
  };
};
