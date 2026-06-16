import type { MobileWarRoomPanel } from "./MobileBottomNav";

const navItems: Array<{ id: MobileWarRoomPanel; label: string }> = [
  { id: "dashboard", label: "ภาพรวม" },
  { id: "scanner", label: "สแกนตลาด" },
  { id: "plan", label: "สร้างแผน" },
  { id: "journal", label: "บันทึก" },
  { id: "imageRecords", label: "รายการจากรูป" },
  { id: "expenses", label: "ค่าใช้จ่าย" },
  { id: "tools", label: "เครื่องมือ" }
];

export default function SidebarNav({ activePanel, onSelect }: { activePanel: MobileWarRoomPanel; onSelect: (panel: MobileWarRoomPanel) => void }) {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-white/10 bg-slate-950/70 p-5 backdrop-blur-2xl xl:block">
      <div className="luxury-panel rounded-[1.75rem] p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-yellow-200/25 bg-yellow-200/10 text-xl font-black text-yellow-50">TB</div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-100">Trade Buddy</p>
            <h1 className="text-lg font-black text-white">War Room</h1>
          </div>
        </div>
      </div>

      <nav className="mt-6 space-y-2">
        {navItems.map((item) => {
          const active = activePanel === item.id || (item.id === "imageRecords" && activePanel === "expenses");
          return (
            <button className={`min-h-12 w-full rounded-2xl px-4 text-left text-sm font-bold transition ${active ? "luxury-primary" : "text-slate-300 hover:bg-white/[0.05] hover:text-yellow-50"}`} key={item.id} onClick={() => onSelect(item.id)} type="button">
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-6 space-y-3">
        <div className="luxury-card rounded-[1.75rem] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-100">Daily Stop -$0.61 <span className="text-red-100/60">(-20.00 บาท)</span></p>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-900">
            <div className="h-full w-0 rounded-full bg-gradient-to-r from-red-300 to-yellow-200" />
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-400">Used amount: $0.00 <span className="text-slate-500">(0.00 บาท)</span></p>
        </div>
        <div className="luxury-gold rounded-[1.75rem] p-4">
          <p className="text-sm font-black text-yellow-50">Buddy Tip</p>
          <p className="mt-2 text-sm text-slate-300">ทุนเล็กต้องชนะด้วยวินัย ก่อนคิดถึงกำไร ให้เช็ก SL และ R 1:2 ทุกครั้ง</p>
        </div>
      </div>
    </aside>
  );
}
