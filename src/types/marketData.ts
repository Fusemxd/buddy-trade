export type MarketQuote = {
  symbol: string;
  price: number;
  change?: number;
  changePercent?: number;
  timestamp?: string;
  provider: "binance";
  currency?: "USDT";
};

export type MarketCandle = {
  time: string | number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

export type MarketDataResult = {
  quote?: MarketQuote;
  candles?: MarketCandle[];
  provider: "binance";
  error?: string;
  stale?: boolean;
};

export type MarketTimeframe = "5m" | "15m" | "1h" | "4h" | "1d";
