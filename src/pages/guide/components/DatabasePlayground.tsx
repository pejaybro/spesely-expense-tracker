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
  Check,
  X,
  Server,
  Layers,
  Tag,
  Receipt,
  ArrowDownCircle,
  ArrowUpCircle,
  Filter,
} from "lucide-react";
import type {
  SpeselyPrimaryCategory,
  SpeselySecondaryCategory,
  SpeselyTransaction,
} from "@/types/db/interface/spesely.interface";

interface LogEntry {
  id: string;
  timestamp: string;
  type: "info" | "success" | "error";
  message: string;
}

export const DatabasePlayground: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"primary" | "secondary" | "transactions">("primary");

  // State for Primary Categories
  const [primaryCats, setPrimaryCats] = useState<SpeselyPrimaryCategory[]>([]);
  const [priName, setPriName] = useState("");
  const [priColor, setPriColor] = useState("#3b82f6");
  const [priIsExpense, setPriIsExpense] = useState<number>(1);

  // State for Secondary Categories
  const [secCats, setSecCats] = useState<SpeselySecondaryCategory[]>([]);
  const [secName, setSecName] = useState("");
  const [secColor, setSecColor] = useState("#10b981");
  const [secParentPublicId, setSecParentPublicId] = useState("");

  // State for Transactions
  const [transactions, setTransactions] = useState<SpeselyTransaction[]>([]);
  const [txAmount, setTxAmount] = useState("");
  const [txNote, setTxNote] = useState("");
  const [txDate, setTxDate] = useState(new Date().toISOString().split("T")[0]);
  const [txIsExpense, setTxIsExpense] = useState<number>(1);
  const [txPriCatId, setTxPriCatId] = useState("");
  const [txSecCatId, setTxSecCatId] = useState("");
  const [txFilter, setTxFilter] = useState<"all" | "top10_expense" | "top10_income">("all");

  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const isElectron = typeof window !== "undefined" && Boolean(window.electronAPI);

  const addLog = useCallback((message: string, type: "info" | "success" | "error" = "info") => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { id: `${Date.now()}-${Math.random()}`, timestamp: time, type, message },
      ...prev.slice(0, 49),
    ]);
  }, []);

  // Fetch Primary Categories
  const fetchPrimaryCats = useCallback(async () => {
    if (!isElectron) {
      setPrimaryCats([
        { id: 1, public_id: "mock_p1", name: "Food & Dining", color: "#ef4444", is_expense: 1, status: 1, is_deleted: 0, transaction_count: 0 },
        { id: 2, public_id: "mock_p2", name: "Salary", color: "#10b981", is_expense: 0, status: 1, is_deleted: 0, transaction_count: 0 },
      ]);
      return;
    }
    try {
      const data = await window.electronAPI.primaryCategory.getAll();
      setPrimaryCats(data || []);
      addLog(`Loaded ${data?.length || 0} primary categories`, "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog(`Error fetching primary categories: ${msg}`, "error");
    }
  }, [isElectron, addLog]);

  // Fetch Secondary Categories
  const fetchSecCats = useCallback(async () => {
    if (!isElectron) {
      setSecCats([
        { id: 1, public_id: "mock_s1", primary_category_id: "mock_p1", name: "Restaurants", color: "#f59e0b", is_expense: 1, status: 1, is_deleted: 0, transaction_count: 0 },
        { id: 2, public_id: "mock_s2", primary_category_id: "mock_p1", name: "Groceries", color: "#8b5cf6", is_expense: 1, status: 1, is_deleted: 0, transaction_count: 0 },
      ]);
      return;
    }
    try {
      const data = await window.electronAPI.secondaryCategory.getAll();
      setSecCats(data || []);
      addLog(`Loaded ${data?.length || 0} secondary categories`, "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog(`Error fetching secondary categories: ${msg}`, "error");
    }
  }, [isElectron, addLog]);

  // Fetch Transactions
  const fetchTransactions = useCallback(async () => {
    if (!isElectron) {
      setTransactions([
        { id: 1, public_id: "mock_t1", amount: 250.5, note: "Dinner with friends", date: "2026-08-15", is_expense: 1, primary_category_id: "mock_p1", secondary_category_id: "mock_s1", primary_category_name: "Food & Dining", secondary_category_name: "Restaurants" },
        { id: 2, public_id: "mock_t2", amount: 5000, note: "August Salary Paycheck", date: "2026-08-01", is_expense: 0, primary_category_id: "mock_p2", primary_category_name: "Salary" },
      ]);
      return;
    }
    try {
      let data: SpeselyTransaction[] = [];
      if (txFilter === "top10_expense") {
        data = await window.electronAPI.transaction.getTop10(1);
      } else if (txFilter === "top10_income") {
        data = await window.electronAPI.transaction.getTop10(0);
      } else {
        data = await window.electronAPI.transaction.getAll();
      }
      setTransactions(data || []);
      addLog(`Loaded ${data?.length || 0} transactions (filter: ${txFilter})`, "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog(`Error fetching transactions: ${msg}`, "error");
    }
  }, [isElectron, txFilter, addLog]);

  const refreshAll = useCallback(() => {
    setLoading(true);
    Promise.all([fetchPrimaryCats(), fetchSecCats(), fetchTransactions()]).finally(() => setLoading(false));
  }, [fetchPrimaryCats, fetchSecCats, fetchTransactions]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Handlers for Primary Category
  const handleCreatePrimary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!priName.trim()) return;
    if (!isElectron) {
      addLog("Cannot insert in Browser Preview mode", "error");
      return;
    }
    try {
      const newCat = await window.electronAPI.primaryCategory.create({
        name: priName.trim(),
        color: priColor,
        is_expense: priIsExpense,
      });
      addLog(`Created Primary Category "${newCat.name}" (public_id: ${newCat.public_id})`, "success");
      setPriName("");
      fetchPrimaryCats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog(`Failed to create primary category: ${msg}`, "error");
    }
  };

  const handleTogglePrimaryStatus = async (public_id: string, name: string) => {
    if (!isElectron) return;
    try {
      await window.electronAPI.primaryCategory.toggleStatus(public_id);
      addLog(`Toggled status for category "${name}"`, "info");
      fetchPrimaryCats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog(`Error toggling status: ${msg}`, "error");
    }
  };

  const handleSoftDeletePrimary = async (public_id: string, name: string) => {
    if (!isElectron) return;
    try {
      await window.electronAPI.primaryCategory.softDelete(public_id);
      addLog(`Soft-deleted category "${name}" (is_deleted = 1)`, "info");
      fetchPrimaryCats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog(`Error soft deleting: ${msg}`, "error");
    }
  };

  // Handlers for Secondary Category
  const handleCreateSecondary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secName.trim() || !secParentPublicId) {
      addLog("Please select a Primary Category parent", "error");
      return;
    }
    if (!isElectron) return;
    try {
      const newCat = await window.electronAPI.secondaryCategory.create({
        primary_category_id: secParentPublicId,
        name: secName.trim(),
        color: secColor,
        is_expense: priIsExpense,
      });
      addLog(`Created Secondary Category "${newCat.name}"`, "success");
      setSecName("");
      fetchSecCats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog(`Failed to create secondary category: ${msg}`, "error");
    }
  };

  // Handlers for Transactions
  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(txAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      addLog("Please enter a valid amount", "error");
      return;
    }
    if (!txPriCatId) {
      addLog("Please select a Primary Category", "error");
      return;
    }
    if (!isElectron) return;
    try {
      const newTx = await window.electronAPI.transaction.create({
        amount: parsedAmount,
        note: txNote,
        date: txDate,
        is_expense: txIsExpense,
        primary_category_id: txPriCatId,
        secondary_category_id: txSecCatId || undefined,
      });
      addLog(`Created Transaction \$${newTx.amount} (is_expense: ${newTx.is_expense})`, "success");
      setTxAmount("");
      setTxNote("");
      fetchTransactions();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog(`Failed to create transaction: ${msg}`, "error");
    }
  };

  const handleDeleteTransaction = async (public_id: string) => {
    if (!isElectron) return;
    try {
      await window.electronAPI.transaction.delete(public_id);
      addLog(`Deleted transaction ${public_id}`, "info");
      fetchTransactions();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog(`Error deleting transaction: ${msg}`, "error");
    }
  };

  return (
    <Flex direction="column" className="w-full gap-6 text-chalk-90 select-none">
      {/* Header Banner */}
      <Flex direction="row" items="center" justify="between" className="w-full p-5 bg-chalk-10 border border-chalk-15 rounded-2xl shadow-xl">
        <Flex direction="row" items="center" className="gap-3">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              SQLite Database Playground
              <span className="text-xs px-2 py-0.5 rounded-full bg-chalk-20 text-chalk-70 font-mono">
                spesely-db-v1.sqlite
              </span>
            </h2>
            <p className="text-xs text-chalk-60 mt-0.5">
              Live interactive tester for <span className="font-mono text-blue-400">spesely_primary_categories</span>, <span className="font-mono text-emerald-400">spesely_secondary_categories</span>, and <span className="font-mono text-purple-400">spesely_transactions</span>
            </p>
          </div>
        </Flex>

        <Flex direction="row" items="center" className="gap-2">
          <Button variant="white-ghost" onClick={refreshAll} disabled={loading} className="gap-2 text-xs">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh DB
          </Button>
        </Flex>
      </Flex>

      {/* Navigation Sub-Tabs */}
      <Flex direction="row" className="gap-2 border-b border-chalk-15 pb-3">
        <Button
          variant={activeSubTab === "primary" ? "primary" : "white-ghost"}
          onClick={() => setActiveSubTab("primary")}
          className="gap-2 text-xs"
        >
          <Layers className="w-4 h-4" />
          Primary Categories ({primaryCats.length})
        </Button>
        <Button
          variant={activeSubTab === "secondary" ? "primary" : "white-ghost"}
          onClick={() => setActiveSubTab("secondary")}
          className="gap-2 text-xs"
        >
          <Tag className="w-4 h-4" />
          Secondary Categories ({secCats.length})
        </Button>
        <Button
          variant={activeSubTab === "transactions" ? "primary" : "white-ghost"}
          onClick={() => setActiveSubTab("transactions")}
          className="gap-2 text-xs"
        >
          <Receipt className="w-4 h-4" />
          Transactions ({transactions.length})
        </Button>
      </Flex>

      {/* SUB-TAB 1: PRIMARY CATEGORIES */}
      {activeSubTab === "primary" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create Form */}
          <form onSubmit={handleCreatePrimary} className="p-5 bg-chalk-10 border border-chalk-15 rounded-2xl flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-400" /> Add Primary Category
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-chalk-60">Category Name</label>
              <Input
                placeholder="e.g. Food & Dining, Salary"
                value={priName}
                onChange={(e) => setPriName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-chalk-60">Category Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPriIsExpense(1)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border flex items-center justify-center gap-2 transition-all ${
                    priIsExpense === 1
                      ? "bg-red-500/20 border-red-500/50 text-red-400"
                      : "bg-chalk-15 border-chalk-20 text-chalk-60"
                  }`}
                >
                  <ArrowDownCircle className="w-3.5 h-3.5" /> Expense
                </button>
                <button
                  type="button"
                  onClick={() => setPriIsExpense(0)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border flex items-center justify-center gap-2 transition-all ${
                    priIsExpense === 0
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                      : "bg-chalk-15 border-chalk-20 text-chalk-60"
                  }`}
                >
                  <ArrowUpCircle className="w-3.5 h-3.5" /> Income
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-chalk-60">Badge Color (Hex)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={priColor}
                  onChange={(e) => setPriColor(e.target.value)}
                  className="w-9 h-9 rounded bg-transparent border-0 cursor-pointer"
                />
                <Input value={priColor} onChange={(e) => setPriColor(e.target.value)} />
              </div>
            </div>

            <Button type="submit" variant="primary" className="mt-2 text-xs py-2.5">
              Insert into SQLite
            </Button>
          </form>

          {/* Table List */}
          <div className="md:col-span-2 p-5 bg-chalk-10 border border-chalk-15 rounded-2xl flex flex-col gap-4 overflow-x-auto">
            <h3 className="text-sm font-bold text-white">
              Primary Categories Table (<span className="text-blue-400">spesely_primary_categories</span>)
            </h3>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-chalk-15 text-chalk-50 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Public ID</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Tx Count</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-chalk-15/50 font-mono">
                {primaryCats.map((cat) => (
                  <tr key={cat.id} className="hover:bg-chalk-15/30">
                    <td className="py-3 px-3 text-chalk-50">#{cat.id}</td>
                    <td className="py-3 px-3 text-chalk-60 text-[10px]" title={cat.public_id}>
                      {cat.public_id?.substring(0, 10)}...
                    </td>
                    <td className="py-3 px-3 font-sans font-semibold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: cat.color || "#3b82f6" }} />
                      {cat.name}
                    </td>
                    <td className="py-3 px-3 font-sans">
                      {cat.is_expense === 1 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400 border border-red-500/20">Expense</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Income</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-chalk-70">
                      {cat.transaction_count ?? 0}
                    </td>
                    <td className="py-3 px-3 font-sans">
                      {cat.status === 1 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400">Active</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-gray-500/20 text-gray-400">Disabled</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-sans">
                      <Flex direction="row" justify="end" className="gap-1">
                        <Button
                          variant="white-ghost"
                          onClick={() => handleTogglePrimaryStatus(cat.public_id, cat.name)}
                          className="px-2 py-1 text-[10px]"
                          title="Toggle Status (Soft Enable/Disable)"
                        >
                          {cat.status === 1 ? "Disable" : "Enable"}
                        </Button>
                        <Button
                          variant="white-ghost"
                          onClick={() => handleSoftDeletePrimary(cat.public_id, cat.name)}
                          className="px-2 py-1 text-[10px] text-red-400 hover:text-red-300"
                          title="Soft Delete (is_deleted = 1)"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </Flex>
                    </td>
                  </tr>
                ))}
                {primaryCats.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-chalk-50 font-sans text-xs">
                      No primary categories found in SQLite database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SECONDARY CATEGORIES */}
      {activeSubTab === "secondary" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create Form */}
          <form onSubmit={handleCreateSecondary} className="p-5 bg-chalk-10 border border-chalk-15 rounded-2xl flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" /> Add Secondary Category
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-chalk-60">Parent Primary Category</label>
              <select
                value={secParentPublicId}
                onChange={(e) => setSecParentPublicId(e.target.value)}
                className="w-full px-3 py-2 bg-chalk-15 border border-chalk-20 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Primary Parent...</option>
                {primaryCats.map((cat) => (
                  <option key={cat.public_id} value={cat.public_id}>
                    {cat.name} ({cat.is_expense ? "Expense" : "Income"})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-chalk-60">Secondary Category Name</label>
              <Input
                placeholder="e.g. Restaurants, Groceries, Fast Food"
                value={secName}
                onChange={(e) => setSecName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-chalk-60">Badge Color (Hex)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secColor}
                  onChange={(e) => setSecColor(e.target.value)}
                  className="w-9 h-9 rounded bg-transparent border-0 cursor-pointer"
                />
                <Input value={secColor} onChange={(e) => setSecColor(e.target.value)} />
              </div>
            </div>

            <Button type="submit" variant="primary" className="mt-2 text-xs py-2.5">
              Insert Sub-Category
            </Button>
          </form>

          {/* Table List */}
          <div className="md:col-span-2 p-5 bg-chalk-10 border border-chalk-15 rounded-2xl flex flex-col gap-4 overflow-x-auto">
            <h3 className="text-sm font-bold text-white">
              Secondary Categories Table (<span className="text-emerald-400">spesely_secondary_categories</span>)
            </h3>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-chalk-15 text-chalk-50 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Public ID</th>
                  <th className="py-2.5 px-3">Primary Parent FK</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Tx Count</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-chalk-15/50 font-mono">
                {secCats.map((cat) => (
                  <tr key={cat.id} className="hover:bg-chalk-15/30">
                    <td className="py-3 px-3 text-chalk-50">#{cat.id}</td>
                    <td className="py-3 px-3 text-chalk-60 text-[10px]" title={cat.public_id}>
                      {cat.public_id?.substring(0, 10)}...
                    </td>
                    <td className="py-3 px-3 text-chalk-60 text-[10px]">
                      {cat.primary_category_id?.substring(0, 10)}...
                    </td>
                    <td className="py-3 px-3 font-sans font-semibold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: cat.color || "#10b981" }} />
                      {cat.name}
                    </td>
                    <td className="py-3 px-3 font-mono text-chalk-70">
                      {cat.transaction_count ?? 0}
                    </td>
                    <td className="py-3 px-3 font-sans">
                      {cat.status === 1 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400">Active</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-gray-500/20 text-gray-400">Disabled</span>
                      )}
                    </td>
                  </tr>
                ))}
                {secCats.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-chalk-50 font-sans text-xs">
                      No secondary categories found in SQLite database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TRANSACTIONS */}
      {activeSubTab === "transactions" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create Form */}
          <form onSubmit={handleCreateTransaction} className="p-5 bg-chalk-10 border border-chalk-15 rounded-2xl flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-400" /> Add Transaction
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTxIsExpense(1)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border flex items-center justify-center gap-2 transition-all ${
                  txIsExpense === 1
                    ? "bg-red-500/20 border-red-500/50 text-red-400"
                    : "bg-chalk-15 border-chalk-20 text-chalk-60"
                }`}
              >
                <ArrowDownCircle className="w-3.5 h-3.5" /> Expense
              </button>
              <button
                type="button"
                onClick={() => setTxIsExpense(0)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border flex items-center justify-center gap-2 transition-all ${
                  txIsExpense === 0
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                    : "bg-chalk-15 border-chalk-20 text-chalk-60"
                }`}
              >
                <ArrowUpCircle className="w-3.5 h-3.5" /> Income
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-chalk-60">Amount</label>
              <Input
                type="number"
                step="0.01"
                placeholder="e.g. 150.00"
                value={txAmount}
                onChange={(e) => setTxAmount(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-chalk-60">Date (YYYY-MM-DD)</label>
              <Input
                type="date"
                value={txDate}
                onChange={(e) => setTxDate(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-chalk-60">Primary Category (FK)</label>
              <select
                value={txPriCatId}
                onChange={(e) => setTxPriCatId(e.target.value)}
                className="w-full px-3 py-2 bg-chalk-15 border border-chalk-20 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Primary Category...</option>
                {primaryCats
                  .filter((cat) => cat.is_expense === txIsExpense)
                  .map((cat) => (
                    <option key={cat.public_id} value={cat.public_id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-chalk-60">Secondary Category (Optional FK)</label>
              <select
                value={txSecCatId}
                onChange={(e) => setTxSecCatId(e.target.value)}
                className="w-full px-3 py-2 bg-chalk-15 border border-chalk-20 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">None / Optional</option>
                {secCats
                  .filter((cat) => cat.primary_category_id === txPriCatId)
                  .map((cat) => (
                    <option key={cat.public_id} value={cat.public_id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-chalk-60">Note / Description</label>
              <Input
                placeholder="e.g. Dinner with team"
                value={txNote}
                onChange={(e) => setTxNote(e.target.value)}
              />
            </div>

            <Button type="submit" variant="primary" className="mt-2 text-xs py-2.5">
              Record Transaction
            </Button>
          </form>

          {/* Table List & Query Filter */}
          <div className="md:col-span-2 p-5 bg-chalk-10 border border-chalk-15 rounded-2xl flex flex-col gap-4 overflow-x-auto">
            <Flex direction="row" items="center" justify="between" className="w-full">
              <h3 className="text-sm font-bold text-white">
                Transactions Table (<span className="text-purple-400">spesely_transactions</span>)
              </h3>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-chalk-60" />
                <select
                  value={txFilter}
                  onChange={(e) => setTxFilter(e.target.value as any)}
                  className="px-2.5 py-1 bg-chalk-15 border border-chalk-20 rounded-lg text-xs text-white focus:outline-none"
                >
                  <option value="all">All Transactions</option>
                  <option value="top10_expense">Top 10 Expenses</option>
                  <option value="top10_income">Top 10 Incomes</option>
                </select>
              </div>
            </Flex>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-chalk-15 text-chalk-50 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Category (Joined)</th>
                  <th className="py-2.5 px-3">Note</th>
                  <th className="py-2.5 px-3 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-chalk-15/50 font-mono">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-chalk-15/30">
                    <td className="py-3 px-3 text-chalk-60 text-xs font-sans">{tx.date}</td>
                    <td className={`py-3 px-3 font-bold ${tx.is_expense === 1 ? "text-red-400" : "text-emerald-400"}`}>
                      {tx.is_expense === 1 ? "-" : "+"}\${tx.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 font-sans text-white">
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs text-blue-400">
                          {tx.primary_category_name || "Uncategorized"}
                        </span>
                        {tx.secondary_category_name && (
                          <span className="text-[10px] text-chalk-50">
                            ↳ {tx.secondary_category_name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-sans text-chalk-70 max-w-[150px] truncate">
                      {tx.note || "—"}
                    </td>
                    <td className="py-3 px-3 text-right font-sans">
                      <Button
                        variant="white-ghost"
                        onClick={() => handleDeleteTransaction(tx.public_id)}
                        className="px-2 py-1 text-[10px] text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-chalk-50 font-sans text-xs">
                      No transactions recorded in SQLite database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Real-time Log Console */}
      <Flex direction="column" className="w-full p-4 bg-gray-950 border border-chalk-15 rounded-2xl gap-2 font-mono text-xs">
        <Flex direction="row" items="center" justify="between">
          <span className="text-xs font-bold text-chalk-60 flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-blue-400" /> Database Operation Terminal Logs
          </span>
          <span className="text-[10px] text-chalk-50">{logs.length} events logged</span>
        </Flex>
        <div className="h-32 overflow-y-auto flex flex-col gap-1 pr-2">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 text-[11px] leading-tight">
              <span className="text-chalk-60 select-none">[{log.timestamp}]</span>
              <span
                className={
                  log.type === "success"
                    ? "text-emerald-400"
                    : log.type === "error"
                    ? "text-red-400"
                    : "text-blue-400"
                }
              >
                {log.message}
              </span>
            </div>
          ))}
          {logs.length === 0 && (
            <span className="text-chalk-60 italic text-[11px]">No database operations yet...</span>
          )}
        </div>
      </Flex>
    </Flex>
  );
};
