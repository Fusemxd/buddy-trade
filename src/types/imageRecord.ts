export type ImageRecordType = "trade_screenshot" | "receipt" | "journal_draft" | "trade_plan_draft" | "expense_record";

export type ImageRecordStatus = "draft" | "confirmed" | "needs_review" | "archived";

export type ImageRecord = {
  id: string;
  createdAt: string;
  type: ImageRecordType;
  status: ImageRecordStatus;
  imageDataUrl?: string;
  title?: string;
  source?: string;
  linkedExpenseId?: string;
  linkedJournalId?: string;
  linkedTradePlanId?: string;
  extractedText?: string;
  summary?: string;
  notes?: string;
};

export type ImageRecordSummary = {
  totalImages: number;
  tradeScreenshots: number;
  receiptImages: number;
  pendingReview: number;
  confirmedRecords: number;
  journalDrafts: number;
  tradePlanDrafts: number;
  monthlyExpenseTotal: number;
  monthlyApiCost: number;
  monthlySubscriptionCost: number;
  screenshotLinkedPnL?: number;
  winCount?: number;
  lossCount?: number;
  breakEvenCount?: number;
  insights: string[];
  nextActions: string[];
};
