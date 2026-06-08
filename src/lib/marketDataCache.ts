import type { MarketDataResult, MarketTimeframe } from "@/types/marketData";

const CACHE_PREFIX = "trade-buddy-market-cache";

const CACHE_SECONDS: Record<MarketTimeframe, number> = {
  "5m": 30,
  "15m": 60,
  "1h": 180,
  "4h": 300,
  "1d": 600
};

type CachedMarketData = {
  savedAt: number;
  data: MarketDataResult;
};

export function getMarketCacheKey(symbol: string, timeframe: string) {
  return `${CACHE_PREFIX}:binance:${symbol.toUpperCase()}:${timeframe}`;
}

export function getCachedMarketData(symbol: string, timeframe: MarketTimeframe): MarketDataResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(getMarketCacheKey(symbol, timeframe));
    if (!raw) return null;
    const cached = JSON.parse(raw) as CachedMarketData;
    const maxAge = CACHE_SECONDS[timeframe] * 1000;
    if (Date.now() - cached.savedAt > maxAge) return null;
    return { ...cached.data, stale: true };
  } catch {
    return null;
  }
}

export function setCachedMarketData(symbol: string, timeframe: MarketTimeframe, data: MarketDataResult) {
  if (typeof window === "undefined") return;
  const cached: CachedMarketData = { savedAt: Date.now(), data: { ...data, stale: false } };
  window.localStorage.setItem(getMarketCacheKey(symbol, timeframe), JSON.stringify(cached));
}

export function getCacheDurationText(timeframe: MarketTimeframe) {
  const seconds = CACHE_SECONDS[timeframe];
  if (seconds < 60) return `${seconds} วินาที`;
  return `${Math.round(seconds / 60)} นาที`;
}
