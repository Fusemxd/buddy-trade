import type { MarketSignal, MarketStatus } from "./market";

export type TimeframeKey = "5m" | "15m" | "1h" | "4h" | "1d";

export type TimeframeStatus = {
  timeframe: TimeframeKey;
  ema20: number | null;
  ema50: number | null;
  rsi14: number | null;
  marketStatus: MarketStatus;
  statusText: string;
  trend: "positive" | "weak" | "mixed";
};

export type MultiTimeframeResult = {
  symbol: string;
  primary?: TimeframeStatus;
  confirm?: TimeframeStatus;
  combinedBias: "LONG_WEIGHT" | "CAUTION" | "WAIT" | "NO_CHASE";
  summaryText: string;
  nextStep: string;
  signalsConflict: boolean;
  rawSignals: MarketSignal[];
};
