import type { WatchlistItem } from "@/types/watchlist";

const WATCHLIST_KEY = "trade-buddy-watchlist";
const DEFAULT_SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];

export function normalizeCryptoSymbol(value: string) {
  return value.trim().replace(/\s+/g, "").replace("/", "").toUpperCase();
}

export function validateCryptoSymbol(value: string) {
  const symbol = normalizeCryptoSymbol(value);
  if (!symbol.endsWith("USDT")) {
    return {
      symbol,
      ok: false,
      message: "ตอนนี้ระบบรองรับคู่ USDT บน Binance ก่อน เช่น BTCUSDT หรือ ETHUSDT"
    };
  }
  if (!/^[A-Z0-9]+USDT$/.test(symbol) || symbol.length < 7 || symbol.length > 20) {
    return {
      symbol,
      ok: false,
      message: "ใช้ได้เฉพาะตัวอักษร/ตัวเลข และคู่ USDT เช่น BTCUSDT"
    };
  }
  return { symbol, ok: true, message: "" };
}

export function createWatchlistItem(symbol: string): WatchlistItem {
  const now = new Date().toISOString();
  return {
    id: `${symbol}-${Date.now()}`,
    symbol,
    favorite: DEFAULT_SYMBOLS.includes(symbol),
    createdAt: now,
    updatedAt: now
  };
}

export function getDefaultWatchlist(): WatchlistItem[] {
  return DEFAULT_SYMBOLS.map((symbol) => createWatchlistItem(symbol));
}

export function loadWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return getDefaultWatchlist();
  try {
    const raw = window.localStorage.getItem(WATCHLIST_KEY);
    if (!raw) {
      const defaults = getDefaultWatchlist();
      saveWatchlist(defaults);
      return defaults;
    }
    const parsed = JSON.parse(raw) as WatchlistItem[];
    return Array.isArray(parsed) && parsed.length ? parsed : getDefaultWatchlist();
  } catch {
    return getDefaultWatchlist();
  }
}

export function saveWatchlist(items: WatchlistItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
}

export function upsertWatchlistItem(items: WatchlistItem[], input: WatchlistItem) {
  const exists = items.some((item) => item.id === input.id || item.symbol === input.symbol);
  if (exists) {
    return items.map((item) => (item.id === input.id || item.symbol === input.symbol ? { ...item, ...input, updatedAt: new Date().toISOString() } : item));
  }
  return [...items, input];
}

export function sortWatchlist(items: WatchlistItem[]) {
  return [...items].sort((a, b) => Number(Boolean(b.favorite)) - Number(Boolean(a.favorite)) || a.symbol.localeCompare(b.symbol));
}
