export default function TopBar() {
  return (
    <div className="trade-panel flex min-w-0 items-center justify-between gap-2 rounded-2xl p-2.5">
      <button className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-lg font-black text-slate-100 sm:h-12 sm:w-12" type="button">
        ≡
      </button>
      <div className="hidden items-center gap-2 rounded-full border border-trade-green/25 bg-trade-green/10 px-4 py-2 text-sm font-black text-emerald-100 sm:flex">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-trade-green shadow-[0_0_18px_rgba(31,191,117,0.95)]" />
        War Room Online
      </div>
      <div className="ml-auto flex min-w-0 items-center gap-2">
        <div className="hidden rounded-full border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-300 sm:block">
          Demo Risk Desk
        </div>
        <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 sm:px-4">
          <p className="truncate text-sm font-black text-white">Trader Buddy</p>
          <p className="truncate text-xs font-semibold text-slate-400">Risk-first helper</p>
        </div>
      </div>
    </div>
  );
}
