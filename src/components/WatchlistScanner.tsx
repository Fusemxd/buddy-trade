"use client";

import { useCallback, useEffect, useState } from "react";
import { evaluateAlertRule } from "@/lib/alertRules";
import { loadAlertEvents, loadAlertRules, saveAlertEvents } from "@/lib/alertStorage";
import { analyzeKlines } from "@/lib/indicators";
import { fetchMarketData } from "@/lib/marketDataProviders";
import { buildWatchlistSetup } from "@/lib/setupScanner";
import { loadWatchlist, saveWatchlist } from "@/lib/watchlistStorage";
import type { Kline, MarketSignal } from "@/types/market";
import type { WatchlistSetup } from "@/types/setup";
import type { WatchlistItem } from "@/types/watchlist";
import MultiTimeframePanel from "./MultiTimeframePanel";
import WatchlistCard from "./WatchlistCard";
import WatchlistManager from "./WatchlistManager";

const DEFAULT_TIMEFRAME = "15m";
const AUTO_REFRESH_MS = 60_000;
const DATA_ERROR = "ดึงข้อมูลจาก Binance ไม่ได้ชั่วคราว สามารถกรอกราคาเองเพื่อคำนวณ Risk ได้";

export default function WatchlistScanner({ onBuildPlan }: { onBuildPlan?: (symbol: string) => void }) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [items, setItems] = useState<WatchlistSetup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState(DEFAULT_TIMEFRAME);
  const [failedSymbol, setFailedSymbol] = useState("");

  const scan = useCallback(
    async (forceRefresh = false, symbols?: string[]) => {
      const sourceItems = loadWatchlist();
      const scanSymbols = symbols ?? sourceItems.map((item) => item.symbol);
      setWatchlist(sourceItems);
      setLoading(true);
      setError("");
      setFailedSymbol("");
      try {
        const markets = await Promise.all(scanSymbols.map((symbol) => loadMarketSignal(symbol, timeframe, forceRefresh)));
        const validMarkets = markets.filter((market): market is MarketSignal => Boolean(market));
        setItems(validMarkets.map(buildWatchlistSetup));
        evaluateScannerAlerts(validMarkets);
        if (validMarkets.length !== scanSymbols.length) {
          setError(DATA_ERROR);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : DATA_ERROR);
      } finally {
        setLoading(false);
      }
    },
    [timeframe]
  );

  const handleWatchlistChange = useCallback((nextItems: WatchlistItem[]) => {
    setWatchlist(nextItems);
  }, []);

  useEffect(() => {
    const loaded = loadWatchlist();
    setWatchlist(loaded);
    void scan(false, loaded.map((item) => item.symbol));
  }, [scan]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void scan(true);
    }, AUTO_REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [scan]);

  function removeSymbol(symbol: string) {
    const next = watchlist.filter((item) => item.symbol !== symbol);
    saveWatchlist(next);
    setWatchlist(next);
    setItems((current) => current.filter((item) => item.symbol !== symbol));
  }

  return (
    <section className="trade-panel rounded-[2rem] p-4 sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">Custom Crypto Watchlist</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Semi-Auto Setup Scan</h2>
          <p className="mt-1 max-w-3xl text-sm font-semibold text-slate-600">เพิ่มเหรียญที่ต้องการเฝ้าดู เช่น BTCUSDT, ETHUSDT, SOLUSDT ข้อมูลนี้ใช้เพื่อช่วยวางแผน ไม่ใช่คำสั่งซื้อขาย</p>
          <p className="mt-2 text-xs font-bold text-teal-700/80">รีเฟรชอัตโนมัติทุก 60 วินาที และกด Refresh เพื่อดึงข้อมูลใหม่ทันทีได้</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select className="min-h-12 rounded-2xl border border-slate-200 bg-white/80 px-3 text-sm font-black text-slate-950 outline-none focus:border-teal-300" value={timeframe} onChange={(event) => setTimeframe(event.target.value)}>
            <option value="5m">5m</option>
            <option value="15m">15m</option>
            <option value="1h">1h</option>
            <option value="4h">4h</option>
            <option value="1d">1d</option>
          </select>
          <button className="trade-button min-h-12 rounded-2xl px-4 text-sm font-black disabled:opacity-60" disabled={loading} onClick={() => scan(true)} type="button">
            {loading ? "Scanning..." : "รีเฟรชข้อมูล"}
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[0.86fr_1.44fr]">
        <div className="grid content-start gap-3">
          <WatchlistManager onChange={handleWatchlistChange} />
        </div>
        <div className="min-w-0">
          {error ? <p className="mb-4 rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-700 ring-1 ring-rose-200">{error}</p> : null}
          {failedSymbol ? <ManualFallback symbol={failedSymbol} onBuildPlan={onBuildPlan} /> : null}
          {items[0] ? <div className="mb-4"><MultiTimeframePanel symbol={items[0].symbol} /></div> : null}
          <div className="grid gap-3 xl:grid-cols-2">
            {loading && !items.length
              ? watchlist.map((item) => <div className="min-h-72 animate-pulse rounded-3xl bg-white/70 shadow-sm ring-1 ring-white" key={item.id} />)
              : items.map((item) => (
                  <WatchlistCard
                    key={item.symbol}
                    setup={item}
                    onBuildPlan={onBuildPlan}
                    onRefresh={(symbol) => scan(true, [symbol])}
                    onRemove={(symbol) => removeSymbol(symbol)}
                    onFallback={(symbol) => setFailedSymbol(symbol)}
                  />
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function evaluateScannerAlerts(markets: MarketSignal[]) {
  const rules = loadAlertRules();
  if (!rules.length) return;
  const existingEvents = loadAlertEvents();
  const nextEvents = rules.flatMap((rule) => {
    const market = markets.find((item) => item.symbol === rule.symbol);
    const event = evaluateAlertRule(rule, market);
    return event ? [event] : [];
  });
  if (!nextEvents.length) return;
  saveAlertEvents([...nextEvents, ...existingEvents].slice(0, 100));
  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    for (const event of nextEvents.slice(0, 2)) {
      new Notification("Trade Buddy Alert", { body: event.message });
    }
  }
}

async function loadMarketSignal(symbol: string, timeframe: string, forceRefresh: boolean): Promise<MarketSignal | null> {
  const result = await fetchMarketData(symbol, timeframe, { forceRefresh });
  if (result.error || !result.candles?.length) return null;
  const candles: Kline[] = result.candles.map((candle) => ({
    openTime: Number(candle.time),
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
    volume: candle.volume ?? 0,
    closeTime: Number(candle.time)
  }));
  const signal = analyzeKlines(symbol, timeframe, candles);
  return {
    ...signal,
    provider: "binance",
    changePercent: result.quote?.changePercent,
    cached: result.stale,
    updatedAt: result.quote?.timestamp ?? new Date().toISOString(),
    recentCloses: candles.slice(-48).map((candle) => candle.close),
    recentCandles: candles.slice(-48).map((candle) => ({
      time: candle.openTime,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume
    }))
  };
}

function ManualFallback({ symbol, onBuildPlan }: { symbol: string; onBuildPlan?: (symbol: string) => void }) {
  return (
    <div className="mb-4 rounded-3xl bg-amber-50 p-4 text-amber-800 ring-1 ring-amber-200">
      <h3 className="text-lg font-black">Manual fallback: {symbol}</h3>
      <p className="mt-1 text-sm font-semibold">ถ้าดึงข้อมูลไม่ได้ ให้กรอกราคาเองเพื่อเช็ก Risk ต่อได้</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {["Current price", "Entry", "Stop Loss", "Take Profit"].map((label) => (
          <label className="text-xs font-black" key={label}>
            {label}
            <input className="mt-1 min-h-11 w-full rounded-xl border border-amber-200 bg-white/80 px-3 text-slate-950" type="number" />
          </label>
        ))}
        <label className="text-xs font-black sm:col-span-2">
          Notes
          <textarea className="mt-1 min-h-20 w-full rounded-xl border border-amber-200 bg-white/80 px-3 py-2 text-slate-950" />
        </label>
      </div>
      <button className="mt-3 min-h-11 rounded-xl bg-amber-300 px-4 font-black text-slate-950" onClick={() => onBuildPlan?.(symbol)} type="button">
        ส่งไปสร้างแผน
      </button>
    </div>
  );
}
