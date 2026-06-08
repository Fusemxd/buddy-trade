import type { ExpenseCategory, ExtractedReceiptData, ReceiptSource } from "@/types/expense";

const categories: ExpenseCategory[] = ["Trading Fee", "API Cost", "Subscription", "Course / Learning", "Software", "Device / Equipment", "Internet", "Other"];
const sources: ReceiptSource[] = ["Receipt Photo", "Screenshot", "Exchange Statement", "Subscription Invoice", "Other"];

export default function ReceiptExtractedFields({ data, onChange }: { data: ExtractedReceiptData; onChange: (data: ExtractedReceiptData) => void }) {
  return <div className="grid gap-3 sm:grid-cols-2"><Field label="Merchant" value={data.merchant ?? ""} onChange={(v) => onChange({ ...data, merchant: v })} /><Field label="Date" type="date" value={data.date ?? ""} onChange={(v) => onChange({ ...data, date: v })} /><Field label="Total Amount" type="number" value={data.totalAmount ?? ""} onChange={(v) => onChange({ ...data, totalAmount: Number(v) })} /><Field label="Currency" value={data.currency ?? "THB"} onChange={(v) => onChange({ ...data, currency: v as ExtractedReceiptData["currency"] })} /><Select label="Category" value={data.category ?? "Other"} options={categories} onChange={(v) => onChange({ ...data, category: v as ExpenseCategory })} /><Select label="Source" value={data.source ?? "Receipt Photo"} options={sources} onChange={(v) => onChange({ ...data, source: v as ReceiptSource })} /><Field label="Notes" value={data.notes ?? ""} onChange={(v) => onChange({ ...data, notes: v })} /></div>;
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string | number; onChange: (value: string) => void; type?: string }) {
  return <label className="text-sm font-black text-slate-200">{label}<input className="mt-2 min-h-12 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 text-white" type={type} value={value} onChange={(e) => onChange(e.target.value)} /></label>;
}
function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="text-sm font-black text-slate-200">{label}<select className="mt-2 min-h-12 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 text-white" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o}>{o}</option>)}</select></label>;
}
