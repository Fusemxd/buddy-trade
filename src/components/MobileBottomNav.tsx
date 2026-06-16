export type MobileWarRoomPanel = "dashboard" | "scanner" | "plan" | "journal" | "more" | "imageRecords" | "expenses" | "tools" | "guide";

const navItems: Array<{ id: MobileWarRoomPanel; label: string }> = [
  { id: "dashboard", label: "ภาพรวม" },
  { id: "scanner", label: "สแกน" },
  { id: "plan", label: "แผน" },
  { id: "journal", label: "บันทึก" },
  { id: "more", label: "เพิ่มเติม" }
];

export default function MobileBottomNav({ activePanel = "dashboard", onChange }: { activePanel?: MobileWarRoomPanel; onChange?: (panel: MobileWarRoomPanel) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom)+0.6rem)] pt-2 lg:hidden">
      <div className="grid grid-cols-5 gap-1.5 rounded-[1.65rem] bg-white/82 p-2 shadow-[0_-18px_55px_rgba(15,23,42,0.14)] ring-1 ring-white/90 backdrop-blur-2xl">
        {navItems.map((item) => {
          const active = activePanel === item.id;
          return (
            <button
              className={`min-h-14 rounded-2xl px-1 text-[11px] font-black leading-tight transition sm:text-xs ${
                active
                  ? "bg-gradient-to-r from-teal-400 to-emerald-300 text-slate-950 shadow-[0_12px_25px_rgba(20,184,166,0.22)]"
                  : "bg-slate-50/70 text-slate-500"
              }`}
              key={item.id}
              onClick={() => onChange?.(item.id)}
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
