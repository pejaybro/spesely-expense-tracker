import React from "react";
import { RotateCcw } from "lucide-react";
import { Flex, toast } from "@/src/components/base";

export interface ConfirmRestoreToastProps {
  id: string;
  itemName: string;
  subCount: number;
  onRestoreAll: () => void;
  onRestorePrimaryOnly: () => void;
  onCancel?: () => void;
}

export const ConfirmRestoreToast: React.FC<ConfirmRestoreToastProps> = ({
  id,
  itemName,
  subCount,
  onRestoreAll,
  onRestorePrimaryOnly,
  onCancel,
}) => {
  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.dismiss(id);
    if (onCancel) onCancel();
  };

  const handleRestoreAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.dismiss(id);
    onRestoreAll();
  };

  const handleRestorePrimaryOnly = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.dismiss(id);
    onRestorePrimaryOnly();
  };

  return (
    <div className="flex flex-col gap-3 p-4 w-full bg-dark-c1 border border-chalk-15 rounded-xl shadow-2xl backdrop-blur-md select-none text-chalk-90 min-w-80">
      <Flex direction="row" items="center" className="gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <RotateCcw size={14} />
        </div>
        <h4 className="text-xs font-bold text-chalk-100 uppercase tracking-wider">
          Restore Category
        </h4>
      </Flex>

      <p className="text-xs text-chalk-60 leading-relaxed">
        <span className="font-semibold text-white">"{itemName}"</span> has{" "}
        <span className="font-semibold text-white">{subCount}</span> sub-categories.
        Would you like to restore them as well?
      </p>

      <Flex
        direction="row"
        items="center"
        justify="end"
        className="gap-2 pt-2 border-t border-chalk-10"
      >
        <button
          type="button"
          onClick={handleCancel}
          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-chalk-70 hover:text-white transition-colors cursor-pointer text-xs font-medium border border-white/10"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleRestorePrimaryOnly}
          className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-xs font-medium border border-white/15"
        >
          Primary Only
        </button>
        <button
          type="button"
          onClick={handleRestoreAll}
          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer text-xs font-semibold shadow-sm border border-emerald-500/40"
        >
          Restore All
        </button>
      </Flex>
    </div>
  );
};

export interface ShowRestoreCategoryOptions {
  itemName: string;
  subCount: number;
  duration?: number;
  onRestoreAll: () => void;
  onRestorePrimaryOnly: () => void;
  onCancel?: () => void;
}

export const showRestoreCategoryToast = ({
  itemName,
  subCount,
  duration = 10000,
  onRestoreAll,
  onRestorePrimaryOnly,
  onCancel,
}: ShowRestoreCategoryOptions) => {
  return toast.custom({
    duration,
    content: (id) => (
      <ConfirmRestoreToast
        id={id}
        itemName={itemName}
        subCount={subCount}
        onRestoreAll={onRestoreAll}
        onRestorePrimaryOnly={onRestorePrimaryOnly}
        onCancel={onCancel}
      />
    ),
  });
};

// ── Restore All Archived Categories Toast ─────────────────────────────────

export interface ConfirmRestoreAllToastProps {
  id: string;
  count: number;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const ConfirmRestoreAllToast: React.FC<ConfirmRestoreAllToastProps> = ({
  id,
  count,
  onConfirm,
  onCancel,
}) => {
  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.dismiss(id);
    if (onCancel) onCancel();
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.dismiss(id);
    onConfirm();
  };

  return (
    <div className="flex flex-col gap-3 p-4 w-full bg-dark-c1 border border-chalk-15 rounded-xl shadow-2xl backdrop-blur-md select-none text-chalk-90 min-w-80">
      <Flex direction="row" items="center" className="gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <RotateCcw size={14} />
        </div>
        <h4 className="text-xs font-bold text-chalk-100 uppercase tracking-wider">
          Restore All Categories
        </h4>
      </Flex>

      <p className="text-xs text-chalk-60 leading-relaxed">
        Are you sure you want to restore all{" "}
        <span className="font-semibold text-white">{count} archived categories</span> and their sub-categories?
      </p>

      <Flex
        direction="row"
        items="center"
        justify="end"
        className="gap-2 pt-2 border-t border-chalk-10"
      >
        <button
          type="button"
          onClick={handleCancel}
          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-chalk-70 hover:text-white transition-colors cursor-pointer text-xs font-medium border border-white/10"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer text-xs font-semibold shadow-sm border border-emerald-500/40"
        >
          Restore All
        </button>
      </Flex>
    </div>
  );
};

export interface ShowConfirmRestoreAllOptions {
  count: number;
  duration?: number;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const showConfirmRestoreAllToast = ({
  count,
  duration = 10000,
  onConfirm,
  onCancel,
}: ShowConfirmRestoreAllOptions) => {
  return toast.custom({
    duration,
    content: (id) => (
      <ConfirmRestoreAllToast
        id={id}
        count={count}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    ),
  });
};
