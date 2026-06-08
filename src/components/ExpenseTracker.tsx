"use client";

import { useEffect, useState } from "react";
import { loadExpenses, saveExpenses } from "@/lib/expenseStorage";
import type { ExpenseRecord } from "@/types/expense";
import ExpenseSummary from "./ExpenseSummary";
import ReceiptImport from "./ReceiptImport";

export default function ExpenseTracker({ showImport = true }: { showImport?: boolean }) {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);

  function refresh() {
    setExpenses(loadExpenses());
  }

  useEffect(refresh, []);

  function remove(id: string) {
    const next = expenses.filter((expense) => expense.id !== id);
    setExpenses(next);
    saveExpenses(next);
  }

  function clear() {
    setExpenses([]);
    saveExpenses([]);
  }

  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-950/65 p-4">
      <ExpenseSummary expenses={expenses} />
      {showImport ? <div className="mt-4"><ReceiptImport onSaved={refresh} /></div> : null}
      <div className="mt-4 flex justify-end">
        <button className="min-h-12 rounded-2xl border border-red-300/30 px-4 font-black text-red-100" onClick={clear} type="button">
          Clear all expenses
        </button>
      </div>
      <div className="mt-4 grid gap-3">
        {expenses.map((expense) => (
          <article className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3" key={expense.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-black text-white">{expense.merchant}</p>
                <p className="text-sm text-slate-400">
                  {expense.date} | {expense.category}
                </p>
              </div>
              <button className="text-sm font-bold text-red-100" onClick={() => remove(expense.id)} type="button">
                Delete
              </button>
            </div>
            <p className="mt-2 text-xl font-black text-white">
              {expense.totalAmount} {expense.currency}
            </p>
            {expense.imageDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="mt-3 h-20 rounded-xl object-cover" src={expense.imageDataUrl} alt="Receipt thumbnail" />
            ) : null}
            <p className="mt-2 text-sm text-slate-400">{expense.notes}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
