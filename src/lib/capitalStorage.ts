import type { CapitalSummary, CapitalTransaction } from "@/types/capital";

const KEY = "trade-buddy-capital-transactions";
export const USD_THB_RATE = 35;

export function loadCapitalTransactions(): CapitalTransaction[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CapitalTransaction[];
  } catch {
    return [];
  }
}

export function saveCapitalTransactions(items: CapitalTransaction[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
}

export function summarizeCapital(items: CapitalTransaction[]): CapitalSummary {
  const depositsUsd = sum(items.filter((item) => item.type === "deposit"));
  const withdrawalsUsd = sum(items.filter((item) => item.type === "withdraw"));
  return {
    balanceUsd: round(depositsUsd - withdrawalsUsd),
    depositsUsd,
    withdrawalsUsd
  };
}

export function formatUsdWithThb(valueUsd: number) {
  return `$${valueUsd.toFixed(2)} (${(valueUsd * USD_THB_RATE).toFixed(0)} THB)`;
}

function sum(items: CapitalTransaction[]) {
  return round(items.reduce((total, item) => total + item.amountUsd, 0));
}

function round(value: number) {
  return Number(value.toFixed(2));
}
