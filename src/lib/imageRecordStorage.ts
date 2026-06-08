import { loadExpenses } from "@/lib/expenseStorage";
import { loadScreenshotImports } from "@/lib/screenshotStorage";
import type { ExpenseRecord } from "@/types/expense";
import type { ImageRecord } from "@/types/imageRecord";
import type { ScreenshotImportDraft } from "@/types/screenshotImport";

const IMAGE_RECORD_KEY = "trade-buddy-image-records";

export function loadImageRecords(): ImageRecord[] {
  if (typeof window === "undefined") return [];
  const directRecords = loadDirectImageRecords();
  return mergeRecords([...directRecords, ...screenshotRecords(loadScreenshotImports()), ...expenseRecords(loadExpenses())]);
}

export function saveImageRecords(records: ImageRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(IMAGE_RECORD_KEY, JSON.stringify(records));
}

function loadDirectImageRecords() {
  const raw = window.localStorage.getItem(IMAGE_RECORD_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ImageRecord[];
  } catch {
    return [];
  }
}

function screenshotRecords(items: ScreenshotImportDraft[]): ImageRecord[] {
  return items.map((item) => ({
    id: `screenshot-${item.id}`,
    createdAt: item.createdAt,
    type: item.mode === "journal" ? "journal_draft" : item.mode === "trade_plan" ? "trade_plan_draft" : "trade_screenshot",
    status: item.confirmed ? "confirmed" : "needs_review",
    imageDataUrl: item.imageDataUrl,
    title: item.extracted.symbol ? `${item.extracted.symbol} screenshot` : "Trade screenshot",
    source: item.extracted.sourceApp ?? "Screenshot Import",
    extractedText: item.extracted.rawText,
    summary: summarizeScreenshot(item),
    notes: item.extracted.notes
  }));
}

function expenseRecords(items: ExpenseRecord[]): ImageRecord[] {
  return items.map((item) => ({
    id: `expense-${item.id}`,
    createdAt: item.createdAt,
    type: item.imageDataUrl ? "receipt" : "expense_record",
    status: item.confirmed ? "confirmed" : "needs_review",
    imageDataUrl: item.imageDataUrl,
    title: item.merchant,
    source: item.source,
    linkedExpenseId: item.id,
    extractedText: item.rawText,
    summary: `${item.totalAmount} ${item.currency} | ${item.category}`,
    notes: item.notes
  }));
}

function summarizeScreenshot(item: ScreenshotImportDraft) {
  const parts = [
    item.extracted.symbol,
    item.extracted.direction,
    item.extracted.timeframe,
    item.extracted.entryPrice ? `Entry ${item.extracted.entryPrice}` : "",
    item.extracted.stopLoss ? `SL ${item.extracted.stopLoss}` : "",
    item.extracted.takeProfit1 ? `TP ${item.extracted.takeProfit1}` : ""
  ].filter(Boolean);
  return parts.length ? parts.join(" | ") : "ระบบยังอ่านข้อมูลจากภาพได้ไม่ครบ กรุณาตรวจและกรอกเองก่อนบันทึก";
}

function mergeRecords(records: ImageRecord[]) {
  const seen = new Set<string>();
  return records
    .filter((record) => {
      if (seen.has(record.id)) return false;
      seen.add(record.id);
      return true;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
