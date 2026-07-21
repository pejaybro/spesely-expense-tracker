import type { ContextMenuItem } from "./types";

type ExpensePayload = {
  expenseId: number;
  expense?: unknown;
};

type ExpenseHandlers = {
  onEdit: (payload: ExpensePayload) => void;
  onDelete: (payload: ExpensePayload) => void;
};

export function getExpenseMenuItems(
  payload: ExpensePayload,
  handlers: ExpenseHandlers,
): ContextMenuItem[] {
  return [
    {
      id: "edit-expense",
      label: "Edit Expense",

      onClick: () => {
        handlers.onEdit(payload);
      },
    },

    {
      id: "delete-expense",
      label: "Delete Expense",

      onClick: () => {
        handlers.onDelete(payload);
      },
    },
  ];
}