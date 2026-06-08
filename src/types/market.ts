export type Kline = {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
};

export type MarketStatus = "WATCH_LONG" | "NO_CHASE" | "WEAK" | "WAIT";

export type MarketSignal = {
  symbol: string;
  interval: string;
  provider?: "binance";
  changePercent?: number;
  cached?: boolean;
  updatedAt?: string;
  recentCloses?: number[];
  lastPrice: number;
  latestClose: number;
  rsi: number | null;
  rsi14: number | null;
  emaFast: number | null;
  emaSlow: number | null;
  ema20: number | null;
  ema50: number | null;
  atr: number | null;
  condition: "calm" | "mixed" | "heated" | "thin";
  status: MarketStatus;
  statusText: string;
  notes: string[];
};
