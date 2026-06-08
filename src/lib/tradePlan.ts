import { DEFAULT_DAILY_LOSS_LIMIT_THB } from "./dailyStop";
import { loadJournal, saveJournal } from "./journal";
import { calculateSetupQuality } from "./setupScanner";
import type { TradePlan, TradePlanInput } from "@/types/tradePlan";

export function buildTradePlan(input: TradePlanInput): TradePlan {
  const riskAmount = round((input.capital * input.riskPercent) / 100);
  const riskDistance = Math.abs(input.entry - input.stopLoss);
  const rewardToTp1 = Math.abs(input.takeProfit1 - input.entry);
  const rewardToTp2 = input.takeProfit2 ? Math.abs(input.takeProfit2 - input.entry) : undefined;
  const positionSize = riskDistance > 0 ? round(riskAmount / riskDistance, 6) : 0;
  const rewardRiskToTp1 = riskDistance > 0 ? round(rewardToTp1 / riskDistance) : 0;
  const rewardRiskToTp2 = rewardToTp2 !== undefined && riskDistance > 0 ? round(rewardToTp2 / riskDistance) : undefined;
  const warnings: string[] = [];

  if (!input.stopLoss || riskDistance === 0) warnings.push("ยังไม่มี Stop Loss");
  if (rewardRiskToTp1 < 2) warnings.push("R:R ต่ำกว่า 1:2");
  if (input.riskPercent > 2) warnings.push("Risk ต่อไม้เกิน 2% ของทุน");
  if ((input.todayPnl ?? 0) <= DEFAULT_DAILY_LOSS_LIMIT_THB) warnings.push("วันนี้แตะ Daily Stop แล้ว ควรพักก่อน");
  if ((input.losingStreak ?? 0) >= 2) warnings.push("แพ้ติดกัน 2 ไม้ พักก่อน อย่าแก้มือ");

  const blocked = warnings.length > 0;
  const quality = calculateSetupQuality({
    riskReward: rewardRiskToTp1,
    riskAmount,
    hasStopLoss: Boolean(input.stopLoss && riskDistance > 0),
    dailyStopReached: (input.todayPnl ?? 0) <= DEFAULT_DAILY_LOSS_LIMIT_THB,
    losingStreak: input.losingStreak
  });

  return {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    riskAmount,
    positionSize,
    rewardRiskToTp1,
    rewardRiskToTp2,
    quality,
    status: blocked ? "BLOCKED" : quality.label === "high" ? "PASS" : "CAUTION",
    warnings,
    notes: "This is a trade plan, not a buy/sell command."
  };
}

export function copyPlanText(plan: TradePlan) {
  return [
    "Trade Plan",
    `Symbol: ${plan.symbol}`,
    `Direction: ${plan.direction}`,
    `Entry: ${plan.entry}`,
    `Stop Loss: ${plan.stopLoss}`,
    `Take Profit 1: ${plan.takeProfit1}`,
    `Take Profit 2: ${plan.takeProfit2 ?? "-"}`,
    `Capital: $${plan.capital}`,
    `Risk Amount: $${plan.riskAmount}`,
    `Position Size: ${plan.positionSize}`,
    `R:R: 1:${plan.rewardRiskToTp1}`,
    `Setup Quality: ${plan.quality.label} (${plan.quality.score})`,
    `Checklist: ${plan.warnings.length ? plan.warnings.join("; ") : "Basic checks passed"}`,
    "Note: This is a trade plan, not a buy/sell command.",
    "นี่คือแผนเทรด ไม่ใช่คำสั่งซื้อขายหรือการรับประกันกำไร"
  ].join("\n");
}

export function savePlanToJournal(plan: TradePlan) {
  const entries = loadJournal();
  saveJournal([
    {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      date: new Date().toISOString().slice(0, 10),
      symbol: plan.symbol,
      direction: plan.direction,
      entry: String(plan.entry),
      stopLoss: String(plan.stopLoss),
      takeProfit: `${plan.takeProfit1}${plan.takeProfit2 ? ` / ${plan.takeProfit2}` : ""}`,
      result: "Break Even",
      profitLossThb: "0",
      emotion: "",
      reasonForEntry: `Plan status: ${plan.status}. Setup quality: ${plan.quality.label}`,
      notes: copyPlanText(plan)
    },
    ...entries
  ]);
}

function round(value: number, digits = 2) {
  return Number(value.toFixed(digits));
}
