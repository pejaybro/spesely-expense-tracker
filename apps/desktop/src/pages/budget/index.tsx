export const Budget = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-black tracking-tight">Budget</h1>
        <p className="text-lg opacity-40 font-medium italic">Set boundaries for your spending and stay on track.</p>
      </div>
      <div className="w-24 h-1 bg-blue-500 rounded-full opacity-50" />
      <div className="mt-12 p-12 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center text-sm font-bold opacity-20 uppercase tracking-[0.2em]">
        Budget Configuration Placeholder
      </div>
    </div>
  );
};
