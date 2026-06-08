export type TradeDirection = "Spot Buy" | "Long" | "Short";
export type TradeResult = "Win" | "Loss" | "Break Even";

export type JournalEntry = {
  id: string;
  createdAt: string;
  date: string;
  symbol: string;
  direction: TradeDirection;
  entry: string;
  stopLoss: string;
  takeProfit: string;
  result: TradeResult;
  profitLossThb: string;
  emotion: string;
  reasonForEntry: string;
  notes: string;
  strategy?: string;
  mistakeTags?: string;
  tradeDuration?: string;
  followedPlan?: "yes" | "no";
};

export type JournalSummaryStats = {
  totalTrades: number;
  winRate: number;
  totalPnl: number;
  currentLosingStreak: number;
  todayPnl: number;
};
