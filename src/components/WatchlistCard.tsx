import { calculateDirectionBias } from "@/lib/directionBias";
import type { DirectionBiasResult } from "@/types/directionBias";
import type { WatchlistSetup } from "@/types/setup";

const statusClass = {
  WATCH_LONG: "border-emerald-300/35 bg-emerald-300/10 text-emerald-100",
  NO_CHASE: "border-red-300/40 bg-red-300/10 text-red-100",
  WEAK: "border-yellow-300/35 bg-yellow-300/10 text-yellow-100",
  WAIT: "border-slate-600 bg-slate-900/80 text-slate-200"
};

const statusDescription = {
  WATCH_LONG: "แนวโน้มเริ่มดูดี แต่ยังต้องรอจุดเข้าและตั้ง Stop Loss ก่อน",
  NO_CHASE: "ราคาอาจร้อนเกินไป รอให้ย่อลงมาก่อนปลอดภัยกว่า",
  WEAK: "ฝั่งขึ้นยังไม่ชัด ควรรอก่อน ไม่ต้องรีบ",
  WAIT: "ข้อมูลยังไม่ชัดพอ รอ setup ที่ดีกว่านี้"
};

const biasTone: Record<DirectionBiasResult["bias"], string> = {
  LONG_BIAS: "border-emerald-300/30 bg-emerald-300/10 text-emerald-50",
  SHORT_BIAS: "border-sky-300/30 bg-sky-300/10 text-sky-50",
  WAIT: "border-slate-500/40 bg-slate-950/50 text-slate-100",
  BLOCKED: "border-red-300/35 bg-red-300/10 text-red-50"
};

export default function WatchlistCard({
  setup,
  onBuildPlan,
  onRefresh,
  onRemove,
  onFallback
}: {
  setup: WatchlistSetup;
  onBuildPlan?: (symbol: string) => void;
  onRefresh?: (symbol: string) => void;
  onRemove?: (symbol: string) => void;
  onFallback?: (symbol: string) => void;
}) {
  const bias = calculateDirectionBias({
    symbol: setup.symbol,
    timeframePrimary: setup.timeframe ?? "15m",
    timeframeConfirm: "1h",
    ema20Primary: setup.ema20,
    ema50Primary: setup.ema50,
    ema20Confirm: setup.ema20,
    ema50Confirm: setup.ema50,
    rsiPrimary: setup.rsi14,
    marketStatus: setup.marketStatus,
    stopLoss: 1,
    riskReward: setup.marketStatus === "NO_CHASE" ? 0 : 2
  });

  return (
    <article className={`rounded-3xl border p-4 ${statusClass[setup.marketStatus]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-xl font-black text-white">{setup.symbol}</h3>
          <p className="mt-1 text-sm font-bold">{setup.statusText}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs font-black">{setup.quality.label}</span>
          <span className="rounded-full border border-cyan-200/20 bg-cyan-200/10 px-2.5 py-1 text-[10px] font-black text-cyan-50">Binance</span>
        </div>
      </div>

      <MiniPriceChart values={setup.recentCloses ?? []} status={setup.marketStatus} />
      <BiasMiniCard bias={bias} />

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <Metric label="Price" value={format(setup.latestPrice)} />
        <Metric label="24h" value={formatPercent(setup.changePercent)} />
        <Metric label="RSI14" value={format(setup.rsi14)} />
        <Metric label="Timeframe" value={setup.timeframe ?? "15m"} />
        <Metric label="EMA20" value={format(setup.ema20)} />
        <Metric label="EMA50" value={format(setup.ema50)} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Setup Quality Score</p>
        <p className="mt-1 text-2xl font-black text-white">{setup.quality.score}</p>
        <p className="mt-1 text-sm text-slate-300">{setup.quality.reason}</p>
      </div>

      <p className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm font-bold text-slate-100">{statusDescription[setup.marketStatus]}</p>
      <p className="mt-3 text-sm font-bold text-slate-200">Next step: {setup.nextStep}</p>
      <p className="mt-2 text-xs font-semibold text-slate-400">{setup.cached ? "ข้อมูล cache ล่าสุดเมื่อ " : "อัปเดตเมื่อ "}{formatTime(setup.updatedAt)} เวลาไทย · auto refresh ทุก 60 วิ</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className="min-h-12 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 text-sm font-black text-cyan-100" onClick={() => onBuildPlan?.(setup.symbol)} type="button">
          Create Plan
        </button>
        <button className="min-h-12 rounded-2xl border border-slate-300/20 bg-slate-900/70 px-4 text-sm font-black text-slate-100" onClick={() => onRefresh?.(setup.symbol)} type="button">
          Refresh
        </button>
        <button className="min-h-12 rounded-2xl border border-yellow-300/30 bg-yellow-300/10 px-4 text-sm font-black text-yellow-100" onClick={() => onFallback?.(setup.symbol)} type="button">
          Manual
        </button>
        <button className="min-h-12 rounded-2xl border border-red-300/30 bg-red-300/10 px-4 text-sm font-black text-red-100" onClick={() => onRemove?.(setup.symbol)} type="button">
          Remove
        </button>
      </div>
    </article>
  );
}

function BiasMiniCard({ bias }: { bias: DirectionBiasResult }) {
  return (
    <div className={`mt-3 rounded-2xl border p-3 ${biasTone[bias.bias]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] opacity-70">ดูฝั่งที่น่าจับตา</p>
          <p className="mt-1 text-lg font-black text-white">{bias.biasText}</p>
        </div>
        <div className="grid grid-cols-2 gap-1 text-center text-xs font-black">
          <span className="rounded-xl border border-white/10 bg-black/20 px-2 py-1">L {bias.longScore}</span>
          <span className="rounded-xl border border-white/10 bg-black/20 px-2 py-1">S {bias.shortScore}</span>
        </div>
      </div>
      <p className="mt-2 text-xs font-semibold opacity-85">นี่คือ bias จากข้อมูลในการ์ด ไม่ใช่คำสั่งซื้อขาย</p>
    </div>
  );
}

function MiniPriceChart({ values, status }: { values: number[]; status: WatchlistSetup["marketStatus"] }) {
  const stroke = status === "WATCH_LONG" ? "#34d399" : status === "NO_CHASE" ? "#f87171" : status === "WEAK" ? "#facc15" : "#94a3b8";
  const points = buildPoints(values);

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/75 p-3">
      <div className="mb-2 flex items-center justify-between text-xs font-black text-slate-400">
        <span>Mini chart</span>
        <span>Public candles</span>
      </div>
      <svg aria-label="Mini price chart" className="h-24 w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
        <path d="M0 32 H100" stroke="rgba(148,163,184,0.18)" strokeWidth="0.7" />
        <path d="M0 20 H100" stroke="rgba(148,163,184,0.12)" strokeWidth="0.7" />
        <path d="M0 8 H100" stroke="rgba(148,163,184,0.18)" strokeWidth="0.7" />
        {points ? <polyline fill="none" points={points} stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" /> : null}
      </svg>
    </div>
  );
}

function buildPoints(values: number[]) {
  if (values.length < 2) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 36 - ((value - min) / range) * 32;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wide opacity-60">{label}</p>
      <p className="mt-1 break-words font-black text-white">{value}</p>
    </div>
  );
}

function format(value: number | null | undefined) {
  if (value === null || value === undefined) return "-";
  return value >= 100 ? value.toFixed(2) : value.toFixed(4);
}

function formatPercent(value: number | undefined) {
  if (value === undefined) return "-";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function formatTime(value: string | undefined) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Bangkok"
  }).format(date);
}
