export const Dashboard = () => {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-5xl font-black tracking-tight underline decoration-violet-c1 decoration-8 underline-offset-8">
        Dashboard
      </h1>
      <p className="text-lg opacity-60 max-w-2xl">
        This is your central command center. All your expense data and analytics will manifest here.
      </p>
      
      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="h-40 bg-white/5 rounded-2xl border border-white/10 p-6 flex flex-col justify-end">
          <div className="text-3xl font-bold font-mono">$12,450.00</div>
          <div className="text-xs uppercase opacity-40 font-bold">Income</div>
        </div>
        <div className="h-40 bg-white/5 rounded-2xl border border-white/10 p-6 flex flex-col justify-end">
          <div className="text-3xl font-bold font-mono">$4,200.50</div>
          <div className="text-xs uppercase opacity-40 font-bold">Expenses</div>
        </div>
      </div>
    </div>
  );
};
