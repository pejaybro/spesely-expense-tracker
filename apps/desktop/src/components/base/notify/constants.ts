import type { NotifyPosition, NotifyVariant } from "./types";

export const notifyPositionClasses: Record<NotifyPosition, string> = {
  "top-left": "top-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-4 right-4",
};

export const notifyVariantClasses: Record<NotifyVariant, string> = {
  default: "border-neutral-200 bg-white text-black",

  success: "border-green-200 bg-green-50 text-green-950",

  error: "border-red-200 bg-red-50 text-red-950",

  warning: "border-yellow-200 bg-yellow-50 text-yellow-950",

  info: "border-blue-200 bg-blue-50 text-blue-950",
};