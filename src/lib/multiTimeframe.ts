import { analyzeKlines } from "@/lib/indicators";
import { fetchMarketData } from "@/lib/marketDataProviders";
import type { Kline, MarketSignal } from "@/types/market";
import type { MultiTimeframeResult, TimeframeKey, TimeframeStatus } from "@/types/timeframe";

export async function fetchMultiTimeframeConfirmation(symbol: string, options: { primary?: TimeframeKey; confirm?: TimeframeKey; forceRefresh?: boolean } = {}): Promise<MultiTimeframeResult> {
  const primaryTf = options.primary ?? "15m";
  const confirmTf = options.confirm ?? "1h";
  const signals = await Promise.all([loadSignal(symbol, primaryTf, options.forceRefresh), loadSignal(symbol, confirmTf, options.forceRefresh)]);
  return buildMultiTimeframeResult(symbol, signals.filter((signal): signal is MarketSignal => Boolean(signal)), primaryTf, confirmTf);
}

export function buildMultiTimeframeResult(symbol: string, signals: MarketSignal[], primaryTf: TimeframeKey = "15m", confirmTf: TimeframeKey = "1h"): MultiTimeframeResult {
  const primarySignal = signals.find((signal) => signal.interval === primaryTf);
  const confirmSignal = signals.find((signal) => signal.interval === confirmTf);
  const primary = primarySignal ? toStatus(primarySignal) : undefined;
  const confirm = confirmSignal ? toStatus(confirmSignal) : undefined;
  const primaryStatus = primary?.marketStatus;
  const confirmStatus = confirm?.marketStatus;
  const confirmPositive = confirm?.trend === "positive" || confirmStatus === "WATCH_LONG";
  const signalsConflict = Boolean(primary && confirm && primary.trend !== "mixed" && confirm.trend !== "mixed" && primary.trend !== confirm.trend);

  if (primaryStatus === "NO_CHASE") {
    return result(symbol, primary, confirm, "NO_CHASE", "ราคาเริ่มร้อน รอย่อก่อน", "รอให้ RSI เย็นลงและเช็ก Risk ก่อน", signalsConflict, signals);
  }
  if (primaryStatus === "WATCH_LONG" && confirmPositive) {
    return result(symbol, primary, confirm, "LONG_WEIGHT", "ฝั่งขึ้นเริ่มมีน้ำหนัก แต่ต้องเช็ก Risk ก่อน", "ไปกรอก Entry / SL / TP แล้วเช็ก Risk Calculator", signalsConflict, signals);
  }
  if (primaryStatus === "WATCH_LONG" && confirmStatus === "WEAK") {
    return result(symbol, primary, confirm, "CAUTION", "15m เริ่มดี แต่ 1h ยังอ่อน ควรระวัง", "รอ confirmation ให้ชัดขึ้น", signalsConflict, signals);
  }
  if (primaryStatus === "WEAK" && confirmStatus === "WEAK") {
    return result(symbol, primary, confirm, "WAIT", "แนวโน้มยังอ่อน ควรรอ", "รอ setup ที่ชัดกว่า", signalsConflict, signals);
  }
  if (signalsConflict) {
    return result(symbol, primary, confirm, "CAUTION", "สัญญาณยังขัดกัน รอให้ชัดกว่านี้", "ลดความรีบและเช็กกรอบเวลาใหญ่ก่อน", signalsConflict, signals);
  }
  return result(symbol, primary, confirm, "WAIT", "ยังไม่ชัด ควรรอ", "รอจังหวะที่มีข้อมูลชัดกว่า", signalsConflict, signals);
}

async function loadSignal(symbol: string, timeframe: TimeframeKey, forceRefresh?: boolean) {
  const result = await fetchMarketData(symbol, timeframe, { forceRefresh });
  if (result.error || !result.candles?.length) return null;
  const candles: Kline[] = result.candles.map((candle) => ({
    openTime: Number(candle.time),
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
    volume: candle.volume ?? 0,
    closeTime: Number(candle.time)
  }));
  return analyzeKlines(symbol, timeframe, candles);
}

function toStatus(signal: MarketSignal): TimeframeStatus {
  return {
    timeframe: signal.interval as TimeframeKey,
    ema20: signal.ema20,
    ema50: signal.ema50,
    rsi14: signal.rsi14,
    marketStatus: signal.status,
    statusText: signal.statusText,
    trend: signal.ema20 !== null && signal.ema50 !== null ? (signal.ema20 > signal.ema50 ? "positive" : signal.ema20 < signal.ema50 ? "weak" : "mixed") : "mixed"
  };
}

function result(symbol: string, primary: TimeframeStatus | undefined, confirm: TimeframeStatus | undefined, combinedBias: MultiTimeframeResult["combinedBias"], summaryText: string, nextStep: string, signalsConflict: boolean, rawSignals: MarketSignal[]): MultiTimeframeResult {
  return { symbol, primary, confirm, combinedBias, summaryText, nextStep, signalsConflict, rawSignals };
}
