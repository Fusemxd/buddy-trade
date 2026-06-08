import CapitalLedger from "./CapitalLedger";
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
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-800/80 bg-slate-950/80 p-5 backdrop-blur-xl xl:block">
      <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4 shadow-[0_0_40px_rgba(34,211,238,0.12)]">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-200/30 bg-slate-950 text-2xl">TB</div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Trade Buddy</p>
            <h1 className="text-lg font-black text-white">War Room</h1>
          </div>
        </div>
      </div>

      <nav className="mt-6 space-y-2">
        {navItems.map((item) => {
          const active = activePanel === item.id || (item.id === "imageRecords" && activePanel === "expenses");
          return (
            <button className={`min-h-12 w-full rounded-2xl px-4 text-left text-sm font-bold transition hover:bg-cyan-300/10 hover:text-cyan-100 ${active ? "bg-cyan-300 text-slate-950" : "text-slate-300"}`} key={item.id} onClick={() => onSelect(item.id)} type="button">
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-6 space-y-3">
        <CapitalLedger compact />
        <div className="rounded-3xl border border-red-300/25 bg-red-300/10 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-100">Daily Stop -$0.60 <span className="text-red-100/60">(-21 THB)</span></p>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-0 rounded-full bg-red-300" />
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-400">Used amount: $0.00 <span className="text-slate-500">(0 THB)</span></p>
        </div>
        <div className="rounded-3xl border border-yellow-300/25 bg-yellow-300/10 p-4">
          <p className="text-sm font-black text-yellow-100">Buddy Tip</p>
          <p className="mt-2 text-sm text-slate-300">ทุนเล็กต้องชนะด้วยวินัย ก่อนคิดถึงกำไร ให้เช็ก SL และ R 1:2 ทุกครั้ง</p>
        </div>
      </div>
    </aside>
  );
}
