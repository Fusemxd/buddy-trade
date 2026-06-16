export default function TopBar() {
  return (
    <div className="luxury-panel flex min-w-0 items-center justify-between gap-2 rounded-[1.75rem] p-3">
      <button className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-lg font-black text-slate-100 sm:h-12 sm:w-12" type="button">
        ≡
      </button>
      <div className="hidden items-center gap-2 rounded-full border border-emerald-200/25 bg-emerald-200/10 px-4 py-2 text-sm font-black text-emerald-50 sm:flex">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.95)]" />
        War Room Online
      </div>
      <div className="ml-auto flex min-w-0 items-center gap-2">
        <div className="hidden rounded-full border border-yellow-200/25 bg-yellow-200/10 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-yellow-100 sm:block">
          Premium Mode
        </div>
        <div className="min-w-0 rounded-2xl border border-cyan-200/20 bg-cyan-200/[0.06] px-3 py-2 sm:px-4">
          <p className="truncate text-sm font-black text-white">Trader Buddy</p>
          <p className="truncate text-xs font-semibold text-slate-400">Risk-first helper</p>
        </div>
      </div>
    </div>
  );
}
