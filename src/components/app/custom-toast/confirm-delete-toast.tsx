import React from "react";
import { Trash2 } from "lucide-react";
import { Flex, toast } from "@/src/components/base";

export interface ConfirmDeleteToastProps {
  id: string;
  itemName: string;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const ConfirmDeleteToast: React.FC<ConfirmDeleteToastProps> = ({
  id,
  itemName,
  title = "Confirm Delete",
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
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
    <div className="flex flex-col gap-3 p-4 w-full bg-dark-c1 border border-chalk-15 rounded-xl shadow-2xl backdrop-blur-md select-none text-chalk-90 min-w-75">
      <Flex direction="row" items="center" className="gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
          <Trash2 size={14} />
        </div>
        <h4 className="text-xs font-bold text-chalk-100 uppercase tracking-wider">
          {title}
        </h4>
      </Flex>

      <p className="text-xs text-chalk-60 leading-relaxed">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-white">"{itemName}"</span>?
        {description && (
          <span className="block mt-1 text-[11px] text-chalk-50">
            {description}
          </span>
        )}
      </p>

      <Flex direction="row" items="center" justify="end" className="gap-2 pt-2 border-t border-chalk-10">
        <button
          type="button"
          onClick={handleCancel}
          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-chalk-70 hover:text-white transition-colors cursor-pointer text-xs font-medium border border-white/10"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="px-3 py-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors cursor-pointer text-xs font-semibold shadow-sm border border-red-500/40"
        >
          {confirmText}
        </button>
      </Flex>
    </div>
  );
};

export interface ShowConfirmDeleteOptions {
  itemName: string;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  duration?: number;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const showConfirmDeleteToast = ({
  itemName,
  title = "Confirm Delete",
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  duration = 10000,
  onConfirm,
  onCancel,
}: ShowConfirmDeleteOptions) => {
  return toast.custom({
    duration,
    content: (id) => (
      <ConfirmDeleteToast
        id={id}
        itemName={itemName}
        title={title}
        description={description}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    ),
  });
};
