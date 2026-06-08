export type ScreenshotSourceApp = "Binance" | "TradingView" | "Bybit" | "Bitkub" | "Other" | "Unknown";
export type ScreenshotImportMode = "watchlist" | "trade_plan" | "journal" | "exit_plan";

export type ExtractedScreenshotData = {
  symbol?: string;
  currentPrice?: number;
  direction?: "Spot Buy" | "Long" | "Short" | "Unknown";
  entryPrice?: number;
  stopLoss?: number;
  takeProfit1?: number;
  takeProfit2?: number;
  timeframe?: string;
  sourceApp?: ScreenshotSourceApp;
  rawText?: string;
  confidence?: number;
  notes?: string;
};

export type ScreenshotImportDraft = {
  id: string;
  createdAt: string;
  imageDataUrl: string;
  mode: ScreenshotImportMode;
  extracted: ExtractedScreenshotData;
  confirmed: boolean;
};
