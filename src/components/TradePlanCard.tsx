"use client";

import { copyPlanText, savePlanToJournal } from "@/lib/tradePlan";
import type { TradePlan } from "@/types/tradePlan";

export default function TradePlanCard({ plan }: { plan: TradePlan }) {
  const copy = async () => {
    await navigator.clipboard.writeText(copyPlanText(plan));
  };

  return (
    <article className="rounded-3xl border border-slate-700 bg-slate-950/75 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-white">{plan.symbol} Plan</h3>
          <p className="text-sm text-slate-400">{plan.direction} | {plan.status}</p>
        </div>
        <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-100">{plan.quality.label}</span>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Mini label="Entry" value={String(plan.entry)} />
        <Mini label="Stop Loss" value={String(plan.stopLoss)} />
        <Mini label="TP1" value={String(plan.takeProfit1)} />
        <Mini label="TP2" value={plan.takeProfit2 ? String(plan.takeProfit2) : "-"} />
        <Mini label="Risk Amount" value={`$${plan.riskAmount}`} />
        <Mini label="Position Size" value={String(plan.positionSize)} />
        <Mini label="R:R TP1" value={`1:${plan.rewardRiskToTp1}`} />
        <Mini label="R:R TP2" value={plan.rewardRiskToTp2 ? `1:${plan.rewardRiskToTp2}` : "-"} />
      </div>
      {plan.warnings.length ? (
        <ul className="mt-4 space-y-2">
          {plan.warnings.map((warning) => <li className="rounded-2xl border border-red-300/35 bg-red-300/10 p-3 text-sm font-bold text-red-100" key={warning}>{warning}</li>)}
        </ul>
      ) : null}
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button className="min-h-12 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 font-black text-cyan-100" onClick={copy} type="button">คัดลอกแผน</button>
        <button className="min-h-12 rounded-2xl border border-purple-300/30 bg-purple-300/10 px-4 font-black text-purple-100" onClick={() => savePlanToJournal(plan)} type="button">บันทึกแผนเข้า Journal</button>
      </div>
    </article>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}
