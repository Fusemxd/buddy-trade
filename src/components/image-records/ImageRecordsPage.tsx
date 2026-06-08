"use client";

import { useEffect, useMemo, useState } from "react";
import ExpenseTracker from "@/components/ExpenseTracker";
import ReceiptImport from "@/components/ReceiptImport";
import ScreenshotImport from "@/components/ScreenshotImport";
import { loadExpenses } from "@/lib/expenseStorage";
import { loadImageRecords } from "@/lib/imageRecordStorage";
import { generateImageRecordSummary } from "@/lib/imageRecordSummary";
import { loadJournal } from "@/lib/journal";
import type { ExpenseRecord } from "@/types/expense";
import type { ImageRecord } from "@/types/imageRecord";
import type { JournalEntry } from "@/types/journal";
import AutoImageSummary from "./AutoImageSummary";
import ImageRecordHistory from "./ImageRecordHistory";
import ImageRecordTabs, { type ImageRecordTab } from "./ImageRecordTabs";

export default function ImageRecordsPage({ initialTab = "summary" }: { initialTab?: ImageRecordTab }) {
  const [tab, setTab] = useState<ImageRecordTab>(initialTab);
  const [records, setRecords] = useState<ImageRecord[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);

  function refresh() {
    setRecords(loadImageRecords());
    setExpenses(loadExpenses());
    setJournals(loadJournal());
  }

  useEffect(refresh, []);

  const summary = useMemo(() => generateImageRecordSummary(records, expenses, journals), [records, expenses, journals]);

  return (
    <section className="grid gap-4">
      <div className="rounded-3xl border border-slate-700/70 bg-slate-950/65 p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Image Records</p>
        <h2 className="mt-1 text-2xl font-black text-white">รายการจากรูป</h2>
        <div className="mt-3 grid gap-2 text-sm font-semibold text-slate-300">
          <p className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3">รูปภาพและข้อมูลที่นำเข้าจะถูกเก็บในเครื่องของคุณผ่าน localStorage ในเวอร์ชันนี้</p>
          <p className="rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-3 text-yellow-100">OCR หรือการอ่านข้อมูลจากภาพอาจผิดพลาด กรุณาตรวจสอบก่อนบันทึกทุกครั้ง</p>
          <p className="rounded-2xl border border-slate-700 bg-slate-900/70 p-3">ภาพเทรดใช้เพื่อช่วยจัดแผนและบันทึกเท่านั้น ไม่ใช่คำสั่งซื้อขายหรือการรับประกันกำไร</p>
        </div>
      </div>

      <ImageRecordTabs active={tab} onChange={setTab} />

      {tab === "summary" ? <AutoImageSummary summary={summary} /> : null}
      {tab === "trade" ? (
        <div className="grid gap-4">
          <p className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm font-bold text-cyan-50">ภาพเทรดใช้ช่วยสร้างแผนหรือบันทึก Journal ไม่ใช่คำสั่งซื้อขาย</p>
          <ScreenshotImport />
        </div>
      ) : null}
      {tab === "receipt" ? (
        <div className="grid gap-4">
          <p className="rounded-3xl border border-purple-300/20 bg-purple-300/10 p-4 text-sm font-bold text-purple-50">ใบเสร็จใช้ช่วยดูต้นทุนจริงของการเทรดและเครื่องมือที่ใช้</p>
          <ReceiptImport onSaved={refresh} />
          <ExpenseTracker showImport={false} />
        </div>
      ) : null}
      {tab === "history" ? <ImageRecordHistory records={records} /> : null}
    </section>
  );
}
