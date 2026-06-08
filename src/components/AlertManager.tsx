"use client";

import { useEffect, useState } from "react";
import { buildAlertMessage } from "@/lib/alertRules";
import { loadAlertEvents, loadAlertRules, saveAlertEvents, saveAlertRules } from "@/lib/alertStorage";
import type { AlertEvent, AlertRule } from "@/types/alerts";
import AlertList from "./AlertList";
import AlertRuleForm from "./AlertRuleForm";

export default function AlertManager() {
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [events, setEvents] = useState<AlertEvent[]>([]);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("unsupported");

  useEffect(() => {
    setRules(loadAlertRules());
    setEvents(loadAlertEvents());
    setPermission(typeof Notification === "undefined" ? "unsupported" : Notification.permission);
  }, []);

  function commitRules(next: AlertRule[]) {
    setRules(next);
    saveAlertRules(next);
  }

  function commitEvents(next: AlertEvent[]) {
    setEvents(next);
    saveAlertEvents(next);
  }

  async function enableNotifications() {
    if (typeof Notification === "undefined") return setPermission("unsupported");
    const result = await Notification.requestPermission();
    setPermission(result);
  }

  function addRule(rule: AlertRule) {
    commitRules([rule, ...rules]);
  }

  function testRule(rule: AlertRule) {
    const event: AlertEvent = { id: crypto.randomUUID(), ruleId: rule.id, symbol: rule.symbol, message: buildAlertMessage(rule), createdAt: new Date().toISOString(), read: false };
    commitEvents([event, ...events]);
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification("Trade Buddy Alert", { body: event.message });
    }
  }

  return (
    <section className="grid gap-4">
      <div className="rounded-3xl border border-cyan-300/25 bg-cyan-300/10 p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-100">Browser Alerts</p>
        <h2 className="mt-1 text-2xl font-black text-white">Local Alert Manager</h2>
        <p className="mt-2 text-sm font-semibold text-cyan-50/80">แจ้งเตือนใน browser และเก็บประวัติในเครื่องเท่านั้น ไม่มี email/server push/auto trading</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="min-h-11 rounded-2xl bg-cyan-300 px-4 font-black text-slate-950" onClick={enableNotifications} type="button">Enable browser notification</button>
          <span className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm font-black text-white">Permission: {permission}</span>
        </div>
      </div>
      <AlertRuleForm onAdd={addRule} />
      <div className="grid gap-2">
        {rules.slice(0, 1).map((rule) => <button className="min-h-11 rounded-2xl border border-yellow-300/30 bg-yellow-300/10 px-4 text-sm font-black text-yellow-100" key={rule.id} onClick={() => testRule(rule)} type="button">Test latest alert safely</button>)}
      </div>
      <AlertList
        rules={rules}
        events={events}
        onToggle={(id) => commitRules(rules.map((rule) => rule.id === id ? { ...rule, enabled: !rule.enabled } : rule))}
        onDelete={(id) => commitRules(rules.filter((rule) => rule.id !== id))}
        onMarkRead={(id) => commitEvents(events.map((event) => event.id === id ? { ...event, read: true } : event))}
        onClearHistory={() => commitEvents([])}
      />
    </section>
  );
}
