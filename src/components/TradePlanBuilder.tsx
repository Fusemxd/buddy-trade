"use client";

import { FormEvent, useState } from "react";
import { buildTradePlan } from "@/lib/tradePlan";
import type { TradePlan, TradePlanDirection } from "@/types/tradePlan";
import ExitPlanCard from "./ExitPlanCard";
import TradePlanCard from "./TradePlanCard";
import { generateExitPlanAlert } from "@/lib/exitPlan";

export default function TradePlanBuilder({ initialSymbol = "BTCUSDT" }: { initialSymbol?: string }) {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [direction, setDirection] = useState<TradePlanDirection>("Spot Buy");
  const [entry, setEntry] = useState(100);
  const [stopLoss, setStopLoss] = useState(95);
  const [takeProfit1, setTakeProfit1] = useState(110);
  const [takeProfit2, setTakeProfit2] = useState(115);
  const [capital, setCapital] = useState(500);
  const [riskPercent, setRiskPercent] = useState(1);
  const [plan, setPlan] = useState<TradePlan | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    setPlan(buildTradePlan({ symbol, direction, entry, stopLoss, takeProfit1, takeProfit2, capital, riskPercent }));
  }

  const exitAlerts = plan ? generateExitPlanAlert({ symbol: plan.symbol, direction: plan.direction, entryPrice: plan.entry, stopLoss: plan.stopLoss, takeProfit1: plan.takeProfit1, takeProfit2: plan.takeProfit2, capital: plan.capital, riskAmount: plan.riskAmount, positionSize: plan.positionSize }) : [];

  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-950/65 p-4">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Trade Plan Builder</p>
        <h2 className="mt-1 text-xl font-black text-white">Semi-Auto Plan Assistant</h2>
        <p className="mt-1 text-sm text-slate-400">สร้างแผนและคัดลอกไปใช้เองนอกแอป ไม่มีการส่งคำสั่งเทรด</p>
      </div>
      <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={submit}>
        <Field label="Symbol" value={symbol} onChange={setSymbol} />
        <label className="text-sm font-black text-slate-200">Direction<select className="mt-2 min-h-12 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 text-white" value={direction} onChange={(e) => setDirection(e.target.value as TradePlanDirection)}><option>Spot Buy</option><option>Long</option><option>Short</option></select></label>
        <Field label="Entry" value={entry} onChange={setEntry} type="number" />
        <Field label="Stop Loss" value={stopLoss} onChange={setStopLoss} type="number" />
        <Field label="Take Profit 1" value={takeProfit1} onChange={setTakeProfit1} type="number" />
        <Field label="Take Profit 2" value={takeProfit2} onChange={setTakeProfit2} type="number" />
        <Field label="Capital" value={capital} onChange={setCapital} type="number" />
        <Field label="Risk %" value={riskPercent} onChange={setRiskPercent} type="number" />
        <button className="min-h-12 rounded-2xl bg-cyan-300 px-4 font-black text-slate-950 sm:col-span-2">สร้างแผน</button>
      </form>
      {plan ? <div className="mt-4 grid gap-4"><TradePlanCard plan={plan} /><ExitPlanCard input={{ symbol: plan.symbol, direction: plan.direction, entryPrice: plan.entry, stopLoss: plan.stopLoss, takeProfit1: plan.takeProfit1, takeProfit2: plan.takeProfit2 }} alerts={exitAlerts} /></div> : null}
    </section>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string | number; onChange: (value: any) => void; type?: string }) {
  return <label className="text-sm font-black text-slate-200">{label}<input className="mt-2 min-h-12 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 text-white" type={type} value={value} onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)} /></label>;
}
