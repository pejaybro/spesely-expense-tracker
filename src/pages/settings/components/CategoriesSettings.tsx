import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Tag,
  Palette,
  Info,
  Loader2,
} from "lucide-react";
import { Button, Flex, toast, Tooltip } from "@/src/components/base";
import { showConfirmDeleteToast } from "@/src/components/app";
import { MY_TABS } from "@/src/pejay-ui/components/horizontal-tabs/horizontal-tabs.config";
import { SETTINGS_NAV_ITEM } from "@/src/router/nav.config";
import { ColorPickerModal } from "./ColorPickerModal";

// ============================================================================
// Local Types
// ============================================================================

interface SecondaryCategory {
  id: string; // public_id
  name: string;
  color: string;
  transaction_count?: number;
  isNew?: boolean;
}

interface PrimaryCategory {
  id: string; // public_id
  name: string;
  color: string;
  transaction_count?: number;
  secondaryCategories: SecondaryCategory[];
  isNew?: boolean;
}

interface ActiveColorTarget {
  primaryId: string;
  secondaryId?: string;
  currentColor: string;
}



// ============================================================================
// Secondary Category Row
// ============================================================================

const SecondaryCategoryRow = ({
  item,
  onUpdate,
  onDelete,
  onOpenColorPicker,
}: {
  item: SecondaryCategory;
  onUpdate: (updated: SecondaryCategory) => void;
  onDelete: () => void;
  onOpenColorPicker: () => void;
}) => (
  <Flex direction="row" items="center" className="gap-3 px-4 py-2 group">
    {/* Color trigger bar/button */}
    <button
      type="button"
      onClick={onOpenColorPicker}
      className="w-2.5 h-6 rounded-full shrink-0 transition-transform hover:scale-110 cursor-pointer shadow-sm border border-white/10"
      style={{ backgroundColor: item.color }}
      title="Click to change color"
    />
    <div className="flex-1 flex items-center">
      <input
        type="text"
        value={item.name}
        onChange={e => onUpdate({ ...item, name: e.target.value })}
        placeholder="Secondary category name"
        className="w-full h-8 bg-transparent text-white text-sm border-b border-transparent focus:border-white/30 focus:outline-none transition-colors px-1 placeholder:text-white/25 leading-normal"
      />
    </div>

    {/* Color Icon Button */}
    <button
      type="button"
      onClick={onOpenColorPicker}
      className="flex items-center justify-center gap-1.5 px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer text-xs font-mono shrink-0"
    >
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: item.color }}
      />
      <span>{item.color}</span>
    </button>

    <Flex items="center" className="gap-1">
      <Tooltip content={`${item.transaction_count || 0} Transactions`}>
        <button
          type="button"
          className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-white/30 hover:text-white cursor-pointer p-1 rounded shrink-0"
        >
          <Info size={13} />
        </button>
      </Tooltip>

      <button
        type="button"
        onClick={onDelete}
        className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-white/30 hover:text-red-400 cursor-pointer p-1 rounded shrink-0"
        title="Delete sub-category"
      >
        <Trash2 size={13} />
      </button>
    </Flex>
  </Flex>
);

// ============================================================================
// Primary Category Card
// ============================================================================

