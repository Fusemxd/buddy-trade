export type AlertRuleType =
  | "price_above"
  | "price_below"
  | "rsi_above_70"
  | "rsi_below_30"
  | "ema_cross_above"
  | "ema_cross_below"
  | "near_tp1"
  | "near_stop_loss"
  | "daily_stop_reached"
  | "losing_streak_reached";

export type AlertRule = {
  id: string;
  symbol: string;
  type: AlertRuleType;
  value?: number;
  enabled: boolean;
  createdAt: string;
};

export type AlertEvent = {
  id: string;
  ruleId?: string;
  symbol: string;
  message: string;
  createdAt: string;
  read: boolean;
};
