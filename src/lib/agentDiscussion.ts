import type { AgentDiscussionInput, AgentDiscussionMessage, AgentDiscussionResult, DiscussionTone, SetupProbability } from "@/types/agentDiscussion";
import { generateExitPlanAlert } from "./exitPlan";

export function generateAgentDiscussion(input: AgentDiscussionInput): AgentDiscussionResult {
  const now = new Date().toISOString();
  const exitAlerts = generateExitPlanAlert(input);
  const probability = calculateSetupQuality(input, exitAlerts.some((item) => item.level === "blocked"));
  const messages: AgentDiscussionMessage[] = [
    message("market-agent", "Market Agent", "Market Scanner", marketTone(input), marketText(input), now),
    message("risk-agent", "Risk Agent", "Position-size Guard", riskTone(input), riskText(input), now),
    message("checklist-agent", "Checklist Agent", "Discipline Checklist", checklistTone(input), checklistText(input), now),
    message("journal-agent", "Journal Agent", "Trade Record Keeper", journalTone(input), journalText(input), now),
    message("exit-agent", "Exit Agent", "Exit Plan Guard", exitTone(exitAlerts), exitText(exitAlerts), now)
  ];
  const finalSummary = finalBuddySummary(probability.label);
  messages.push(message("ask-buddy", "Ask Buddy", "Rule-based Chat Assistant", probability.label === "blocked" ? "blocked" : "neutral", finalSummary, now));

  return {
    messages,
    probability,
    finalSummary,
    exitAlerts,
    actionCards: [{ type: "agent_discussion" }, { type: "exit_plan" }]
  };
}

function message(agentId: AgentDiscussionMessage["agentId"], agentName: string, role: string, tone: DiscussionTone, text: string, createdAt: string): AgentDiscussionMessage {
  return { id: `${agentId}-${createdAt}`, agentId, agentName, role, tone, text, createdAt };
}

function marketText(input: AgentDiscussionInput) {
  if (input.marketStatus === "WATCH_LONG") return "สัญญาณตลาดเริ่มเข้าข่ายน่าจับตา เพราะ EMA20 อยู่เหนือ EMA50 และ RSI ยังไม่ร้อนเกินไป";
  if (input.marketStatus === "NO_CHASE" || (input.rsi ?? 0) > 70) return "ราคาเริ่มร้อนเกินไป มีความเสี่ยงจากการไล่ราคา ควรรอย่อก่อน";
  if (input.marketStatus === "WEAK") return "แนวโน้มยังอ่อน ต้องระวังฝั่ง Long และไม่ควรรีบ";
  return "ตลาดยังไม่ชัดเจน ควรรอ setup ที่ชัดกว่านี้";
}

function marketTone(input: AgentDiscussionInput): DiscussionTone {
  if (input.marketStatus === "WATCH_LONG") return "positive";
  if (input.marketStatus === "NO_CHASE" || (input.rsi ?? 0) > 70) return "warning";
  if (input.marketStatus === "WEAK") return "caution";
  return "neutral";
}

function riskText(input: AgentDiscussionInput) {
  if (input.todayPnl !== undefined && input.todayPnl <= -20) return "วันนี้ขาดทุนถึง Daily Stop แล้ว ควรหยุดเทรด";
  if (input.riskReward === undefined) return "ยังประเมินความคุ้มค่าไม่ได้ ต้องมี Entry, Stop Loss และ Take Profit ก่อน";
  if (input.riskReward < 2) return "R:R ต่ำกว่า 1:2 แผนนี้ยังไม่คุ้มความเสี่ยง";
  if ((input.riskAmount ?? 0) > 10) return "สำหรับทุน 500 บาท ความเสี่ยงเกิน 10 บาทต่อไม้ถือว่าสูงเกินไป";
  return "ถ้าคุมความเสี่ยงให้อยู่ในช่วง 5-10 บาทต่อไม้ แผนจะปลอดภัยขึ้น";
}

function riskTone(input: AgentDiscussionInput): DiscussionTone {
  if (input.todayPnl !== undefined && input.todayPnl <= -20) return "blocked";
  if (input.riskReward !== undefined && input.riskReward < 2) return "warning";
  if ((input.riskAmount ?? 0) > 10) return "warning";
  return "neutral";
}

function checklistText(input: AgentDiscussionInput) {
  if (!input.hasStopLoss) return "ยังไม่มี Stop Loss จึงไม่ควรตัดสินใจจากภาพหรืออารมณ์";
  if ((input.rsi ?? 0) > 70) return "RSI สูงกว่า 70 มีโอกาสเป็นการไล่ราคา";
  if (input.hasEntry && input.hasStopLoss && input.hasTakeProfit && (input.riskReward ?? 0) >= 2) return "Checklist เบื้องต้นเริ่มผ่าน แต่ยังต้องดูอารมณ์และวินัยก่อนกดจริง";
  return "ข้อมูลแผนยังไม่ครบ ควรกรอก Entry, SL และ TP ก่อน";
}

