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
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-white/10 bg-[#111314]/95 p-4 backdrop-blur-2xl xl:block">
      <div className="trade-panel rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl border border-trade-green/25 bg-trade-green/10 text-xl font-black text-emerald-100">TB</div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-trade-green">Trade Buddy</p>
            <h1 className="text-lg font-black text-white">War Room</h1>
          </div>
        </div>
      </div>

      <nav className="mt-5 space-y-1.5">
        {navItems.map((item) => {
          const active = activePanel === item.id || (item.id === "imageRecords" && activePanel === "expenses");
          return (
            <button className={`min-h-11 w-full rounded-xl px-4 text-left text-sm font-bold transition ${active ? "trade-button" : "text-slate-300 hover:bg-white/[0.055] hover:text-white"}`} key={item.id} onClick={() => onSelect(item.id)} type="button">
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-5 space-y-3">
        <div className="trade-danger-card rounded-2xl p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em]">Daily Stop -$0.61 <span className="text-red-100/65">(-20.00 บาท)</span></p>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-black/30">
            <div className="h-full w-0 rounded-full bg-trade-red" />
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-400">Used amount: $0.00 <span className="text-slate-500">(0.00 บาท)</span></p>
        </div>
        <div className="trade-card rounded-2xl p-4">
          <p className="text-sm font-black text-white">Buddy Tip</p>
          <p className="mt-2 text-sm text-slate-300">ทุนเล็กต้องชนะด้วยวินัย ก่อนคิดถึงกำไร ให้เช็ก SL และ R 1:2 ทุกครั้ง</p>
        </div>
      </div>
    </aside>
  );
}
