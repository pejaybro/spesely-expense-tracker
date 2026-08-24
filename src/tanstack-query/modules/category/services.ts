import { electronClient } from "../../client";
import type {
  SpeselyPrimaryCategory,
  SpeselySecondaryCategory,
} from "@/types/db/interface/spesely.interface";
import type { PrimaryCategory } from "@/src/pages/settings/components/category-settings/types";
import { CategoryMappers } from "./mappers";

export const CategoryService = {
  // ── Primary Categories ──────────────────────────────────────────────────
  getAllPrimary: async (): Promise<SpeselyPrimaryCategory[]> => {
    return electronClient.primaryCategory.getAll();
  },

  createPrimary: async (
    category: Partial<SpeselyPrimaryCategory>
  ): Promise<SpeselyPrimaryCategory> => {
    return electronClient.primaryCategory.create(category);
  },

  updatePrimary: async (
    publicId: string,
    category: Partial<SpeselyPrimaryCategory>
  ): Promise<SpeselyPrimaryCategory> => {
    return electronClient.primaryCategory.update(publicId, category);
  },

  deletePrimary: async (
    publicId: string,
    transactionCount: number = 0
  ): Promise<boolean> => {
    if (transactionCount > 0) {
      return electronClient.primaryCategory.softDelete(publicId);
    }
    return electronClient.primaryCategory.delete(publicId);
  },

  // ── Secondary Categories ────────────────────────────────────────────────
  getAllSecondary: async (): Promise<SpeselySecondaryCategory[]> => {
    return electronClient.secondaryCategory.getAll();
  },

  getByPrimaryId: async (
    primaryPublicId: string
  ): Promise<SpeselySecondaryCategory[]> => {
    return electronClient.secondaryCategory.getByPrimaryId(primaryPublicId);
  },

  createSecondary: async (
    category: Partial<SpeselySecondaryCategory>
  ): Promise<SpeselySecondaryCategory> => {
    return electronClient.secondaryCategory.create(category);
  },

  updateSecondary: async (
    publicId: string,
    category: Partial<SpeselySecondaryCategory>
  ): Promise<SpeselySecondaryCategory> => {
    return electronClient.secondaryCategory.update(publicId, category);
  },

  deleteSecondary: async (
    publicId: string,
    transactionCount: number = 0
  ): Promise<boolean> => {
    if (transactionCount > 0) {
      return electronClient.secondaryCategory.softDelete(publicId);
    }
    return electronClient.secondaryCategory.delete(publicId);
  },

  // ── Combined Tree / Grouped Service ────────────────────────────────────
  getCategoryTree: async (): Promise<PrimaryCategory[]> => {
    const [primaries, secondaries] = await Promise.all([
      electronClient.primaryCategory.getAll(),
      electronClient.secondaryCategory.getAll(),
    ]);
    return CategoryMappers.toPrimaryTree(primaries, secondaries);
  },

  batchSave: async (categories: PrimaryCategory[]): Promise<void> => {
    for (const cat of categories) {
      await electronClient.primaryCategory.update(cat.id, {
        name: cat.name,
        color: cat.color,
      });

      for (const sec of cat.secondaryCategories) {
        await electronClient.secondaryCategory.update(sec.id, {
          name: sec.name,
          color: sec.color,
        });
      }
    }
  },
};
