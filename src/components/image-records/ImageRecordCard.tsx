import type { ImageRecord } from "@/types/imageRecord";

export default function ImageRecordCard({ record }: { record: ImageRecord }) {
  return (
    <article className="rounded-3xl border border-slate-700 bg-slate-900/75 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-lg font-black text-white">{record.title ?? typeText(record.type)}</p>
          <p className="mt-1 text-xs font-bold text-slate-400">{typeText(record.type)} | {statusText(record.status)}</p>
        </div>
        <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-100">{record.source ?? "local"}</span>
      </div>
      {record.imageDataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={record.title ?? "Imported image"} className="mt-3 max-h-40 w-full rounded-2xl object-cover" src={record.imageDataUrl} />
      ) : null}
      <p className="mt-3 text-sm font-semibold text-slate-300">{record.summary ?? "ไม่มี summary"}</p>
      {record.notes ? <p className="mt-2 text-xs text-slate-500">{record.notes}</p> : null}
    </article>
  );
}

function typeText(type: ImageRecord["type"]) {
  if (type === "trade_screenshot") return "ภาพเทรด";
  if (type === "receipt") return "ใบเสร็จ";
  if (type === "journal_draft") return "Journal Draft";
  if (type === "trade_plan_draft") return "Trade Plan Draft";
  return "Expense Record";
}

function statusText(status: ImageRecord["status"]) {
  if (status === "confirmed") return "ยืนยันแล้ว";
  if (status === "needs_review") return "รอตรวจสอบ";
  if (status === "archived") return "เก็บถาวร";
  return "Draft";
}
