import type { ChatActionCard } from "./chat";
import type { ExitPlanAlert } from "./exitPlan";
import type { MarketStatus } from "./market";

export type DiscussionAgentId = "market-agent" | "risk-agent" | "checklist-agent" | "journal-agent" | "exit-agent" | "ask-buddy";

export type DiscussionTone = "neutral" | "caution" | "warning" | "positive" | "blocked";

export type AgentDiscussionMessage = {
  id: string;
  agentId: DiscussionAgentId;
  agentName: string;
  role: string;
  tone: DiscussionTone;
  text: string;
  createdAt: string;
};

export type SetupProbability = {
  label: "low" | "medium" | "high" | "blocked";
  score: number;
  reason: string;
};

export type AgentDiscussionInput = {
  userMessage?: string;
  symbol?: string;
  marketStatus?: MarketStatus;
  rsi?: number;
  ema20?: number;
  ema50?: number;
  capital?: number;
  riskAmount?: number;
  riskPercent?: number;
  riskReward?: number;
  todayPnl?: number;
  losingStreak?: number;
  hasEntry?: boolean;
  hasStopLoss?: boolean;
  hasTakeProfit?: boolean;
  hasImage?: boolean;
  direction?: "Spot Buy" | "Long" | "Short";
  currentPrice?: number;
  entryPrice?: number;
  stopLoss?: number;
  takeProfit1?: number;
  takeProfit2?: number;
  positionSize?: number;
};

export type AgentDiscussionResult = {
  messages: AgentDiscussionMessage[];
  probability: SetupProbability;
  finalSummary: string;
  exitAlerts?: ExitPlanAlert[];
  actionCards?: ChatActionCard[];
};
