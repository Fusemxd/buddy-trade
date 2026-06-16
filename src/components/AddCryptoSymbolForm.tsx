"use client";

import { FormEvent, useState } from "react";
import { fetchBinanceQuote } from "@/lib/binance";
import { createWatchlistItem, validateCryptoSymbol } from "@/lib/watchlistStorage";
import type { WatchlistItem } from "@/types/watchlist";

export default function AddCryptoSymbolForm({ existingSymbols, onAdd }: { existingSymbols: string[]; onAdd: (item: WatchlistItem) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const validation = validateCryptoSymbol(value);
    if (!validation.ok) {
      setError(validation.message);
      return;
    }
    if (existingSymbols.includes(validation.symbol)) {
      setError("Symbol นี้อยู่ใน Watchlist แล้ว");
      return;
    }
    setLoading(true);
    try {
      await fetchBinanceQuote(validation.symbol);
      onAdd(createWatchlistItem(validation.symbol));
      setValue("");
    } catch {
      setError("ไม่พบ Symbol นี้บน Binance Public API กรุณาตรวจสอบชื่ออีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="rounded-2xl bg-white/[0.035] p-4 ring-1 ring-white/[0.055]" onSubmit={submit}>
      <label className="text-sm font-black text-slate-100">
        เพิ่มเหรียญที่ต้องการเฝ้าดู
        <input
          className="mt-2 min-h-12 w-full rounded-xl border border-white/[0.07] bg-black/30 px-3 text-base font-bold text-white outline-none focus:border-trade-green/45"
          placeholder="เช่น BTCUSDT, ETH/USDT, SUIUSDT"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </label>
      <p className="mt-2 text-xs font-semibold text-slate-400">ตอนนี้รองรับ Crypto คู่ USDT จาก Binance ก่อน</p>
      {error ? <p className="mt-3 rounded-xl border border-yellow-300/20 bg-yellow-300/[0.08] p-3 text-sm font-bold text-yellow-100">{error}</p> : null}
      <button className="trade-button mt-3 min-h-12 w-full rounded-xl px-4 font-black disabled:opacity-60" disabled={loading} type="submit">
        {loading ? "กำลังตรวจสอบ Binance..." : "เพิ่มเข้า Watchlist"}
      </button>
    </form>
  );
}
