export type StrategyPerformance = {
  strategy: string;
  trades: number;
  winRate: number;
  totalPnl: number;
  averageRr: number;
  notes: string;
};

export type JournalAnalytics = {
  totalTrades: number;
  winCount: number;
  lossCount: number;
  breakEvenCount: number;
  winRate: number;
  totalPnl: number;
  todayPnl: number;
  weeklyPnl: number;
  monthlyPnl: number;
  averageWin: number;
  averageLoss: number;
  biggestWin: number;
  biggestLoss: number;
  currentLosingStreak: number;
  bestStrategy?: StrategyPerformance;
  worstStrategy?: StrategyPerformance;
  commonMistakeTags: Array<{ tag: string; count: number }>;
  emotionSummary: Array<{ emotion: string; count: number }>;
  durationSummary: Array<{ duration: string; count: number }>;
  strategyPerformance: StrategyPerformance[];
  insights: string[];
  weeklySummary: string;
  monthlySummary: string;
};
