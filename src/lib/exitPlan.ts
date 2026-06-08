import type { ExitPlanAlert, ExitPlanInput } from "@/types/exitPlan";

const EXIT_CHECKLIST = ["มี Stop Loss แล้ว", "มี Take Profit แล้ว", "ไม่ขยับ SL เพราะอารมณ์", "ไม่เพิ่มไม้เพื่อแก้มือ", "ทำตามแผนเดิม"];

export function generateExitPlanAlert(input: ExitPlanInput): ExitPlanAlert[] {
  const alerts: ExitPlanAlert[] = [];
  const short = input.direction === "Short";

  if (!input.entryPrice || !input.stopLoss || !input.takeProfit1) {
    alerts.push(alert("missing-plan", "caution", "แผนออกยังไม่ครบ", "ควรกำหนด Entry, Stop Loss และ Take Profit ก่อนตัดสินใจถือหรือปิดแผน"));
  }

  if (input.currentPrice && input.entryPrice && !input.takeProfit1 && isInProfit(input.currentPrice, input.entryPrice, short)) {
    alerts.push(alert("profit-no-tp", "caution", "มีกำไรแต่ยังไม่มีแผนออก", "ควรกำหนดจุด Take Profit หรือเงื่อนไขการปิดบางส่วน เพื่อไม่ให้ตัดสินใจด้วยอารมณ์"));
  }

  if (input.currentPrice && input.entryPrice && !input.stopLoss && !isInProfit(input.currentPrice, input.entryPrice, short)) {
    alerts.push(alert("loss-no-sl", "blocked", "ขาดทุนแต่ไม่มี Stop Loss", "แผนนี้เสี่ยงมาก เพราะไม่มีจุดจำกัดความเสียหาย"));
  }

  if (input.currentPrice && input.takeProfit1) {
    if (hasReachedTarget(input.currentPrice, input.takeProfit1, short)) {
      alerts.push(alert("hit-tp1", "info", "ถึงโซน TP1 แล้ว", "แผนถึงจุดบริหารกำไรแล้ว อย่าตัดสินใจจากความโลภ ให้ทำตามแผนที่กำหนดไว้"));
    } else if (isClose(input.currentPrice, input.takeProfit1)) {
      alerts.push(alert("near-tp1", "info", "ราคาเข้าใกล้ TP1", "ราคาเข้าใกล้ Take Profit 1 แล้ว ให้พิจารณาทำตามแผนที่วางไว้"));
    }
  }

  if (input.currentPrice && input.takeProfit2 && isClose(input.currentPrice, input.takeProfit2)) {
    alerts.push(alert("near-tp2", "info", "ราคาเข้าใกล้ TP2", "ราคาเข้าใกล้ Take Profit 2 แล้ว ให้ตรวจว่าแผนเดิมต้องการถือถึงเป้าหมายนี้หรือทยอยลดความเสี่ยง"));
  }

  if (input.currentPrice && input.stopLoss) {
    if (hasReachedStop(input.currentPrice, input.stopLoss, short)) {
      alerts.push(alert("hit-sl", "warning", "ถึงโซน Stop Loss", "แผนถึงจุดจำกัดความเสี่ยงแล้ว ควรเคารพแผน ไม่เพิ่มไม้เพื่อแก้มือ"));
    } else if (isClose(input.currentPrice, input.stopLoss)) {
      alerts.push(alert("near-sl", "warning", "ราคาเข้าใกล้ Stop Loss", "ราคาเข้าใกล้ Stop Loss แล้ว อย่าขยับ SL เพราะอารมณ์ ให้ทำตามแผนความเสี่ยงที่กำหนดไว้"));
    }
  }

  return alerts;
}

function alert(id: string, level: ExitPlanAlert["level"], title: string, message: string): ExitPlanAlert {
  return { id, level, title, message, checklist: EXIT_CHECKLIST };
}

function isClose(price: number, target: number) {
  const distance = Math.abs(price - target) / target;
  return distance >= 0.005 && distance <= 0.01;
}

function isInProfit(current: number, entry: number, short: boolean) {
  return short ? current < entry : current > entry;
}

function hasReachedTarget(current: number, target: number, short: boolean) {
  return short ? current <= target : current >= target;
}

function hasReachedStop(current: number, stop: number, short: boolean) {
  return short ? current >= stop : current <= stop;
}
