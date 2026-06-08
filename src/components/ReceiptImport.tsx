"use client";

import { useState } from "react";
import { loadExpenses, saveExpenses } from "@/lib/expenseStorage";
import { parseReceiptText } from "@/lib/receiptParser";
import type { ExtractedReceiptData } from "@/types/expense";
import ReceiptExtractedFields from "./ReceiptExtractedFields";
import ReceiptPreview from "./ReceiptPreview";

export default function ReceiptImport({ onSaved }: { onSaved?: () => void }) {
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [rawText, setRawText] = useState("");
  const [data, setData] = useState<ExtractedReceiptData>(parseReceiptText(""));
  const [error, setError] = useState("");

  async function handleFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Accept image files only.");
    if (file.size > 2.5 * 1024 * 1024) return setError("File is too large.");
    setImageDataUrl(await readFile(file));
    setError("");
  }

  function save(category?: ExtractedReceiptData["category"]) {
    const expenses = loadExpenses();
    saveExpenses([{ id: crypto.randomUUID(), createdAt: new Date().toISOString(), merchant: data.merchant ?? "Unknown", date: data.date || new Date().toISOString().slice(0, 10), totalAmount: data.totalAmount ?? 0, currency: data.currency ?? "THB", category: category ?? data.category ?? "Other", source: data.source ?? "Receipt Photo", imageDataUrl, rawText, notes: data.notes, confirmed: true }, ...expenses]);
    onSaved?.();
  }

  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-950/65 p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-200">Receipt Import</p>
      <h2 className="mt-1 text-xl font-black text-white">บันทึกค่าใช้จ่ายจากใบเสร็จ</h2>
      <p className="mt-2 text-sm text-slate-400">ข้อมูลใบเสร็จถูกเก็บในเครื่องผ่าน localStorage และไม่ถูกส่งไป AI/API ภายนอก</p>
      <input className="mt-4 min-h-14 w-full rounded-2xl border border-slate-700 bg-slate-900 p-3 text-white" type="file" accept="image/*" onChange={(e) => void handleFile(e.target.files?.[0])} />
      {error ? <p className="mt-3 text-red-100">{error}</p> : null}
      {imageDataUrl ? <div className="mt-4"><ReceiptPreview dataUrl={imageDataUrl} onRemove={() => setImageDataUrl("")} /></div> : null}
      <textarea className="mt-4 min-h-24 w-full rounded-2xl border border-slate-700 bg-slate-900 p-3 text-white" placeholder="Optional OCR/raw text paste. TODO: Add OCR extraction with tesseract.js." value={rawText} onChange={(e) => setRawText(e.target.value)} />
      <button className="mt-2 min-h-12 rounded-2xl border border-slate-700 px-4 font-black text-slate-300" onClick={() => setData(parseReceiptText(rawText))} type="button">Parse pasted text</button>
      <div className="mt-4"><ReceiptExtractedFields data={data} onChange={setData} /></div>
      <p className="mt-4 rounded-2xl border border-yellow-300/30 bg-yellow-300/10 p-3 text-sm font-bold text-yellow-100">OCR อาจอ่านตัวเลขผิด กรุณาตรวจสอบก่อนบันทึกทุกครั้ง</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-3"><button className="min-h-12 rounded-2xl bg-purple-300 px-4 font-black text-slate-950" onClick={() => save()} type="button">บันทึกค่าใช้จ่าย</button><button className="min-h-12 rounded-2xl border border-cyan-300/30 px-4 font-black text-cyan-100" onClick={() => save("API Cost")} type="button">บันทึกเป็นค่า API</button><button className="min-h-12 rounded-2xl border border-cyan-300/30 px-4 font-black text-cyan-100" onClick={() => save("Subscription")} type="button">บันทึกเป็นค่าสมัครสมาชิก</button></div>
    </section>
  );
}

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.onerror = reject; r.readAsDataURL(file); });
}
