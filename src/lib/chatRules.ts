import type { ChatActionCard, ChatContext } from "@/types/chat";

// Rule-based replies live here until the future AI server route is added.
// TODO: Replace rule-based reply with API route later
// TODO: Keep this file as the deterministic fallback when AI is unavailable
export const quickPrompts = [
  "รูปนี้ควรเฝ้าดูไหม?",
  "ช่วยคำนวณ Risk ให้หน่อย",
  "SL/TP แบบนี้โอเคไหม?",
  "ฉันกำลังไล่ราคาอยู่ไหม?",
  "ทุนตอนนี้เสี่ยงเกินไปไหม?",
  "บันทึกแผนนี้เข้า Journal"
];

export type BuddyReply = {
  text: string;
  actionCards?: ChatActionCard[];
};

export function generateBuddyReply(messageText: string, context: ChatContext = {}, hasImage = false): BuddyReply {
  const text = messageText.toLowerCase();
  const actionCards: ChatActionCard[] = [];
  let reply = DEFAULT_REPLY;

  if (includesAny(text, ["เข้าไหม", "ควรเข้า", "ควรเฝ้าดู"])) {
    reply = "อย่าเพิ่งตัดสินใจจากภาพอย่างเดียว เช็กก่อนว่า Stop Loss มีแล้วไหม, R ถึง 1:2 ไหม, และวันนี้แตะ Daily Stop หรือยัง";
    actionCards.push({ type: "checklist" });
  } else if (includesAny(text, ["ไล่ราคา", "แท่งเขียว", "พุ่ง"])) {
    reply = "ระวังการไล่ราคา ถ้า RSI สูงกว่า 70 หรือราคาห่าง EMA มาก ควรรอให้จังหวะเย็นลงก่อน";
    actionCards.push({ type: "warning", message: "ระวังการไล่ราคา" });
  } else if (includesAny(text, ["risk", "เสี่ยง", "ทุน", "capital"])) {
    reply = "ให้ใช้ทุนจากบันทึกฝาก/ถอนเป็นฐาน แล้วเสี่ยงต่อไม้ประมาณ 1-2% เท่านั้น ถ้าวันนี้ใกล้ Daily Stop ให้พักก่อน";
    actionCards.push({ type: "risk_calculator" });
  } else if (includesAny(text, ["sl", "stop loss", "ขาดทุน"])) {
    reply = "ควรกำหนด Stop Loss ก่อนทำแผนเสมอ ถ้า SL ทำให้เสียเกิน 1-2% ของทุน แผนนั้นเสี่ยงเกินไปสำหรับทุนเล็ก";
    actionCards.push({ type: "risk_calculator" });
  } else if (includesAny(text, ["tp", "take profit", "กำไร"])) {
    reply = "ตั้ง TP ให้สัมพันธ์กับ SL อย่างน้อย R 1:2 เช่น เสี่ยง $1 ควรมีโอกาสได้อย่างน้อย $2 ตามแผน ไม่ใช่อารมณ์";
  } else if (includesAny(text, ["journal", "บันทึก"])) {
    reply = "บันทึกไว้ใน Journal ได้เลย โดยกรอกเหรียญ ราคาเข้า จำนวนเงินที่เล่น ผลได้/เสีย ระยะเวลา และโน้ตสั้น ๆ ก็พอสำหรับเวอร์ชันใช้ง่าย";
    actionCards.push({ type: "journal_save" });
  }

  if (hasImage) {
    reply += " ตอนนี้ระบบบันทึกภาพไว้แล้ว แต่ยังไม่ได้วิเคราะห์ภาพอัตโนมัติ ต้องใช้ร่วมกับ Checklist และ Risk Calculator ก่อน";
  }

  if (context.riskWarnings?.length) {
    actionCards.push({ type: "warning", message: context.riskWarnings[0] });
  }

  return { text: reply, actionCards: actionCards.length ? actionCards : undefined };
}

export function getRuleBasedReply(message: string, context: ChatContext) {
  return generateBuddyReply(message, context).text;
}

const DEFAULT_REPLY = "รับทราบ เดี๋ยวใช้ Checklist และ Risk Calculator ช่วยเช็กแผนให้ได้ ลองพิมพ์ Entry, SL, TP หรือกดปุ่มคำนวณ Risk";

function includesAny(text: string, patterns: string[]) {
  return patterns.some((pattern) => text.includes(pattern.toLowerCase()));
}
