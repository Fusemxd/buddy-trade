import type { ChatActionCard, ChatMessage } from "@/types/chat";
import AgentDiscussionThread from "./AgentDiscussionThread";
import ChatChecklistCard from "./ChatChecklistCard";
import ChatJournalCard from "./ChatJournalCard";
import ChatRiskCard from "./ChatRiskCard";

export default function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[92%] rounded-2xl border p-3 text-sm shadow-sm sm:max-w-[78%] ${isUser ? "border-cyan-300/30 bg-cyan-300/10 text-slate-100" : "border-slate-700 bg-slate-900/85 text-slate-200"}`}>
        {message.attachments?.length ? (
          <div className="mb-3 grid gap-2">
            {message.attachments.map((attachment) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="max-h-72 rounded-xl border border-slate-700 object-contain" src={attachment.dataUrl} alt={attachment.name} key={attachment.id} />
            ))}
          </div>
        ) : null}
        <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
        {message.discussion ? (
          <div className="mt-3">
            <AgentDiscussionThread discussion={message.discussion} />
          </div>
        ) : null}
        {message.actionCards?.length ? (
          <div className="mt-3 grid gap-2">
            {message.actionCards.map((card, index) => (
              <ActionCard card={card} key={`${card.type}-${index}`} />
            ))}
          </div>
        ) : null}
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{formatIsoTime(message.createdAt)}</p>
      </div>
    </div>
  );
}

function formatIsoTime(value: string) {
  const match = value.match(/T(\d{2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : "--:--";
}

function ActionCard({ card }: { card: ChatActionCard }) {
  if (card.type === "risk_calculator") return <ChatRiskCard compact />;
  if (card.type === "checklist") return <ChatChecklistCard />;
  if (card.type === "journal_save") return <ChatJournalCard />;
  if (card.type === "agent_discussion") {
    return (
      <div className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 p-3 text-sm">
        <p className="font-black text-cyan-100">Multi-Agent Discussion</p>
        <p className="mt-1 text-slate-300">Market, Risk, Checklist, Journal, Exit Agent, and Buddy reviewed the setup quality.</p>
      </div>
    );
  }
  if (card.type === "exit_plan") {
    return (
      <div className="rounded-xl border border-orange-300/30 bg-orange-300/10 p-3 text-sm">
        <p className="font-black text-orange-100">Exit Plan Alert</p>
        <p className="mt-1 text-slate-300">Check TP, SL, and original plan readiness before making decisions.</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-red-300/30 bg-red-300/10 p-3 text-sm">
      <p className="font-black text-red-100">Warning</p>
      <p className="mt-1 text-slate-300">{card.message}</p>
    </div>
  );
}
