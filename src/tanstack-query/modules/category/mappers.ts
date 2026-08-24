import type {
  SpeselyPrimaryCategory,
  SpeselySecondaryCategory,
} from "@/types/db/interface/spesely.interface";
import type {
  PrimaryCategory,
  SecondaryCategory,
} from "@/src/pages/settings/components/category-settings/types";

export const CategoryMappers = {
  toPrimary: (item: SpeselyPrimaryCategory): PrimaryCategory => ({
    id: item.public_id,
    name: item.name,
    color: item.color || "#AA5BFC",
    is_expense: item.is_expense !== undefined ? item.is_expense : 1,
    transaction_count: item.transaction_count || 0,
    secondaryCategories: [],
  }),

  toPrimaryList: (items: SpeselyPrimaryCategory[]): PrimaryCategory[] =>
    items.map(CategoryMappers.toPrimary),

  toSecondary: (item: SpeselySecondaryCategory): SecondaryCategory => ({
    id: item.public_id,
    name: item.name,
    color: item.color || "#AA5BFC",
    is_expense: item.is_expense !== undefined ? item.is_expense : 1,
    transaction_count: item.transaction_count || 0,
  }),

  toSecondaryList: (items: SpeselySecondaryCategory[]): SecondaryCategory[] =>
    items.map(CategoryMappers.toSecondary),

  toPrimaryTree: (
    primaries: SpeselyPrimaryCategory[],
    secondaries: SpeselySecondaryCategory[]
  ): PrimaryCategory[] => {
    return primaries.map((p) => {
      const primaryColor = p.color || "#AA5BFC";
      const primaryIsExpense = p.is_expense !== undefined ? p.is_expense : 1;
      return {
        id: p.public_id,
        name: p.name,
        color: primaryColor,
        is_expense: primaryIsExpense,
        transaction_count: p.transaction_count || 0,
        secondaryCategories: secondaries
          .filter((s) => s.primary_category_id === p.public_id)
          .map((s) => ({
            id: s.public_id,
            name: s.name,
            color: s.color || primaryColor,
            is_expense:
              s.is_expense !== undefined ? s.is_expense : primaryIsExpense,
            transaction_count: s.transaction_count || 0,
          })),
      };
    });
  },
};
