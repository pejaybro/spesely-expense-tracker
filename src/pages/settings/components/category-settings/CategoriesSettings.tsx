import {
  Tag,
  Plus,
  ChevronRight,
  Loader2,
  TrendingDown,
  TrendingUp,
  Archive,
  RotateCcw,
} from "lucide-react";
import { Button, EmptyData, Flex } from "@/src/components/base";
import {
  showConfirmDeleteToast,
  showRestoreCategoryToast,
  showConfirmRestoreAllToast,
  ColorPickerModal,
} from "@/src/components/app";
import { MY_TABS } from "@/src/pejay-ui/components/horizontal-tabs/horizontal-tabs.config";
import { SETTINGS_NAV_ITEM } from "@/src/router/nav.config";
import { PrimaryCategoryCard } from "./PrimaryCategoryCard";
import { useCategoriesSettings } from "../../hooks/category.settings.hook";

// ============================================================================
// Main Component — Expense / Income / Archived Segmented View
// ============================================================================

export const CategoriesSettings = () => {
  const {
    categories,
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
  } = useCategoriesSettings();

  const categoryTab = MY_TABS.find(t => t.id === "categories");
  const HeaderIcon = categoryTab?.icon || Tag;

  if (loading) {
    return (
      <Flex
        direction="column"
        items="center"
        justify="center"
        className="py-20 w-full text-white/30 gap-2"
      >
        <Loader2 size={24} className="animate-spin text-white/50" />
        <span className="text-xs">Loading categories...</span>
      </Flex>
    );
  }

  const isArchived = categoryType === "archived";

  return (
    <Flex direction="column" className="gap-5 py-4 px-5 w-full">
      {/* 1. Top Bar */}
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
                className="h-9 w-9 p-0 flex items-center justify-center shrink-0 cursor-default pointer-events-none"
              >
                <HeaderIcon size={14} />
              </Button>
            )}
            <Flex
              direction="row"
              items="center"
              className="gap-1.5 text-[18px]"
            >
              <span className="font-medium text-white">
                {SETTINGS_NAV_ITEM.name}
              </span>
              <ChevronRight size={14} className="text-white shrink-0" />
              <span className="font-semibold text-white">
                {categoryTab?.name || "Categories"}
              </span>
            </Flex>
          </Flex>
          <p className="text-xs text-white/50">
            Organize your transactions with primary and sub-categories
          </p>
        </Flex>
      </Flex>

      {/* 2. Control Bar: Left 3-Pill Segment + Right Action Button */}
      <Flex direction="row" items="center" justify="between" className="w-full">
        {/* Left: Type Segmented Control (Expense | Income | Archived) */}
        <Flex
          direction="row"
          items="center"
          className="p-1 bg-white/4 border border-white/8 rounded-xl gap-1"
        >
          <Button
            variant={categoryType === "expense" ? "white-soft" : "white-ghost"}
            rounded="lg"
            onClick={() => setCategoryType("expense")}
            className={`h-8 px-3 text-xs gap-1.5 font-medium transition-all ${
              categoryType === "expense"
                ? "bg-white/12 text-white shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            <TrendingDown size={13} className="text-rose-400" />
            <span>Expense</span>
            <span className="text-[10px] text-white/40 tabular-nums font-mono">
              ({expenseCount})
            </span>
          </Button>

          <Button
            variant={categoryType === "income" ? "white-soft" : "white-ghost"}
            rounded="lg"
            onClick={() => setCategoryType("income")}
            className={`h-8 px-3 text-xs gap-1.5 font-medium transition-all ${
              categoryType === "income"
                ? "bg-white/12 text-white shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            <TrendingUp size={13} className="text-emerald-400" />
            <span>Income</span>
            <span className="text-[10px] text-white/40 tabular-nums font-mono">
              ({incomeCount})
            </span>
          </Button>

          <Button
            variant={categoryType === "archived" ? "white-soft" : "white-ghost"}
            rounded="lg"
            onClick={() => setCategoryType("archived")}
            className={`h-8 px-3 text-xs gap-1.5 font-medium transition-all ${
              categoryType === "archived"
                ? "bg-white/12 text-white shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Archive size={13} className="text-amber-400" />
            <span>Archived</span>
            <span className="text-[10px] text-white/40 tabular-nums font-mono">
              ({archivedCount})
            </span>
          </Button>
        </Flex>

        {/* Right Action Button: Restore All (in Archived tab) OR New Category */}
        {isArchived ? (
          archivedCount > 0 && (
            <Button
              variant="white-ghost"
              rounded="lg"
              onClick={() => {
                showConfirmRestoreAllToast({
                  count: archivedCount,
                  onConfirm: restoreAllArchived,
                });
              }}
              className="gap-1.5 h-8 px-3 text-xs text-emerald-400 hover:text-emerald-300"
            >
              <RotateCcw size={13} className="text-emerald-400" />
              Restore All
            </Button>
          )
        ) : (
          <Button
            variant="white-ghost"
            rounded="lg"
            onClick={addPrimary}
            className="gap-1.5 h-8 px-3 text-xs"
          >
            <Plus
              size={13}
              className={
                categoryType === "expense"
                  ? "text-rose-400"
                  : "text-emerald-400"
              }
            />
            New Category
          </Button>
        )}
      </Flex>

      {/* 3. Category list Map */}
      {categories.length === 0 ? (
        <EmptyData
          icon={<Tag size={28} className="text-white/15" />}
          label={
            isArchived
              ? "No archived categories"
              : `No ${categoryType === "expense" ? "expense" : "income"} categories yet`
          }
          description={
            isArchived
              ? "Categories soft-deleted with transaction history will appear here."
              : `Click 'New Category' to create your first ${categoryType} category.`
          }
        />
      ) : (
        <Flex direction="column" className="gap-4 w-full">
          {categories.map(cat => (
            <PrimaryCategoryCard
              key={cat.id}
              item={cat}
              isArchivedView={isArchived}
              onUpdate={updated => updatePrimaryState(cat.id, updated)}
              onSaveName={name => savePrimaryName(cat.id, name)}
              onSaveSecondaryName={(secId, name) =>
                saveSecondaryName(secId, name)
              }
              onDelete={() => {
                showConfirmDeleteToast({
                  itemName: cat.name || "category",
                  title: "Delete Primary Category",
                  onConfirm: () =>
                    deletePrimary(cat.id, cat.transaction_count || 0),
                });
              }}
              onDeleteSecondary={(secId, count) =>
                deleteSecondary(secId, count)
              }
              onRestorePrimary={() => {
                if (cat.secondaryCategories.length > 0) {
                  showRestoreCategoryToast({
                    itemName: cat.name || "category",
                    subCount: cat.secondaryCategories.length,
                    onRestoreAll: () => restorePrimary(cat.id, true),
                    onRestorePrimaryOnly: () => restorePrimary(cat.id, false),
                  });
                } else {
                  restorePrimary(cat.id, true);
                }
              }}
              onRestoreSecondary={secId => restoreSecondary(cat.id, secId)}
              onAddSecondary={() => addSecondary(cat.id, cat.color, cat.is_expense)}
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
