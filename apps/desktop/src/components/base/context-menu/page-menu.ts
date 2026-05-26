import type { ContextMenuItem } from "./types";
import { BASE_MENU_RIGHT_CLICK } from "./constants";

type PageMenuMode = "base" | "replace" | "extend";

type PageConfig = {
  mode: PageMenuMode;
  items?: ContextMenuItem[];
};

export function getPageContextMenu(pathname: string): PageConfig {
  switch (pathname) {
    case "/expense":
      return {
        mode: "replace",
        items: [
          {
            id: "add-expense",
            label: "Add Expense",
            onClick: () => console.log("Add Expense"),
          },
          {
            id: "export-expense",
            label: "Export",
            children: [
              {
                id: "pdf",
                label: "PDF",
                onClick: () => {},
              },
              {
                id: "csv",
                label: "CSV",
                onClick: () => {},
              },
            ],
          },
        ],
      };
    case "/income":
      return {
        mode: "extend",
        items: [
          {
            id: "add-income",
            label: "Add Income",
            onClick: () => console.log("Add Income"),
          },
          {
            id: "export-income",
            label: "Export",
            onClick: () => console.log("Export Expense"),
          },
        ],
      };

    default:
      return {
        mode: "base",
      };
  }
}