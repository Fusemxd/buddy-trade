import type { MarketStatus } from "./market";

export type SetupQualityLabel = "low" | "medium" | "high" | "blocked";

export type SetupQuality = {
  label: SetupQualityLabel;
  score: number;
  reason: string;
};

export type SetupQualityInput = {
  marketStatus?: MarketStatus;
  rsi?: number | null;
  ema20?: number | null;
  ema50?: number | null;
  riskReward?: number;
  riskAmount?: number;
  hasStopLoss?: boolean;
  dailyStopReached?: boolean;
  losingStreak?: number;
};

export type WatchlistSetup = {
  symbol: string;
  latestPrice: number;
  changePercent?: number;
  provider?: "binance";
  timeframe?: string;
  cached?: boolean;
  updatedAt?: string;
  recentCloses?: number[];
  ema20: number | null;
  ema50: number | null;
  rsi14: number | null;
  marketStatus: MarketStatus;
  statusText: string;
  nextStep: string;
  quality: SetupQuality;
};
