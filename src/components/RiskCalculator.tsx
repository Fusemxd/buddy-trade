"use client";

import { useEffect, useMemo, useState } from "react";
import { calculateRisk, DEFAULT_CAPITAL_THB, type RiskResult } from "@/lib/risk";

const PLAN_PASS_TEXT = "\u0E41\u0E1C\u0E19\u0E19\u0E35\u0E49\u0E1C\u0E48\u0E32\u0E19\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02\u0E40\u0E1A\u0E37\u0E49\u0E2D\u0E07\u0E15\u0E49\u0E19";
const PLAN_FAIL_TEXT = "\u0E41\u0E1C\u0E19\u0E19\u0E35\u0E49\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E04\u0E38\u0E49\u0E21 \u0E04\u0E27\u0E32\u0E21\u0E40\u0E2A\u0E35\u0E48\u0E22\u0E07\u0E2A\u0E39\u0E07\u0E40\u0E01\u0E34\u0E19\u0E44\u0E1B";
const SMALL_CAPITAL_RISK_TEXT = "\u0E40\u0E2A\u0E35\u0E48\u0E22\u0E07\u0E40\u0E01\u0E34\u0E19\u0E44\u0E1B\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E17\u0E38\u0E19\u0E40\u0E25\u0E47\u0E01";
const RISK_CLEAR_TEXT = "Risk \u0E40\u0E1A\u0E37\u0E49\u0E2D\u0E07\u0E15\u0E49\u0E19\u0E2D\u0E22\u0E39\u0E48\u0E43\u0E19\u0E01\u0E23\u0E2D\u0E1A \u0E41\u0E15\u0E48\u0E22\u0E31\u0E07\u0E15\u0E49\u0E2D\u0E07\u0E23\u0E2D Checklist \u0E41\u0E25\u0E30\u0E1A\u0E23\u0E34\u0E2B\u0E32\u0E23\u0E02\u0E19\u0E32\u0E14\u0E44\u0E21\u0E49\u0E40\u0E2A\u0E21\u0E2D";

export default function RiskCalculator({ onRiskChange }: { onRiskChange?: (risk: RiskResult) => void }) {
  const [capitalThb, setCapitalThb] = useState(DEFAULT_CAPITAL_THB);
  const [riskPercent, setRiskPercent] = useState(1);
  const [entry, setEntry] = useState(100);
  const [stopLoss, setStopLoss] = useState(95);
  const [takeProfit, setTakeProfit] = useState(110);

  const risk = useMemo(() => calculateRisk({ capitalThb, riskPercent, entry, stopLoss, takeProfit }), [capitalThb, entry, riskPercent, stopLoss, takeProfit]);

  useEffect(() => {
    onRiskChange?.(risk);
  }, [onRiskChange, risk]);

  const panelClass = risk.isRewardValid ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-100" : "border-red-400/40 bg-red-400/10 text-red-100";

  return (
    <section className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-4 shadow-[0_0_45px_rgba(250,204,21,0.08)] backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-200">Risk Calculator</p>
          <h2 className="mt-1 text-xl font-black text-white">Position Plan Guard</h2>
        </div>
        <span className="rounded-full border border-yellow-300/30 bg-yellow-300/10 px-3 py-1 text-xs font-black text-yellow-100">{risk.status.toUpperCase()}</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <NumberField label="Capital THB" value={capitalThb} onChange={setCapitalThb} />
        <NumberField label="Risk %" value={riskPercent} onChange={setRiskPercent} step={0.25} />
        <NumberField label="Entry price" value={entry} onChange={setEntry} step={0.0001} />
        <NumberField label="Stop Loss price" value={stopLoss} onChange={setStopLoss} step={0.0001} />
        <NumberField label="Take Profit price" value={takeProfit} onChange={setTakeProfit} step={0.0001} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <ResultCard label="Risk amount" value={`${risk.riskAmountThb} THB`} />
        <ResultCard label="Estimated position size" value={risk.positionSize > 0 ? risk.positionSize.toString() : "-"} />
        <ResultCard label="Risk / Reward" value={risk.rewardRatioText} />
      </div>

      <p className={`mt-4 rounded-xl border p-4 text-base font-black ${panelClass}`}>{risk.isRewardValid ? PLAN_PASS_TEXT : PLAN_FAIL_TEXT}</p>
      {!risk.isRiskAmountValid ? <p className="mt-3 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm font-bold text-red-100">{SMALL_CAPITAL_RISK_TEXT}</p> : null}
      {risk.warnings.length === 0 ? <p className="mt-3 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm font-semibold text-emerald-100">{RISK_CLEAR_TEXT}</p> : null}
    </section>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/75 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 break-words text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function NumberField({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (value: number) => void; step?: number }) {
  return (
    <label className="text-sm font-black text-slate-200">
      {label}
      <input className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-4 text-lg font-bold text-white outline-none focus:border-yellow-300" type="number" step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}
