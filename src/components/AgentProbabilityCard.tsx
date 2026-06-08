import type { SetupProbability } from "@/types/agentDiscussion";

const labelClass = {
  low: "border-yellow-300/35 bg-yellow-300/10 text-yellow-100",
  medium: "border-cyan-300/35 bg-cyan-300/10 text-cyan-100",
  high: "border-emerald-300/35 bg-emerald-300/10 text-emerald-100",
  blocked: "border-red-300/40 bg-red-300/10 text-red-100"
};

export default function AgentProbabilityCard({ probability }: { probability: SetupProbability }) {
  return (
    <section className={`rounded-2xl border p-4 ${labelClass[probability.label]}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] opacity-70">Setup Quality</p>
          <h3 className="mt-1 text-xl font-black text-white">{probability.label.toUpperCase()}</h3>
        </div>
        {probability.label !== "blocked" ? <p className="text-3xl font-black text-white">{probability.score}</p> : null}
      </div>
      <p className="mt-3 text-sm font-semibold leading-6">{probability.reason}</p>
      <p className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-slate-300">คะแนนนี้คือความพร้อมของแผน ไม่ใช่โอกาสชนะหรือคำสั่งซื้อขาย</p>
    </section>
  );
}
