import { formatUsdWithThb } from "@/lib/capitalStorage";
import { summarizeExpenses } from "@/lib/expenseStorage";
import type { ExpenseRecord } from "@/types/expense";

export default function ExpenseSummary({ expenses }: { expenses: ExpenseRecord[] }) {
  const summary = summarizeExpenses(expenses);
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric label="This month" value={formatUsdWithThb(summary.total)} />
      <Metric label="API cost" value={formatUsdWithThb(summary.apiCost)} />
      <Metric label="Subscription" value={formatUsdWithThb(summary.subscription)} />
      <Metric label="Trading fees" value={formatUsdWithThb(summary.tradingFees)} />
      {summary.total > 20 ? <p className="rounded-2xl border border-yellow-300/35 bg-yellow-300/10 p-3 text-sm font-bold text-yellow-100 sm:col-span-2 xl:col-span-4">ค่าใช้จ่ายเดือนนี้สูง ควรทบทวนว่าคุ้มกับทุนและการใช้งานไหม</p> : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3"><p className="text-xs text-slate-500">{label}</p><p className="text-xl font-black text-white">{value}</p></div>;
}
