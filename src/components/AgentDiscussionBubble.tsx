import type { AgentDiscussionMessage } from "@/types/agentDiscussion";

const toneClass = {
  neutral: "border-slate-600 bg-slate-900/80 text-slate-200",
  caution: "border-yellow-300/35 bg-yellow-300/10 text-yellow-100",
  warning: "border-orange-300/35 bg-orange-300/10 text-orange-100",
  positive: "border-emerald-300/35 bg-emerald-300/10 text-emerald-100",
  blocked: "border-red-300/40 bg-red-300/10 text-red-100"
};

export default function AgentDiscussionBubble({ message }: { message: AgentDiscussionMessage }) {
  return (
    <article className={`rounded-2xl border p-3 text-sm ${toneClass[message.tone]}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-black text-white">{message.agentName}</p>
        <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] font-bold uppercase">{message.tone}</span>
      </div>
      <p className="mt-1 text-xs font-semibold opacity-80">{message.role}</p>
      <p className="mt-2 leading-6">{message.text}</p>
    </article>
  );
}
