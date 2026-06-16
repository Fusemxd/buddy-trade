export default function RiskSummaryCard() {
  return (
    <section className="luxury-gold rounded-[2rem] p-4">
      <h3 className="text-lg font-black text-white">สรุปความเสี่ยงวันนี้</h3>
      <div className="mt-4 space-y-3 text-sm font-semibold text-slate-300">
        <Row label="เสี่ยงต่อไม้" value="1-2%" />
        <Row label="Daily Stop Loss" value="-$0.61 (20.00 บาท)" />
        <Row label="ใช้ไปวันนี้" value="$0.00 (0.00 บาท)" />
        <Row label="แพ้ติดกัน" value="0" />
        <Row label="เหลือ Daily Stop" value="$0.61 (20.00 บาท)" />
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-900">
        <div className="h-full w-0 rounded-full bg-gradient-to-r from-yellow-200 to-emerald-200" />
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/45 px-3 py-2">
      <span>{label}</span>
      <span className="font-black text-white">{value}</span>
    </div>
  );
}
