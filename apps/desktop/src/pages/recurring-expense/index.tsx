export const RecurringExpense = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-black tracking-tight">Subscriptions</h1>
        <p className="text-lg opacity-40 font-medium italic">Manage recurring payments and automated bills.</p>
      </div>
      <div className="w-24 h-1 bg-pink-500 rounded-full opacity-50" />
      <div className="mt-12 p-12 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center text-sm font-bold opacity-20 uppercase tracking-[0.2em]">
        Recurring List Placeholder
      </div>
    </div>
  );
};
