"use client";

export type ImageRecordTab = "summary" | "trade" | "receipt" | "history";

const tabs: Array<{ id: ImageRecordTab; label: string }> = [
  { id: "summary", label: "สรุปจากรูป" },
  { id: "trade", label: "ภาพเทรด" },
  { id: "receipt", label: "ใบเสร็จ" },
  { id: "history", label: "ประวัติ" }
];

export default function ImageRecordTabs({ active, onChange }: { active: ImageRecordTab; onChange: (tab: ImageRecordTab) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-3xl border border-slate-700 bg-slate-950/70 p-2 sm:grid-cols-4">
      {tabs.map((tab) => (
        <button className={`min-h-12 rounded-2xl px-3 text-sm font-black transition ${active === tab.id ? "bg-cyan-300 text-slate-950" : "bg-slate-900 text-slate-300"}`} key={tab.id} onClick={() => onChange(tab.id)} type="button">
          {tab.label}
        </button>
      ))}
    </div>
  );
}
