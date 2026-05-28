import { Skeleton } from "@/src/components/base/skeleton";

export const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-start py-12 px-4 min-h-screen w-full gap-12 bg-black text-white select-none">

      {/* ── SKELETON LOADER SHOWCASE ── */}
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold text-white tracking-tight">Skeleton Loader</h1>
          <p className="text-zinc-500 text-xs">Pulsing shimmer placeholders that adapt to any custom layout grid</p>
        </div>

        {/* Showcase card */}
        <div className="flex flex-col gap-6 p-6 bg-zinc-950 border border-zinc-900 rounded-2xl">
          {/* Card adaptation example */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-zinc-400">Widget Profile Card Layout</h3>
            <div className="flex items-center gap-4 p-4 bg-zinc-900/40 border border-zinc-800/40 rounded-xl w-72">
              <Skeleton variant="circle" width={44} height={44} />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton variant="text" width="80%" height={10} />
                <Skeleton variant="text" width="50%" height={8} />
              </div>
            </div>
          </div>

          {/* Grid adaptation example */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-zinc-400">Complex Grid Widget Layout</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-3 flex flex-col gap-2 p-3 bg-zinc-900/40 border border-zinc-800/40 rounded-xl">
                <Skeleton variant="rect" height={80} className="w-full" />
                <div className="flex justify-between items-center mt-1">
                  <Skeleton variant="text" width={60} height={10} />
                  <Skeleton variant="text" width={40} height={10} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
