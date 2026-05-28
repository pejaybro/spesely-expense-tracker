import { useState, useEffect } from "react";
import { MultiSelectInput, SelectInput, type SelectOption } from "@/src/components/base/select-dropdown";
import { Sparkles, Loader2, RotateCcw, CheckCircle, HelpCircle, Folder } from "lucide-react";

export const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedMultiValue, setSelectedMultiValue] = useState<string[]>([]);
  const [scenario, setScenario] = useState<"success" | "empty">("success");

  // State for static prefix icon example (initialized with multiple categories to show scrollbar)
  const [staticMultiValue, setStaticMultiValue] = useState<string[]>([
    "opt-1", "opt-2", "opt-3", "opt-4", "opt-5"
  ]);

  const loadData = () => {
    setIsLoading(true);
    setOptions([]);
    setSelectedValue("");
    setSelectedMultiValue([]);

    setTimeout(() => {
      if (scenario === "success") {
        setOptions([
          { id: "opt-1", label: "Personal Expense Tracker", key: "personal" },
          { id: "opt-2", label: "Business Overhead Expense", key: "business" },
          { id: "opt-3", label: "Shared Travel Log", key: "travel" },
        ]);
      } else {
        // Empty API result case
        setOptions([]);
      }
      setIsLoading(false);
    }, 3000);
  };

  // Run simulation whenever scenario changes or on mount
  useEffect(() => {
    loadData();
  }, [scenario]);

  return (
    <div className="flex flex-col items-center justify-start py-12 px-4 min-h-screen w-full gap-8 bg-black text-white select-none">
      
      {/* 1. API Simulator Component */}
      <div className="w-full max-w-xl flex flex-col gap-6 p-8 bg-zinc-950 border border-zinc-900 rounded-3xl shadow-2xl items-center text-center">
        {/* Decorative Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-sky-500/20 bg-sky-950/20 text-xs font-semibold text-sky-400">
          <Sparkles size={12} className="animate-pulse" />
          API Loading Simulator
        </div>

        {/* Text Area */}
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-bold tracking-tight text-white">
            Custom Select Trigger
          </h1>
          <p className="text-zinc-400 text-xs max-w-xs leading-relaxed">
            Mimicking a 3-second async API delay. The inputs display <code className="text-sky-400">"Loading..."</code> with a spinner, blocking dropdown interaction until options arrive.
          </p>
        </div>

        {/* Scenario Select Buttons */}
        <div className="flex gap-2 p-1 bg-zinc-900 border border-zinc-800/80 rounded-xl w-full">
          <button
            onClick={() => setScenario("success")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              scenario === "success"
                ? "bg-zinc-800 text-white shadow-sm font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Delivers Options
          </button>
          <button
            onClick={() => setScenario("empty")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              scenario === "empty"
                ? "bg-zinc-800 text-white shadow-sm font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Delivers Empty []
          </button>
        </div>

        {/* Simulator Element */}
        <div className="w-full py-4 flex flex-col md:flex-row gap-4 justify-center items-center">
          <div className="w-64 flex flex-col gap-1 text-left">
            <label className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Single Select</label>
            <SelectInput
              options={options}
              value={selectedValue}
              loading={isLoading}
              placeholder="Select Ledger Account"
              onChange={(key) => setSelectedValue(key)}
            />
          </div>

          <div className="w-64 flex flex-col gap-1 text-left">
            <label className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Multi Select (Chips)</label>
            <MultiSelectInput
              options={options}
              value={selectedMultiValue}
              loading={isLoading}
              displayMode="chips"
              placeholder="Select Categories"
              onChange={(keys) => setSelectedMultiValue(keys)}
            />
          </div>
        </div>

        {/* Status Indicator & Reload Trigger */}
        <div className="flex flex-col items-center gap-4 border-t border-zinc-900 w-full pt-6">
          <div className="flex items-center gap-2 text-xs">
            {isLoading ? (
              <>
                <Loader2 size={12} className="animate-spin text-sky-400" />
                <span className="text-zinc-500">Fetching API database options...</span>
              </>
            ) : options.length > 0 ? (
              <>
                <CheckCircle size={12} className="text-emerald-500" />
                <span className="text-emerald-400 font-medium">Data Loaded successfully!</span>
              </>
            ) : (
              <>
                <HelpCircle size={12} className="text-zinc-400" />
                <span className="text-zinc-400 font-medium">API returned no records (Empty []).</span>
              </>
            )}
          </div>

          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700 hover:text-white rounded-lg transition-all"
          >
            <RotateCcw size={12} />
            Rerun Current Simulation
          </button>
        </div>
      </div>

      {/* 2. Chips mode prefix icon alignment example */}
      <div className="w-full max-w-xl flex flex-col gap-4 p-8 bg-zinc-950 border border-zinc-900 rounded-3xl shadow-2xl items-center text-center">
        <div className="flex flex-col gap-1.5 w-full text-left">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Folder className="text-sky-400" size={16} />
            Multi Select Chips (Scrollable Chips & Prefix Example)
          </h2>
          <p className="text-zinc-500 text-xs leading-relaxed">
            Select multiple values to see how the chips container wraps and restricts height to a maximum scrollable limit of 82px.
          </p>
        </div>

        <div className="w-72 self-start flex flex-col gap-1 text-left">
          <label className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Categories (Chips Mode)</label>
          <MultiSelectInput
            options={[
              { id: "opt-1", label: "Personal Expense", key: "opt-1" },
              { id: "opt-2", label: "Business Overhead", key: "opt-2" },
              { id: "opt-3", label: "Shared Travel", key: "opt-3" },
              { id: "opt-4", label: "Entertainment Streaming", key: "opt-4" },
              { id: "opt-5", label: "Home Utilities", key: "opt-5" },
              { id: "opt-6", label: "Healthcare & Medicine", key: "opt-6" },
              { id: "opt-7", label: "Automotive fuel & repairs", key: "opt-7" },
              { id: "opt-8", label: "Education & training", key: "opt-8" },
              { id: "opt-9", label: "Groceries & Food", key: "opt-9" },
              { id: "opt-10", label: "Subscriptions", key: "opt-10" },
            ]}
            value={staticMultiValue}
            displayMode="chips"
            prefixIcon={<Folder size={14} />}
            placeholder="Select categories"
            onChange={(keys) => setStaticMultiValue(keys)}
          />
        </div>
      </div>

    </div>
  );
};
