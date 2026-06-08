import type { JournalEntry, JournalSummaryStats } from "@/types/journal";

const JOURNAL_KEY = "trade-buddy-war-room-journal";

export function loadJournal() {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(JOURNAL_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as JournalEntry[];
  } catch {
    return [];
  }
}

export function saveJournal(entries: JournalEntry[]) {
  window.localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
}

export function summarizeJournal(entries: JournalEntry[]): JournalSummaryStats {
  const totalTrades = entries.length;
  const wins = entries.filter((entry) => entry.result === "Win").length;
  const totalPnl = round(entries.reduce((sum, entry) => sum + parsePnl(entry.profitLossThb), 0));
  const todayPnl = round(entries.filter(isTodayEntry).reduce((sum, entry) => sum + parsePnl(entry.profitLossThb), 0));
  const currentLosingStreak = getCurrentLosingStreak(entries);
  const winRate = totalTrades > 0 ? round((wins / totalTrades) * 100) : 0;

  return { totalTrades, winRate, totalPnl, currentLosingStreak, todayPnl };
}

export function parsePnl(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getCurrentLosingStreak(entries: JournalEntry[]) {
  let streak = 0;
  for (const entry of entries) {
    if (entry.result !== "Loss") break;
    streak += 1;
  }
  return streak;
}

function isTodayEntry(entry: JournalEntry) {
  const today = new Date().toISOString().slice(0, 10);
  return entry.date === today;
}

function round(value: number) {
  return Number(value.toFixed(2));
}
