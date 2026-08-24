import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Info,
  Palette,
  Check,
  Loader2,
  RotateCcw,
  Archive,
} from "lucide-react";
import { Button, Flex, Input } from "@/src/components/base";
import { showConfirmDeleteToast } from "@/src/components/app";
import { cn } from "@/src/pejay-ui/utils/cn";
import { SecondaryCategoryRow } from "./SecondaryCategoryRow";
import type { PrimaryCategory, SecondaryCategory } from "./types";

// ============================================================================
// Primary Category Card
// ============================================================================

export const PrimaryCategoryCard = ({
  item,
  isArchivedView = false,
  autoFocus = false,
  onUpdate,
  onSaveName,
  onSaveSecondaryName,
  onDelete,
  onDeleteSecondary,
  onRestorePrimary,
  onRestoreSecondary,
  onOpenColorPicker,
  onAddSecondary,
}: {
  item: PrimaryCategory;
  isArchivedView?: boolean;
  autoFocus?: boolean;
  onUpdate?: (updated: PrimaryCategory) => void;
  onSaveName?: (name: string) => Promise<unknown> | void;
  onSaveSecondaryName?: (secondaryPublicId: string, name: string) => Promise<unknown> | void;
  onDelete?: () => void;
  onDeleteSecondary?: (secondaryId: string, count: number) => void;
  onRestorePrimary?: () => void;
  onRestoreSecondary?: (secondaryId: string) => void;
  onOpenColorPicker?: (secondaryId?: string) => void;
  onAddSecondary?: () => void;
}) => {
  const [expanded, setExpanded] = useState(isArchivedView);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [name, setName] = useState(item.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastSavedDbNameRef = useRef(item.name);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isPrimaryRestored = item.is_deleted === 0;

  // Auto-focus on new item creation
  useEffect(() => {
    if (autoFocus || item.isNew) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [autoFocus, item.isNew]);

  // Keep expanded in archived view
  useEffect(() => {
    if (isArchivedView) {
      setExpanded(true);
    }
  }, [isArchivedView]);

  // Sync state only when the underlying item ID changes or when refreshed from DB outside
  useEffect(() => {
    setName(item.name);
    lastSavedDbNameRef.current = item.name;
  }, [item.id]);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const performSave = async (valToSave: string) => {
    if (isArchivedView) return;
    const trimmed = valToSave.trim();
    if (!trimmed || trimmed === lastSavedDbNameRef.current.trim() || !onSaveName) return;

    setSaveStatus("saving");
    try {
      await onSaveName(valToSave);
      lastSavedDbNameRef.current = valToSave;
      onUpdate?.({ ...item, name: valToSave });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      console.error("Failed to auto-save category name:", err);
      setSaveStatus("idle");
    }
  };

  const handleChangeName = (val: string) => {
    if (isArchivedView) return;
    setName(val);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      performSave(val);
    }, 600);
  };

  const handleBlur = () => {
    if (isArchivedView) return;
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    performSave(name);
  };

  const updateSecondary = (id: string, updated: SecondaryCategory) => {
    onUpdate?.({
      ...item,
      secondaryCategories: item.secondaryCategories.map((s) =>
        s.id === id ? updated : s
      ),
    });
  };

  const deleteSecondary = (id: string) => {
    onUpdate?.({
      ...item,
      secondaryCategories: item.secondaryCategories.filter((s) => s.id !== id),
    });
  };

  const handleAddSecondary = () => {
    setExpanded(true);
    onAddSecondary?.();
  };

  return (
    <div className="rounded-xl border border-white/8 bg-white/2 overflow-hidden w-full">
      {/* Primary Row */}
      <Flex direction="row" items="center" className="gap-3 px-4 py-3 group">
        {/* Expand toggle */}
        <Button
          variant="white-ghost"
          rounded="lg"
          onClick={() => setExpanded((v) => !v)}
          className="h-7 w-7 p-0 flex items-center justify-center text-white/40 hover:text-white/80 shrink-0"
        >
          {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </Button>

        {/* Color Indicator */}
        <span
          className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20 shadow-sm"
          style={{ backgroundColor: item.color }}
        />

        {/* Name input */}
        <div className="flex-1 flex items-center">
          <Input
            ref={inputRef}
            value={name}
            readOnly={isArchivedView}
            onChange={(e) => handleChangeName(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                (e.target as HTMLInputElement).blur();
              }
            }}
            placeholder="Primary category name"
            styles={{
              inputBox: cn(
                "h-8 bg-transparent border-t-0 border-x-0 border-b border-b-transparent rounded-none shadow-none",
                isArchivedView
                  ? "cursor-default select-none pointer-events-none opacity-90"
                  : "hover:border-b-white/20 focus-within:border-b-white/30 focus-within:ring-0"
              ),
              input:
                "text-white text-sm font-medium placeholder:text-white/25 px-1",
            }}
          />
        </div>

        {/* Live Save Status OR Archived / Restored Indicator */}
        {isArchivedView ? (
          isPrimaryRestored ? (
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 shrink-0 font-medium font-mono">
              <Check size={11} />
              Restored
            </span>
          ) : (
            <span className="text-[11px] text-amber-400/90 flex items-center gap-1 shrink-0 font-medium font-mono">
              <Archive size={11} />
              Archived
            </span>
          )
        ) : (
          <>
            {saveStatus === "saving" && (
              <span className="text-[11px] text-white/50 flex items-center gap-1 shrink-0 animate-pulse font-mono">
                <Loader2 size={11} className="animate-spin text-white/70" />
                Updating...
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 shrink-0 font-medium animate-fade-in">
                <Check size={11} />
                Updated
              </span>
            )}
          </>
        )}

        {/* Color button (View-only in Archived View) */}
        <Button
          variant="white-soft"
          rounded="lg"
          onClick={isArchivedView ? undefined : () => onOpenColorPicker?.()}
          className={cn(
            "h-7 px-2.5 text-xs font-mono gap-1.5 shrink-0",
            isArchivedView && "cursor-default pointer-events-none opacity-80"
          )}
        >
          <Palette size={13} className="text-white/50" />
          <span>{item.color}</span>
        </Button>

        {/* Sub count badge */}
        <span className="text-xs text-white/30 tabular-nums w-12 text-right shrink-0 flex items-center justify-end">
          {item.secondaryCategories.length} Sub
        </span>

        {/* Info & Delete / Restore actions */}
        <Flex items="center" className="gap-1">
          <Button
            variant="white-ghost"
            rounded="lg"
            tooltipContent={`${item.transaction_count || 0} Transactions`}
            className="h-7 w-7 p-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-white/30 hover:text-white shrink-0"
          >
            <Info size={14} />
          </Button>

          {isArchivedView ? (
            <Button
              variant="white-ghost"
              rounded="lg"
              tooltipContent={isPrimaryRestored ? "Category restored" : "Restore category"}
              disabled={isPrimaryRestored}
              onClick={onRestorePrimary}
              className={cn(
                "h-7 w-7 p-0 flex items-center justify-center transition-opacity duration-150 shrink-0",
                isPrimaryRestored
                  ? "text-emerald-400 opacity-40 cursor-not-allowed"
                  : "opacity-0 group-hover:opacity-100 text-emerald-400 hover:text-emerald-300"
              )}
            >
              <RotateCcw size={14} />
            </Button>
          ) : (
            <Button
              variant="danger-ghost"
              rounded="lg"
              tooltipContent="Delete category"
              onClick={onDelete}
              className="h-7 w-7 p-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-white/30 hover:text-red-400 shrink-0"
            >
              <Trash2 size={14} />
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Secondary list */}
      {expanded && (
        <div className="border-t border-white/5">
          {item.secondaryCategories.length === 0 ? (
            <p className="pl-14 py-3 text-xs text-white/20 italic">
              No sub-categories
            </p>
          ) : (
            <div className="divide-y divide-white/5">
              {item.secondaryCategories.map((sec) => (
                <SecondaryCategoryRow
                  key={sec.id}
                  item={sec}
                  isArchivedView={isArchivedView}
                  isParentRestored={isPrimaryRestored}
                  onUpdate={(updated) => updateSecondary(sec.id, updated)}
                  onSaveName={(secName) => onSaveSecondaryName?.(sec.id, secName)}
                  onDelete={() => {
                    showConfirmDeleteToast({
                      itemName: sec.name || "sub-category",
                      title: "Delete Sub-category",
                      onConfirm: () => {
                        deleteSecondary(sec.id);
                        onDeleteSecondary?.(sec.id, sec.transaction_count || 0);
                      },
                    });
                  }}
                  onRestore={() => onRestoreSecondary?.(sec.id)}
                  onOpenColorPicker={() => onOpenColorPicker?.(sec.id)}
                />
              ))}
            </div>
          )}

          {/* Sub-categories Footer */}
          <Flex
            direction="row"
            items="center"
            justify={isArchivedView ? "end" : "between"}
            className="px-4 py-2 border-t border-white/5"
          >
            {!isArchivedView && (
              <Button
                variant="white-ghost"
                rounded="lg"
                onClick={handleAddSecondary}
                className="h-7 px-2 text-xs text-white/40 hover:text-white/80 gap-1.5"
              >
                <Plus size={12} />
                Add sub-category
              </Button>
            )}

            <Button
              variant="white-ghost"
              rounded="lg"
              tooltipContent="Collapse category"
              onClick={() => setExpanded(false)}
              className="h-7 w-7 p-0 flex items-center justify-center text-white/30 hover:text-white"
            >
              <ChevronUp size={14} />
            </Button>
          </Flex>
        </div>
      )}
    </div>
  );
};
