"use client";

import { useMemo, useState } from "react";
import { calculateDirectionBias } from "@/lib/directionBias";
import type { DirectionBiasInput, DirectionBiasResult } from "@/types/directionBias";

const biasTone: Record<DirectionBiasResult["bias"], string> = {
  LONG_BIAS: "border-emerald-300/35 bg-emerald-300/10 text-emerald-50",
  SHORT_BIAS: "border-sky-300/35 bg-sky-300/10 text-sky-50",
  WAIT: "border-slate-600 bg-slate-900/80 text-slate-100",
  BLOCKED: "border-red-300/40 bg-red-300/10 text-red-50"
};

export default function DirectionBiasCard({ initialInput }: { initialInput?: Partial<DirectionBiasInput> }) {
  const [input, setInput] = useState<DirectionBiasInput>({
    symbol: initialInput?.symbol ?? "BTCUSDT",
    timeframePrimary: initialInput?.timeframePrimary ?? "15m",
    timeframeConfirm: initialInput?.timeframeConfirm ?? "1h",
    ema20Primary: initialInput?.ema20Primary ?? 0,
    ema50Primary: initialInput?.ema50Primary ?? 0,
    ema20Confirm: initialInput?.ema20Confirm ?? 0,
    ema50Confirm: initialInput?.ema50Confirm ?? 0,
    rsiPrimary: initialInput?.rsiPrimary ?? 50,
    entry: initialInput?.entry ?? 0,
    stopLoss: initialInput?.stopLoss ?? 0,
    takeProfit: initialInput?.takeProfit ?? 0,
    riskReward: initialInput?.riskReward ?? 0,
    todayPnl: initialInput?.todayPnl ?? 0,
    losingStreak: initialInput?.losingStreak ?? 0
  });

  const result = useMemo(() => calculateDirectionBias(input), [input]);

  function setField(field: keyof DirectionBiasInput, value: string) {
    setInput((current) => ({
      ...current,
      [field]: field === "symbol" ? value.toUpperCase() : Number(value)
    }));
  }

  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-950/65 p-4 shadow-[0_0_45px_rgba(34,211,238,0.06)]">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Direction Bias Helper</p>
        <h2 className="mt-1 text-xl font-black text-white">ดูฝั่งที่น่าจับตา</h2>
        <p className="mt-1 text-sm font-semibold text-slate-400">นี่คือการประเมินฝั่งที่น่าจับตา ไม่ใช่คำสั่งซื้อขาย</p>
      </div>

      <div className={`mt-4 rounded-3xl border p-4 ${biasTone[result.bias]}`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] opacity-75">{result.symbol}</p>
            <h3 className="mt-1 text-2xl font-black text-white">{result.biasText}</h3>
            <p className="mt-2 text-sm font-bold">{result.reason}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <Score label="Long" value={result.longScore} />
            <Score label="Short" value={result.shortScore} />
          </div>
        </div>
        <p className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm font-black text-white">Next step: {result.nextStep}</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Symbol" value={input.symbol} onChange={(value) => setField("symbol", value)} type="text" />
        <Field label="RSI Primary" value={input.rsiPrimary ?? 0} onChange={(value) => setField("rsiPrimary", value)} />
        <Field label="15m EMA20" value={input.ema20Primary ?? 0} onChange={(value) => setField("ema20Primary", value)} />
        <Field label="15m EMA50" value={input.ema50Primary ?? 0} onChange={(value) => setField("ema50Primary", value)} />
        <Field label="1h EMA20" value={input.ema20Confirm ?? 0} onChange={(value) => setField("ema20Confirm", value)} />
        <Field label="1h EMA50" value={input.ema50Confirm ?? 0} onChange={(value) => setField("ema50Confirm", value)} />
        <Field label="Entry" value={input.entry ?? 0} onChange={(value) => setField("entry", value)} />
        <Field label="Stop Loss" value={input.stopLoss ?? 0} onChange={(value) => setField("stopLoss", value)} />
        <Field label="Take Profit" value={input.takeProfit ?? 0} onChange={(value) => setField("takeProfit", value)} />
        <Field label="Risk/Reward" value={input.riskReward ?? 0} onChange={(value) => setField("riskReward", value)} />
        <Field label="Today P/L" value={input.todayPnl ?? 0} onChange={(value) => setField("todayPnl", value)} />
        <Field label="Losing Streak" value={input.losingStreak ?? 0} onChange={(value) => setField("losingStreak", value)} />
      </div>

      {result.details.length ? (
        <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-900/70 p-3">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">เหตุผลที่ใช้ประเมิน</p>
          <ul className="mt-2 grid gap-1 text-sm font-semibold text-slate-300">
            {result.details.map((detail) => <li key={detail}>- {detail}</li>)}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-20 rounded-2xl border border-white/10 bg-black/20 p-3">
      <p className="text-[10px] font-black uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function Field({ label, value, onChange, type = "number" }: { label: string; value: string | number; onChange: (value: string) => void; type?: "number" | "text" }) {
  return (
    <label className="text-sm font-black text-slate-200">
      {label}
      <input className="mt-2 min-h-12 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 text-white outline-none focus:border-cyan-300" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
