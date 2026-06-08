import { summarizeExpenses } from "@/lib/expenseStorage";
import { parsePnl } from "@/lib/journal";
import type { ExpenseRecord } from "@/types/expense";
import type { ImageRecord, ImageRecordSummary } from "@/types/imageRecord";
import type { JournalEntry } from "@/types/journal";

export function generateImageRecordSummary(records: ImageRecord[], expenses: ExpenseRecord[], journals: JournalEntry[]): ImageRecordSummary {
  const expenseSummary = summarizeExpenses(expenses);
  const tradeScreenshots = records.filter((record) => record.type === "trade_screenshot").length;
  const receiptImages = records.filter((record) => record.type === "receipt").length;
  const journalDrafts = records.filter((record) => record.type === "journal_draft").length;
  const tradePlanDrafts = records.filter((record) => record.type === "trade_plan_draft").length;
  const pendingReview = records.filter((record) => record.status === "needs_review" || record.status === "draft").length;
  const confirmedRecords = records.filter((record) => record.status === "confirmed").length;
  const wins = journals.filter((entry) => entry.result === "Win").length;
  const losses = journals.filter((entry) => entry.result === "Loss").length;
  const breakEvens = journals.filter((entry) => entry.result === "Break Even").length;
  const totalPnl = journals.reduce((sum, entry) => sum + parsePnl(entry.profitLossThb), 0);
  const insights: string[] = [];
  const nextActions: string[] = [];

  if (pendingReview > 0) insights.push("มีรายการที่ยังไม่ได้ตรวจสอบ");
  if (tradeScreenshots > journalDrafts) insights.push("มีภาพเทรดบางรายการที่ยังไม่ได้บันทึก Journal");
  if (expenseSummary.total > 500) insights.push("ค่าใช้จ่ายเดือนนี้สูงกว่าทุนเริ่มต้น 500 บาท");
  if (expenseSummary.apiCost > 0) insights.push("มีค่า API เดือนนี้ ควรติดตามว่าคุ้มกับการใช้งานไหม");
  if (receiptImages === 0) insights.push("ยังไม่มีใบเสร็จค่าใช้จ่าย ลองเริ่มจากค่าสมัครหรือค่า API");
  if (tradeScreenshots === 0) insights.push("ยังไม่มีภาพเทรดนำเข้า");

  if (pendingReview > 0) nextActions.push("ตรวจสอบภาพที่ยังไม่ยืนยัน");
  if (tradeScreenshots > journalDrafts) nextActions.push("บันทึก Journal จากภาพเทรด");
  nextActions.push("ตรวจยอดใบเสร็จ");
  nextActions.push("สรุปค่าใช้จ่ายเดือนนี้");
  if (records.length > 10) nextActions.push("ลบรูปที่ไม่จำเป็นเพื่อลดพื้นที่ localStorage");

  return {
    totalImages: records.filter((record) => Boolean(record.imageDataUrl)).length,
    tradeScreenshots,
    receiptImages,
    pendingReview,
    confirmedRecords,
    journalDrafts,
    tradePlanDrafts,
    monthlyExpenseTotal: expenseSummary.total,
    monthlyApiCost: expenseSummary.apiCost,
    monthlySubscriptionCost: expenseSummary.subscription,
    screenshotLinkedPnL: Number(totalPnl.toFixed(2)),
    winCount: wins,
    lossCount: losses,
    breakEvenCount: breakEvens,
    insights: insights.length ? insights : ["ยังไม่มีสัญญาณผิดปกติจากรายการที่บันทึกไว้"],
    nextActions
  };
}
