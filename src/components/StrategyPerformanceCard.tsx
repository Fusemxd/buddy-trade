import { formatThbAsUsdWithThb } from "@/lib/capitalStorage";
import type { StrategyPerformance } from "@/types/journalAnalytics";

export default function StrategyPerformanceCard({ strategies }: { strategies: StrategyPerformance[] }) {
  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-950/65 p-4">
      <h3 className="text-lg font-black text-white">Strategy Performance</h3>
      <div className="mt-3 grid gap-2">
        {strategies.length ? strategies.map((strategy) => (
          <article className="grid gap-2 rounded-2xl border border-slate-700 bg-slate-900/75 p-3 sm:grid-cols-4" key={strategy.strategy}>
            <p className="font-black text-white">{strategy.strategy}</p>
            <p className="text-sm text-slate-300">Trades {strategy.trades}</p>
            <p className="text-sm text-slate-300">Win {strategy.winRate}%</p>
            <p className="text-sm font-black text-white">{formatThbAsUsdWithThb(strategy.totalPnl)}</p>
          </article>
        )) : <p className="text-sm font-bold text-slate-400">ยังไม่มี strategy data</p>}
      </div>
    </section>
  );
}
