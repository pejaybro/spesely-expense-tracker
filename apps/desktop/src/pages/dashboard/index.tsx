import {
  useContextMenuStore,
  useDoubleClickAction,
} from "@/src/components/base/context-menu";
import { Btn } from "@/src/components/base";
import { Globe, MoreVertical, Copy } from "lucide-react";

export const Dashboard = () => {
  // Left‑click three‑dot menu (static items)
  const { open: openMenu } = useContextMenuStore();

  const leftClickMenuItems = [
    { id: "edit", label: "Edit", onClick: () => console.log("Edit") },
    { id: "delete", label: "Delete", onClick: () => console.log("Delete") },
    { id: "view", label: "View", onClick: () => console.log("View") },
  ];

  const handleLeftClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    openMenu(rect.right, rect.bottom, leftClickMenuItems);
  };

  // Nested Submenu items
  const nestedMenuItems = [
    { id: "share", label: "Share", onClick: () => console.log("Share") },
    {
      id: "export",
      label: "Export",
      children: [
        { id: "pdf", label: "Download PDF", onClick: () => console.log("PDF") },
        {
          id: "email-export",
          label: "Send via Email",
          children: [
            {
              id: "personal",
              label: "To Personal",
              onClick: () => console.log("Personal Email"),
            },
            {
              id: "work",
              label: "To Work",
              onClick: () => console.log("Work Email"),
            },
          ],
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      onClick: () => console.log("Settings"),
    },
  ];

  const handleNestedLeftClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    openMenu(rect.right, rect.bottom, nestedMenuItems);
  };

  // Divider demo items — right-click the dark area below
  const dividerMenuItems = [
    { id: "cut", label: "Cut", onClick: () => console.log("Cut") },
    { id: "copy", label: "Copy", onClick: () => console.log("Copy") },
    { id: "paste", label: "Paste", onClick: () => console.log("Paste") },
    { id: "div-1", type: "divider" as const },
    { id: "rename", label: "Rename", onClick: () => console.log("Rename") },
    { id: "move", label: "Move to", onClick: () => console.log("Move") },
    { id: "div-2", type: "divider" as const },
    { id: "delete", label: "Delete", disabled: true, onClick: () => console.log("Delete") },
  ];

  const handleDividerAreaRightClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    openMenu(e.clientX, e.clientY, dividerMenuItems);
  };

  // Centralized hook registry copy-cell call
  const doubleClickRef = useDoubleClickAction("copy-cell", {
    value: "double-click-btn-value@example.com",
    label: "Email",
  });

  return (
    <div className="flex flex-col items-center justify-start p-8 min-h-screen w-full gap-8 bg-black text-white">
      <div className="w-full max-w-2xl flex flex-col gap-2 border-b border-gray-900 pb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          Context Menu Demo
        </h1>
        <p className="text-gray-400 text-sm">
          Three levels: element, page (URL), and default.
        </p>
      </div>

      {/* Left‑click three‑dot button */}
      <div className="w-full max-w-2xl p-6 bg-gray-950 border border-gray-900 rounded-2xl flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-bold text-white">Button Menu (Left Click)</h2>
          <Btn variant="outline" onClick={handleLeftClick}>
            <MoreVertical size={18} />
          </Btn>
        </div>
        <p className="text-xs text-gray-500">
          Click the three‑dot button to open a static menu (Edit / Delete /
          View). The actions just log to console.
        </p>
      </div>

      {/* Nested Submenu button */}
      <div className="w-full max-w-2xl p-6 bg-gray-950 border border-gray-900 rounded-2xl flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-bold text-white">Nested Submenu (Left Click)</h2>
          <Btn variant="outline" onClick={handleNestedLeftClick}>
            Open Nested Menu
          </Btn>
        </div>
        <p className="text-xs text-gray-500">
          Click to open a menu with nested submenus: Share - Export -Send via
          Email - To Personal / To Work.
        </p>
      </div>

      {/* Divider demo — dark right-click area */}
      <div className="w-full max-w-2xl p-6 bg-gray-950 border border-gray-900 rounded-2xl flex flex-col gap-3">
        <h2 className="font-bold text-white">Divider Groups (Right Click)</h2>
        <p className="text-xs text-gray-500">
          Right-click inside the dark area below to see a grouped menu with divider separators.
        </p>
        <div
          onContextMenu={handleDividerAreaRightClick}
          className="w-full h-32 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600 text-xs select-none cursor-context-menu"
        >
          Right-click anywhere in here
        </div>
      </div>

      {/* Double-click Action */}
      <div className="w-full max-w-2xl p-6 bg-gray-950 border border-gray-900 rounded-2xl flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-bold text-white">Double-click Action</h2>
          <div ref={doubleClickRef as React.RefObject<HTMLDivElement>}>
            <Btn variant="outline">
              <Copy size={16} className="mr-1" /> Double-click me
            </Btn>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Double-click this button to copy the email address value and show a
          local feedback tooltip right above it saying "Email Copied!".
        </p>
      </div>

      {/* Page-level */}
      <div className="w-full max-w-2xl p-6 bg-gray-950 border border-gray-900 rounded-2xl flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Globe className="text-sky-400" size={18} />
          <h2 className="font-bold text-white">Page Level</h2>
        </div>
        <p className="text-xs text-gray-500">
          Right-click anywhere on these pages to see route-specific menus:
        </p>
        <ul className="text-sm text-gray-300 list-disc list-inside flex flex-col gap-1">
          <li>
            <span className="text-violet-400">/expense</span> — replaces menu
            with Add Expense + Export (PDF/CSV submenu)
          </li>
          <li>
            <span className="text-sky-400">/income</span> — extends base menu
            with Add Income + Export
          </li>
          <li>
            <span className="text-gray-500">Anywhere else</span> — default base
            menu (Refresh, Back, Forward)
          </li>
        </ul>
      </div>
    </div>
  );
};
