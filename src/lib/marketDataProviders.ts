import { fetchBinanceKlines, fetchBinanceQuote } from "@/lib/binance";
import { getCachedMarketData, setCachedMarketData } from "@/lib/marketDataCache";
import type { MarketDataResult, MarketTimeframe } from "@/types/marketData";

const SUPPORTED_TIMEFRAMES: MarketTimeframe[] = ["5m", "15m", "1h", "4h", "1d"];

export function normalizeTimeframe(value: string): MarketTimeframe {
  return SUPPORTED_TIMEFRAMES.includes(value as MarketTimeframe) ? (value as MarketTimeframe) : "15m";
}

export async function fetchMarketData(symbol: string, timeframe: string, options: { forceRefresh?: boolean } = {}): Promise<MarketDataResult> {
  const safeTimeframe = normalizeTimeframe(timeframe);
  const safeSymbol = symbol.toUpperCase();

  if (!options.forceRefresh) {
    const cached = getCachedMarketData(safeSymbol, safeTimeframe);
    if (cached) return cached;
  }

  try {
    const [quote, candles] = await Promise.all([fetchBinanceQuote(safeSymbol), fetchBinanceKlines(safeSymbol, safeTimeframe)]);
    const result: MarketDataResult = {
      quote,
      candles: candles.map((candle) => ({
        time: candle.openTime,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: candle.volume
      })),
      provider: "binance"
    };
    setCachedMarketData(safeSymbol, safeTimeframe, result);
    return result;
  } catch (error) {
    return {
      provider: "binance",
      error: error instanceof Error ? error.message : "ดึงข้อมูลจาก Binance ไม่ได้ชั่วคราว สามารถกรอกราคาเองเพื่อคำนวณ Risk ได้"
    };
  }
}
