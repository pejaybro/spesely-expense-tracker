import { Spinner, type SpinnerVariant } from "@/src/components/base/spinner";

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


export const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-start py-12 px-4 min-h-screen w-full gap-8 bg-black text-white select-none">

      {/* Header */}
      <div className="w-full max-w-2xl flex flex-col gap-1">
        <h1 className="text-lg font-bold text-white tracking-tight">Spinner Variants</h1>
        <p className="text-zinc-500 text-xs">9 variants × 3 sizes — white only</p>
      </div>

      {/* Showcase grid */}
      <div className="w-full max-w-2xl flex flex-col gap-3">
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
  );
};
