import type { AgentDiscussionResult } from "@/types/agentDiscussion";
import AgentDiscussionBubble from "./AgentDiscussionBubble";
import AgentProbabilityCard from "./AgentProbabilityCard";
import ExitPlanCard from "./ExitPlanCard";

export default function AgentDiscussionThread({ discussion }: { discussion: AgentDiscussionResult }) {
  return (
    <div className="space-y-3">
      <AgentProbabilityCard probability={discussion.probability} />
      <div className="grid gap-2">
        {discussion.messages.map((message) => (
          <AgentDiscussionBubble key={message.id} message={message} />
        ))}
      </div>
      {discussion.exitAlerts?.length ? <ExitPlanCard alerts={discussion.exitAlerts} input={{}} /> : null}
      <p className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 p-3 text-sm font-bold text-cyan-100">นี่คือการแจ้งเตือนตามแผน ไม่ใช่คำสั่งซื้อขายหรือการรับประกันกำไร</p>
    </div>
  );
}
