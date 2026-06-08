"use client";

import { useMemo, useState } from "react";
import type { RiskResult } from "@/lib/risk";

const CHECKLIST_FAIL_TEXT = "\u0E41\u0E1C\u0E19\u0E19\u0E35\u0E49\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E1C\u0E48\u0E32\u0E19 \u0E2D\u0E22\u0E48\u0E32\u0E40\u0E1E\u0E34\u0E48\u0E07\u0E40\u0E02\u0E49\u0E32";
const CHECKLIST_PASS_TEXT = "\u0E41\u0E1C\u0E19\u0E19\u0E35\u0E49\u0E1C\u0E48\u0E32\u0E19 Checklist \u0E40\u0E1A\u0E37\u0E49\u0E2D\u0E07\u0E15\u0E49\u0E19 \u0E41\u0E15\u0E48\u0E22\u0E31\u0E07\u0E15\u0E49\u0E2D\u0E07\u0E1A\u0E23\u0E34\u0E2B\u0E32\u0E23\u0E04\u0E27\u0E32\u0E21\u0E40\u0E2A\u0E35\u0E48\u0E22\u0E07";

type ManualChecks = {
  trendClear: boolean;
  notChasing: boolean;
  rsiSafe: boolean;
  dailyLossClear: boolean;
};

const manualItems: Array<{ id: keyof ManualChecks; label: string }> = [
  { id: "trendClear", label: "Trend is clear" },
  { id: "notChasing", label: "Not chasing price" },
  { id: "rsiSafe", label: "RSI is not above 70" },
  { id: "dailyLossClear", label: "Daily loss limit has not been reached" }
];

export default function SetupChecklist({ risk }: { risk?: RiskResult }) {
  const [manualChecks, setManualChecks] = useState<ManualChecks>({
    trendClear: false,
    notChasing: false,
    rsiSafe: false,
    dailyLossClear: false
  });

  const calculatedItems = useMemo(
    () => [
      { label: "Stop Loss is already planned", complete: risk?.hasStopLoss ?? false },
      { label: "Risk/Reward is at least 1:2", complete: risk?.isRewardValid ?? false },
      { label: "Risk per trade stays within 1-2%", complete: risk?.isRiskAmountValid ?? false }
    ],
    [risk]
  );

  const complete = Object.values(manualChecks).every(Boolean) && calculatedItems.every((item) => item.complete);

  return (
    <section className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-4 shadow-[0_0_45px_rgba(96,165,250,0.08)] backdrop-blur">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">Setup Checklist</p>
        <h2 className="mt-1 text-xl font-black text-white">Discipline Gate</h2>
      </div>

      <div className="mt-4 grid gap-3">
        {manualItems.map((item) => (
          <label className="flex min-h-16 items-center gap-4 rounded-xl border border-slate-700 bg-slate-900/80 p-4 text-base font-bold text-slate-200" key={item.id}>
            <input className="h-6 w-6 shrink-0 accent-blue-300" type="checkbox" checked={manualChecks[item.id]} onChange={(event) => setManualChecks((current) => ({ ...current, [item.id]: event.target.checked }))} />
            {item.label}
          </label>
        ))}

        {calculatedItems.map((item) => (
          <div className={`flex min-h-16 items-center gap-4 rounded-xl border p-4 text-base font-bold ${item.complete ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100" : "border-red-400/30 bg-red-400/10 text-red-100"}`} key={item.label}>
            <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border text-xs ${item.complete ? "border-emerald-300 bg-emerald-300 text-slate-950" : "border-red-300 text-red-100"}`}>{item.complete ? "OK" : "!"}</span>
            {item.label}
          </div>
        ))}
      </div>

      <p className={`mt-4 rounded-xl border p-4 text-base font-black ${complete ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-100" : "border-red-400/40 bg-red-400/10 text-red-100"}`}>
        {complete ? CHECKLIST_PASS_TEXT : CHECKLIST_FAIL_TEXT}
      </p>
    </section>
  );
}
