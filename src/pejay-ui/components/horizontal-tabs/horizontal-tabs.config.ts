import { Tag, type LucideIcon } from "lucide-react";

export interface HorizontalTabItem {
  id: string;
  name: string;
  icon?: LucideIcon;
}

export const MY_TABS: HorizontalTabItem[] = [
  { id: "categories", name: "Categories", icon: Tag },
];
