export type ExitAlertLevel = "info" | "caution" | "warning" | "blocked";

export type ExitPlanInput = {
  symbol?: string;
  direction?: "Spot Buy" | "Long" | "Short";
  currentPrice?: number;
  entryPrice?: number;
  stopLoss?: number;
  takeProfit1?: number;
  takeProfit2?: number;
  positionSize?: number;
  capital?: number;
  riskAmount?: number;
};

export type ExitPlanAlert = {
  id: string;
  level: ExitAlertLevel;
  title: string;
  message: string;
  checklist?: string[];
};
