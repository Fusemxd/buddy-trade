export default function RiskSummaryCard() {
  return (
    <section className="rounded-3xl border border-yellow-300/25 bg-yellow-300/10 p-4 shadow-[0_0_35px_rgba(250,204,21,0.08)]">
      <h3 className="text-lg font-black text-white">สรุปความเสี่ยงวันนี้</h3>
      <div className="mt-4 space-y-3 text-sm font-semibold text-slate-300">
        <Row label="เสี่ยงต่อไม้" value="1-2%" />
        <Row label="Daily Stop Loss" value="-$0.61 (20.00 บาท)" />
        <Row label="ใช้ไปวันนี้" value="$0.00 (0.00 บาท)" />
        <Row label="แพ้ติดกัน" value="0" />
        <Row label="เหลือ Daily Stop" value="$0.61 (20.00 บาท)" />
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full w-0 rounded-full bg-yellow-300" />
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-700/60 bg-slate-950/50 px-3 py-2">
      <span>{label}</span>
      <span className="font-black text-white">{value}</span>
    </div>
  );
}
