import { useActionFeedbackStore } from "./action-feedback-store";

export type DoubleClickActionPayload = {
  value: string;
  label?: string;
};

export type DoubleClickAction = {
  run: (element: HTMLElement, payload: DoubleClickActionPayload) => void;
};

export const doubleClickRegistry: Record<string, DoubleClickAction> = {
  "copy-cell": {
    run: (element, payload) => {
      navigator.clipboard.writeText(payload.value);

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const topY = rect.top;

      const displayLabel = payload.label ? `${payload.label} Copied!` : "Copied!";
      useActionFeedbackStore.getState().trigger(centerX, topY, displayLabel);
    },
  },
};
