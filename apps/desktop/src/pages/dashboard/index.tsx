import { Btn, toast } from "@/src/components/base";
import { CheckCircle, AlertCircle, AlertTriangle, Info, Sparkles, Gift, Zap, SendHorizontal } from "lucide-react";

export const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-start p-8 min-h-screen w-full gap-8 overflow-y-auto bg-black text-white selection:bg-sky-500 selection:text-black">
      {/* Page Header */}
      <div className="w-full max-w-4xl flex flex-col gap-2 border-b border-gray-900 pb-6">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-widest text-sky-400 bg-sky-950/40 border border-sky-800/30 rounded-full">
            Component Audit
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
          Toast Notification Showcase
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl">
          All triggers use a consistent object-based API. Every field is named explicitly so the call site is always self-documenting.
        </p>
      </div>

      {/* Toast Triggers */}
      <div className="w-full max-w-4xl p-6 bg-gray-950 border border-gray-900 rounded-2xl shadow-xl flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="text-sky-400" size={20} />
            <h2 className="text-xl font-bold tracking-tight text-white">Global Toast Notification System</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            All values are passed as a single object. Success & Error show a close button, Warning & Info do not.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mt-2">
          {/* Success — with close */}
          <Btn
            onClick={() => toast.success({
              title: "Transaction Committed",
              description: "Expense record has been successfully saved to the database.",
              showClose: true,
            })}
            className="rounded-lg bg-emerald-950/60 border border-emerald-850/30 hover:bg-emerald-900/50 text-emerald-400 hover:text-emerald-300 font-semibold text-xs transition-all px-4 py-2"
          >
            <CheckCircle size={14} className="mr-1" /> Success (With Close)
          </Btn>

          {/* Error — with close */}
          <Btn
            onClick={() => toast.error({
              title: "Database Sync Failed",
              description: "Unable to establish handshake with banking API. Retrying...",
              showClose: true,
            })}
            className="rounded-lg bg-red-950/60 border border-red-850/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 font-semibold text-xs transition-all px-4 py-2"
          >
            <AlertCircle size={14} className="mr-1" /> Error (With Close)
          </Btn>

          {/* Warning — no close */}
          <Btn
            onClick={() => toast.warning({
              title: "Budget Cap Warned",
              description: "You have exhausted 90% of your entertainment budget for May.",
            })}
            className="rounded-lg bg-amber-950/60 border border-amber-850/30 hover:bg-amber-900/50 text-amber-400 hover:text-amber-300 font-semibold text-xs transition-all px-4 py-2"
          >
            <AlertTriangle size={14} className="mr-1" /> Warning (No Close)
          </Btn>

          {/* Info — no close */}
          <Btn
            onClick={() => toast.info({
              title: "Sync Complete",
              description: "Categorization engine processed 14 new transactions.",
            })}
            className="rounded-lg bg-sky-950/60 border border-sky-850/30 hover:bg-sky-900/50 text-sky-400 hover:text-sky-300 font-semibold text-xs transition-all px-4 py-2"
          >
            <Info size={14} className="mr-1" /> Info (No Close)
          </Btn>

          {/* Custom — violet, default icon */}
          <Btn
            onClick={() => toast({
              type: "custom",
              title: "Premium Upgrade",
              description: "Unlock bank accounts integration and advanced projections. Upgrade to Pro!",
              showClose: true,
            })}
            className="rounded-lg bg-violet-950/60 border border-violet-800/30 hover:bg-violet-900/50 text-violet-400 hover:text-violet-300 font-semibold text-xs transition-all px-4 py-2"
          >
            <Sparkles size={14} className="mr-1" /> Custom Violet
          </Btn>

          {/* Custom — pink, custom Gift icon */}
          <Btn
            onClick={() => toast({
              type: "custom",
              title: "Weekly Reward!",
              description: "You earned 500 bonus points for categorization streaks. Claim now!",
              showClose: true,
              icon: <Gift className="text-pink-400 shrink-0 mt-0.5" size={18} />,
              borderColor: "border-pink-500/20",
              bgGlow: "shadow-pink-500/5",
              accentColor: "bg-pink-500",
            })}
            className="rounded-lg bg-pink-950/60 border border-pink-800/30 hover:bg-pink-900/50 text-pink-400 hover:text-pink-300 font-semibold text-xs transition-all px-4 py-2"
          >
            <Gift size={14} className="mr-1" /> Custom Pink + Icon
          </Btn>

          {/* Custom — full color override (yellow) */}
          <Btn
            onClick={() => toast({
              type: "custom",
              title: "Power Mode Activated",
              description: "All analytics pipelines are now running at maximum capacity.",
              showClose: true,
              icon: <Zap className="text-yellow-300 shrink-0 mt-0.5" size={18} />,
              bgColor: "bg-yellow-950/80",
              borderColor: "border-yellow-500/20",
              accentColor: "bg-yellow-400",
              bgGlow: "shadow-yellow-500/5",
              titleColor: "text-yellow-200",
              descriptionColor: "text-yellow-100/60",
            })}
            className="rounded-lg bg-yellow-950/60 border border-yellow-800/30 hover:bg-yellow-900/50 text-yellow-400 hover:text-yellow-300 font-semibold text-xs transition-all px-4 py-2"
          >
            <Zap size={14} className="mr-1" /> Full Custom Colors (Yellow)
          </Btn>
        </div>
      </div>
      {/* Dismiss Demo Section */}
      <div className="w-full max-w-4xl p-6 bg-gray-950 border border-gray-900 rounded-2xl shadow-xl flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-2">
            <SendHorizontal className="text-sky-400" size={20} />
            <h2 className="text-xl font-bold tracking-tight text-white">Custom ID & Dismiss Patterns</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Two ways to dismiss a toast — via <code className="text-sky-400 bg-gray-900 px-1 rounded">toast.dismiss(id)</code> or by passing{" "}
            <code className="text-sky-400 bg-gray-900 px-1 rounded">dismiss: "id"</code> inside the next toast object.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {/* Pattern 1 — toast.dismiss(id) */}
          <div className="flex flex-col gap-2 p-4 bg-gray-900 border border-gray-800 rounded-xl">
            <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-widest">Pattern 1 — toast.dismiss(id)</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Show an info toast with a custom ID, then manually call <code className="text-sky-300">toast.dismiss()</code> before showing the success.
            </p>
            <div className="flex gap-2 mt-1">
              <Btn
                onClick={() => toast.info({
                  id: "form-submit",
                  title: "Sending Report...",
                  description: "Your expense report is being uploaded to the server.",
                  duration: Infinity,
                })}
                className="rounded-lg bg-sky-950/60 border border-sky-800/30 hover:bg-sky-900/50 text-sky-400 font-semibold text-xs transition-all px-3 py-2"
              >
                <Info size={13} className="mr-1" /> Show Info
              </Btn>
              <Btn
                onClick={() => {
                  toast.dismiss("form-submit");
                  toast.success({
                    title: "Report Submitted!",
                    description: "Your data was saved to the server successfully.",
                    showClose: true,
                  });
                }}
                className="rounded-lg bg-emerald-950/60 border border-emerald-800/30 hover:bg-emerald-900/50 text-emerald-400 font-semibold text-xs transition-all px-3 py-2"
              >
                <CheckCircle size={13} className="mr-1" /> Dismiss → Success
              </Btn>
            </div>
          </div>

          {/* Pattern 2 — dismiss field inside next toast */}
          <div className="flex flex-col gap-2 p-4 bg-gray-900 border border-gray-800 rounded-xl">
            <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-widest">Pattern 2 — dismiss: "id" inside toast</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Show an info toast with a custom ID, then pass <code className="text-sky-300">dismiss: "id"</code> inside the next toast — it auto-dismisses the first.
            </p>
            <div className="flex gap-2 mt-1">
              <Btn
                onClick={() => toast.info({
                  id: "form-upload",
                  title: "Uploading File...",
                  description: "Your attachment is being processed by the server.",
                  duration: Infinity,
                })}
                className="rounded-lg bg-sky-950/60 border border-sky-800/30 hover:bg-sky-900/50 text-sky-400 font-semibold text-xs transition-all px-3 py-2"
              >
                <Info size={13} className="mr-1" /> Show Info
              </Btn>
              <Btn
                onClick={() => toast.success({
                  dismiss: "form-upload",
                  title: "Upload Complete!",
                  description: "Your file was processed and stored successfully.",
                  showClose: true,
                })}
                className="rounded-lg bg-emerald-950/60 border border-emerald-800/30 hover:bg-emerald-900/50 text-emerald-400 font-semibold text-xs transition-all px-3 py-2"
              >
                <CheckCircle size={13} className="mr-1" /> Auto-dismiss → Success
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
