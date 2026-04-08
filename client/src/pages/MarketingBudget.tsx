import { useState, useEffect, useMemo, useCallback } from "react";
import {
  DollarSign,
  TrendingUp,
  PieChart,
  Plus,
  Trash2,
  Pencil,
  Search,
  X,
  Check,
  Lock,
  ChevronDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CATEGORIES = [
  "Paid Media",
  "Events & Sponsorships",
  "Content Production",
  "Design & Creative",
  "Agency Fees",
  "PR & Communications",
  "Tools & Software",
  "Miscellaneous",
];

const CATEGORY_COLORS: Record<string, string> = {
  "Paid Media": "#19F578",
  "Events & Sponsorships": "#E8FB10",
  "Content Production": "#00C7B1",
  "Design & Creative": "#3B82F6",
  "Agency Fees": "#A78BFA",
  "PR & Communications": "#F97316",
  "Tools & Software": "#EC4899",
  "Miscellaneous": "#6B7280",
};

const STATUSES = ["Pending", "Approved", "Paid"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const SESSION_KEY = "budget_unlocked";
const PASSCODE_KEY = "betterfly_unlocked";

interface Expense {
  id: string;
  date: string;
  vendor: string;
  category: string;
  campaign: string;
  amount: number;
  status: string;
  notes: string;
}

interface BudgetData {
  totalAnnualBudget: number;
  allocations: Record<string, number>;
  expenses: Expense[];
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/verify-budget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: value }),
      });
      const data = await res.json();
      if (data.valid) {
        try { sessionStorage.setItem(SESSION_KEY, "true"); } catch {}
        onUnlock();
      } else {
        setError(true);
        setValue("");
        setTimeout(() => setError(false), 2000);
      }
    } catch {
      setError(true);
      setValue("");
      setTimeout(() => setError(false), 2000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-10 max-w-sm w-full text-center">
        <div className="w-14 h-14 rounded-full bg-green-400/10 flex items-center justify-center mx-auto mb-5">
          <Lock size={24} className="text-green-400" />
        </div>
        <h2 className="text-white text-lg font-semibold mb-1">Marketing Budget</h2>
        <p className="text-white/40 text-sm mb-6">Enter the password to access budget data</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Password"
            autoFocus
            className={`w-full bg-white/10 border text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all ${
              error ? "border-red-400 ring-2 ring-red-400" : "border-white/20"
            }`}
          />
          {error && <p className="text-red-400 text-xs text-left">Incorrect password.</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-400 text-green-950 font-semibold py-3 rounded-full text-sm hover:bg-green-300 transition-colors disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Unlock"}
          </button>
        </form>
      </div>
    </div>
  );
}

export function MarketingBudget() {
  const [unlocked, setUnlocked] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === "true"; } catch { return false; }
  });

  return (
    <div className="min-h-screen bg-[#042914] p-6 md:p-10">
      {!unlocked ? <PasswordGate onUnlock={() => setUnlocked(true)} /> : <BudgetDashboard />}
    </div>
  );
}

