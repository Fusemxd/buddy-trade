import { tradeBuddyAgents } from "@/lib/agentWorkspace";
import type { AgentToolType, TradeBuddyAgent } from "@/types/agent";
import AgentStatusCard from "./AgentStatusCard";

export default function AgentStatusBar({ activeTool, onSelectAgent }: { activeTool?: AgentToolType; onSelectAgent?: (agent: TradeBuddyAgent) => void }) {
  return (
    <section className="rounded-xl border border-slate-700/70 bg-slate-950/55 p-3 shadow-[0_0_40px_rgba(56,189,248,0.08)] backdrop-blur">
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-300">Agent Status</h2>
        <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-200">Rule-based standby</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-5 md:overflow-visible">
        {tradeBuddyAgents.map((agent) => (
          <AgentStatusCard activeTool={activeTool} agent={agent} key={agent.id} onSelect={onSelectAgent} />
        ))}
      </div>
    </section>
  );
}
