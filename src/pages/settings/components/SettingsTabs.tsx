import { HorizontalTabMenu } from "@/src/pejay-ui/components";
import { CategoriesSettings } from "./CategoriesSettings";

const TAB_PANELS: Record<string, React.ReactNode> = {
  categories: <CategoriesSettings />,
};

export const SettingsTabs = () => {
  return (
    <div className="flex flex-col w-full">
      <HorizontalTabMenu />
      {/* Temporary panel — will be driven by active tab once wired */}
      <div>{TAB_PANELS["categories"]}</div>
    </div>
  );
};
