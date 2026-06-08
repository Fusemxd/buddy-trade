"use client";

import { useState } from "react";
import { agentDeskItems } from "@/lib/agentWorkspace";
import type { AgentDeskItem } from "@/types/agent";
import AgentToolModal from "./AgentToolModal";

export default function AgentDesk() {
  const [selected, setSelected] = useState<AgentDeskItem | null>(null);

  return (
    <section className="rounded-lg border border-office-line bg-office-panel p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-white">Agent Desk</h2>
        <span className="rounded-full border border-office-glow/40 px-3 py-1 text-xs font-bold text-office-glow">No auto trading</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {agentDeskItems.map((item) => (
          <button className="rounded-lg border border-office-line bg-office-card p-3 text-left transition hover:border-office-cyan" key={item.id} onClick={() => setSelected(item)}>
            <p className="font-bold text-white">{item.title}</p>
            <p className="mt-1 text-sm text-slate-400">{item.subtitle}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.12em] text-office-cyan">{item.status}</p>
          </button>
        ))}
      </div>
      <AgentToolModal item={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
