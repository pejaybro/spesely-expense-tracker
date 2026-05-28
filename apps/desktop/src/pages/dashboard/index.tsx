import { useState } from "react";
import { SelectInput, MultiSelectInput, type SelectOption } from "@/src/components/base/select-dropdown";
import { Sparkles, Calendar, Tag, CreditCard, Layers } from "lucide-react";

export const Dashboard = () => {
  // Option lists
  const defaultOptions: SelectOption[] = [
    { id: "opt-1", label: "Personal Expense Tracker", key: "personal" },
    { id: "opt-2", label: "Business Overhead Expense", key: "business" },
    { id: "opt-3", label: "Shared Travel Log", key: "travel" },
  ];

  const iconOptions: SelectOption[] = [
    { id: "cat-1", label: "Food & Dining out with family", key: "food" },
    { id: "cat-2", label: "Home Utilities & Rent bills", key: "utilities" },
    { id: "cat-3", label: "Entertainment & Leisure streaming", key: "leisure" },
  ];

  const longTextOptions: SelectOption[] = [
    {
      id: "long-1",
      label: "This is an extremely long option name that will exceed the width of the input button trigger, causing it to display ellipsis (...) in the button but wrap cleanly into multiple lines within the dropdown list view.",
      key: "extreme-wrap",
    },
    { id: "long-2", label: "Short option 2", key: "short-2" },
    { id: "long-3", label: "Short option 3", key: "short-3" },
  ];

  // Controlled states
  const [selectedBudget, setSelectedBudget] = useState("business");
  const [selectedCategory, setSelectedCategory] = useState("utilities");
  const [selectedLongOpt, setSelectedLongOpt] = useState("extreme-wrap");

  // Controlled states for MultiSelect
  const [multiValCount, setMultiValCount] = useState<string[]>(["personal", "business"]);
  const [multiValChips, setMultiValChips] = useState<string[]>(["personal"]);

  return (
    <div className="flex flex-col items-center justify-start p-8 min-h-screen w-full gap-8 bg-black text-white">
      {/* Header */}
      <div className="w-full max-w-2xl flex flex-col gap-2 border-b border-gray-900 pb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Sparkles className="text-sky-400" size={24} />
          Select Input Demo
        </h1>
        <p className="text-gray-400 text-sm">
          A premium variation of custom select inputs using Floating UI.
        </p>
      </div>

      {/* Grid of variations */}
      <div className="w-full max-w-2xl flex flex-col gap-6">
        
        {/* 1. Default Uncontrolled Select */}
        <div className="p-6 bg-gray-950 border border-gray-900 rounded-2xl flex flex-col gap-3">
          <h2 className="font-bold text-white text-sm">1. Uncontrolled Default Select</h2>
          <p className="text-xs text-gray-500">
            No value passed. Automatically defaults to selecting the first value in the array.
          </p>
          <div className="w-64">
            <SelectInput options={defaultOptions} />
          </div>
        </div>

        {/* 2. Controlled Select with Prefix Icon */}
        <div className="p-6 bg-gray-950 border border-gray-900 rounded-2xl flex flex-col gap-3">
          <h2 className="font-bold text-white text-sm">2. Controlled Select + Prefix Icon</h2>
          <p className="text-xs text-gray-500">
            Passes a prefix icon on the left, handles selection changes via <code className="text-sky-400">onChange</code>.
          </p>
          <div className="flex flex-col gap-2 w-64">
            <label className="text-xs text-zinc-400">Select Budget Ledger</label>
            <SelectInput
              options={defaultOptions}
              value={selectedBudget}
              prefixIcon={<CreditCard size={16} />}
              onChange={(key) => setSelectedBudget(key)}
            />
            <span className="text-xs text-zinc-500">
              Active Key: <strong className="text-zinc-300">{selectedBudget}</strong>
            </span>
          </div>
        </div>

        {/* 3. Text Wrapping / Truncating Behavior */}
        <div className="p-6 bg-gray-950 border border-gray-900 rounded-2xl flex flex-col gap-3">
          <h2 className="font-bold text-white text-sm">3. Truncation vs wrapping text</h2>
          <p className="text-xs text-gray-500">
            The button trigger limits long labels to a single line using ellipsis. Open the dropdown to see the option wrap naturally into multiple lines.
          </p>
          <div className="w-80">
            <SelectInput
              options={longTextOptions}
              value={selectedLongOpt}
              prefixIcon={<Tag size={16} />}
              showTooltip
              onChange={(key) => setSelectedLongOpt(key)}
            />
          </div>
        </div>

        {/* 4. Disabled Select */}
        <div className="p-6 bg-gray-950 border border-gray-900 rounded-2xl flex flex-col gap-3">
          <h2 className="font-bold text-white text-sm">4. Disabled Select</h2>
          <p className="text-xs text-gray-500">
            Inoperable state, cannot receive keyboard focus or open.
          </p>
          <div className="w-64">
            <SelectInput
              options={defaultOptions}
              prefixIcon={<Calendar size={16} />}
              disabled
            />
          </div>
        </div>

        {/* 5. MultiSelect - Default (Count Mode) */}
        <div className="p-6 bg-gray-950 border border-gray-900 rounded-2xl flex flex-col gap-3">
          <h2 className="font-bold text-white text-sm">5. MultiSelect Dropdown (Count Mode)</h2>
          <p className="text-xs text-gray-500">
            Default display mode. Summarizes the selected values using a numeric count.
          </p>
          <div className="flex flex-col gap-2 w-72">
            <MultiSelectInput
              options={defaultOptions}
              value={multiValCount}
              prefixIcon={<Layers size={16} />}
              showTooltip
              onChange={(keys) => setMultiValCount(keys)}
            />
            <span className="text-xs text-zinc-500">
              Selected: <strong className="text-zinc-300">{multiValCount.join(", ") || "None"}</strong>
            </span>
          </div>
        </div>

        {/* 6. MultiSelect - Chips Mode */}
        <div className="p-6 bg-gray-950 border border-gray-900 rounded-2xl flex flex-col gap-3">
          <h2 className="font-bold text-white text-sm">6. MultiSelect Dropdown (Chips Mode)</h2>
          <p className="text-xs text-gray-500">
            Renders selected values as separate tags/chips inside the input bar. Deletable with the "x" mark or backspace key when focused.
          </p>
          <div className="flex flex-col gap-2 w-80">
            <MultiSelectInput
              options={defaultOptions}
              value={multiValChips}
              displayMode="chips"
              prefixIcon={<Layers size={16} />}
              showTooltip
              onChange={(keys) => setMultiValChips(keys)}
            />
            <span className="text-xs text-zinc-500">
              Selected: <strong className="text-zinc-300">{multiValChips.join(", ") || "None"}</strong>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
