import type { ContextMenuItem } from "./types";

type ElementMode = "replace" | "extend";

type ElementConfig = {
  mode: ElementMode;
  items: ContextMenuItem[];
};

const registry = new WeakMap<HTMLElement, ElementConfig>();

export function registerElementMenu(
  element: HTMLElement,
  config: ElementConfig,
) {
  registry.set(element, config);
}

export function getElementContextMenu(
  target: EventTarget | null,
): ElementConfig | null {
  if (!(target instanceof HTMLElement)) {
    return null;
  }

  let current: HTMLElement | null = target;

  while (current) {
    const config = registry.get(current);

    if (config) {
      return config;
    }

    current = current.parentElement;
  }

  return null;
}