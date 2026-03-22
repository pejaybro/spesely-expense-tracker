export const Goals = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-black tracking-tight">Financial Goals</h1>
        <p className="text-lg opacity-40 font-medium italic">Dream big and track your progress toward major milestones.</p>
      </div>
      <div className="w-24 h-1 bg-yellow-500 rounded-full opacity-50" />
      <div className="mt-12 p-12 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center text-sm font-bold opacity-20 uppercase tracking-[0.2em]">
        Goals Roadmap Placeholder
      </div>
    </div>
  );
};