const PrimaryCategoryCard = ({
  item,
  onUpdate,
  onDelete,
  onDeleteSecondary,
  onOpenColorPicker,
  onAddSecondary,
}: {
  item: PrimaryCategory;
  onUpdate: (updated: PrimaryCategory) => void;
  onDelete: () => void;
  onDeleteSecondary: (secondaryId: string, count: number) => void;
  onOpenColorPicker: (secondaryId?: string) => void;
  onAddSecondary: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  const updateSecondary = (id: string, updated: SecondaryCategory) => {
    onUpdate({
      ...item,
      secondaryCategories: item.secondaryCategories.map(s =>
        s.id === id ? updated : s,
      ),
    });
  };

  const deleteSecondary = (id: string) => {
    onUpdate({
      ...item,
      secondaryCategories: item.secondaryCategories.filter(s => s.id !== id),
    });
  };

  return (
    <div className="rounded-xl border border-white/8 bg-white/2 overflow-hidden w-full">
      {/* Primary Row */}
      <Flex direction="row" items="center" className="gap-3 px-4 py-3 group">
        {/* Expand toggle */}
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="flex items-center justify-center text-white/30 hover:text-white/60 transition-colors cursor-pointer shrink-0"
        >
          {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </button>

        {/* Primary Color trigger dot */}
        <button
          type="button"
          onClick={() => onOpenColorPicker()}
          className="w-4 h-4 rounded-full shrink-0 transition-transform hover:scale-110 cursor-pointer border border-white/20 shadow-sm"
          style={{ backgroundColor: item.color }}
          title="Click to change color"
        />

        {/* Name input */}
        <div className="flex-1 flex items-center">
          <input
            type="text"
            value={item.name}
            onChange={e => onUpdate({ ...item, name: e.target.value })}
            placeholder="Primary category name"
            className="w-full h-8 bg-transparent text-white text-sm font-medium border-b border-transparent focus:border-white/30 focus:outline-none transition-colors px-1 placeholder:text-white/25 leading-normal"
          />
        </div>

        {/* Color button */}
        <button
          type="button"
          onClick={() => onOpenColorPicker()}
          className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer text-xs font-mono shrink-0"
        >
          <Palette size={13} className="text-white/50" />
          <span>{item.color}</span>
        </button>

        {/* Sub count badge */}
        <span className="text-xs text-white/30 tabular-nums w-12 text-right shrink-0 flex items-center justify-end">
          {item.secondaryCategories.length} Sub
        </span>

        {/* Info & Delete actions */}
        <Flex items="center" className="gap-1">
          <Tooltip content={`${item.transaction_count || 0} Transactions`}>
            <button
              type="button"
              className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-white/30 hover:text-white cursor-pointer p-1 rounded shrink-0"
            >
              <Info size={14} />
            </button>
          </Tooltip>

          <button
            type="button"
            onClick={onDelete}
            className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-white/30 hover:text-red-400 cursor-pointer p-1 rounded shrink-0"
            title="Delete category"
          >
            <Trash2 size={14} />
          </button>
        </Flex>
      </Flex>

      {/* Secondary list */}
      {expanded && (
        <div className="border-t border-white/5">
          {item.secondaryCategories.length === 0 ? (
            <p className="pl-14 py-3 text-xs text-white/20 italic">
              No sub-categories yet
            </p>
          ) : (
            <div className="divide-y divide-white/5">
              {item.secondaryCategories.map(sec => (
                <SecondaryCategoryRow
                  key={sec.id}
                  item={sec}
                  onUpdate={updated => updateSecondary(sec.id, updated)}
                  onDelete={() => {
                    showConfirmDeleteToast({
                      itemName: sec.name || "sub-category",
                      title: "Delete Sub-category",
                      onConfirm: () => {
                        deleteSecondary(sec.id);
                        onDeleteSecondary(sec.id, sec.transaction_count || 0);
                      },
                    });
                  }}
                  onOpenColorPicker={() => onOpenColorPicker(sec.id)}
                />
              ))}
            </div>
          )}

          {/* Add secondary row with collapse arrow on right */}
          <Flex
            direction="row"
            items="center"
            justify="between"
            className="px-4 py-2 border-t border-white/5"
          >
            <button
              type="button"
              onClick={onAddSecondary}
              className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors cursor-pointer py-1"
            >
              <Plus size={12} />
              Add sub-category
            </button>

            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="flex items-center gap-1 text-xs text-white/30 hover:text-white transition-colors cursor-pointer py-1"
              title="Collapse category"
            >
              <ChevronUp size={14} />
            </button>
          </Flex>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export const CategoriesSettings = () => {
  const [categories, setCategories] = useState<PrimaryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [colorTarget, setColorTarget] = useState<ActiveColorTarget | null>(null);

  // Load from SQLite DB
  const loadCategories = useCallback(async () => {
    if (typeof window === "undefined" || !window.electronAPI) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const primaries = await window.electronAPI.primaryCategory.getAll();
      const secondaries = await window.electronAPI.secondaryCategory.getAll();

      const mapped: PrimaryCategory[] = primaries.map(p => ({
        id: p.public_id,
        name: p.name,
        color: p.color || "#AA5BFC",
        transaction_count: p.transaction_count || 0,
        secondaryCategories: secondaries
          .filter(s => s.primary_category_id === p.public_id)
          .map(s => ({
            id: s.public_id,
            name: s.name,
            color: s.color || p.color || "#AA5BFC",
            transaction_count: s.transaction_count || 0,
          })),
      }));

      setCategories(mapped);
    } catch (err) {
      console.error("Failed to fetch categories from database:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Create Primary in DB
  const addPrimary = async () => {
    if (window.electronAPI) {
      try {
        const created = await window.electronAPI.primaryCategory.create({
          name: "New Category",
          color: "#AA5BFC",
          is_expense: 1,
        });

        setCategories(prev => [
          ...prev,
          {
            id: created.public_id,
            name: created.name,
            color: created.color || "#AA5BFC",
            secondaryCategories: [],
          },
        ]);
      } catch (err) {
        console.error("Failed to create primary category:", err);
      }
    } else {
      // Fallback for browser dev
      const fallbackId = crypto.randomUUID();
      setCategories(prev => [
        ...prev,
        {
          id: fallbackId,
          name: "New Category",
          color: "#AA5BFC",
          secondaryCategories: [],
        },
      ]);
    }
  };

  // Create Secondary in DB
  const addSecondary = async (primaryPublicId: string, primaryColor: string) => {
    if (window.electronAPI) {
      try {
        const created = await window.electronAPI.secondaryCategory.create({
          primary_category_id: primaryPublicId,
          name: "New Sub-category",
          color: primaryColor,
          is_expense: 1,
        });

        setCategories(prev =>
          prev.map(cat => {
            if (cat.id !== primaryPublicId) return cat;
            return {
              ...cat,
              secondaryCategories: [
                ...cat.secondaryCategories,
                {
                  id: created.public_id,
                  name: created.name,
                  color: created.color || primaryColor,
                },
              ],
            };
          })
        );
      } catch (err) {
        console.error("Failed to create secondary category:", err);
      }
    } else {
      // Fallback
      setCategories(prev =>
        prev.map(cat => {
          if (cat.id !== primaryPublicId) return cat;
          return {
            ...cat,
            secondaryCategories: [
              ...cat.secondaryCategories,
              {
                id: crypto.randomUUID(),
                name: "New Sub-category",
                color: primaryColor,
              },
            ],
          };
        })
      );
    }
  };

  // Delete Primary in DB (Soft delete if transaction_count > 0, hard delete if count === 0)
  const deletePrimary = async (publicId: string, count: number = 0) => {
    if (window.electronAPI) {
      try {
        if (count > 0) {
          await window.electronAPI.primaryCategory.softDelete(publicId);
        } else {
          await window.electronAPI.primaryCategory.delete(publicId);
        }
      } catch (err) {
        console.error("Failed to delete primary category:", err);
      }
    }
    setCategories(prev => prev.filter(c => c.id !== publicId));
  };

  // Delete Secondary in DB (Soft delete if transaction_count > 0, hard delete if count === 0)
  const deleteSecondary = async (secondaryPublicId: string, count: number = 0) => {
    if (window.electronAPI) {
      try {
        if (count > 0) {
          await window.electronAPI.secondaryCategory.softDelete(secondaryPublicId);
        } else {
          await window.electronAPI.secondaryCategory.delete(secondaryPublicId);
        }
      } catch (err) {
        console.error("Failed to delete secondary category:", err);
      }
    }
    setCategories(prev =>
      prev.map(cat => ({
        ...cat,
        secondaryCategories: cat.secondaryCategories.filter(
          s => s.id !== secondaryPublicId
        ),
      }))
    );
  };

  const updatePrimaryState = (id: string, updated: PrimaryCategory) => {
    setCategories(prev => prev.map(c => (c.id === id ? updated : c)));
  };

  const handleApplyColor = (color: string) => {
    if (!colorTarget) return;

    const { primaryId, secondaryId } = colorTarget;

    setCategories(prev =>
      prev.map(cat => {
        if (cat.id !== primaryId) return cat;

        if (!secondaryId) {
          return { ...cat, color };
        } else {
          return {
            ...cat,
            secondaryCategories: cat.secondaryCategories.map(sec =>
              sec.id === secondaryId ? { ...sec, color } : sec
            ),
          };
        }
      })
    );

    setColorTarget(null);
  };

  // Save all modified category names & colors to DB
  const handleSave = async () => {
    if (!window.electronAPI) return;
    setIsSaving(true);
    try {
      for (const cat of categories) {
        await window.electronAPI.primaryCategory.update(cat.id, {
          name: cat.name,
          color: cat.color,
        });

        for (const sec of cat.secondaryCategories) {
          await window.electronAPI.secondaryCategory.update(sec.id, {
            name: sec.name,
            color: sec.color,
          });
        }
      }
      // Refresh state from DB to sync
      await loadCategories();
    } catch (err) {
      console.error("Failed to save category updates:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const categoryTab = MY_TABS.find(t => t.id === "categories");
  const HeaderIcon = categoryTab?.icon || Tag;

  if (loading) {
    return (
      <Flex direction="column" items="center" justify="center" className="py-20 w-full text-white/30 gap-2">
        <Loader2 size={24} className="animate-spin text-white/50" />
        <span className="text-xs">Loading categories...</span>
      </Flex>
    );
  }

  return (
    <Flex direction="column" className="gap-6 py-4 px-5 w-full">
      {/* Header */}
      <Flex
        direction="row"
        items="center"
        justify="between"
        className="w-full pt-2"
      >
        <Flex direction="column" noGap className="gap-2">
          {/* Breadcrumb Title */}
          <Flex
            direction="row"
            items="center"
            className="gap-2.5 text-white/80"
          >
            {HeaderIcon && (
              <Button
                variant="white-soft"
                rounded="lg"
                className=" h-9 w-9 p-0 flex items-center justify-center shrink-0 cursor-default pointer-events-none"
              >
                <HeaderIcon size={14} />
              </Button>
            )}
            <Flex
              direction="row"
              items="center"
              className="gap-1.5 text-[18px]"
            >
              <span className=" font-medium text-white">
                {SETTINGS_NAV_ITEM.name}
              </span>
              <ChevronRight size={14} className="text-white shrink-0" />
              <span className=" font-semibold text-white">
                {categoryTab?.name || "Categories"}
              </span>
            </Flex>
          </Flex>
          <p className="text-xs text-white/50">
            Organize your expenses with primary and sub-categories
          </p>
        </Flex>
        <Button
          variant="white-ghost"
          rounded="lg"
          onClick={addPrimary}
          className="gap-1.5 h-8 px-3 text-xs"
        >
          <Plus size={13} />
          Add Category
        </Button>
      </Flex>

      {/* Category list */}
      {categories.length === 0 ? (
        <Flex
          direction="column"
          items="center"
          justify="center"
          className="gap-3 py-16 border border-dashed border-white/10 rounded-xl"
        >
          <Tag size={28} className="text-white/15" />
          <p className="text-sm text-white/25">No categories yet</p>
          <Button
            variant="white-ghost"
            rounded="lg"
            onClick={addPrimary}
            className="h-8 px-3 text-xs gap-1.5"
          >
            <Plus size={12} />
            Add your first category
          </Button>
        </Flex>
      ) : (
        <Flex direction="column" className="gap-5 w-full">
          {categories.map(cat => (
            <PrimaryCategoryCard
              key={cat.id}
              item={cat}
              onUpdate={updated => updatePrimaryState(cat.id, updated)}
              onDelete={() => {
                showConfirmDeleteToast({
                  itemName: cat.name || "category",
                  title: "Delete Primary Category",
                  onConfirm: () => {
                    deletePrimary(cat.id, cat.transaction_count || 0);
                  },
                });
              }}
              onDeleteSecondary={(secId, count) => deleteSecondary(secId, count)}
              onAddSecondary={() => addSecondary(cat.id, cat.color)}
              onOpenColorPicker={secondaryId =>
                setColorTarget({
                  primaryId: cat.id,
                  secondaryId,
                  currentColor: secondaryId
                    ? cat.secondaryCategories.find(s => s.id === secondaryId)
                        ?.color || cat.color
                    : cat.color,
                })
              }
            />
          ))}
        </Flex>
      )}

      {/* Save */}
      {categories.length > 0 && (
        <Flex direction="row" justify="end" className="pt-2 w-full">
          <Button
            variant="white"
            rounded="lg"
            onClick={handleSave}
            isLoading={isSaving}
            className="h-8 px-4 text-xs font-semibold"
          >
            Save Changes
          </Button>
        </Flex>
      )}

      {/* Color Picker Modal */}
      <ColorPickerModal
        isOpen={!!colorTarget}
        initialColor={colorTarget?.currentColor || "#AA5BFC"}
        onClose={() => setColorTarget(null)}
        onApply={handleApplyColor}
      />
    </Flex>
  );
};
