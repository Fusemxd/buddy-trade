"use client";

import { useState } from "react";
import { normalizeCryptoSymbol, validateCryptoSymbol } from "@/lib/watchlistStorage";
import type { WatchlistItem } from "@/types/watchlist";

export default function WatchlistItemCard({ item, onUpdate, onRemove }: { item: WatchlistItem; onUpdate: (item: WatchlistItem) => void; onRemove: (id: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [symbol, setSymbol] = useState(item.symbol);
  const [error, setError] = useState("");

  function save() {
    const validation = validateCryptoSymbol(symbol);
    if (!validation.ok) {
      setError(validation.message);
      return;
    }
    onUpdate({ ...item, symbol: normalizeCryptoSymbol(symbol), updatedAt: new Date().toISOString() });
    setEditing(false);
    setError("");
  }

  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-950/70 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          {editing ? <input className="min-h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 font-black text-white" value={symbol} onChange={(event) => setSymbol(event.target.value)} /> : <p className="truncate text-lg font-black text-white">{item.symbol}</p>}
          <p className="text-xs font-semibold text-slate-400">Binance Public API</p>
        </div>
        <button className={`min-h-10 rounded-xl px-3 text-sm font-black ${item.favorite ? "bg-yellow-300 text-slate-950" : "bg-slate-800 text-slate-200"}`} onClick={() => onUpdate({ ...item, favorite: !item.favorite, updatedAt: new Date().toISOString() })} type="button">
          ★
        </button>
      </div>
      {error ? <p className="mt-2 text-xs font-bold text-yellow-100">{error}</p> : null}
      <div className="mt-3 grid grid-cols-2 gap-2">
        {editing ? (
          <button className="min-h-10 rounded-xl bg-cyan-300 font-black text-slate-950" onClick={save} type="button">Save</button>
        ) : (
          <button className="min-h-10 rounded-xl border border-cyan-300/30 bg-cyan-300/10 font-black text-cyan-100" onClick={() => setEditing(true)} type="button">Edit</button>
        )}
        <button className="min-h-10 rounded-xl border border-red-300/30 bg-red-300/10 font-black text-red-100" onClick={() => onRemove(item.id)} type="button">Remove</button>
      </div>
    </article>
  );
}
