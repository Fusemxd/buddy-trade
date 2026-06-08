import type { ExtractedScreenshotData } from "@/types/screenshotImport";

export function parseScreenshotText(rawText: string): ExtractedScreenshotData {
  const text = rawText.toUpperCase();
  const symbol = text.match(/\b(BTC\/?USDT|ETH\/?USDT|SOL\/?USDT|AAPL|NVDA|TSLA)\b/)?.[1]?.replace("/", "");
  const timeframe = text.match(/\b(1M|5M|15M|1H|4H|1D|1W)\b/)?.[1];
  const direction = text.includes("SHORT") ? "Short" : text.includes("LONG") ? "Long" : text.includes("SPOT") || text.includes("BUY") ? "Spot Buy" : "Unknown";
  const sourceApp = text.includes("BINANCE") ? "Binance" : text.includes("TRADINGVIEW") ? "TradingView" : text.includes("BYBIT") ? "Bybit" : text.includes("BITKUB") ? "Bitkub" : "Unknown";

  return {
    symbol,
    direction,
    timeframe,
    sourceApp,
    rawText,
    confidence: rawText ? 0.35 : 0,
    notes: "TODO: Add OCR extraction using tesseract.js or AI Vision later. OCR may read numbers incorrectly."
  };
}
