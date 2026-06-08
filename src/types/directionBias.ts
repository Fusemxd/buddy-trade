import type { MarketStatus } from "./market";

export type DirectionBias = "LONG_BIAS" | "SHORT_BIAS" | "WAIT" | "BLOCKED";

export type DirectionBiasInput = {
  symbol: string;
  timeframePrimary?: string;
  timeframeConfirm?: string;
  ema20Primary?: number | null;
  ema50Primary?: number | null;
  ema20Confirm?: number | null;
  ema50Confirm?: number | null;
  rsiPrimary?: number | null;
  marketStatus?: MarketStatus;
  entry?: number;
  stopLoss?: number;
  takeProfit?: number;
  riskReward?: number;
  todayPnl?: number;
  losingStreak?: number;
};

export type DirectionBiasResult = {
  symbol: string;
  bias: DirectionBias;
  biasText: string;
  longScore: number;
  shortScore: number;
  reason: string;
  nextStep: string;
  details: string[];
};
