import type { ExtractedReceiptData, ExpenseCategory } from "@/types/expense";

export function parseReceiptText(rawText: string): ExtractedReceiptData {
  const text = rawText;
  const upper = rawText.toUpperCase();
  const amount = upper.match(/(?:TOTAL|AMOUNT|PAID|ยอดรวม|รวมเงิน|ชำระเงิน)\D{0,12}(\d+(?:[.,]\d{1,2})?)/)?.[1]?.replace(",", ".");
  const date = upper.match(/\b(\d{4}-\d{2}-\d{2}|\d{2}[/-]\d{2}[/-]\d{4})\b/)?.[1];
  const currency = upper.includes("USDT") ? "USDT" : upper.includes("USD") ? "USD" : upper.includes("THB") || text.includes("฿") ? "THB" : "Other";
  return {
    merchant: rawText.split(/\r?\n/).find(Boolean) ?? "",
    date,
    totalAmount: amount ? Number(amount) : undefined,
    currency,
    category: detectCategory(upper),
    source: "Receipt Photo",
    rawText,
    confidence: rawText ? 0.35 : 0,
    notes: "TODO: Add OCR extraction with tesseract.js or AI Vision later."
  };
}

function detectCategory(text: string): ExpenseCategory {
  if (/OPENAI|ANTHROPIC|API|TOKEN|USAGE/.test(text)) return "API Cost";
  if (/VERCEL|TRADINGVIEW|CHATGPT|SUBSCRIPTION|MONTHLY/.test(text)) return "Subscription";
  if (/FEE|COMMISSION|BINANCE|BYBIT|BITKUB|EXCHANGE/.test(text)) return "Trading Fee";
  if (/COURSE|CLASS|LEARNING|คอร์ส|เรียน/.test(text)) return "Course / Learning";
  if (/SOFTWARE|APP|LICENSE|PLUGIN|EXTENSION/.test(text)) return "Software";
  if (/INTERNET|FIBER|AIS|TRUE|DTAC/.test(text)) return "Internet";
  return "Other";
}
