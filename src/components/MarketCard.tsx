import type { MarketSignal, MarketStatus } from "@/types/market";

const statusAccent: Record<MarketStatus, string> = {
  WATCH_LONG: "border-emerald-400/40 bg-emerald-400/10 text-emerald-100",
  NO_CHASE: "border-red-400/40 bg-red-400/10 text-red-100",
  WEAK: "border-yellow-300/40 bg-yellow-300/10 text-yellow-100",
  WAIT: "border-slate-600 bg-slate-900/70 text-slate-200"
};

export default function MarketCard({ market }: { market: MarketSignal }) {
  return (
    <article className={`rounded-xl border p-4 shadow-[0_0_28px_rgba(15,23,42,0.3)] ${statusAccent[market.status]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] opacity-70">{market.symbol}</p>
          <h3 className="mt-1 text-2xl font-black text-white">{formatPrice(market.latestClose)}</h3>
        </div>
        <span className="rounded-full border border-white/15 bg-black/25 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide">{market.status}</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Metric label="EMA20" value={formatIndicator(market.ema20)} />
        <Metric label="EMA50" value={formatIndicator(market.ema50)} />
        <Metric label="RSI14" value={formatIndicator(market.rsi14)} />
      </div>

      <p className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3 text-sm font-semibold text-white">{market.statusText}</p>
      <p className="mt-2 text-xs text-slate-300">ข้อมูล 15m จาก Binance public REST API เพื่อช่วยคุมความเสี่ยงเท่านั้น</p>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-2">
      <p className="text-[10px] font-bold uppercase tracking-wide opacity-60">{label}</p>
      <p className="mt-1 truncate text-sm font-black text-white">{value}</p>
    </div>
  );
}

function formatPrice(value: number) {
  return value >= 100 ? value.toFixed(2) : value.toFixed(4);
}

function formatIndicator(value: number | null) {
  if (value === null) return "-";
  return value >= 100 ? value.toFixed(2) : value.toFixed(4);
}

export function LegacyMetricCard({ label, value, tone = "neutral" }: { label: string; value: string | number; tone?: "neutral" | "good" | "warn" | "danger" }) {
  const toneClass = {
    neutral: "text-slate-100",
    good: "text-office-glow",
    warn: "text-office-warn",
    danger: "text-office-danger"
  }[tone];

  return (
    <div className="rounded-lg border border-office-line bg-office-card p-3">
      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className={`mt-1 break-words text-lg font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}
