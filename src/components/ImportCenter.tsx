import ReceiptImport from "./ReceiptImport";
import ScreenshotImport from "./ScreenshotImport";

export default function ImportCenter() {
  return (
    <section className="grid gap-4">
      <div className="rounded-3xl border border-slate-700/70 bg-slate-950/65 p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Import Center</p>
        <h2 className="mt-1 text-2xl font-black text-white">นำเข้า</h2>
        <p className="mt-2 text-sm text-slate-400">
          ภาพหน้าจอใช้สร้าง draft สำหรับ Watchlist / Trade Plan ส่วนใบเสร็จใช้บันทึกค่าใช้จ่าย ต้องตรวจสอบและยืนยันก่อนบันทึกทุกครั้ง
        </p>
      </div>
      <ScreenshotImport />
      <ReceiptImport />
    </section>
  );
}
