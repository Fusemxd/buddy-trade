import type { DirectionBiasInput, DirectionBiasResult } from "@/types/directionBias";

export function calculateDirectionBias(input: DirectionBiasInput): DirectionBiasResult {
  const todayPnl = input.todayPnl ?? 0;
  const losingStreak = input.losingStreak ?? 0;
  const hasStopLoss = Boolean(input.stopLoss && input.stopLoss > 0);
  const riskReward = input.riskReward ?? calculateRiskReward(input.entry, input.stopLoss, input.takeProfit);
  const details: string[] = [];

  let longScore = 0;
  let shortScore = 0;

  if (isAbove(input.ema20Confirm, input.ema50Confirm)) {
    longScore += 2;
    details.push("1H EMA20 อยู่เหนือ EMA50");
  }
  if (isBelow(input.ema20Confirm, input.ema50Confirm)) {
    shortScore += 2;
    details.push("1H EMA20 อยู่ใต้ EMA50");
  }
  if (isAbove(input.ema20Primary, input.ema50Primary)) {
    longScore += 2;
    details.push("15m EMA20 อยู่เหนือ EMA50");
  }
  if (isBelow(input.ema20Primary, input.ema50Primary)) {
    shortScore += 2;
    details.push("15m EMA20 อยู่ใต้ EMA50");
  }
  if (inRange(input.rsiPrimary, 40, 65)) {
    longScore += 1;
    details.push("RSI อยู่ในโซนที่ฝั่งขึ้นยังไม่ร้อนเกินไป");
  }
  if (inRange(input.rsiPrimary, 35, 60)) {
    shortScore += 1;
    details.push("RSI อยู่ในโซนที่ฝั่งลงยังพอดูได้");
  }
  if ((input.rsiPrimary ?? 0) > 70) {
    longScore -= 2;
    details.push("RSI สูงกว่า 70 ต้องระวังการไล่ราคา");
  }
  if (input.rsiPrimary !== null && input.rsiPrimary !== undefined && input.rsiPrimary < 30) {
    shortScore -= 2;
    details.push("RSI ต่ำกว่า 30 อาจยืดเกินไป");
  }
  if (riskReward >= 2) {
    longScore += 2;
    shortScore += 2;
    details.push("Risk/Reward ผ่านขั้นต่ำ 1:2");
  }
  if (!hasStopLoss) {
    longScore -= 3;
    shortScore -= 3;
  }
  if (todayPnl <= -20) {
    longScore -= 5;
    shortScore -= 5;
  }
  if (losingStreak >= 2) {
    longScore -= 5;
    shortScore -= 5;
  }

  if (todayPnl <= -20) return result(input, "BLOCKED", longScore, shortScore, "ยังไม่ควรทำแผนต่อ เพราะเงื่อนไขความเสี่ยงไม่ผ่าน", "พักก่อน เพราะถึง Daily Stop แล้ว", details);
  if (losingStreak >= 2) return result(input, "BLOCKED", longScore, shortScore, "ยังไม่ควรทำแผนต่อ เพราะเงื่อนไขความเสี่ยงไม่ผ่าน", "พักก่อน เพราะแพ้ติดกัน 2 ไม้", details);
  if (!hasStopLoss) return result(input, "BLOCKED", longScore, shortScore, "ยังไม่ควรทำแผนต่อ เพราะเงื่อนไขความเสี่ยงไม่ผ่าน", "ไปกรอก Entry / SL / TP", details);
  if (longScore >= 5 && longScore > shortScore) return result(input, "LONG_BIAS", longScore, shortScore, "ฝั่งขึ้นเริ่มมีน้ำหนัก แต่ยังต้องมี Entry, Stop Loss และ Take Profit ก่อน", "เช็ก Risk Calculator", details);
  if (shortScore >= 5 && shortScore > longScore) return result(input, "SHORT_BIAS", longScore, shortScore, "ฝั่งลงเริ่มมีน้ำหนัก แต่ยังต้องเช็กความเสี่ยงและไม่ไล่ราคา", "เช็ก Risk Calculator", details);

  const nextStep = (input.rsiPrimary ?? 0) > 70 ? "รอให้ RSI เย็นลง" : "รอข้อมูลให้ชัดขึ้น";
  return result(input, "WAIT", longScore, shortScore, "สัญญาณยังไม่ชัด รอก่อนปลอดภัยกว่า", nextStep, details);
}

function result(input: DirectionBiasInput, bias: DirectionBiasResult["bias"], longScore: number, shortScore: number, reason: string, nextStep: string, details: string[]): DirectionBiasResult {
  return {
    symbol: input.symbol || "BTCUSDT",
    bias,
    biasText: biasText(bias),
    longScore,
    shortScore,
    reason,
    nextStep,
    details
  };
}

function biasText(bias: DirectionBiasResult["bias"]) {
  if (bias === "LONG_BIAS") return "ฝั่งขึ้นน่าจับตา";
  if (bias === "SHORT_BIAS") return "ฝั่งลงน่าจับตา";
  if (bias === "BLOCKED") return "เงื่อนไขความเสี่ยงไม่ผ่าน";
  return "ยังไม่ชัด ควรรอ";
}

function isAbove(a?: number | null, b?: number | null) {
  return a !== null && a !== undefined && b !== null && b !== undefined && a > b;
}

function isBelow(a?: number | null, b?: number | null) {
  return a !== null && a !== undefined && b !== null && b !== undefined && a < b;
}

function inRange(value: number | null | undefined, min: number, max: number) {
  return value !== null && value !== undefined && value >= min && value <= max;
}

function calculateRiskReward(entry?: number, stopLoss?: number, takeProfit?: number) {
  if (!entry || !stopLoss || !takeProfit) return 0;
  const risk = Math.abs(entry - stopLoss);
  const reward = Math.abs(takeProfit - entry);
  return risk > 0 ? Number((reward / risk).toFixed(2)) : 0;
}
