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
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-white/70 bg-white/55 p-4 shadow-[20px_0_60px_rgba(15,23,42,0.05)] backdrop-blur-2xl xl:block">
      <div className="rounded-[1.75rem] bg-white/80 p-4 shadow-[0_16px_44px_rgba(15,23,42,0.08)] ring-1 ring-white">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-teal-300 to-emerald-300 text-xl font-black text-slate-950 shadow-[0_14px_30px_rgba(20,184,166,0.24)]">TB</div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">Trade Buddy</p>
            <h1 className="text-lg font-black text-slate-950">War Room</h1>
          </div>
        </div>
      </div>

      <nav className="mt-5 space-y-1.5">
        {navItems.map((item) => {
          const active = activePanel === item.id || (item.id === "imageRecords" && activePanel === "expenses");
          return (
            <button
              className={`min-h-11 w-full rounded-2xl px-4 text-left text-sm font-black transition ${
                active
                  ? "bg-gradient-to-r from-teal-400 to-emerald-300 text-slate-950 shadow-[0_14px_28px_rgba(20,184,166,0.22)]"
                  : "text-slate-600 hover:bg-white/75 hover:text-slate-950 hover:shadow-sm"
              }`}
              key={item.id}
              onClick={() => onSelect(item.id)}
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-5 space-y-3">
        <div className="rounded-3xl bg-rose-50/85 p-4 text-rose-800 shadow-sm ring-1 ring-rose-200/80">
          <p className="text-xs font-black uppercase tracking-[0.16em]">Daily Stop -$0.61 <span className="text-rose-500">(-20.00 บาท)</span></p>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-rose-100">
            <div className="h-full w-0 rounded-full bg-rose-500" />
          </div>
          <p className="mt-2 text-xs font-bold text-rose-500">Used amount: $0.00 <span>(0.00 บาท)</span></p>
        </div>
        <div className="rounded-3xl bg-white/[0.78] p-4 shadow-sm ring-1 ring-white">
          <p className="text-sm font-black text-slate-950">Buddy Tip</p>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-600">ทุนเล็กต้องชนะด้วยวินัย ก่อนคิดถึงกำไร ให้เช็ก SL และ R 1:2 ทุกครั้ง</p>
        </div>
      </div>
    </aside>
  );
}
