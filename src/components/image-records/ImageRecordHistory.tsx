"use client";

import { useMemo, useState } from "react";
import type { ImageRecord, ImageRecordType } from "@/types/imageRecord";
import ImageRecordCard from "./ImageRecordCard";

const filters: Array<{ id: "all" | ImageRecordType; label: string }> = [
  { id: "all", label: "ทั้งหมด" },
  { id: "trade_screenshot", label: "ภาพเทรด" },
  { id: "receipt", label: "ใบเสร็จ" },
  { id: "expense_record", label: "Expense" },
  { id: "journal_draft", label: "Journal Draft" },
  { id: "trade_plan_draft", label: "Plan Draft" }
];

export default function ImageRecordHistory({ records }: { records: ImageRecord[] }) {
  const [filter, setFilter] = useState<"all" | ImageRecordType>("all");
  const visible = useMemo(() => (filter === "all" ? records : records.filter((record) => record.type === filter)), [filter, records]);

  return (
    <section className="grid gap-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((item) => (
          <button className={`min-h-11 shrink-0 rounded-2xl px-4 text-sm font-black transition ${filter === item.id ? "bg-cyan-300 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.22)]" : "bg-slate-900 text-slate-300 hover:bg-slate-800"}`} key={item.id} onClick={() => setFilter(item.id)} type="button">
            {item.label}
          </button>
        ))}
      </div>

      {visible.length ? (
        <>
          <div className="hidden overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-950/70 shadow-[0_0_50px_rgba(15,23,42,0.35)] backdrop-blur md:block">
            <div className="grid grid-cols-[1.25fr_0.85fr_0.8fr_0.95fr_1.5fr] border-b border-slate-700/70 bg-slate-900/80 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              <span>Record</span>
              <span>Type</span>
              <span>Status</span>
              <span>Date</span>
              <span>Summary</span>
            </div>
            <div className="divide-y divide-slate-800/90">
              {visible.map((record) => (
                <ImageRecordRow key={record.id} record={record} />
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:hidden">
            {visible.map((record) => (
              <ImageRecordCard key={record.id} record={record} />
            ))}
          </div>
        </>
      ) : (
        <p className="rounded-3xl border border-slate-700 bg-slate-900/70 p-4 text-sm font-bold text-slate-300">ยังไม่มีรายการในหมวดนี้</p>
      )}
    </section>
  );
}

function ImageRecordRow({ record }: { record: ImageRecord }) {
  return (
    <article className="grid grid-cols-[1.25fr_0.85fr_0.8fr_0.95fr_1.5fr] items-center gap-3 px-4 py-3 text-sm transition hover:bg-cyan-300/[0.04]">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
          {record.imageDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt={record.title ?? "Imported image"} className="h-full w-full object-cover" src={record.imageDataUrl} />
          ) : (
            <span className="text-xs font-black text-cyan-100">IMG</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate font-black text-white">{record.title ?? typeText(record.type)}</p>
          <p className="truncate text-xs font-semibold text-slate-500">{record.source ?? "localStorage"}</p>
        </div>
      </div>
      <span className="w-fit rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-100">{typeText(record.type)}</span>
      <span className={`w-fit rounded-full border px-3 py-1 text-xs font-black ${statusClass(record.status)}`}>{statusText(record.status)}</span>
      <span className="font-bold text-slate-300">{formatDate(record.createdAt)}</span>
      <p className="line-clamp-2 text-sm font-semibold text-slate-400">{record.summary ?? "ไม่มี summary"}</p>
    </article>
  );
}

function typeText(type: ImageRecord["type"]) {
  if (type === "trade_screenshot") return "ภาพเทรด";
  if (type === "receipt") return "ใบเสร็จ";
  if (type === "journal_draft") return "Journal Draft";
  if (type === "trade_plan_draft") return "Plan Draft";
  return "Expense";
}

function statusText(status: ImageRecord["status"]) {
  if (status === "confirmed") return "ยืนยันแล้ว";
  if (status === "needs_review") return "รอตรวจ";
  if (status === "archived") return "เก็บถาวร";
  return "Draft";
}

function statusClass(status: ImageRecord["status"]) {
  if (status === "confirmed") return "border-emerald-300/25 bg-emerald-300/10 text-emerald-100";
  if (status === "needs_review") return "border-yellow-300/25 bg-yellow-300/10 text-yellow-100";
  if (status === "archived") return "border-slate-600 bg-slate-800 text-slate-300";
  return "border-cyan-300/25 bg-cyan-300/10 text-cyan-100";
}

function formatDate(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}/${match[2]}/${match[1].slice(2)}` : "-";
}
