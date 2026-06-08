import type { JournalAnalytics } from "@/types/journalAnalytics";

export default function TradeDurationStats({ analytics }: { analytics: JournalAnalytics }) {
  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-950/65 p-4">
      <h3 className="text-lg font-black text-white">Emotion / Duration</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <List title="Emotion summary" items={analytics.emotionSummary.map((item) => `${item.emotion}: ${item.count}`)} />
        <List title="Duration summary" items={analytics.durationSummary.map((item) => `${item.duration}: ${item.count}`)} />
      </div>
    </section>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return <div className="rounded-2xl border border-slate-700 bg-slate-900/75 p-3"><p className="font-black text-white">{title}</p><div className="mt-2 grid gap-1">{items.length ? items.map((item) => <p className="text-sm text-slate-300" key={item}>{item}</p>) : <p className="text-sm text-slate-500">ยังไม่มีข้อมูล</p>}</div></div>;
}
