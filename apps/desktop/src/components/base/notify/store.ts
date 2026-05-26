import type { NotifyItem } from "./types";

type Listener = (item: NotifyItem | null) => void;
let memoryState: NotifyItem | null = null;
let listener: Listener | null = null;

function dispatch() {
  listener?.(memoryState);
}

export function subscribe(l: Listener) {
  listener = l;

  listener(memoryState);

  return () => {
    listener = null;
  };
}

export function notify(item: Omit<NotifyItem, "id">) {
  const newItem: NotifyItem = {
    id: crypto.randomUUID(),
    ...item,
  };

  memoryState = newItem;

  dispatch();

  return newItem.id;
}

export function dismiss() {
  memoryState = null;

  dispatch();
}