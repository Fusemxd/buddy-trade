import type { ExtractedScreenshotData } from "@/types/screenshotImport";

export default function ScreenshotExtractedFields({ data, onChange }: { data: ExtractedScreenshotData; onChange: (data: ExtractedScreenshotData) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Symbol" value={data.symbol ?? ""} onChange={(value) => onChange({ ...data, symbol: value })} />
      <Field label="Current Price" value={data.currentPrice ?? ""} type="number" onChange={(value) => onChange({ ...data, currentPrice: Number(value) })} />
      <Field label="Direction" value={data.direction ?? "Unknown"} onChange={(value) => onChange({ ...data, direction: value as ExtractedScreenshotData["direction"] })} />
      <Field label="Entry" value={data.entryPrice ?? ""} type="number" onChange={(value) => onChange({ ...data, entryPrice: Number(value) })} />
      <Field label="Stop Loss" value={data.stopLoss ?? ""} type="number" onChange={(value) => onChange({ ...data, stopLoss: Number(value) })} />
      <Field label="Take Profit 1" value={data.takeProfit1 ?? ""} type="number" onChange={(value) => onChange({ ...data, takeProfit1: Number(value) })} />
      <Field label="Take Profit 2" value={data.takeProfit2 ?? ""} type="number" onChange={(value) => onChange({ ...data, takeProfit2: Number(value) })} />
      <Field label="Timeframe" value={data.timeframe ?? ""} onChange={(value) => onChange({ ...data, timeframe: value })} />
      <Field label="Source App" value={data.sourceApp ?? "Unknown"} onChange={(value) => onChange({ ...data, sourceApp: value as ExtractedScreenshotData["sourceApp"] })} />
      <Field label="Notes" value={data.notes ?? ""} onChange={(value) => onChange({ ...data, notes: value })} />
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string | number; onChange: (value: string) => void; type?: string }) {
  return <label className="text-sm font-black text-slate-200">{label}<input className="mt-2 min-h-12 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 text-white" type={type} value={value} onChange={(e) => onChange(e.target.value)} /></label>;
}
