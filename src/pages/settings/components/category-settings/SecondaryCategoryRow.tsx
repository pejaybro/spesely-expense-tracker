import { useState, useRef, useEffect } from "react";
import {
  Info,
  Trash2,
  Check,
  Loader2,
  RotateCcw,
  Archive,
  GitMerge,
  FolderInput,
} from "lucide-react";
import { Button, Flex, Input } from "@/src/components/base";
import { cn } from "@/src/pejay-ui/utils/cn";
import type { SecondaryCategory } from "./types";

// ============================================================================
// Secondary Category Row
// ============================================================================

export const SecondaryCategoryRow = ({
  item,
  isArchivedView = false,
  isParentRestored = false,
  autoFocus = false,
  onUpdate,
  onSaveName,
  onDelete,
  onRestore,
  onOpenColorPicker,
}: {
  item: SecondaryCategory;
  isArchivedView?: boolean;
  isParentRestored?: boolean;
  autoFocus?: boolean;
  onUpdate?: (updated: SecondaryCategory) => void;
  onSaveName?: (name: string) => Promise<unknown> | void;
  onDelete?: () => void;
  onRestore?: () => void;
  onOpenColorPicker?: () => void;
}) => {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [name, setName] = useState(item.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastSavedDbNameRef = useRef(item.name);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-focus on new item creation
  useEffect(() => {
    if (autoFocus || item.isNew) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [autoFocus, item.isNew]);

  // Sync state only when the item ID changes or when refreshed from DB outside
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
      console.error("Failed to auto-save sub-category name:", err);
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

  return (
    <Flex direction="row" items="center" className="gap-3 px-4 py-2 group">
      {/* Color Indicator */}
      <span
        className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20 shadow-sm ml-2"
        style={{ backgroundColor: item.color }}
      />
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
          placeholder="Secondary category name"
          styles={{
            inputBox: cn(
              "h-8 bg-transparent border-t-0 border-x-0 border-b border-b-transparent rounded-none shadow-none",
              isArchivedView
                ? "cursor-default select-none pointer-events-none opacity-85"
                : "hover:border-b-white/20 focus-within:border-b-white/30 focus-within:ring-0"
            ),
            input: "text-white text-sm placeholder:text-white/25 px-1",
          }}
        />
      </div>

      {/* Live Save Status OR Archived Indicator */}
      {isArchivedView ? (
        <span className="text-[11px] text-amber-400/90 flex items-center gap-1 shrink-0 font-medium font-mono">
          <Archive size={11} />
          Archived
        </span>
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

      {/* Color Button (Disabled in Archived View) */}
      <Button
        variant="white-soft"
        rounded="lg"
        onClick={isArchivedView ? undefined : onOpenColorPicker}
        className={cn(
          "h-6 px-2 text-xs font-mono gap-1.5 shrink-0",
          isArchivedView && "cursor-default pointer-events-none opacity-80"
        )}
      >
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: item.color }}
        />
        <span>{item.color}</span>
      </Button>

      <Flex items="center" className="gap-1">
        {/* Move action icon */}
        {!isArchivedView && (
          <Button
            variant="white-ghost"
            rounded="lg"
            tooltipContent="Move to another category"
            className="h-6 w-6 p-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-white/30 hover:text-white shrink-0"
          >
            <FolderInput size={13} />
          </Button>
        )}

        {/* Merge action icon */}
        {!isArchivedView && (
          <Button
            variant="white-ghost"
            rounded="lg"
            tooltipContent="Merge transactions into another category"
            className="h-6 w-6 p-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-white/30 hover:text-white shrink-0"
          >
            <GitMerge size={13} />
          </Button>
        )}

        {/* Info button */}
        <Button
          variant="white-ghost"
          rounded="lg"
          tooltipContent={`${item.transaction_count || 0} Transactions`}
          className="h-6 w-6 p-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-white/30 hover:text-white shrink-0"
        >
          <Info size={13} />
        </Button>

        {isArchivedView ? (
          <Button
            variant="white-ghost"
            rounded="lg"
            tooltipContent="Restore sub-category"
            onClick={onRestore}
            className="h-6 w-6 p-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-emerald-400 hover:text-emerald-300 shrink-0"
          >
            <RotateCcw size={13} />
          </Button>
        ) : (
          <Button
            variant="danger-ghost"
            rounded="lg"
            tooltipContent="Delete sub-category"
            onClick={onDelete}
            className="h-6 w-6 p-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-white/30 hover:text-red-400 shrink-0"
          >
            <Trash2 size={13} />
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
