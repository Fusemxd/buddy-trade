"use client";

import { FormEvent, useEffect, useState } from "react";
import { loadJournal, saveJournal } from "@/lib/journal";
import type { JournalEntry, TradeDirection, TradeResult } from "@/types/journal";
import JournalSummary from "./JournalSummary";

type JournalForm = Omit<JournalEntry, "id" | "createdAt">;

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = (): JournalForm => ({
  date: today(),
  symbol: "BTCUSDT",
  direction: "Spot Buy",
  entry: "",
  stopLoss: "",
  takeProfit: "",
  result: "Break Even",
  profitLossThb: "",
  emotion: "",
  reasonForEntry: "",
  notes: ""
});

const directions: TradeDirection[] = ["Spot Buy", "Long", "Short"];
const results: TradeResult[] = ["Win", "Loss", "Break Even"];

export default function TradeJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [form, setForm] = useState<JournalForm>(emptyForm);

  useEffect(() => {
    setEntries(loadJournal());
  }, []);

  function submit(event: FormEvent) {
    event.preventDefault();
    const nextEntry: JournalEntry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...form
    };
    const nextEntries = [nextEntry, ...entries];
    setEntries(nextEntries);
    saveJournal(nextEntries);
    setForm({ ...emptyForm(), symbol: form.symbol, direction: form.direction });
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
          <h2 className="mt-1 text-xl font-black text-white">Daily Stop Record</h2>
        </div>
        <button className="rounded-lg border border-slate-700 px-4 py-3 text-sm font-bold text-slate-300" onClick={clear}>Clear journal</button>
      </div>

      <div className="mt-4">
        <JournalSummary entries={entries} />
      </div>

      <form className="mt-5 grid gap-3 lg:grid-cols-3" onSubmit={submit}>
        <InputField label="Date" type="date" value={form.date} onChange={(value) => setForm((current) => ({ ...current, date: value }))} />
        <InputField label="Symbol" value={form.symbol} onChange={(value) => setForm((current) => ({ ...current, symbol: value.toUpperCase() }))} />
        <SelectField label="Direction" value={form.direction} options={directions} onChange={(value) => setForm((current) => ({ ...current, direction: value as TradeDirection }))} />
        <InputField label="Entry" value={form.entry} onChange={(value) => setForm((current) => ({ ...current, entry: value }))} />
        <InputField label="Stop Loss" value={form.stopLoss} onChange={(value) => setForm((current) => ({ ...current, stopLoss: value }))} />
        <InputField label="Take Profit" value={form.takeProfit} onChange={(value) => setForm((current) => ({ ...current, takeProfit: value }))} />
        <SelectField label="Result" value={form.result} options={results} onChange={(value) => setForm((current) => ({ ...current, result: value as TradeResult }))} />
        <InputField label="Profit or Loss in THB" type="number" value={form.profitLossThb} onChange={(value) => setForm((current) => ({ ...current, profitLossThb: value }))} />
        <InputField label="Emotion" value={form.emotion} onChange={(value) => setForm((current) => ({ ...current, emotion: value }))} />
        <TextAreaField label="Reason for entry" value={form.reasonForEntry} onChange={(value) => setForm((current) => ({ ...current, reasonForEntry: value }))} />
        <TextAreaField label="Notes" value={form.notes} onChange={(value) => setForm((current) => ({ ...current, notes: value }))} />
        <button className="min-h-14 rounded-xl bg-purple-300 px-4 py-3 text-base font-black text-slate-950 lg:col-span-3">Save journal entry</button>
      </form>

      <div className="mt-5 grid gap-3">
        {entries.length === 0 ? <p className="rounded-xl border border-slate-700 bg-slate-900/75 p-4 text-sm font-semibold text-slate-400">No journal entries yet. Save the first trade note to activate daily stop tracking.</p> : null}
        {entries.map((entry) => (
          <article className="rounded-xl border border-slate-700 bg-slate-900/75 p-4 text-sm text-slate-300" key={entry.id}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-lg font-black text-white">{entry.symbol} - {entry.direction}</p>
                <p className="text-xs font-semibold text-slate-500">{entry.date} | {formatIsoDateTime(entry.createdAt)}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-black ${entry.result === "Win" ? "bg-emerald-400/10 text-emerald-100" : entry.result === "Loss" ? "bg-red-400/10 text-red-100" : "bg-slate-700 text-slate-200"}`}>{entry.result} | {entry.profitLossThb || "0"} THB</span>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <MiniStat label="Entry" value={entry.entry || "-"} />
              <MiniStat label="SL" value={entry.stopLoss || "-"} />
              <MiniStat label="TP" value={entry.takeProfit || "-"} />
            </div>
            <p className="mt-3"><span className="font-bold text-white">Emotion:</span> {entry.emotion || "-"}</p>
            <p className="mt-1"><span className="font-bold text-white">Reason:</span> {entry.reasonForEntry || "-"}</p>
            <p className="mt-1"><span className="font-bold text-white">Notes:</span> {entry.notes || "-"}</p>
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

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="text-sm font-black text-slate-200">
      {label}
      <select className="mt-2 min-h-14 w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-base font-bold text-white outline-none focus:border-purple-300" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-sm font-black text-slate-200 lg:col-span-3">
      {label}
      <textarea className="mt-2 min-h-24 w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-base font-bold text-white outline-none focus:border-purple-300" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-950/70 p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}
