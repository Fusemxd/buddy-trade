import { getDailyStopStatus } from "@/lib/dailyStop";
import { summarizeJournal } from "@/lib/journal";
import type { JournalEntry } from "@/types/journal";

export default function JournalSummary({ entries }: { entries: JournalEntry[] }) {
  const summary = summarizeJournal(entries);
  const dailyStop = getDailyStopStatus(summary.todayPnl, summary.currentLosingStreak);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryItem label="Total trades" value={summary.totalTrades} />
        <SummaryItem label="Win rate" value={`${summary.winRate}%`} />
        <SummaryItem label="Total P/L" value={`${summary.totalPnl} THB`} tone={summary.totalPnl < 0 ? "danger" : "good"} />
        <SummaryItem label="Losing streak" value={summary.currentLosingStreak} tone={summary.currentLosingStreak >= 2 ? "danger" : "neutral"} />
        <SummaryItem label="Today's P/L" value={`${summary.todayPnl} THB`} tone={summary.todayPnl <= -20 ? "danger" : "neutral"} />
      </div>

      {dailyStop.blocked ? (
        <div className="space-y-2">
          {dailyStop.messages.map((message) => (
            <p className="rounded-xl border border-red-400/40 bg-red-400/10 p-3 text-sm font-black text-red-100" key={message}>{message}</p>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm font-bold text-emerald-100">Daily stop ยังไม่ถูก trigger แต่ยังต้องคุมขนาดความเสี่ยงทุกไม้</p>
      )}
    </div>
  );
}

function SummaryItem({ label, value, tone = "neutral" }: { label: string; value: string | number; tone?: "neutral" | "good" | "danger" }) {
  const toneClass = {
    neutral: "text-white",
    good: "text-emerald-100",
    danger: "text-red-100"
  }[tone];

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/75 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className={`mt-2 break-words text-2xl font-black ${toneClass}`}>{value}</p>
    </div>
  );
}
