export const DemoKeys = {
  root: () => ["demo"] as const,
  list: () => [...DemoKeys.root(), "list"] as const,
  detail: (id: number) => [...DemoKeys.root(), "detail", id] as const,
};
