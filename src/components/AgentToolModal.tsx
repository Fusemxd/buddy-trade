"use client";

import type { AgentDeskItem } from "@/types/agent";

export default function AgentToolModal({ item, onClose }: { item: AgentDeskItem | null; onClose: () => void }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60 p-4 sm:items-center sm:justify-center">
      <div className="w-full max-w-md rounded-lg border border-office-line bg-office-panel p-4 shadow-neon">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-office-glow">Agent tool</p>
            <h3 className="mt-1 text-xl font-black text-white">{item.title}</h3>
          </div>
          <button className="rounded-md border border-office-line px-3 py-1 text-sm text-slate-300" onClick={onClose}>Close</button>
        </div>
        <p className="mt-3 text-sm text-slate-300">{item.subtitle}</p>
        <p className="mt-2 rounded-md bg-office-bg p-3 text-sm text-slate-400">Status: {item.status}. This office is rule-based and uses public or local data only.</p>
      </div>
    </div>
  );
}
