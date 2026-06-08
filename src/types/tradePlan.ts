import type { SetupQuality } from "./setup";

export type TradePlanDirection = "Spot Buy" | "Long" | "Short";
export type TradePlanStatus = "PASS" | "CAUTION" | "BLOCKED";

export type TradePlanInput = {
  symbol: string;
  direction: TradePlanDirection;
  entry: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2?: number;
  capital: number;
  riskPercent: number;
  todayPnl?: number;
  losingStreak?: number;
};

export type TradePlan = TradePlanInput & {
  id: string;
  createdAt: string;
  riskAmount: number;
  positionSize: number;
  rewardRiskToTp1: number;
  rewardRiskToTp2?: number;
  quality: SetupQuality;
  status: TradePlanStatus;
  warnings: string[];
  notes: string;
};
