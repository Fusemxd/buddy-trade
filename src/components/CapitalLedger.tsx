"use client";

import { FormEvent, useEffect, useState } from "react";
import { formatUsdWithThb, loadCapitalTransactions, saveCapitalTransactions, summarizeCapital } from "@/lib/capitalStorage";
import type { CapitalTransaction, CapitalTransactionType } from "@/types/capital";

export default function CapitalLedger({ compact = false }: { compact?: boolean }) {
  const [items, setItems] = useState<CapitalTransaction[]>([]);
  const [type, setType] = useState<CapitalTransactionType>("deposit");
  const [amountUsd, setAmountUsd] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    setItems(loadCapitalTransactions());
  }, []);

  const summary = summarizeCapital(items);

  function commit(next: CapitalTransaction[]) {
    setItems(next);
    saveCapitalTransactions(next);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const amount = Number(amountUsd);
    if (!Number.isFinite(amount) || amount <= 0) return;
    commit([{ id: crypto.randomUUID(), createdAt: new Date().toISOString(), type, amountUsd: amount, note }, ...items]);
    setAmountUsd("");
    setNote("");
  }

  return (
    <section className="luxury-card min-w-0 overflow-hidden rounded-[2rem] p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(250,204,21,0.10),transparent_26%),radial-gradient(circle_at_100%_0%,rgba(16,185,129,0.10),transparent_30%)]" />
      <div className="relative min-w-0">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-100">Capital Ledger</p>
        <h3 className="mt-1 text-2xl font-black text-white">{formatUsdWithThb(summary.balanceUsd)}</h3>
        <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-300">บันทึกฝาก/ถอนเพื่อคำนวณทุนปัจจุบัน</p>
      </div>

      {!compact ? (
        <div className="relative">
          <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <SummaryLine label="ฝากรวม" value={formatUsdWithThb(summary.depositsUsd)} />
            <SummaryLine label="ถอนรวม" value={formatUsdWithThb(summary.withdrawalsUsd)} />
          </div>
          <form className="mt-4 grid min-w-0 gap-2 sm:grid-cols-2" onSubmit={submit}>
            <select className="min-h-12 min-w-0 rounded-2xl border border-white/10 bg-slate-950/80 px-3 font-bold text-white outline-none focus:border-yellow-200/45" value={type} onChange={(event) => setType(event.target.value as CapitalTransactionType)}>
              <option value="deposit">ฝากทุน</option>
              <option value="withdraw">ถอนทุน</option>
            </select>
            <input className="min-h-12 min-w-0 rounded-2xl border border-white/10 bg-slate-950/80 px-3 font-bold text-white outline-none placeholder:text-slate-500 focus:border-yellow-200/45" inputMode="decimal" placeholder="จำนวน USD" type="number" value={amountUsd} onChange={(event) => setAmountUsd(event.target.value)} />
            <input className="min-h-12 min-w-0 rounded-2xl border border-white/10 bg-slate-950/80 px-3 font-bold text-white outline-none placeholder:text-slate-500 focus:border-yellow-200/45 sm:col-span-2" placeholder="โน้ต เช่น เติมทุน" value={note} onChange={(event) => setNote(event.target.value)} />
            <button className="luxury-primary min-h-12 rounded-2xl px-4 font-black sm:col-span-2" type="submit">บันทึก</button>
          </form>
          <div className="mt-3 grid gap-2">
            {items.slice(0, 5).map((item) => (
              <div className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-sm" key={item.id}>
                <div className="min-w-0">
                  <p className="break-words font-black text-white">{item.type === "deposit" ? "ฝากทุน" : "ถอนทุน"} {formatUsdWithThb(item.amountUsd)}</p>
                  <p className="break-words text-xs text-slate-400">{item.note || "ไม่มีโน้ต"}</p>
                </div>
                <button className="shrink-0 text-xs font-black text-red-100" onClick={() => commit(items.filter((current) => current.id !== item.id))} type="button">ลบ</button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/45 px-3 py-2">
      <p className="shrink-0 text-xs font-bold text-yellow-100/70">{label}</p>
      <p className="truncate text-sm font-black text-white">{value}</p>
    </div>
  );
}
