export const DEFAULT_CAPITAL_THB = 500;
export const DAILY_LOSS_LIMIT_THB = -20;

export type RiskInput = {
  capitalThb: number;
  riskPercent: number;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  dailyPnlThb?: number;
  losingStreak?: number;
};

export type RiskResult = {
  riskAmountThb: number;
  positionSize: number;
  rewardMultiple: number;
  rewardRatioText: string;
  riskDistance: number;
  rewardDistance: number;
  isRewardValid: boolean;
  isRiskAmountValid: boolean;
  hasStopLoss: boolean;
  dailyStopClear: boolean;
  primaryMessage: string;
  warnings: string[];
  status: "disciplined" | "review" | "stop";
};

export function calculateRisk(input: RiskInput): RiskResult {
  const warnings: string[] = [];
  const riskAmountThb = round((input.capitalThb * input.riskPercent) / 100);
  const riskDistance = Math.abs(input.entry - input.stopLoss);
  const rewardDistance = Math.abs(input.takeProfit - input.entry);
  const rewardMultiple = riskDistance > 0 ? round(rewardDistance / riskDistance) : 0;
  const positionSize = riskDistance > 0 ? round(riskAmountThb / riskDistance, 6) : 0;
  const dailyPnlThb = input.dailyPnlThb ?? 0;
  const losingStreak = input.losingStreak ?? 0;
  const hasStopLoss = input.stopLoss > 0 && riskDistance > 0;
  const isRewardValid = rewardMultiple >= 2;
  const isRiskAmountValid = !(input.capitalThb === DEFAULT_CAPITAL_THB && riskAmountThb > 10);
  const dailyStopClear = dailyPnlThb > DAILY_LOSS_LIMIT_THB;
  const primaryMessage = isRewardValid ? "Initial risk/reward condition passed." : "Risk/reward is below the minimum condition.";

  if (input.riskPercent < 1 || input.riskPercent > 2) {
    warnings.push("Risk per trade should stay around 1-2% for beginner mode.");
  }
  if (!isRiskAmountValid) {
    warnings.push("Risk amount is too high for small capital.");
  }
  if (!hasStopLoss) {
    warnings.push("Every trade plan needs a valid Stop Loss before execution.");
  }
  if (!isRewardValid) {
    warnings.push("Risk/reward is below 1:2.");
  }
  if (!dailyStopClear) {
    warnings.push("Daily loss limit reached. Stop trading and review the journal.");
  }
  if (losingStreak >= 2) {
    warnings.push("Losing streak is 2 or more. Pause trading to protect capital.");
  }

  const status = !dailyStopClear || losingStreak >= 2 ? "stop" : warnings.length ? "review" : "disciplined";

  return {
    riskAmountThb,
    positionSize,
    rewardMultiple,
    rewardRatioText: `1:${rewardMultiple}`,
    riskDistance,
    rewardDistance,
    isRewardValid,
    isRiskAmountValid,
    hasStopLoss,
    dailyStopClear,
    primaryMessage,
    warnings,
    status
  };
}

function round(value: number, digits = 2) {
  return Number(value.toFixed(digits));
}
