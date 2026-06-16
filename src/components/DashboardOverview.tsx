"use client";

import { useEffect, useMemo, useState } from "react";
import { loadExpenses } from "@/lib/expenseStorage";
import { loadImageRecords } from "@/lib/imageRecordStorage";
import { generateImageRecordSummary } from "@/lib/imageRecordSummary";
import { loadJournal } from "@/lib/journal";
import type { ExpenseRecord } from "@/types/expense";
import type { ImageRecord } from "@/types/imageRecord";
import type { JournalEntry } from "@/types/journal";
import type { MobileWarRoomPanel } from "./MobileBottomNav";
import CapitalLedger from "./CapitalLedger";
import DailySummaryCard from "./DailySummaryCard";
import RiskSummaryCard from "./RiskSummaryCard";

export default function DashboardOverview({ onNavigate }: { onNavigate: (page: MobileWarRoomPanel) => void }) {
  const [records, setRecords] = useState<ImageRecord[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);

  useEffect(() => {
    setRecords(loadImageRecords());
    setExpenses(loadExpenses());
    setJournals(loadJournal());
  }, []);

  const imageSummary = useMemo(() => generateImageRecordSummary(records, expenses, journals), [records, expenses, journals]);
  const tradeWithoutJournal = Math.max(0, imageSummary.tradeScreenshots - imageSummary.journalDrafts);

  return (
    <section className="grid gap-3">
      <div className="trade-panel overflow-hidden rounded-3xl p-4">
        <div className="relative">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-trade-green">Dashboard</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">ภาพรวม Trade Buddy</h2>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-300">โฟกัสวันนี้: สแกน setup, สร้างแผน, คุมความเสี่ยง และจด Journal แบบมีวินัย</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button className="trade-button min-h-14 rounded-xl px-4 text-base font-black" onClick={() => onNavigate("scanner")} type="button">
              เริ่มสแกนตลาด
            </button>
            <button className="trade-button-secondary min-h-14 rounded-xl px-4 text-base font-black" onClick={() => onNavigate("plan")} type="button">
              สร้างแผนเทรด
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <CapitalLedger />
        <RiskSummaryCard />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <DailySummaryCard />
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <MiniCard title="Watchlist" value="Custom crypto" helper="ไปที่ Scanner เพื่อดู watchlist, chart และ bias ของเหรียญ" />
        <MiniCard title="Setup Alerts" value="Rule-based" helper="ระบบช่วยเตือนเรื่องไล่ราคา, SL, R:R และ Daily Stop" />
        <MiniCard title="Next Action" value="เช็กก่อนเสมอ" helper="เริ่มจาก Scanner หรือสร้างแผนพร้อม Entry / SL / TP" />
      </div>

      <article className="trade-card rounded-3xl p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-trade-blue">Image Records</p>
            <h3 className="mt-1 text-2xl font-black text-white">รายการจากรูป</h3>
            <p className="mt-2 text-sm font-semibold text-slate-300">แสดงเฉพาะ summary สั้น ๆ บน Dashboard ไม่มี upload form ที่หน้านี้</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <DashMetric label="รอตรวจ" value={imageSummary.pendingReview} />
            <DashMetric label="ค่าใช้จ่าย" value={`${imageSummary.monthlyExpenseTotal}`} />
            <DashMetric label="ยังไม่จด" value={tradeWithoutJournal} />
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button className="trade-button min-h-12 rounded-xl px-4 font-black" onClick={() => onNavigate("imageRecords")} type="button">
            ไปหน้ารายการจากรูป
          </button>
          <button className="trade-button-secondary min-h-12 rounded-xl px-4 font-black" onClick={() => onNavigate("imageRecords")} type="button">
            นำเข้าภาพใหม่
          </button>
        </div>
      </article>
    </section>
  );
}

function MiniCard({ title, value, helper }: { title: string; value: string; helper: string }) {
  return (
    <article className="trade-card rounded-2xl p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{title}</p>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{helper}</p>
    </article>
  );
}

function DashMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="min-w-20 rounded-xl border border-white/10 bg-black/20 p-3">
      <p className="text-[10px] font-bold text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-black text-white">{value}</p>
    </div>
  );
}
