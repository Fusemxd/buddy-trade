export default function DailySummaryCard() {
  return (
    <section className="rounded-3xl border border-purple-300/25 bg-purple-300/10 p-4 shadow-[0_0_35px_rgba(192,132,252,0.08)]">
      <h3 className="text-lg font-black text-white">สรุปผลงานวันนี้</h3>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric label="Trades" value="0" />
        <Metric label="Wins" value="0" />
        <Metric label="Losses" value="0" />
        <Metric label="Win Rate" value="0%" />
      </div>
      <div className="mt-3 rounded-2xl border border-slate-700/60 bg-slate-950/50 p-3">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">PnL วันนี้</p>
        <p className="mt-1 text-2xl font-black text-white">0.00 ฿</p>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-950/50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-lg font-black text-white">{value}</p>
    </div>
  );
}
