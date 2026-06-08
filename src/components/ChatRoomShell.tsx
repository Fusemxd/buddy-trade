import type { TradeBuddyAgent } from "@/types/agent";

export default function ChatRoomShell({ agent, children, onClose }: { agent: TradeBuddyAgent; children: React.ReactNode; onClose?: () => void }) {
  return (
    <section className="flex max-h-[calc(100vh-7.5rem)] min-h-[calc(100vh-13rem)] min-w-0 flex-col overflow-hidden rounded-2xl border border-cyan-300/20 bg-slate-950/80 shadow-[0_0_70px_rgba(34,211,238,0.12)] lg:max-h-[calc(100vh-1.5rem)] lg:min-h-[520px]">
      <header className="shrink-0 border-b border-slate-700/80 bg-slate-950/95 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Active Tool</p>
            <h2 className="mt-1 truncate text-xl font-black text-white">{agent.name}</h2>
            <p className="mt-1 text-sm font-bold text-slate-300">{agent.role}</p>
          </div>
          {onClose ? (
            <button className="min-h-12 rounded-xl border border-slate-700 px-4 py-2 text-sm font-black text-slate-300" onClick={onClose} type="button">
              Back
            </button>
          ) : null}
        </div>
        <p className="mt-3 text-sm text-slate-400">{agent.description}</p>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Related tool: {agent.toolType}</p>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
    </section>
  );
}
