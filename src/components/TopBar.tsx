export default function TopBar() {
  return (
    <div className="flex min-w-0 items-center justify-between gap-2 rounded-[1.75rem] bg-white/[0.72] p-2.5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] ring-1 ring-white/90 backdrop-blur-2xl">
      <button className="keep-dark grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-lg font-black shadow-[0_12px_28px_rgba(15,23,42,0.16)] sm:h-12 sm:w-12" type="button">
        ≡
      </button>
      <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 ring-1 ring-emerald-100 sm:flex">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.85)]" />
        War Room Online
      </div>
      <div className="ml-auto flex min-w-0 items-center gap-2">
        <div className="keep-dark hidden rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.16em] shadow-sm sm:block">
          Demo Risk Desk
        </div>
        <div className="min-w-0 rounded-2xl bg-white/80 px-3 py-2 shadow-sm ring-1 ring-slate-200/80 sm:px-4">
          <p className="truncate text-sm font-black text-slate-950">Trader Buddy</p>
          <p className="truncate text-xs font-semibold text-slate-500">Risk-first helper</p>
        </div>
      </div>
    </div>
  );
}