function checklistTone(input: AgentDiscussionInput): DiscussionTone {
  if (!input.hasStopLoss) return "blocked";
  if ((input.rsi ?? 0) > 70) return "warning";
  if (input.hasEntry && input.hasStopLoss && input.hasTakeProfit && (input.riskReward ?? 0) >= 2) return "positive";
  return "caution";
}

function journalText(input: AgentDiscussionInput) {
  if ((input.losingStreak ?? 0) >= 2) return "แพ้ติดกัน 2 ไม้แล้ว ควรพักก่อน อย่าแก้มือ";
  if (input.todayPnl !== undefined && input.todayPnl <= -20) return "วันนี้แตะขีดจำกัดขาดทุนแล้ว ควรปิดวัน";
  return "ถ้าจะใช้แผนนี้ อย่าลืมจดเหตุผลและอารมณ์ก่อนเข้าไว้ใน Journal";
}

function journalTone(input: AgentDiscussionInput): DiscussionTone {
  if ((input.losingStreak ?? 0) >= 2 || (input.todayPnl !== undefined && input.todayPnl <= -20)) return "blocked";
  return "neutral";
}

function exitText(alerts: ReturnType<typeof generateExitPlanAlert>) {
  if (alerts.some((item) => item.level === "blocked")) return "แผนออกมีความเสี่ยงสูง เพราะไม่มีจุดจำกัดความเสียหายหรือแตะเงื่อนไขหยุดพัก";
  if (alerts.some((item) => item.level === "warning")) return "ราคาเข้าใกล้จุดที่ต้องบริหารแผนแล้ว ควรทำตาม SL/TP ที่กำหนดไว้";
  if (alerts.some((item) => item.level === "info")) return "แผนเริ่มเข้าใกล้จุดบริหารกำไรหรือจุดออกตามแผนแล้ว ควรเช็กว่าจะทำตามแผนเดิมอย่างไร";
  return "ยังไม่มีแผนออกครบ ควรกำหนด TP และ SL ก่อน";
}

function exitTone(alerts: ReturnType<typeof generateExitPlanAlert>): DiscussionTone {
  if (alerts.some((item) => item.level === "blocked")) return "blocked";
  if (alerts.some((item) => item.level === "warning")) return "warning";
  if (alerts.some((item) => item.level === "info")) return "positive";
  return "caution";
}

function calculateSetupQuality(input: AgentDiscussionInput, exitBlocked: boolean): SetupProbability {
  let score = 50;
  if (input.marketStatus === "WATCH_LONG") score += 15;
  if (input.marketStatus === "NO_CHASE") score -= 25;
  if (input.marketStatus === "WEAK") score -= 15;
  if ((input.rsi ?? 0) > 70) score -= 20;
  if ((input.riskReward ?? 0) >= 2) score += 15;
  else if (input.riskReward !== undefined) score -= 20;
  if ((input.riskAmount ?? 0) > 10) score -= 15;
  if (!input.hasStopLoss) score -= 30;
  if (!input.hasEntry || !input.hasStopLoss || !input.hasTakeProfit) score -= 10;
  if (input.entryPrice && input.stopLoss && input.takeProfit1) score += 10;
  else score -= 10;
  score = Math.max(0, Math.min(100, score));

  const blocked = exitBlocked || !input.hasStopLoss || (input.todayPnl !== undefined && input.todayPnl <= -20) || (input.losingStreak ?? 0) >= 2;
  if (blocked) return { label: "blocked", score: 0, reason: "มีเงื่อนไขความเสี่ยงที่ควรหยุดหรือพักก่อน" };
  if (score >= 75) return { label: "high", score, reason: "ความพร้อมของแผนค่อนข้างดี แต่ยังต้องจำกัดความเสี่ยง" };
  if (score >= 55) return { label: "medium", score, reason: "แผนน่าจับตา แต่ยังควรกรอกข้อมูลความเสี่ยงและแผนออกให้ครบ" };
  return { label: "low", score, reason: "แผนยังไม่พร้อม ควรรอ setup ที่ชัดกว่า" };
}

function finalBuddySummary(label: SetupProbability["label"]) {
  if (label === "high") return "ทีม Agent มองว่าแผนนี้มีความพร้อมค่อนข้างดี แต่ยังต้องทำตามแผนและจำกัดความเสี่ยง";
  if (label === "medium") return "ทีม Agent มองว่าแผนนี้น่าจับตา แต่ยังต้องกรอกข้อมูลความเสี่ยงและแผนออกให้ครบก่อน";
  if (label === "blocked") return "ทีม Agent แนะนำให้หยุดก่อน เพราะเงื่อนไขความเสี่ยงหรือแผนออกไม่ผ่าน";
  return "ทีม Agent มองว่าแผนนี้ยังไม่พร้อม ควรรอ setup ที่ชัดกว่านี้";
}
