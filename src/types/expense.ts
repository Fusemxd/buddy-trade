export type ExpenseCategory = "Trading Fee" | "API Cost" | "Subscription" | "Course / Learning" | "Software" | "Device / Equipment" | "Internet" | "Other";
export type ReceiptSource = "Receipt Photo" | "Screenshot" | "Exchange Statement" | "Subscription Invoice" | "Other";

export type ExtractedReceiptData = {
  merchant?: string;
  date?: string;
  totalAmount?: number;
  currency?: "THB" | "USD" | "USDT" | "Other";
  category?: ExpenseCategory;
  source?: ReceiptSource;
  rawText?: string;
  confidence?: number;
  notes?: string;
};

export type ExpenseRecord = {
  id: string;
  createdAt: string;
  merchant: string;
  date: string;
  totalAmount: number;
  currency: "THB" | "USD" | "USDT" | "Other";
  category: ExpenseCategory;
  source: ReceiptSource;
  imageDataUrl?: string;
  rawText?: string;
  notes?: string;
  confirmed: boolean;
};
