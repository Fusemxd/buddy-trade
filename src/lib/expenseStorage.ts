import type { ExpenseRecord } from "@/types/expense";

const KEY = "trade-buddy-expenses";

export function loadExpenses() {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ExpenseRecord[];
  } catch {
    return [];
  }
}

export function saveExpenses(items: ExpenseRecord[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
}

export function summarizeExpenses(items: ExpenseRecord[]) {
  const month = new Date().toISOString().slice(0, 7);
  const thisMonth = items.filter((item) => item.date.startsWith(month));
  const total = sum(thisMonth);
  return {
    total,
    apiCost: sum(thisMonth.filter((item) => item.category === "API Cost")),
    subscription: sum(thisMonth.filter((item) => item.category === "Subscription")),
    tradingFees: sum(thisMonth.filter((item) => item.category === "Trading Fee")),
    count: items.length,
    byCategory: thisMonth.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + item.totalAmount;
      return acc;
    }, {})
  };
}

function sum(items: ExpenseRecord[]) {
  return Number(items.reduce((total, item) => total + item.totalAmount, 0).toFixed(2));
}
