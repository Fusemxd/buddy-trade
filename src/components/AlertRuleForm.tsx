"use client";

import { FormEvent, useState } from "react";
import { alertTypeLabels } from "@/lib/alertRules";
import type { AlertRule, AlertRuleType } from "@/types/alerts";

const ruleTypes: AlertRuleType[] = ["price_above", "price_below", "rsi_above_70", "rsi_below_30", "ema_cross_above", "ema_cross_below", "near_tp1", "near_stop_loss", "daily_stop_reached", "losing_streak_reached"];

export default function AlertRuleForm({ onAdd }: { onAdd: (rule: AlertRule) => void }) {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [type, setType] = useState<AlertRuleType>("price_above");
  const [value, setValue] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    onAdd({ id: crypto.randomUUID(), symbol: symbol.trim().toUpperCase(), type, value: value ? Number(value) : undefined, enabled: true, createdAt: new Date().toISOString() });
    setValue("");
  }

  return (
    <form className="grid gap-3 rounded-3xl border border-slate-700 bg-slate-950/65 p-4 md:grid-cols-4" onSubmit={submit}>
      <label className="text-sm font-black text-slate-200">Symbol<input className="mt-2 min-h-12 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 text-white" value={symbol} onChange={(e) => setSymbol(e.target.value)} /></label>
      <label className="text-sm font-black text-slate-200 md:col-span-2">Alert type<select className="mt-2 min-h-12 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 text-white" value={type} onChange={(e) => setType(e.target.value as AlertRuleType)}>{ruleTypes.map((item) => <option key={item} value={item}>{alertTypeLabels[item]}</option>)}</select></label>
      <label className="text-sm font-black text-slate-200">Value<input className="mt-2 min-h-12 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 text-white" type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="optional" /></label>
      <button className="min-h-12 rounded-2xl bg-cyan-300 px-4 font-black text-slate-950 md:col-span-4" type="submit">เพิ่ม Alert</button>
    </form>
  );
}
