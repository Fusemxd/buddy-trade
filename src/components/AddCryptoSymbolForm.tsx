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
    <form className="rounded-3xl border border-slate-700 bg-slate-900/70 p-4" onSubmit={submit}>
      <label className="text-sm font-black text-slate-100">
        เพิ่มเหรียญที่ต้องการเฝ้าดู
        <input className="mt-2 min-h-12 w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 text-base font-bold text-white outline-none focus:border-cyan-300" placeholder="เช่น BTCUSDT, ETH/USDT, SUIUSDT" value={value} onChange={(event) => setValue(event.target.value)} />
      </label>
      <p className="mt-2 text-xs font-semibold text-slate-400">ตอนนี้ระบบรองรับ Crypto คู่ USDT จาก Binance ก่อน</p>
      {error ? <p className="mt-3 rounded-2xl border border-yellow-300/35 bg-yellow-300/10 p-3 text-sm font-bold text-yellow-100">{error}</p> : null}
      <button className="mt-3 min-h-12 w-full rounded-2xl bg-cyan-300 px-4 font-black text-slate-950 disabled:opacity-60" disabled={loading} type="submit">
        {loading ? "กำลังตรวจสอบ Binance..." : "เพิ่มเข้า Watchlist"}
      </button>
    </form>
  );
}
