export const DEFAULT_DAILY_LOSS_LIMIT_THB = -0.6;

const DAILY_STOP_TEXT = "\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49\u0E02\u0E32\u0E14\u0E17\u0E38\u0E19\u0E16\u0E36\u0E07\u0E25\u0E34\u0E21\u0E34\u0E15\u0E41\u0E25\u0E49\u0E27 \u0E04\u0E27\u0E23\u0E2B\u0E22\u0E38\u0E14\u0E40\u0E17\u0E23\u0E14";
const LOSING_STREAK_TEXT = "\u0E41\u0E1E\u0E49\u0E15\u0E34\u0E14\u0E01\u0E31\u0E19 2 \u0E44\u0E21\u0E49 \u0E1E\u0E31\u0E01\u0E01\u0E48\u0E2D\u0E19 \u0E2D\u0E22\u0E48\u0E32\u0E41\u0E01\u0E49\u0E21\u0E37\u0E2D";

export type DailyStopStatus = {
  blocked: boolean;
  messages: string[];
};

export function getDailyStopStatus(todayPnl: number, currentLosingStreak: number): DailyStopStatus {
  const messages: string[] = [];

  if (todayPnl <= DEFAULT_DAILY_LOSS_LIMIT_THB) {
    messages.push(DAILY_STOP_TEXT);
  }
  if (currentLosingStreak >= 2) {
    messages.push(LOSING_STREAK_TEXT);
  }

  return {
    blocked: messages.length > 0,
    messages
  };
}

export function getDailyStopMessage(dailyPnlThb: number, losingStreak: number) {
  const status = getDailyStopStatus(dailyPnlThb, losingStreak);
  return status.messages[0] ?? "Daily stop is still clear, but keep risk small.";
}
