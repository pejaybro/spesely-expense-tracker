export const Settings = () => {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-5xl font-black tracking-tight">Settings</h1>
      <p className="text-lg opacity-60">
        Manage your preferences, account details, and security configuration.
      </p>
      
      <div className="flex flex-col gap-3 mt-8">
        <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center group hover:bg-white/10 transition-all cursor-pointer">
          <span className="font-bold opacity-80">Dark Mode</span>
          <div className="size-4 rounded-full bg-violet-c1 shadow-[0_0_8px_rgba(170,91,252,1)]" />
        </div>
        <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center group hover:bg-white/10 transition-all cursor-pointer">
          <span className="font-bold opacity-80">Sync to Cloud</span>
          <div className="size-4 rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
};
