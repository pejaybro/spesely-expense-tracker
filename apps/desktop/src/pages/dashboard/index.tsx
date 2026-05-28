import { useState } from "react";
import { Spinner, type SpinnerVariant } from "@/src/components/base/spinner";
import { Pagination } from "@/src/components/base/pagination";
import { NumberInput } from "@/src/components/base/form";
import { Progress } from "@/src/components/base/progress";

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

const PROGRESS_VARIANTS = [
  { key: "line",      label: "Line Fill",      desc: "Sleek solid background horizontal fill" },
  { key: "striped",   label: "Striped Slide",  desc: "Diagonal violet stripes sliding continuously" },
  { key: "gradient",  label: "Gradient Flow",  desc: "Multi-color smooth horizontal flow" },
  { key: "segmented", label: "Segment Blocks", desc: "Discrete block segments auto-fitting in space" },
  { key: "circle",    label: "Circular Ring",  desc: "SVG-based circular path drawing itself" },
] as const;

export const Dashboard = () => {
  const [activePage, setActivePage] = useState(3);
  const [demoNum, setDemoNum] = useState("42");
  const [progressVal, setProgressVal] = useState(65);
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

      {/* ── PROGRESS BAR SHOWCASE ── */}
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-bold text-white tracking-tight">Progress Variants</h1>
            <p className="text-zinc-500 text-xs">4 premium custom styles with interactive controllers</p>
          </div>

          {/* Interactive Controller */}
          <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-900 px-3.5 py-2 rounded-xl">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Control</span>
            <input
              type="range"
              min="0"
              max="100"
              value={progressVal}
              onChange={(e) => setProgressVal(Number(e.target.value))}
              className="w-24 accent-white bg-zinc-800 cursor-pointer h-1 rounded"
            />
            <span className="text-xs font-bold font-mono text-white w-8 text-right">{progressVal}%</span>
          </div>
        </div>

        {/* Showcase grid */}
        <div className="flex flex-col gap-3">
          {PROGRESS_VARIANTS.map(({ key, label, desc }) => (
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
              <div className="flex-1 flex justify-center items-center py-4 px-6 bg-zinc-900/50 rounded-xl border border-zinc-800/40 min-h-[56px]">
                <div className="w-full flex items-center justify-center">
                  {key === "circle" ? (
                    <div className="flex gap-8 items-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <Progress value={progressVal} variant="circle" showCircleLabel={true} />
                        <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">With Label</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5">
                        <Progress value={progressVal} variant="circle" showCircleLabel={false} />
                        <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">No Label</span>
                      </div>
                    </div>
                  ) : (
                    <Progress
                      value={progressVal}
                      variant={key}
                      showLabel={true}
                      label={
                        key === "line"
                          ? "Database Sync"
                          : key === "gradient"
                          ? "Asset Flowing"
                          : key === "striped"
                          ? "Photoshop"
                          : undefined
                      }
                      labelPosition={key === "line" ? "bottom" : "top"}
                      height={key === "striped" ? 8 : 6}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
