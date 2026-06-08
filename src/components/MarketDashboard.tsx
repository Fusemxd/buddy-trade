"use client";

import { useCallback, useEffect, useState } from "react";
import { loadWatchlist } from "@/lib/watchlistStorage";
import type { MarketSignal } from "@/types/market";
import DataSourceBadge from "./DataSourceBadge";
import MarketCard from "./MarketCard";

export default function MarketDashboard({ onMarketChange }: { onMarketChange?: (market: MarketSignal | null) => void }) {
  const [markets, setMarkets] = useState<MarketSignal[]>([]);
  const [symbols, setSymbols] = useState<string[]>(["BTCUSDT", "ETHUSDT", "SOLUSDT"]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadMarkets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const nextSymbols = loadWatchlist().map((item) => item.symbol);
      setSymbols(nextSymbols);
      const results = await Promise.all(
        nextSymbols.map(async (symbol) => {
          const response = await fetch(`/api/market?symbol=${symbol}&interval=15m`);
          const data = await response.json();
          if (!response.ok) throw new Error(data.error ?? `Market request failed for ${symbol}.`);
          return data as MarketSignal;
        })
      );
      setMarkets(results);
      onMarketChange?.(results[0] ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Market request failed.");
      setMarkets([]);
      onMarketChange?.(null);
    } finally {
      setLoading(false);
    }
  }, [onMarketChange]);

  useEffect(() => {
    void loadMarkets();
  }, [loadMarkets]);

  return (
    <section className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-4 shadow-[0_0_45px_rgba(34,211,238,0.08)] backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Market Dashboard</p>
          <h2 className="mt-1 text-xl font-black text-white">15m Public Market Scan</h2>
          <p className="mt-1 text-sm text-slate-400">ใช้ custom crypto watchlist จาก Binance Public API เท่านั้น</p>
        </div>
        <button className="min-h-12 rounded-2xl bg-cyan-300 px-4 text-sm font-black text-slate-950 disabled:opacity-60" disabled={loading} onClick={loadMarkets} type="button">
          {loading ? "Scanning..." : "Refresh scan"}
        </button>
      </div>

      <div className="mt-4">
        <DataSourceBadge />
      </div>

      {error ? <p className="mt-4 rounded-lg border border-red-400/40 bg-red-400/10 p-3 text-sm font-semibold text-red-100">{error} กรุณาลอง Refresh scan อีกครั้ง</p> : null}

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {loading && markets.length === 0
          ? symbols.map((symbol) => (
              <div className="min-h-48 animate-pulse rounded-xl border border-slate-700 bg-slate-900/70 p-4" key={symbol}>
                <div className="h-4 w-24 rounded bg-slate-700" />
                <div className="mt-4 h-8 w-36 rounded bg-slate-700" />
                <div className="mt-6 grid grid-cols-3 gap-2">
                  <div className="h-14 rounded bg-slate-800" />
                  <div className="h-14 rounded bg-slate-800" />
                  <div className="h-14 rounded bg-slate-800" />
                </div>
              </div>
            ))
          : markets.map((market) => <MarketCard market={market} key={market.symbol} />)}
      </div>

      <p className="mt-4 text-xs font-semibold text-slate-500">สถานะทั้งหมดเป็น rule-based เพื่อช่วยคุมความเสี่ยง ไม่ใช่คำสั่งซื้อขายหรือการรับประกันผลลัพธ์</p>
    </section>
  );
}