function BudgetDashboard() {
  const [data, setData] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [allocationInputs, setAllocationInputs] = useState<Record<string, string>>({});
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filterText, setFilterText] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [activeTab, setActiveTab] = useState<"log" | "chart" | "comparison">("log");

  const passcode = "betterfly2025";

  const headers = useMemo(() => ({
    "Content-Type": "application/json",
    "x-passcode": passcode,
  }), []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/budget", { headers: { "x-passcode": passcode } });
      setData(await res.json());
    } catch (err) {
      console.error("Failed to load budget data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const categorySpend = useMemo(() => {
    if (!data) return {};
    const result: Record<string, number> = {};
    CATEGORIES.forEach((c) => (result[c] = 0));
    data.expenses.forEach((e) => { result[e.category] = (result[e.category] || 0) + e.amount; });
    return result;
  }, [data]);

  const totalSpent = useMemo(() => Object.values(categorySpend).reduce((s, v) => s + v, 0), [categorySpend]);
  const remaining = (data?.totalAnnualBudget || 0) - totalSpent;
  const pctUsed = data?.totalAnnualBudget ? Math.min((totalSpent / data.totalAnnualBudget) * 100, 100) : 0;

  const filteredExpenses = useMemo(() => {
    if (!data) return [];
    return data.expenses.filter((e) => {
      if (filterCategory && e.category !== filterCategory) return false;
      if (filterStatus && e.status !== filterStatus) return false;
      if (filterText) {
        const q = filterText.toLowerCase();
        return (
          e.vendor.toLowerCase().includes(q) ||
          e.campaign.toLowerCase().includes(q) ||
          e.notes.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data, filterCategory, filterStatus, filterText]);

  const monthlyData = useMemo(() => {
    if (!data) return [];
    const year = new Date().getFullYear();
    return MONTHS.map((month, i) => {
      const row: any = { month };
      CATEGORIES.forEach((cat) => {
        row[cat] = data.expenses
          .filter((e) => {
            const d = new Date(e.date);
            return d.getFullYear() === year && d.getMonth() === i && e.category === cat;
          })
          .reduce((sum, e) => sum + e.amount, 0);
      });
      return row;
    });
  }, [data]);

  async function saveBudgetSettings() {
    const allocations: Record<string, number> = {};
    CATEGORIES.forEach((c) => {
      allocations[c] = parseFloat(allocationInputs[c] || "0") || 0;
    });
    const totalAnnualBudget = parseFloat(budgetInput) || 0;
    await fetch("/api/budget", {
      method: "PUT",
      headers,
      body: JSON.stringify({ allocations, totalAnnualBudget }),
    });
    setEditingBudget(false);
    fetchData();
  }

  async function saveExpense(expense: Partial<Expense>) {
    if (editingExpense) {
      await fetch(`/api/budget/expenses/${editingExpense.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(expense),
      });
    } else {
      await fetch("/api/budget/expenses", {
        method: "POST",
        headers,
        body: JSON.stringify(expense),
      });
    }
    setShowExpenseForm(false);
    setEditingExpense(null);
    fetchData();
  }

  async function deleteExpense(id: string) {
    await fetch(`/api/budget/expenses/${id}`, { method: "DELETE", headers });
    fetchData();
  }

  function startEditBudget() {
    if (data) {
      setBudgetInput(String(data.totalAnnualBudget || ""));
      const inputs: Record<string, string> = {};
      CATEGORIES.forEach((c) => { inputs[c] = String(data.allocations[c] || ""); });
      setAllocationInputs(inputs);
    }
    setEditingBudget(true);
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Marketing Budget</h1>
          <p className="text-white/40 text-sm mt-1">Track spend, allocations, and expenses across all categories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-wider mb-2">
            <DollarSign size={14} /> Annual Budget
          </div>
          {editingBudget ? (
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xl font-bold w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          ) : (
            <p className="text-white text-2xl font-bold">{fmt(data.totalAnnualBudget)}</p>
          )}
        </div>
        <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-wider mb-2">
            <TrendingUp size={14} /> Total Spent
          </div>
          <p className="text-white text-2xl font-bold">{fmt(totalSpent)}</p>
        </div>
        <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-wider mb-2">
            <DollarSign size={14} /> Remaining
          </div>
          <p className={`text-2xl font-bold ${remaining >= 0 ? "text-green-400" : "text-red-400"}`}>{fmt(remaining)}</p>
        </div>
        <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-wider mb-2">
            <PieChart size={14} /> % Used
          </div>
          <p className="text-white text-2xl font-bold mb-2">{pctUsed.toFixed(1)}%</p>
          <div className="w-full bg-white/10 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all ${pctUsed > 90 ? "bg-red-400" : pctUsed > 70 ? "bg-yellow-400" : "bg-green-400"}`}
              style={{ width: `${Math.min(pctUsed, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white/[0.04] border border-white/10 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="text-white font-semibold text-sm">Budget by Category</h2>
          {editingBudget ? (
            <div className="flex gap-2">
              <button onClick={() => setEditingBudget(false)} className="text-white/40 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-white/10">Cancel</button>
              <button onClick={saveBudgetSettings} className="bg-green-400 text-green-950 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"><Check size={12} /> Save</button>
            </div>
          ) : (
            <button onClick={startEditBudget} className="text-white/40 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1"><Pencil size={12} /> Edit Allocations</button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-white/40 font-medium px-5 py-3 text-xs uppercase tracking-wider">Category</th>
                <th className="text-right text-white/40 font-medium px-5 py-3 text-xs uppercase tracking-wider">Allocated</th>
                <th className="text-right text-white/40 font-medium px-5 py-3 text-xs uppercase tracking-wider">Actual Spend</th>
                <th className="text-right text-white/40 font-medium px-5 py-3 text-xs uppercase tracking-wider">Remaining</th>
                <th className="text-center text-white/40 font-medium px-5 py-3 text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.map((cat) => {
                const allocated = data.allocations[cat] || 0;
                const spent = categorySpend[cat] || 0;
                const rem = allocated - spent;
                const over = rem < 0;
                return (
                  <tr key={cat} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
                      {cat}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {editingBudget ? (
                        <input
                          type="number"
                          value={allocationInputs[cat] || ""}
                          onChange={(e) => setAllocationInputs((p) => ({ ...p, [cat]: e.target.value }))}
                          className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-right w-28 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
                        />
                      ) : (
                        <span className="text-white/70">{fmt(allocated)}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right text-white/70">{fmt(spent)}</td>
                    <td className={`px-5 py-3 text-right font-medium ${over ? "text-red-400" : "text-green-400"}`}>{fmt(rem)}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${over ? "bg-red-400" : "bg-green-400"}`} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white/[0.04] border border-white/10 rounded-xl overflow-hidden">
        <div className="flex items-center gap-1 px-5 py-3 border-b border-white/10">
          {(["log", "chart", "comparison"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeTab === tab ? "bg-green-400/10 text-green-400" : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab === "log" ? "Expense Log" : tab === "chart" ? "Monthly Spend" : "Budget vs. Actuals"}
            </button>
          ))}
        </div>

        {activeTab === "log" && (
          <div>
            <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-white/5">
              <div className="flex-1 min-w-[200px] relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder="Search vendor, campaign, notes..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-green-400"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-400 appearance-none"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-400 appearance-none"
              >
                <option value="">All Statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button
                onClick={() => { setShowExpenseForm(true); setEditingExpense(null); }}
                className="bg-green-400 text-green-950 text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 hover:bg-green-300 transition-colors"
              >
                <Plus size={14} /> Add Expense
              </button>
            </div>

            {showExpenseForm && (
              <ExpenseForm
                expense={editingExpense}
                onSave={saveExpense}
                onCancel={() => { setShowExpenseForm(false); setEditingExpense(null); }}
              />
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-white/40 font-medium px-5 py-3 text-xs uppercase tracking-wider">Date</th>
                    <th className="text-left text-white/40 font-medium px-5 py-3 text-xs uppercase tracking-wider">Vendor / Description</th>
                    <th className="text-left text-white/40 font-medium px-5 py-3 text-xs uppercase tracking-wider">Category</th>
                    <th className="text-left text-white/40 font-medium px-5 py-3 text-xs uppercase tracking-wider">Campaign</th>
                    <th className="text-right text-white/40 font-medium px-5 py-3 text-xs uppercase tracking-wider">Amount</th>
                    <th className="text-center text-white/40 font-medium px-5 py-3 text-xs uppercase tracking-wider">Status</th>
                    <th className="text-left text-white/40 font-medium px-5 py-3 text-xs uppercase tracking-wider">Notes</th>
                    <th className="text-center text-white/40 font-medium px-5 py-3 text-xs uppercase tracking-wider w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center text-white/30 py-10 text-sm">
                        {data.expenses.length === 0 ? "No expenses yet. Click \"Add Expense\" to get started." : "No expenses match your filters."}
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((exp) => (
                      <tr key={exp.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="px-5 py-3 text-white/70 whitespace-nowrap">{exp.date}</td>
                        <td className="px-5 py-3 text-white max-w-[200px] truncate">{exp.vendor}</td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center gap-1.5 text-white/70">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[exp.category] || "#6B7280" }} />
                            {exp.category}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-white/50">{exp.campaign || "—"}</td>
                        <td className="px-5 py-3 text-right text-white font-medium">{fmt(exp.amount)}</td>
                        <td className="px-5 py-3 text-center">
                          <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${
                            exp.status === "Paid" ? "bg-green-400/10 text-green-400" :
                            exp.status === "Approved" ? "bg-blue-400/10 text-blue-400" :
                            "bg-yellow-400/10 text-yellow-400"
                          }`}>
                            {exp.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-white/40 max-w-[150px] truncate">{exp.notes || "—"}</td>
                        <td className="px-5 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => { setEditingExpense(exp); setShowExpenseForm(true); }}
                              className="text-white/30 hover:text-white p-1 rounded"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => deleteExpense(exp.id)}
                              className="text-white/30 hover:text-red-400 p-1 rounded"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "chart" && (
          <div className="p-5">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "#0a1f12", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff", fontSize: 12 }}
                  formatter={(value: number, name: string) => [fmt(value), name]}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }} />
                {CATEGORIES.map((cat) => (
                  <Bar key={cat} dataKey={cat} stackId="spend" fill={CATEGORY_COLORS[cat]} radius={[0, 0, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === "comparison" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/40 font-medium px-5 py-3 text-xs uppercase tracking-wider">Category</th>
                  <th className="text-right text-white/40 font-medium px-5 py-3 text-xs uppercase tracking-wider">Allocated</th>
                  <th className="text-right text-white/40 font-medium px-5 py-3 text-xs uppercase tracking-wider">Actual Spend</th>
                  <th className="text-right text-white/40 font-medium px-5 py-3 text-xs uppercase tracking-wider">Variance</th>
                  <th className="text-left text-white/40 font-medium px-5 py-3 text-xs uppercase tracking-wider w-48">Progress</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.map((cat) => {
                  const allocated = data.allocations[cat] || 0;
                  const spent = categorySpend[cat] || 0;
                  const variance = allocated - spent;
                  const pct = allocated > 0 ? (spent / allocated) * 100 : 0;
                  return (
                    <tr key={cat} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="px-5 py-3 text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
                        {cat}
                      </td>
                      <td className="px-5 py-3 text-right text-white/70">{fmt(allocated)}</td>
                      <td className="px-5 py-3 text-right text-white/70">{fmt(spent)}</td>
                      <td className={`px-5 py-3 text-right font-medium ${variance >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {variance >= 0 ? "+" : ""}{fmt(variance)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-white/10 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${pct > 100 ? "bg-red-400" : pct > 80 ? "bg-yellow-400" : "bg-green-400"}`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className="text-white/40 text-xs w-10 text-right">{pct.toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ExpenseForm({
  expense,
  onSave,
  onCancel,
}: {
  expense: Expense | null;
  onSave: (e: Partial<Expense>) => void;
  onCancel: () => void;
}) {
  const [date, setDate] = useState(expense?.date || new Date().toISOString().split("T")[0]);
  const [vendor, setVendor] = useState(expense?.vendor || "");
  const [category, setCategory] = useState(expense?.category || CATEGORIES[0]);
  const [campaign, setCampaign] = useState(expense?.campaign || "");
  const [amount, setAmount] = useState(expense?.amount?.toString() || "");
  const [status, setStatus] = useState(expense?.status || "Pending");
  const [notes, setNotes] = useState(expense?.notes || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!vendor || !amount) return;
    onSave({ date, vendor, category, campaign, amount: parseFloat(amount) || 0, status, notes });
  }

  return (
    <form onSubmit={handleSubmit} className="px-5 py-4 border-b border-white/10 bg-white/[0.02]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-white/40 text-xs mb-1">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-400" />
        </div>
        <div>
          <label className="block text-white/40 text-xs mb-1">Vendor / Description *</label>
          <input value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="e.g. Google Ads" className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-green-400" />
        </div>
        <div>
          <label className="block text-white/40 text-xs mb-1">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-400 appearance-none">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-white/40 text-xs mb-1">Amount *</label>
          <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-green-400" />
        </div>
        <div>
          <label className="block text-white/40 text-xs mb-1">Campaign</label>
          <input value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="Optional" className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-green-400" />
        </div>
        <div>
          <label className="block text-white/40 text-xs mb-1">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-400 appearance-none">
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block text-white/40 text-xs mb-1">Notes</label>
          <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-green-400" />
        </div>
        <div className="flex items-end gap-2">
          <button type="submit" className="bg-green-400 text-green-950 text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-green-300">
            <Check size={12} /> {expense ? "Update" : "Add"}
          </button>
          <button type="button" onClick={onCancel} className="text-white/40 hover:text-white text-xs px-3 py-2 rounded-lg border border-white/10">
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
