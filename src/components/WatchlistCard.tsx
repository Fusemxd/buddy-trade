import { calculateDirectionBias } from "@/lib/directionBias";
import type { DirectionBiasResult } from "@/types/directionBias";
import type { MarketCandle } from "@/types/marketData";
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

      <TradingChart candles={setup.recentCandles ?? []} fallbackCloses={setup.recentCloses ?? []} status={setup.marketStatus} timeframe={setup.timeframe ?? "15m"} />
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

function TradingChart({ candles, fallbackCloses, status, timeframe }: { candles: MarketCandle[]; fallbackCloses: number[]; status: WatchlistSetup["marketStatus"]; timeframe: string }) {
  const visible = candles.slice(-36);
  const closes = visible.length ? visible.map((candle) => candle.close) : fallbackCloses.slice(-36);
  const high = visible.length ? Math.max(...visible.map((candle) => candle.high)) : Math.max(...closes);
  const low = visible.length ? Math.min(...visible.map((candle) => candle.low)) : Math.min(...closes);
  const range = high - low || 1;
  const ema20 = buildEma(closes, 20);
  const ema50 = buildEma(closes, 50);

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/85">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-xs font-black text-slate-300">
        <span>Chart · {timeframe}</span>
        <span className="text-slate-500">Public Binance candles</span>
      </div>
      <div className="relative p-3">
        <div className="absolute right-3 top-3 z-10 rounded-lg border border-white/10 bg-slate-950/80 px-2 py-1 text-[10px] font-black text-slate-300">
          H {format(high)} / L {format(low)}
        </div>
        <svg aria-label="Trading candlestick chart" className="h-44 w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 56">
          <defs>
            <linearGradient id={`chartGlow-${status}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(34,211,238,0.16)" />
              <stop offset="100%" stopColor="rgba(15,23,42,0)" />
            </linearGradient>
          </defs>
          <rect fill={`url(#chartGlow-${status})`} height="56" width="100" x="0" y="0" />
          {[10, 22, 34, 46].map((y) => <path d={`M0 ${y} H100`} key={y} stroke="rgba(148,163,184,0.13)" strokeWidth="0.45" />)}
          {[20, 40, 60, 80].map((x) => <path d={`M${x} 0 V56`} key={x} stroke="rgba(148,163,184,0.08)" strokeWidth="0.45" />)}
          {visible.length ? visible.map((candle, index) => <Candle candle={candle} high={high} key={`${candle.time}-${index}`} low={low} range={range} total={visible.length} index={index} />) : <FallbackLine closes={closes} high={high} low={low} range={range} />}
          <IndicatorLine color="#facc15" high={high} low={low} range={range} values={ema20} />
          <IndicatorLine color="#60a5fa" high={high} low={low} range={range} values={ema50} />
        </svg>
        <div className="mt-2 flex items-center gap-3 text-[10px] font-bold text-slate-400">
          <span className="inline-flex items-center gap-1"><i className="h-2 w-4 rounded-full bg-emerald-300" /> Up</span>
          <span className="inline-flex items-center gap-1"><i className="h-2 w-4 rounded-full bg-red-300" /> Down</span>
          <span className="inline-flex items-center gap-1"><i className="h-0.5 w-4 bg-yellow-300" /> EMA20</span>
          <span className="inline-flex items-center gap-1"><i className="h-0.5 w-4 bg-blue-300" /> EMA50</span>
        </div>
      </div>
    </div>
  );
}

function Candle({ candle, high, low, range, index, total }: { candle: MarketCandle; high: number; low: number; range: number; index: number; total: number }) {
  const slot = 100 / total;
  const x = index * slot + slot / 2;
  const width = Math.max(0.8, Math.min(1.9, slot * 0.48));
  const up = candle.close >= candle.open;
  const color = up ? "#34d399" : "#f87171";
  const wickTop = yFor(candle.high, high, low, range);
  const wickBottom = yFor(candle.low, high, low, range);
  const openY = yFor(candle.open, high, low, range);
  const closeY = yFor(candle.close, high, low, range);
  const bodyY = Math.min(openY, closeY);
  const bodyHeight = Math.max(0.75, Math.abs(openY - closeY));

  return (
    <g>
      <line stroke={color} strokeLinecap="round" strokeWidth="0.45" x1={x} x2={x} y1={wickTop} y2={wickBottom} />
      <rect fill={color} height={bodyHeight} rx="0.35" width={width} x={x - width / 2} y={bodyY} />
    </g>
  );
}

function FallbackLine({ closes, high, low, range }: { closes: number[]; high: number; low: number; range: number }) {
  if (closes.length < 2) return null;
  const points = closes.map((value, index) => `${(index / (closes.length - 1)) * 100},${yFor(value, high, low, range)}`).join(" ");
  return <polyline fill="none" points={points} stroke="#67e8f9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />;
}

function IndicatorLine({ values, color, high, low, range }: { values: Array<number | null>; color: string; high: number; low: number; range: number }) {
  const points = values
    .map((value, index) => value === null ? null : `${(index / Math.max(1, values.length - 1)) * 100},${yFor(value, high, low, range)}`)
    .filter(Boolean)
    .join(" ");
  if (!points) return null;
  return <polyline fill="none" points={points} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="0.9" />;
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wide opacity-60">{label}</p>
      <p className="mt-1 break-words font-black text-white">{value}</p>
    </div>
  );
}

function buildEma(values: number[], period: number) {
  if (!values.length) return [];
  const multiplier = 2 / (period + 1);
  let previous = values[0];
  return values.map((value, index) => {
    previous = index === 0 ? value : (value - previous) * multiplier + previous;
    return previous;
  });
}

function yFor(value: number, high: number, low: number, range: number) {
  return 52 - ((value - low) / range) * 48;
}

function format(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
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
