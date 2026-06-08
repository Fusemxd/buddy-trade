import type { AlertEvent, AlertRule } from "@/types/alerts";

const RULES_KEY = "trade-buddy-alerts";
const EVENTS_KEY = "trade-buddy-alert-history";

export function loadAlertRules(): AlertRule[] {
  if (typeof window === "undefined") return [];
  return read<AlertRule[]>(RULES_KEY, []);
}

export function saveAlertRules(rules: AlertRule[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RULES_KEY, JSON.stringify(rules));
}

export function loadAlertEvents(): AlertEvent[] {
  if (typeof window === "undefined") return [];
  return read<AlertEvent[]>(EVENTS_KEY, []);
}

export function saveAlertEvents(events: AlertEvent[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

function read<T>(key: string, fallback: T): T {
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
