import type { MarketSignal } from "@/types/market";
import type { SetupQuality, SetupQualityInput, WatchlistSetup } from "@/types/setup";

export function calculateSetupQuality(input: SetupQualityInput): SetupQuality {
  let score = 50;
  if (input.marketStatus === "WATCH_LONG") score += 15;
  if (input.marketStatus === "NO_CHASE") score -= 25;
  if (input.marketStatus === "WEAK") score -= 15;
  if ((input.rsi ?? 0) > 70) score -= 20;
  if (input.ema20 !== null && input.ema50 !== null && input.ema20 !== undefined && input.ema50 !== undefined) {
    if (input.ema20 > input.ema50) score += 10;
    if (input.ema20 < input.ema50) score -= 10;
  }
  if (input.riskReward !== undefined) {
    score += input.riskReward >= 2 ? 15 : -20;
  }
  if ((input.riskAmount ?? 0) > 10) score -= 15;
  if (input.hasStopLoss === false) score -= 30;

  const blocked = input.dailyStopReached || (input.losingStreak ?? 0) >= 2;
  score = Math.max(0, Math.min(100, score));
  if (blocked) return { label: "blocked", score: 0, reason: "Safety rule failed. Pause and review risk first." };
  if (score >= 75) return { label: "high", score, reason: "Setup readiness is strong, but still requires manual risk review." };
  if (score >= 55) return { label: "medium", score, reason: "Worth watching, but confirm risk and exit plan first." };
  return { label: "low", score, reason: "Not ready yet. Wait for a clearer setup." };
}

export function buildWatchlistSetup(market: MarketSignal): WatchlistSetup {
  const quality = calculateSetupQuality({
    marketStatus: market.status,
    rsi: market.rsi14,
    ema20: market.ema20,
    ema50: market.ema50
  });

  return {
    symbol: market.symbol,
    latestPrice: market.latestClose,
    changePercent: market.changePercent,
    provider: market.provider,
    timeframe: market.interval,
    cached: market.cached,
    updatedAt: market.updatedAt,
    recentCloses: market.recentCloses,
    recentCandles: market.recentCandles,
    ema20: market.ema20,
    ema50: market.ema50,
    rsi14: market.rsi14,
    marketStatus: market.status,
    statusText: statusText(market.status),
    nextStep: nextStep(market.status),
    quality
  };
}

function statusText(status: MarketSignal["status"]) {
  if (status === "WATCH_LONG") return "น่าจับตา";
  if (status === "NO_CHASE") return "ห้ามไล่ราคา";
  if (status === "WEAK") return "แนวโน้มยังอ่อน";
  return "รอจังหวะ";
}

function nextStep(status: MarketSignal["status"]) {
  if (status === "WATCH_LONG") return "เช็ก Entry, Stop Loss, TP และ Risk ก่อนสร้างแผน";
  if (status === "NO_CHASE") return "รอย่อก่อน อย่าไล่ราคา";
  if (status === "WEAK") return "รอ setup ที่ชัดกว่า";
  return "รอจังหวะที่มีข้อมูลชัดกว่า";
}
