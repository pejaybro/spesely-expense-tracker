import React, { useState, useEffect, useCallback } from "react";
import {
  Flex,
  Button,
  Input,
  Spinner,
} from "@/src/components/base";
import {
  Database,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Zap,
  Terminal,
  Server,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import type { Demo } from "@/types/db/interface/demo.interface";

interface LogEntry {
  id: string;
  timestamp: string;
  type: "info" | "success" | "error";
  message: string;
}

export const DatabasePlayground: React.FC = () => {
  const [items, setItems] = useState<Demo[]>([]);
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const isElectron = typeof window !== "undefined" && Boolean(window.electronAPI);

  const addLog = useCallback((message: string, type: "info" | "success" | "error" = "info") => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [
      { id: `${Date.now()}-${Math.random()}`, timestamp: time, type, message },
      ...prev.slice(0, 49),
    ]);
  }, []);

  const handlePing = async () => {
    if (!isElectron) {
      setPingResult("Not connected (Web Browser Mode)");
      addLog("Ping attempt failed: electronAPI not available in browser mode", "error");
      return;
    }
    try {
      const res = await window.electronAPI.ping();
      setPingResult(res);
      addLog(`Ping successful! Server responded with: "${res}"`, "success");
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setPingResult("Error");
      addLog(`Ping error: ${errMsg}`, "error");
    }
  };

  const fetchItems = useCallback(async () => {
    setLoading(true);
    if (!isElectron) {
      // Mock data for web browser preview
      setTimeout(() => {
        setItems([
          { id: 1, demo: "Sample Mock Record 1", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: 2, demo: "Sample Mock Record 2", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        ]);
        setLoading(false);
        addLog("Loaded mock database records (Web Browser Mode)", "info");
      }, 300);
      return;
    }

    try {
      const data = await window.electronAPI.demo.getAll();
      setItems(data || []);
      addLog(`Fetched ${data?.length || 0} record(s) from SQLite database`, "success");
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      addLog(`Failed to fetch records: ${errMsg}`, "error");
    } finally {
      setLoading(false);
    }
  }, [isElectron, addLog]);

  useEffect(() => {
    fetchItems();
    if (isElectron) {
      handlePing();
    }
  }, [fetchItems, isElectron]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    if (!isElectron) {
      const newItem: Demo = {
        id: Date.now(),
        demo: newText.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setItems(prev => [newItem, ...prev]);
      setNewText("");
      addLog(`[Mock] Created item #${newItem.id}: "${newItem.demo}"`, "success");
      return;
    }

    try {
      const created = await window.electronAPI.demo.create({ demo: newText.trim() });
      setNewText("");
      addLog(`Successfully inserted record #${created?.id || 'new'}: "${newText}"`, "success");
      fetchItems();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      addLog(`Failed to create record: ${errMsg}`, "error");
    }
  };

  const handleStartEdit = (item: Demo) => {
    setEditingId(item.id);
    setEditText(item.demo);
  };

  const handleSaveEdit = async (id: number) => {
    if (!editText.trim()) return;

    if (!isElectron) {
      setItems(prev => prev.map(i => i.id === id ? { ...i, demo: editText.trim() } : i));
      setEditingId(null);
      addLog(`[Mock] Updated item #${id} to "${editText.trim()}"`, "success");
      return;
    }

    try {
      await window.electronAPI.demo.update(id, { demo: editText.trim() });
      setEditingId(null);
      addLog(`Successfully updated record #${id}`, "success");
      fetchItems();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      addLog(`Failed to update record #${id}: ${errMsg}`, "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!isElectron) {
      setItems(prev => prev.filter(i => i.id !== id));
      addLog(`[Mock] Deleted item #${id}`, "info");
      return;
    }

    try {
      await window.electronAPI.demo.deleteById(id);
      addLog(`Successfully deleted record #${id}`, "success");
      fetchItems();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      addLog(`Failed to delete record #${id}: ${errMsg}`, "error");
    }
  };

  return (
    <Flex direction="column" className="w-full gap-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-black p-6 border border-zinc-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-inner">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Database & IPC Playground
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  isElectron 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                    : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                }`}>
                  {isElectron ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  {isElectron ? "Electron SQLite Active" : "Web Mock Mode"}
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Interact live with Electron native IPC handlers and local SQLite database queries.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300">
              <Server className="w-3.5 h-3.5 text-zinc-500" />
              <span>Ping:</span>
              <span className={pingResult === "pong" ? "text-emerald-400 font-bold" : "text-zinc-400"}>
                {pingResult || "Untested"}
              </span>
            </div>
            <Button
              variant="white-ghost"
              onClick={handlePing}
              className="text-xs flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Ping Main
            </Button>
            <Button
              variant="white-ghost"
              onClick={fetchItems}
              disabled={loading}
              className="text-xs flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid: Data Operations & Live Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Left Column: CRUD Interface (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Add New Item Card */}
          <div className="p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-lg backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              Insert New Record
            </h3>
            <form onSubmit={handleCreate} className="flex gap-3 items-end">
              <div className="flex-1">
                <Input
                  placeholder="Enter record text (e.g. 'Coffee Expense - $4.50')"
                  value={newText}
                  onChange={e => setNewText(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                disabled={!newText.trim()}
                className="whitespace-nowrap flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Record
              </Button>
            </form>
          </div>

          {/* Records Table Card */}
          <div className="p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-400" />
                SQLite Table: <span className="text-zinc-400 font-mono">demo</span>
              </h3>
              <span className="text-xs font-medium text-zinc-400 bg-zinc-800 px-2.5 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? "record" : "records"}
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-500 gap-3">
                <Spinner variant="ring" size="md" />
                <span className="text-xs font-mono">Querying SQLite database...</span>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-500 border border-dashed border-zinc-800 rounded-lg bg-zinc-950/50 gap-2">
                <Database className="w-8 h-8 text-zinc-600" />
                <p className="text-xs">No records found in table</p>
                <span className="text-[11px] text-zinc-600">Use the input above to insert a new entry.</span>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800 border border-zinc-800/80 rounded-lg overflow-hidden bg-zinc-950/40">
                {items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 hover:bg-zinc-800/30 transition-colors group"
                  >
                    {editingId === item.id ? (
                      <div className="flex items-center gap-2 w-full">
                        <Input
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          className="flex-1 text-xs"
                        />
                        <button
                          onClick={() => handleSaveEdit(item.id)}
                          className="p-2 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 rounded bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col gap-1 min-w-0 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              #{item.id}
                            </span>
                            <span className="text-sm font-medium text-zinc-100 truncate">
                              {item.demo}
                            </span>
                          </div>
                          {item.created_at && (
                            <span className="text-[10px] font-mono text-zinc-500">
                              Created: {new Date(item.created_at).toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="p-1.5 rounded text-zinc-400 hover:text-sky-400 hover:bg-sky-500/10 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live IPC Execution Logs (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-xl flex flex-col h-full min-h-[400px]">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
              <h3 className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                IPC & Database Logs
              </h3>
              <button
                onClick={() => setLogs([])}
                className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Clear Logs
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[11px] pr-1">
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-zinc-600 italic">
                  No IPC calls logged yet...
                </div>
              ) : (
                logs.map(log => (
                  <div
                    key={log.id}
                    className={`p-2 rounded border text-xs leading-relaxed flex items-start gap-2 ${
                      log.type === "success"
                        ? "bg-emerald-950/30 border-emerald-800/40 text-emerald-300"
                        : log.type === "error"
                        ? "bg-red-950/30 border-red-800/40 text-red-300"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400"
                    }`}
                  >
                    <span className="text-[10px] opacity-60 shrink-0 pt-0.5">
                      [{log.timestamp}]
                    </span>
                    <span className="break-all">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Flex>
  );
};
