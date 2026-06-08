"use client";

import type { ReactNode } from "react";
import { formatThbAsUsdWithThb, formatUsdWithThb } from "@/lib/capitalStorage";
import type { ImageRecordSummary } from "@/types/imageRecord";

export default function AutoImageSummary({ summary }: { summary: ImageRecordSummary }) {
  return (
    <section className="grid gap-4">
      <div className="rounded-3xl border border-cyan-300/25 bg-cyan-300/10 p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-100">Auto Image Summary</p>
        <h2 className="mt-1 text-2xl font-black text-white">สรุปอัตโนมัติจากรูป</h2>
        <p className="mt-2 text-sm font-semibold text-cyan-50/80">สรุปจากข้อมูล local ที่ยืนยันแล้วหรือรอตรวจสอบเท่านั้น ไม่ส่งรูปออกนอกเครื่อง</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="ภาพที่นำเข้าทั้งหมด" value={summary.totalImages} />
        <Metric label="ภาพเทรด" value={summary.tradeScreenshots} helper={`Journal drafts ${summary.journalDrafts} | Plan drafts ${summary.tradePlanDrafts}`} />
        <Metric label="ใบเสร็จ / ค่าใช้จ่าย" value={summary.receiptImages} helper={`เดือนนี้ ${formatUsdWithThb(summary.monthlyExpenseTotal)}`} />
        <Metric label="รอตรวจสอบ" value={summary.pendingReview} helper={`ยืนยันแล้ว ${summary.confirmedRecords}`} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Panel title="ต้นทุนเดือนนี้">
          <MetricRow label="ค่า API" value={formatUsdWithThb(summary.monthlyApiCost)} />
          <MetricRow label="ค่าสมัครสมาชิก" value={formatUsdWithThb(summary.monthlySubscriptionCost)} />
        </Panel>
        <Panel title="ผลลัพธ์จาก Journal">
          <MetricRow label="Win / Loss / BE" value={`${summary.winCount ?? 0} / ${summary.lossCount ?? 0} / ${summary.breakEvenCount ?? 0}`} />
          <MetricRow label="P/L รวม" value={formatThbAsUsdWithThb(summary.screenshotLinkedPnL ?? 0)} />
        </Panel>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <ListPanel title="พฤติกรรมที่พบ" items={summary.insights} />
        <ListPanel title="สิ่งที่ควรทำต่อ" items={summary.nextActions} />
      </div>
    </section>
  );
}

function Metric({ label, value, helper }: { label: string; value: string | number; helper?: string }) {
  return (
    <article className="rounded-3xl border border-slate-700 bg-slate-900/75 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
      {helper ? <p className="mt-1 text-xs font-semibold text-slate-400">{helper}</p> : null}
    </article>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return <article className="rounded-3xl border border-slate-700 bg-slate-900/75 p-4"><h3 className="text-lg font-black text-white">{title}</h3><div className="mt-3 grid gap-2">{children}</div></article>;
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-950/70 p-3 text-sm"><span className="font-bold text-slate-400">{label}</span><span className="font-black text-white">{value}</span></div>;
}

function ListPanel({ title, items }: { title: string; items: string[] }) {
  return <Panel title={title}>{items.map((item) => <p className="rounded-2xl bg-slate-950/70 p-3 text-sm font-semibold text-slate-300" key={item}>{item}</p>)}</Panel>;
}
