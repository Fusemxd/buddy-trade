import type { AlertEvent, AlertRule, AlertRuleType } from "@/types/alerts";
import type { MarketSignal } from "@/types/market";

export const alertTypeLabels: Record<AlertRuleType, string> = {
  price_above: "ราคาแตะโซนที่ตั้งไว้",
  price_below: "ราคาแตะโซนที่ตั้งไว้",
  rsi_above_70: "RSI สูงเกินไป",
  rsi_below_30: "RSI ต่ำเกินไป",
  ema_cross_above: "EMA ตัดกัน",
  ema_cross_below: "EMA ตัดกัน",
  near_tp1: "เข้าใกล้ TP1",
  near_stop_loss: "เข้าใกล้ Stop Loss",
  daily_stop_reached: "ถึง Daily Stop",
  losing_streak_reached: "แพ้ติดกัน 2 ไม้"
};

export function buildAlertMessage(rule: AlertRule) {
  if (rule.type === "near_tp1") return `${rule.symbol} ราคาเข้าใกล้ TP1 ตามแผน`;
  if (rule.type === "near_stop_loss") return `${rule.symbol} ราคาเข้าใกล้ Stop Loss ตามแผน`;
  if (rule.type === "rsi_above_70") return `${rule.symbol} RSI สูงเกิน 70 ระวังไล่ราคา`;
  if (rule.type === "rsi_below_30") return `${rule.symbol} RSI ต่ำกว่า 30 รอให้โครงสร้างชัดขึ้น`;
  if (rule.type === "daily_stop_reached") return "ถึง Daily Stop แล้ว ควรพักและทบทวน Journal";
  if (rule.type === "losing_streak_reached") return "แพ้ติดกัน 2 ไม้ ควรพักก่อน";
  return `${rule.symbol} เข้าเงื่อนไขที่ตั้งไว้`;
}

export function evaluateAlertRule(rule: AlertRule, market?: MarketSignal): AlertEvent | null {
  if (!rule.enabled) return null;
  let triggered = false;
  if (market) {
    if (rule.type === "price_above") triggered = rule.value !== undefined && market.latestClose >= rule.value;
    if (rule.type === "price_below") triggered = rule.value !== undefined && market.latestClose <= rule.value;
    if (rule.type === "rsi_above_70") triggered = (market.rsi14 ?? 0) > 70;
    if (rule.type === "rsi_below_30") triggered = market.rsi14 !== null && market.rsi14 < 30;
    if (rule.type === "ema_cross_above") triggered = market.ema20 !== null && market.ema50 !== null && market.ema20 > market.ema50;
    if (rule.type === "ema_cross_below") triggered = market.ema20 !== null && market.ema50 !== null && market.ema20 < market.ema50;
  }
  if (!triggered) return null;
  return { id: crypto.randomUUID(), ruleId: rule.id, symbol: rule.symbol, message: buildAlertMessage(rule), createdAt: new Date().toISOString(), read: false };
}
