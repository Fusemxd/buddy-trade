import { analyzeJournal } from "@/lib/journalAnalytics";
import { formatUsdWithThb } from "@/lib/capitalStorage";
import type { JournalEntry } from "@/types/journal";
import JournalStatsCard from "./JournalStatsCard";
import MonthlyReportCard from "./MonthlyReportCard";
import StrategyPerformanceCard from "./StrategyPerformanceCard";
import TradeDurationStats from "./TradeDurationStats";

export default function JournalDashboard({ entries }: { entries: JournalEntry[] }) {
  const analytics = analyzeJournal(entries);
  return (
    <section className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <JournalStatsCard label="Total trades" value={analytics.totalTrades} helper={`Win ${analytics.winCount} | Loss ${analytics.lossCount} | BE ${analytics.breakEvenCount}`} />
        <JournalStatsCard label="Win rate" value={`${analytics.winRate}%`} helper={`Current losing streak ${analytics.currentLosingStreak}`} />
        <JournalStatsCard label="Total P/L" value={formatUsdWithThb(analytics.totalPnl)} helper={`Today ${formatUsdWithThb(analytics.todayPnl)}`} />
        <JournalStatsCard label="Monthly P/L" value={formatUsdWithThb(analytics.monthlyPnl)} helper={`Weekly ${formatUsdWithThb(analytics.weeklyPnl)}`} />
        <JournalStatsCard label="Average win" value={formatUsdWithThb(analytics.averageWin)} />
        <JournalStatsCard label="Average loss" value={formatUsdWithThb(analytics.averageLoss)} />
        <JournalStatsCard label="Biggest win" value={formatUsdWithThb(analytics.biggestWin)} />
        <JournalStatsCard label="Biggest loss" value={formatUsdWithThb(analytics.biggestLoss)} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <InsightPanel title="Beginner insights" items={analytics.insights} />
        <InsightPanel title="Common mistake tags" items={analytics.commonMistakeTags.map((item) => `${item.tag}: ${item.count}`)} />
      </div>
      <StrategyPerformanceCard strategies={analytics.strategyPerformance} />
      <TradeDurationStats analytics={analytics} />
      <MonthlyReportCard analytics={analytics} />
    </section>
  );
}

function InsightPanel({ title, items }: { title: string; items: string[] }) {
  return <section className="rounded-3xl border border-slate-700 bg-slate-950/65 p-4"><h3 className="text-lg font-black text-white">{title}</h3><div className="mt-3 grid gap-2">{items.length ? items.map((item) => <p className="rounded-2xl bg-slate-900/75 p-3 text-sm font-bold text-slate-300" key={item}>{item}</p>) : <p className="text-sm font-bold text-slate-500">ยังไม่มีข้อมูล</p>}</div></section>;
}
