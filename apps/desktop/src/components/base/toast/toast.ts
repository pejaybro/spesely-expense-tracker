import { toastStore } from "./store";
import type { ToastData } from "./types";

type ToastOptions = ToastData;
type ShortcutOptions = Omit<ToastData, "type">;

function createToast(options: ToastOptions) {
  if (options.dismiss) {
    toastStore.remove(options.dismiss);
  }
  return toastStore.add(options);
}

export const toast = Object.assign(
  (options: ToastOptions) => {
    return createToast(options);
  },
  {
    success: (options: ShortcutOptions) => {
      return createToast({ ...options, type: "success" });
    },

    error: (options: ShortcutOptions) => {
      return createToast({ ...options, type: "error" });
    },

    info: (options: ShortcutOptions) => {
      return createToast({ ...options, type: "info" });
    },

    warning: (options: ShortcutOptions) => {
      return createToast({ ...options, type: "warning" });
    },

    dismiss: (id: string) => {
      toastStore.remove(id);
    },
  },
);