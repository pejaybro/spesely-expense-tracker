import { useCallback, useRef } from "react";
import { registerElementMenu } from "./element-menu";
import type { ContextMenuItem } from "./types";

type Config<TPayload = unknown> = {
  mode: "replace" | "extend";

  payload?: TPayload;

  items: ContextMenuItem[] | ((payload?: TPayload) => ContextMenuItem[]);
};

export function useElementContextMenu<
  T extends HTMLElement = HTMLElement,
  TPayload = unknown,
>(config: Config<TPayload>) {
  const elementRef = useRef<T | null>(null);

  const setRef = useCallback(
    (node: T | null) => {
      if (node) {
        elementRef.current = node;

        const resolvedItems =
          typeof config.items === "function"
            ? config.items(config.payload)
            : config.items;

        registerElementMenu(node, {
          ...config,
          items: resolvedItems,
        });
      } else {
        elementRef.current = null;
      }
    },
    [config],
  );

  return setRef;
}