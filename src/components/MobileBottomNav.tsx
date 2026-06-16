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
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-slate-950/90 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-18px_55px_rgba(0,0,0,0.75)] backdrop-blur-2xl lg:hidden">
      <div className="grid grid-cols-5 gap-1.5">
        {navItems.map((item) => {
          const active = activePanel === item.id;
          return (
            <button className={`min-h-14 rounded-xl px-1 text-[11px] font-black leading-tight transition sm:text-xs ${active ? "luxury-primary" : "bg-white/[0.04] text-slate-300"}`} key={item.id} onClick={() => onChange?.(item.id)} type="button">
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
