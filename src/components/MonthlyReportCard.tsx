import type { JournalAnalytics } from "@/types/journalAnalytics";

export default function MonthlyReportCard({ analytics }: { analytics: JournalAnalytics }) {
  return (
    <section className="rounded-3xl border border-purple-300/25 bg-purple-300/10 p-4">
      <h3 className="text-lg font-black text-white">Weekly / Monthly Report</h3>
      <p className="mt-3 rounded-2xl bg-slate-950/55 p-3 text-sm font-bold text-purple-50">{analytics.weeklySummary}</p>
      <p className="mt-2 rounded-2xl bg-slate-950/55 p-3 text-sm font-bold text-purple-50">{analytics.monthlySummary}</p>
      <button className="mt-3 min-h-11 rounded-2xl border border-purple-200/35 px-4 text-sm font-black text-purple-50" onClick={() => navigator.clipboard?.writeText(`${analytics.weeklySummary}\n${analytics.monthlySummary}`)} type="button">
        Export text summary
      </button>
    </section>
  );
}
