import { useEffect } from "react";
import { useContextMenuStore } from "./store";
import { getPageContextMenu } from "./page-menu";
import { BASE_MENU_RIGHT_CLICK } from "./constants";
import { getElementContextMenu } from "./element-menu";

export function useContextMenu() {
  const open = useContextMenuStore((s) => s.open);
  const close = useContextMenuStore((s) => s.close);

  useEffect(() => {
    const handleRightClick = (e: MouseEvent) => {
      e.preventDefault();
      // Since we use createHashRouter, the path is in the hash (e.g. '#/expense').
      // window.location.pathname will always be "/" in a hash router.
      const hash = window.location.hash;
      const path = hash.replace(/^#/, "").split("?")[0] || "/";
      const pageConfig = getPageContextMenu(path);

      let finalMenu = BASE_MENU_RIGHT_CLICK;

      if (pageConfig.mode === "replace") {
        finalMenu = pageConfig.items || [];
      }
      if (pageConfig.mode === "extend") {
        const baseIds = new Set(BASE_MENU_RIGHT_CLICK.map((i) => i.id));

        const extraItems = (pageConfig.items || []).filter(
          (item) => !baseIds.has(item.id),
        );

        finalMenu = [...BASE_MENU_RIGHT_CLICK, ...extraItems];
      }
      // Element Context Menu
      const elementConfig = getElementContextMenu(e.target);

      if (elementConfig) {
        if (elementConfig.mode === "replace") {
          finalMenu = elementConfig.items;
        }

        if (elementConfig.mode === "extend") {
          finalMenu = [
            ...finalMenu,
            ...elementConfig.items.filter(
              (item) => !finalMenu.some((existing) => existing.id === item.id),
            ),
          ];
        }
      }
      open(e.clientX, e.clientY, finalMenu);
    };

    const handleClick = () => close();

    window.addEventListener("contextmenu", handleRightClick);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("contextmenu", handleRightClick);
      window.removeEventListener("click", handleClick);
    };
  }, [open, close]);
}