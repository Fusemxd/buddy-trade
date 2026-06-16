import type { TimeframeStatus } from "@/types/timeframe";

const tone = {
  WATCH_LONG: "border-emerald-300/[0.16] bg-emerald-300/[0.055] text-emerald-100",
  NO_CHASE: "border-red-300/[0.18] bg-red-300/[0.055] text-red-100",
  WEAK: "border-yellow-300/[0.18] bg-yellow-300/[0.055] text-yellow-100",
  WAIT: "border-white/[0.055] bg-black/20 text-slate-200"
};

export default function TimeframeStatusCard({ status }: { status?: TimeframeStatus }) {
  if (!status) {
    return <div className="rounded-xl bg-black/20 p-3 text-sm font-bold text-slate-400 ring-1 ring-white/[0.055]">ยังไม่มีข้อมูล timeframe</div>;
  }
  return (
    <article className={`rounded-xl border p-3 ${tone[status.marketStatus]}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-lg font-black text-white">{status.timeframe}</p>
        <span className="rounded-full bg-black/20 px-2.5 py-1 text-[10px] font-black ring-1 ring-white/[0.055]">{status.marketStatus}</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <Metric label="EMA20" value={format(status.ema20)} />
        <Metric label="EMA50" value={format(status.ema50)} />
        <Metric label="RSI" value={format(status.rsi14)} />
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-black/20 p-2"><p className="opacity-60">{label}</p><p className="font-black text-white">{value}</p></div>;
}

function format(value: number | null) {
  if (value === null) return "-";
  return value >= 100 ? value.toFixed(2) : value.toFixed(4);
}
