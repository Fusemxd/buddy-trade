export default function JournalStatsCard({ label, value, helper }: { label: string; value: string | number; helper?: string }) {
  return (
    <article className="rounded-3xl border border-slate-700 bg-slate-900/75 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
      {helper ? <p className="mt-1 text-xs font-semibold text-slate-400">{helper}</p> : null}
    </article>
  );
}
