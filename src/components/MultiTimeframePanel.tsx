"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchMultiTimeframeConfirmation } from "@/lib/multiTimeframe";
import type { MultiTimeframeResult } from "@/types/timeframe";
import TimeframeStatusCard from "./TimeframeStatusCard";

export default function MultiTimeframePanel({ symbol }: { symbol: string }) {
  const [result, setResult] = useState<MultiTimeframeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [advanced, setAdvanced] = useState(false);

  const load = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError("");
    try {
      setResult(await fetchMultiTimeframeConfirmation(symbol, { forceRefresh }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "ดึงข้อมูลหลาย timeframe ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    void load(false);
  }, [load]);

  return (
    <section className="rounded-2xl bg-white/75 p-3 shadow-sm ring-1 ring-white">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Multi-Timeframe</p>
          <h3 className="text-lg font-black text-white">{symbol} confirmation</h3>
          <p className="mt-1 text-sm font-semibold text-slate-400">ใช้ 15m + 1h เพื่อดูน้ำหนัก ไม่ใช่คำสั่งซื้อขาย</p>
        </div>
        <button className="min-h-10 rounded-xl border border-cyan-300/[0.18] bg-cyan-300/[0.08] px-4 text-sm font-black text-cyan-100" onClick={() => load(true)} type="button">{loading ? "Loading..." : "Refresh"}</button>
      </div>
      {error ? <p className="mt-3 rounded-xl border border-red-300/[0.18] bg-red-300/[0.08] p-3 text-sm font-bold text-red-100">{error}</p> : null}
      {result ? (
        <div className="mt-4 grid gap-3">
          <div className="rounded-xl bg-cyan-300/[0.07] p-3 ring-1 ring-cyan-300/[0.14]">
            <p className="text-lg font-black text-white">{result.summaryText}</p>
            <p className="mt-1 text-sm font-bold text-cyan-50/80">Next step: {result.nextStep}</p>
          </div>
          <div className="grid gap-2">
            <TimeframeStatusCard status={result.primary} />
            <TimeframeStatusCard status={result.confirm} />
          </div>
          <button className="text-left text-sm font-black text-slate-300" onClick={() => setAdvanced((value) => !value)} type="button">
            {advanced ? "ซ่อนค่า indicator" : "ดูค่า indicator เพิ่มเติม"}
          </button>
          {advanced ? <pre className="overflow-auto rounded-xl bg-black/25 p-3 text-xs text-slate-300 ring-1 ring-white/[0.055]">{JSON.stringify(result.rawSignals.map(({ interval, ema20, ema50, rsi14, status }) => ({ interval, ema20, ema50, rsi14, status })), null, 2)}</pre> : null}
        </div>
      ) : null}
    </section>
  );
}
