import type { Kline } from "@/types/market";
import type { MarketQuote } from "@/types/marketData";

const BINANCE_KLINES_URL = "https://api.binance.com/api/v3/klines";
const BINANCE_TICKER_URL = "https://api.binance.com/api/v3/ticker/24hr";
const SYMBOL_PATTERN = /^[A-Z0-9]{3,20}$/;
const ALLOWED_INTERVALS = new Set(["1m", "5m", "15m", "1h", "4h", "1d"]);
export const WAR_ROOM_SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT"] as const;
export const WAR_ROOM_INTERVAL = "15m";

export async function fetchBinanceKlines(symbol: string, interval: string, limit = 120): Promise<Kline[]> {
  const safeSymbol = symbol.trim().toUpperCase();
  if (!SYMBOL_PATTERN.test(safeSymbol)) throw new Error("Invalid symbol format.");
  if (!ALLOWED_INTERVALS.has(interval)) throw new Error("Unsupported interval.");

  const url = new URL(BINANCE_KLINES_URL);
  url.searchParams.set("symbol", safeSymbol);
  url.searchParams.set("interval", interval);
  url.searchParams.set("limit", String(limit));

  const response = await fetch(url, { next: { revalidate: 60 } });
  if (!response.ok) throw new Error("Public Binance market data is unavailable for this symbol.");

  const data = (await response.json()) as unknown[][];
  return data.map((item) => ({
    openTime: Number(item[0]),
    open: Number(item[1]),
    high: Number(item[2]),
    low: Number(item[3]),
    close: Number(item[4]),
    volume: Number(item[5]),
    closeTime: Number(item[6])
  }));
}

export async function fetchBinanceQuote(symbol: string): Promise<MarketQuote> {
  const safeSymbol = symbol.trim().toUpperCase();
  if (!SYMBOL_PATTERN.test(safeSymbol) || !safeSymbol.endsWith("USDT")) throw new Error("Invalid Binance USDT symbol.");

  const url = new URL(BINANCE_TICKER_URL);
  url.searchParams.set("symbol", safeSymbol);

  const response = await fetch(url, { next: { revalidate: 30 } });
  if (!response.ok) throw new Error("Public Binance quote is unavailable for this symbol.");

  const data = (await response.json()) as { symbol: string; lastPrice: string; priceChange: string; priceChangePercent: string; closeTime?: number };
  return {
    symbol: data.symbol,
    price: Number(data.lastPrice),
    change: Number(data.priceChange),
    changePercent: Number(data.priceChangePercent),
    timestamp: data.closeTime ? new Date(data.closeTime).toISOString() : new Date().toISOString(),
    provider: "binance",
    currency: "USDT"
  };
}

export async function fetchWarRoomKlines(symbol: string) {
  if (!WAR_ROOM_SYMBOLS.includes(symbol as (typeof WAR_ROOM_SYMBOLS)[number])) {
    throw new Error("This War Room market dashboard supports BTCUSDT, ETHUSDT, and SOLUSDT.");
  }

  return fetchBinanceKlines(symbol, WAR_ROOM_INTERVAL, 120);
}
