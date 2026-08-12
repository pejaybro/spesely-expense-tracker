import type { Demo } from "@/types/db/interface/demo.interface";

export type DemoView = Demo & {
  label: string;
};

export const DemoMappers = {
  item(demo: Demo): DemoView {
    return {
      ...demo,
      label: demo.demo,
    };
  },
  list(demos: Demo[]): DemoView[] {
    return demos.map(DemoMappers.item);
  },
};
