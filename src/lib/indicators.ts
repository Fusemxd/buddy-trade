import { ATR, EMA, RSI } from "technicalindicators";
import type { Kline, MarketSignal, MarketStatus } from "@/types/market";

export function analyzeKlines(symbol: string, interval: string, candles: Kline[]): MarketSignal {
  const closes = candles.map((candle) => candle.close);
  const highs = candles.map((candle) => candle.high);
  const lows = candles.map((candle) => candle.low);
  const volumes = candles.map((candle) => candle.volume);
  const lastPrice = closes.at(-1) ?? 0;

  const rsi = last(RSI.calculate({ period: 14, values: closes }));
  const emaFast = last(EMA.calculate({ period: 9, values: closes }));
  const emaSlow = last(EMA.calculate({ period: 21, values: closes }));
  const ema20 = last(EMA.calculate({ period: 20, values: closes }));
  const ema50 = last(EMA.calculate({ period: 50, values: closes }));
  const atr = last(ATR.calculate({ period: 14, high: highs, low: lows, close: closes }));
  const recentVolume = average(volumes.slice(-10));
  const baseVolume = average(volumes.slice(-40, -10));
  const notes: string[] = [];

  if (rsi !== null && rsi > 70) notes.push("RSI is high. Avoid chasing candles.");
  if (rsi !== null && rsi < 30) notes.push("RSI is low. Wait for structure and risk confirmation.");
  if (emaFast !== null && emaSlow !== null) {
    notes.push(emaFast > emaSlow ? "EMA 9 is above EMA 21, showing short-term strength." : "EMA 9 is below EMA 21, showing short-term weakness.");
  }
  if (atr !== null && lastPrice > 0 && atr / lastPrice > 0.035) notes.push("Volatility is high for a small account. Keep position size conservative.");
  if (baseVolume > 0 && recentVolume < baseVolume * 0.65) notes.push("Recent volume is thin. Be careful with small-cap slippage.");

  const status = getMarketStatus(ema20, ema50, rsi);
  const statusText = getMarketStatusText(status);
  let condition: MarketSignal["condition"] = "mixed";
  if (baseVolume > 0 && recentVolume < baseVolume * 0.65) condition = "thin";
  else if (rsi !== null && (rsi > 70 || rsi < 30)) condition = "heated";
  else if (atr !== null && lastPrice > 0 && atr / lastPrice < 0.018) condition = "calm";

  return {
    symbol,
    interval,
    lastPrice: round(lastPrice, 6),
    latestClose: round(lastPrice, 6),
    rsi: nullableRound(rsi, 2),
    rsi14: nullableRound(rsi, 2),
    emaFast: nullableRound(emaFast, 6),
    emaSlow: nullableRound(emaSlow, 6),
    ema20: nullableRound(ema20, 6),
    ema50: nullableRound(ema50, 6),
    atr: nullableRound(atr, 6),
    condition,
    status,
    statusText,
    notes: notes.length ? notes : ["No extreme signal detected. Plan entry, Stop Loss, and invalidation before acting."]
  };
}

export function getMarketStatus(ema20: number | null, ema50: number | null, rsi14: number | null): MarketStatus {
  if (rsi14 !== null && rsi14 > 70) return "NO_CHASE";
  if (ema20 !== null && ema50 !== null && ema20 < ema50) return "WEAK";
  if (ema20 !== null && ema50 !== null && rsi14 !== null && ema20 > ema50 && rsi14 >= 40 && rsi14 <= 65) return "WATCH_LONG";
  return "WAIT";
}

export function getMarketStatusText(status: MarketStatus) {
  const statusText: Record<MarketStatus, string> = {
    WATCH_LONG: "เทรนด์บวกพอใช้ รอย่อเข้าโซน",
    NO_CHASE: "RSI สูงเกินไป ห้ามไล่ราคา",
    WEAK: "แนวโน้มยังอ่อน ระวังฝั่ง Long",
    WAIT: "รอจังหวะ ยังไม่ควรรีบเข้า"
  };

  return statusText[status];
}

function last(values: number[]) {
  return values.length ? values[values.length - 1] : null;
}

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function nullableRound(value: number | null, digits: number) {
  return value === null ? null : round(value, digits);
}

function round(value: number, digits: number) {
  return Number(value.toFixed(digits));
}
