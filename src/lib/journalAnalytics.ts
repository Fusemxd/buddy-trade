import { formatThbAsUsdWithThb } from "@/lib/capitalStorage";
import { parsePnl, summarizeJournal } from "@/lib/journal";
import type { JournalEntry } from "@/types/journal";
import type { JournalAnalytics, StrategyPerformance } from "@/types/journalAnalytics";

export function analyzeJournal(entries: JournalEntry[]): JournalAnalytics {
  const stats = summarizeJournal(entries);
  const pnls = entries.map((entry) => parsePnl(entry.profitLossThb));
  const wins = pnls.filter((value) => value > 0);
  const losses = pnls.filter((value) => value < 0);
  const weeklyEntries = entries.filter((entry) => isWithinDays(entry.date, 7));
  const monthlyEntries = entries.filter((entry) => entry.date.startsWith(new Date().toISOString().slice(0, 7)));
  const strategies = strategyStats(entries);
  const mistakeTags = countSplitValues(entries.map((entry) => entry.mistakeTags ?? ""));
  const emotions = countValues(entries.map((entry) => entry.emotion).filter(Boolean));
  const durations = countValues(entries.map((entry) => entry.tradeDuration ?? "").filter(Boolean));
  const insights: string[] = [];

  if (mistakeTags.some((item) => item.tag.includes("ไล่ราคา") && item.count >= 2)) insights.push("แพ้บ่อยตอนเข้าเพราะไล่ราคา");
  const followed = entries.filter((entry) => entry.followedPlan === "yes");
  const notFollowed = entries.filter((entry) => entry.followedPlan === "no");
  if (sumPnl(followed) > sumPnl(notFollowed)) insights.push("ไม้ที่ทำตามแผนมีผลลัพธ์ดีกว่า");
  if (stats.currentLosingStreak >= 2) insights.push("วันนี้ควรพักเพราะแพ้ติดกัน");
  if (entries.length >= 5 && weeklyEntries.length > 10) insights.push("ควรลดจำนวนไม้ต่อวันและโฟกัสเฉพาะ setup ที่ชัด");

  const weeklyPnl = sumPnl(weeklyEntries);
  const monthlyPnl = sumPnl(monthlyEntries);

  return {
    totalTrades: stats.totalTrades,
    winCount: entries.filter((entry) => entry.result === "Win").length,
    lossCount: entries.filter((entry) => entry.result === "Loss").length,
    breakEvenCount: entries.filter((entry) => entry.result === "Break Even").length,
    winRate: stats.winRate,
    totalPnl: stats.totalPnl,
    todayPnl: stats.todayPnl,
    weeklyPnl,
    monthlyPnl,
    averageWin: average(wins),
    averageLoss: average(losses),
    biggestWin: wins.length ? Math.max(...wins) : 0,
    biggestLoss: losses.length ? Math.min(...losses) : 0,
    currentLosingStreak: stats.currentLosingStreak,
    bestStrategy: strategies[0],
    worstStrategy: strategies.at(-1),
    commonMistakeTags: mistakeTags,
    emotionSummary: emotions.map(({ value, count }) => ({ emotion: value, count })),
    durationSummary: durations.map(({ value, count }) => ({ duration: value, count })),
    strategyPerformance: strategies,
    insights: insights.length ? insights : ["ยังไม่มี insight เชิงลบเด่นชัดจาก Journal"],
    weeklySummary: `7 วันล่าสุด P/L ${formatThbAsUsdWithThb(weeklyPnl)} จาก ${weeklyEntries.length} ไม้`,
    monthlySummary: `เดือนนี้ P/L ${formatThbAsUsdWithThb(monthlyPnl)} จาก ${monthlyEntries.length} ไม้`
  };
}

function strategyStats(entries: JournalEntry[]): StrategyPerformance[] {
  const grouped = new Map<string, JournalEntry[]>();
  for (const entry of entries) {
    const key = entry.strategy?.trim() || "Unspecified";
    grouped.set(key, [...(grouped.get(key) ?? []), entry]);
  }
  return Array.from(grouped.entries())
    .map(([strategy, items]) => {
      const wins = items.filter((entry) => entry.result === "Win").length;
      return {
        strategy,
        trades: items.length,
        winRate: items.length ? round((wins / items.length) * 100) : 0,
        totalPnl: sumPnl(items),
        averageRr: 0,
        notes: items.length >= 3 ? "พอเริ่มมีข้อมูลให้เทียบได้" : "ข้อมูลยังน้อย ควรบันทึกเพิ่ม"
      };
    })
    .sort((a, b) => b.totalPnl - a.totalPnl);
}

function countSplitValues(values: string[]) {
  return countValues(values.flatMap((value) => value.split(",").map((item) => item.trim()).filter(Boolean))).map(({ value, count }) => ({ tag: value, count }));
}

function countValues(values: string[]) {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return Array.from(counts.entries()).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count);
}

function isWithinDays(date: string, days: number) {
  const time = new Date(date).getTime();
  return Number.isFinite(time) && Date.now() - time <= days * 24 * 60 * 60 * 1000;
}

function sumPnl(entries: JournalEntry[]) {
  return round(entries.reduce((sum, entry) => sum + parsePnl(entry.profitLossThb), 0));
}

function average(values: number[]) {
  return values.length ? round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
}

function round(value: number) {
  return Number(value.toFixed(2));
}
