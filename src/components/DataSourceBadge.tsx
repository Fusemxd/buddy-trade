export default function DataSourceBadge() {
  return (
    <div className="rounded-xl bg-cyan-300/[0.07] p-3 text-xs font-bold text-cyan-50 ring-1 ring-cyan-300/[0.14]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-cyan-300 px-2.5 py-1 font-black text-slate-950">Binance Public</span>
        <span>ไม่ต้องใช้ API Key</span>
      </div>
      <p className="mt-2 text-cyan-100/80">ข้อมูลอาจมีดีเลย์ ควรตรวจสอบจากแอพเทรดจริงก่อนตัดสินใจ</p>
    </div>
  );
}
