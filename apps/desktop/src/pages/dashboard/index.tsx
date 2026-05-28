import { useState } from "react";
import { Spinner, type SpinnerVariant } from "@/src/components/base/spinner";
import { Pagination } from "@/src/components/base/pagination";
import { NumberInput } from "@/src/components/base/form";

const VARIANTS: { key: SpinnerVariant; label: string; desc: string }[] = [
  { key: "ring",      label: "Ring",      desc: "Single arc rotating 360°" },
  { key: "dots",      label: "Dots",      desc: "3 dots fading in sequence" },
  { key: "pulse",     label: "Pulse",     desc: "Circle pulsing in/out" },
  { key: "bars",      label: "Bars",      desc: "3 bars scaling up/down" },
  { key: "orbit",     label: "Orbit",     desc: "Dot orbiting a static ring" },
  { key: "ripple",    label: "Ripple",    desc: "Two rings expanding & fading" },
  { key: "dots-ring", label: "Dots Ring", desc: "Dots arranged in a circle fading" },
  { key: "dots-step", label: "Dots Step", desc: "Dots appearing sequentially (., .., ...)" },
  { key: "text-dots", label: "Text Dots", desc: "Inline typographic dots (., .., ...)" },
];

const PAGINATION_VARIANTS = [
  { key: "simple",   label: "Simple Mode",   desc: "Classic next/prev and text layout" },
  { key: "mini",     label: "Mini Mode",     desc: "Compact icons-only design" },
  { key: "numeric",  label: "Numeric Mode",  desc: "Interactive page list & ellipsis" },
  { key: "full",     label: "Full Mode",     desc: "All controls with quick jump" },
  { key: "dropdown", label: "Dropdown Jump", desc: "Select direct page from dropdown list" },
  { key: "input",    label: "Input Jump",    desc: "Type a page number and hit Enter" },
] as const;

export const Dashboard = () => {
  const [activePage, setActivePage] = useState(3);
  const [demoNum, setDemoNum] = useState("42");
  const totalPages = 12;

  const handleNext = () => setActivePage((p) => Math.min(p + 1, totalPages));
  const handlePrev = () => setActivePage((p) => Math.max(p - 1, 1));

  return (
    <div className="flex flex-col items-center justify-start py-12 px-4 min-h-screen w-full gap-12 bg-black text-white select-none">

      {/* ── SPINNERS SHOWCASE ── */}
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold text-white tracking-tight">Spinner Variants</h1>
          <p className="text-zinc-500 text-xs">9 variants × 3 sizes — white only</p>
        </div>

        {/* Showcase grid */}
        <div className="flex flex-col gap-3">
          {VARIANTS.map(({ key, label, desc }) => (
            <div
              key={key}
              className="flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-900 rounded-2xl"
            >
              {/* Label */}
              <div className="w-24 shrink-0">
                <p className="text-xs font-semibold text-white">{label}</p>
                <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">{desc}</p>
              </div>

              {/* sm / md / lg */}
              <div className="flex-1 flex items-center justify-around py-4 bg-zinc-900/50 rounded-xl border border-zinc-800/40">
                {(["sm", "md", "lg"] as const).map((sz) => (
                  <div key={sz} className="flex flex-col items-center gap-2.5">
                    <Spinner variant={key} size={sz} />
                    <span className="text-[9px] text-zinc-600 uppercase tracking-widest">{sz}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PAGINATION SHOWCASE ── */}
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold text-white tracking-tight">Pagination Variants</h1>
          <p className="text-zinc-500 text-xs">Interactive state synced across premium variations</p>
        </div>

        {/* Showcase grid */}
        <div className="flex flex-col gap-3">
          {PAGINATION_VARIANTS.map(({ key, label, desc }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-6 p-4 bg-zinc-950 border border-zinc-900 rounded-2xl"
            >
              {/* Label */}
              <div className="w-40 shrink-0">
                <p className="text-xs font-semibold text-white">{label}</p>
                <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">{desc}</p>
              </div>

              {/* Component view */}
              <div className="flex-1 flex justify-end items-center py-3 px-4 bg-zinc-900/50 rounded-xl border border-zinc-800/40 min-h-[56px]">
                <Pagination
                  page={activePage}
                  totalPages={totalPages}
                  variant={key}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  onPageChange={setActivePage}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── NUMBER INPUT SHOWCASE ── */}
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold text-white tracking-tight">Number Input</h1>
          <p className="text-zinc-500 text-xs">Premium base custom numeric input with built-in steppers</p>
        </div>

        {/* Showcase card */}
        <div className="flex flex-col gap-3 p-6 bg-zinc-950 border border-zinc-900 rounded-2xl">
          <div className="flex flex-col gap-1.5 w-64">
            <label className="text-xs font-semibold text-zinc-400">Steppers Mode</label>
            <NumberInput
              value={demoNum}
              onChange={(e) => setDemoNum(e.target.value)}
              showSteppers={true}
              min={0}
              max={100}
            />
          </div>
          <span className="text-[10px] text-zinc-600 mt-2">
            Current State Value: <code className="text-white font-mono bg-zinc-900 px-1 py-0.5 rounded">{demoNum}</code>
          </span>
        </div>
      </div>

    </div>
  );
};
