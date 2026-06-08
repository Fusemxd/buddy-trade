"use client";

import { useEffect, useState } from "react";
import { loadWatchlist, saveWatchlist, sortWatchlist, upsertWatchlistItem } from "@/lib/watchlistStorage";
import type { WatchlistItem } from "@/types/watchlist";
import AddCryptoSymbolForm from "./AddCryptoSymbolForm";
import DataSourceBadge from "./DataSourceBadge";
import WatchlistItemCard from "./WatchlistItemCard";

export default function WatchlistManager({ onChange }: { onChange?: (items: WatchlistItem[]) => void }) {
  const [items, setItems] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    const loaded = sortWatchlist(loadWatchlist());
    setItems(loaded);
    onChange?.(loaded);
  }, [onChange]);

  function commit(nextItems: WatchlistItem[]) {
    const sorted = sortWatchlist(nextItems);
    setItems(sorted);
    saveWatchlist(sorted);
    onChange?.(sorted);
  }

  return (
    <section className="grid gap-3">
      <DataSourceBadge />
      <AddCryptoSymbolForm existingSymbols={items.map((item) => item.symbol)} onAdd={(item) => commit(upsertWatchlistItem(items, item))} />
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <WatchlistItemCard key={item.id} item={item} onUpdate={(next) => commit(upsertWatchlistItem(items, next))} onRemove={(id) => commit(items.filter((current) => current.id !== id))} />
        ))}
      </div>
    </section>
  );
}
