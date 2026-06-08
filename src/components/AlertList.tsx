"use client";

import { alertTypeLabels } from "@/lib/alertRules";
import type { AlertEvent, AlertRule } from "@/types/alerts";

export default function AlertList({ rules, events, onToggle, onDelete, onMarkRead, onClearHistory }: { rules: AlertRule[]; events: AlertEvent[]; onToggle: (id: string) => void; onDelete: (id: string) => void; onMarkRead: (id: string) => void; onClearHistory: () => void }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-3xl border border-slate-700 bg-slate-950/65 p-4">
        <h3 className="text-lg font-black text-white">Alert rules</h3>
        <div className="mt-3 grid gap-2">
          {rules.length ? rules.map((rule) => (
            <article className="rounded-2xl border border-slate-700 bg-slate-900/75 p-3" key={rule.id}>
              <div className="flex items-start justify-between gap-3">
                <div><p className="font-black text-white">{rule.symbol}</p><p className="text-sm text-slate-400">{alertTypeLabels[rule.type]} {rule.value ? `| ${rule.value}` : ""}</p></div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-black ${rule.enabled ? "bg-emerald-300/10 text-emerald-100" : "bg-slate-800 text-slate-300"}`}>{rule.enabled ? "on" : "off"}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="min-h-10 rounded-xl border border-cyan-300/30 text-sm font-black text-cyan-100" onClick={() => onToggle(rule.id)} type="button">{rule.enabled ? "Disable" : "Enable"}</button>
                <button className="min-h-10 rounded-xl border border-red-300/30 text-sm font-black text-red-100" onClick={() => onDelete(rule.id)} type="button">Delete</button>
              </div>
            </article>
          )) : <p className="text-sm font-bold text-slate-400">ยังไม่มี Alert rule</p>}
        </div>
      </section>
      <section className="rounded-3xl border border-slate-700 bg-slate-950/65 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-black text-white">Alert history</h3>
          <button className="text-sm font-black text-slate-400" onClick={onClearHistory} type="button">Clear</button>
        </div>
        <div className="mt-3 grid gap-2">
          {events.length ? events.map((event) => (
            <button className={`rounded-2xl border p-3 text-left ${event.read ? "border-slate-700 bg-slate-900/65 text-slate-400" : "border-yellow-300/30 bg-yellow-300/10 text-yellow-50"}`} key={event.id} onClick={() => onMarkRead(event.id)} type="button">
              <p className="font-black">{event.symbol}</p>
              <p className="mt-1 text-sm font-semibold">{event.message}</p>
            </button>
          )) : <p className="text-sm font-bold text-slate-400">ยังไม่มีประวัติ Alert</p>}
        </div>
      </section>
    </div>
  );
}
