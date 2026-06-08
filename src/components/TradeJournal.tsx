"use client";

import { FormEvent, useEffect, useState } from "react";
import { loadJournal, saveJournal } from "@/lib/journal";
import { loadWatchlist } from "@/lib/watchlistStorage";
import type { JournalEntry } from "@/types/journal";
import JournalDashboard from "./JournalDashboard";
import JournalSummary from "./JournalSummary";

type QuickJournalForm = {
  symbol: string;
  entry: string;
  amountThb: string;
  profitLossThb: string;
  durationMinutes: string;
};

const emptyForm = (): QuickJournalForm => ({
  symbol: "BTCUSDT",
  entry: "",
  amountThb: "",
  profitLossThb: "",
  durationMinutes: ""
});

export default function TradeJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [symbols, setSymbols] = useState(["BTCUSDT", "ETHUSDT", "SOLUSDT"]);
  const [form, setForm] = useState<QuickJournalForm>(emptyForm);

  useEffect(() => {
    const watchlistSymbols = loadWatchlist().map((item) => item.symbol);
    setSymbols(watchlistSymbols.length ? watchlistSymbols : ["BTCUSDT", "ETHUSDT", "SOLUSDT"]);
    setForm((current) => ({ ...current, symbol: watchlistSymbols[0] ?? current.symbol }));
    setEntries(loadJournal());
  }, []);

  function submit(event: FormEvent) {
    event.preventDefault();
    const pnl = Number(form.profitLossThb || 0);
    const nextEntry: JournalEntry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      date: new Date().toISOString().slice(0, 10),
      symbol: form.symbol,
      direction: "Spot Buy",
      entry: form.entry,
      stopLoss: "",
      takeProfit: "",
      result: pnl > 0 ? "Win" : pnl < 0 ? "Loss" : "Break Even",
      profitLossThb: form.profitLossThb || "0",
      emotion: "",
      reasonForEntry: "",
      notes: `เล่น ${form.amountThb || "0"} บาท | ระยะเวลา ${form.durationMinutes || "0"} นาที`,
      strategy: "Quick Journal",
      mistakeTags: "",
      tradeDuration: form.durationMinutes ? `${form.durationMinutes} นาที` : "",
      followedPlan: "yes"
    };
    const nextEntries = [nextEntry, ...entries];
    setEntries(nextEntries);
    saveJournal(nextEntries);
    setForm({ ...emptyForm(), symbol: form.symbol });
  }

  function clear() {
    setEntries([]);
    saveJournal([]);
  }

  return (
    <section className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-4 shadow-[0_0_45px_rgba(192,132,252,0.08)] backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-200">Trade Journal</p>
          <h2 className="mt-1 text-xl font-black text-white">จดสั้น ๆ พอใช้งานจริง</h2>
          <p className="mt-1 text-sm font-semibold text-slate-400">กรอกแค่เหรียญ ราคาเข้า เงินที่เล่น ได้/เสีย และเวลาก็พอ ระบบจะสรุปให้เอง</p>
        </div>
        <button className="rounded-lg border border-slate-700 px-4 py-3 text-sm font-bold text-slate-300" onClick={clear} type="button">Clear journal</button>
      </div>

      <div className="mt-4">
        <JournalSummary entries={entries} />
      </div>
      <div className="mt-4">
        <JournalDashboard entries={entries} />
      </div>

      <form className="mt-5 grid gap-3 rounded-3xl border border-purple-300/20 bg-purple-300/5 p-3 sm:grid-cols-2 xl:grid-cols-5" onSubmit={submit}>
        <label className="text-sm font-black text-slate-200">
          ชื่อเหรียญ
          <select className="mt-2 min-h-14 w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-base font-bold text-white outline-none focus:border-purple-300" value={form.symbol} onChange={(event) => setForm((current) => ({ ...current, symbol: event.target.value }))}>
            {symbols.map((symbol) => <option key={symbol}>{symbol}</option>)}
          </select>
        </label>
        <InputField label="เข้าที่ราคาเท่าไหร่" type="number" value={form.entry} onChange={(value) => setForm((current) => ({ ...current, entry: value }))} />
        <InputField label="เล่นกี่บาท" type="number" value={form.amountThb} onChange={(value) => setForm((current) => ({ ...current, amountThb: value }))} />
        <InputField label="ได้/เสียกี่บาท" type="number" value={form.profitLossThb} onChange={(value) => setForm((current) => ({ ...current, profitLossThb: value }))} />
        <InputField label="เล่นกี่นาที" type="number" value={form.durationMinutes} onChange={(value) => setForm((current) => ({ ...current, durationMinutes: value }))} />
        <button className="min-h-14 rounded-xl bg-purple-300 px-4 py-3 text-base font-black text-slate-950 sm:col-span-2 xl:col-span-5">บันทึกไม้</button>
      </form>

      <div className="mt-5 grid gap-3">
        {entries.length === 0 ? <p className="rounded-xl border border-slate-700 bg-slate-900/75 p-4 text-sm font-semibold text-slate-400">ยังไม่มีบันทึก เริ่มจดไม้แรกเพื่อดูนิสัยการเทรดของตัวเอง</p> : null}
        {entries.map((entry) => (
          <article className="rounded-xl border border-slate-700 bg-slate-900/75 p-4 text-sm text-slate-300" key={entry.id}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-lg font-black text-white">{entry.symbol}</p>
                <p className="text-xs font-semibold text-slate-500">{entry.date} | {formatIsoDateTime(entry.createdAt)}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-black ${entry.result === "Win" ? "bg-emerald-400/10 text-emerald-100" : entry.result === "Loss" ? "bg-red-400/10 text-red-100" : "bg-slate-700 text-slate-200"}`}>{entry.result} | {entry.profitLossThb || "0"} THB</span>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <MiniStat label="เข้า" value={entry.entry || "-"} />
              <MiniStat label="เวลา" value={entry.tradeDuration || "-"} />
              <MiniStat label="รายละเอียด" value={entry.notes || "-"} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatIsoDateTime(value: string) {
  const match = value.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/);
  return match ? `${match[1]} ${match[2]}:${match[3]}` : value;
}

function InputField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="text-sm font-black text-slate-200">
      {label}
      <input className="mt-2 min-h-14 w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-base font-bold text-white outline-none focus:border-purple-300" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-950/70 p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 break-words font-black text-white">{value}</p>
    </div>
  );
}
