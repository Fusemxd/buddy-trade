export default function TopBar() {
  return (
    <div className="flex min-w-0 items-center justify-between gap-2 rounded-3xl border border-slate-700/70 bg-slate-950/65 p-3 shadow-[0_0_45px_rgba(34,211,238,0.08)] backdrop-blur">
      <button className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-slate-700 bg-slate-900 text-lg font-black text-slate-200 sm:h-12 sm:w-12" type="button">≡</button>
      <div className="hidden items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm font-black text-emerald-100 sm:flex">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]" />
        War Room Online
      </div>
      <div className="ml-auto flex min-w-0 items-center gap-2">
        <div className="hidden h-11 w-11 shrink-0 place-items-center rounded-2xl border border-slate-700 bg-slate-900 text-slate-300 sm:grid">●</div>
        <div className="min-w-0 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 sm:px-4">
          <p className="truncate text-sm font-black text-white">Trader Buddy</p>
          <p className="truncate text-xs font-semibold text-slate-400">Risk-first helper</p>
        </div>
      </div>
    </div>
  );
}
