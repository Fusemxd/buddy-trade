import type { AgentToolType, TradeBuddyAgent } from "@/types/agent";

const accentClasses = {
  green: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200 shadow-[0_0_24px_rgba(52,211,153,0.12)]",
  yellow: "border-yellow-300/40 bg-yellow-300/10 text-yellow-100 shadow-[0_0_24px_rgba(250,204,21,0.1)]",
  blue: "border-blue-400/40 bg-blue-400/10 text-blue-100 shadow-[0_0_24px_rgba(96,165,250,0.1)]",
  purple: "border-purple-400/40 bg-purple-400/10 text-purple-100 shadow-[0_0_24px_rgba(192,132,252,0.1)]",
  cyan: "border-cyan-300/40 bg-cyan-300/10 text-cyan-100 shadow-[0_0_24px_rgba(103,232,249,0.12)]"
};

const activeClasses = {
  green: "ring-2 ring-emerald-300/70",
  yellow: "ring-2 ring-yellow-300/70",
  blue: "ring-2 ring-blue-300/70",
  purple: "ring-2 ring-purple-300/70",
  cyan: "ring-2 ring-cyan-300/70"
};

const lightClasses = {
  green: "bg-emerald-300",
  yellow: "bg-yellow-300",
  blue: "bg-blue-300",
  purple: "bg-purple-300",
  cyan: "bg-cyan-300"
};

const statusLabels = {
  ready: "Ready",
  warning: "Watch",
  blocked: "Blocked"
};

export default function AgentStatusCard({ agent, activeTool, onSelect }: { agent: TradeBuddyAgent; activeTool?: AgentToolType; onSelect?: (agent: TradeBuddyAgent) => void }) {
  const active = activeTool === agent.toolType;

  return (
    <button className={`min-w-56 rounded-lg border p-3 text-left transition hover:scale-[1.01] ${accentClasses[agent.accent]} ${active ? activeClasses[agent.accent] : ""}`} onClick={() => onSelect?.(agent)} type="button">
      <div className="flex items-start gap-3">
        <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-md border border-white/15 bg-slate-950/70">
          <div className={`h-3 w-3 rounded-sm ${lightClasses[agent.accent]}`} />
          <span className={`absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full ${lightClasses[agent.accent]} shadow-[0_0_12px_currentColor]`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-black text-white">{agent.name}</h3>
            <span className="rounded-full border border-white/15 bg-black/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">{statusLabels[agent.status]}</span>
          </div>
          <p className="mt-1 truncate text-xs font-semibold opacity-90">{agent.role}</p>
          <p className="mt-2 truncate text-xs text-slate-300">{agent.statusText}</p>
        </div>
      </div>
    </button>
  );
}
